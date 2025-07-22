"""
Resume content extraction module
Handles PDF and DOCX file parsing using pdfplumber and docx2txt, and uses spaCy for NER.
"""

import pdfplumber
import docx2txt
import re
import logging
from typing import Dict, List, Optional, Any
from io import BytesIO
import tempfile
import os
import spacy
import fitz  # PyMuPDF

from models import ResumeData, PersonalInfo, Experience, Education

logger = logging.getLogger(__name__)
nlp = spacy.load("en_core_web_sm")

def classify_resume_sections(text: str) -> dict:
    """
    Classify lines of resume text into sections (experience, education, skills, etc.).
    Args:
        text (str): The raw resume text.
    Returns:
        dict: Mapping of section name to list of lines in that section.
    """
    import re
    section_headers = {
        'experience': [r'experience', r'employment', r'work history', r'professional experience'],
        'education': [r'education', r'academic background', r'qualifications'],
        'skills': [r'skills', r'technical skills', r'core competencies'],
        'projects': [r'projects', r'project experience'],
        'summary': [r'summary', r'objective', r'profile', r'about', r'overview'],
    }
    section_map = {}
    current_section = 'other'
    section_map[current_section] = []
    for line in text.splitlines():
        line_stripped = line.strip().lower()
        found_section = False
        for section, patterns in section_headers.items():
            for pat in patterns:
                if re.fullmatch(rf'.*{pat}.*', line_stripped):
                    current_section = section
                    if current_section not in section_map:
                        section_map[current_section] = []
                    found_section = True
                    break
            if found_section:
                break
        section_map.setdefault(current_section, []).append(line)
    return section_map

def normalize_skill(skill: str) -> str:
    """
    Normalize a skill to a standard name using a simple mapping (O*NET/ESCO style).
    Args:
        skill (str): The extracted skill.
    Returns:
        str: Normalized skill name.
    """
    # Example mapping (expand as needed)
    mapping = {
        'js': 'JavaScript',
        'py': 'Python',
        'ml': 'Machine Learning',
        'ai': 'Artificial Intelligence',
        'db': 'Databases',
        'sql': 'SQL',
        'pm': 'Project Management',
        'nlp': 'Natural Language Processing',
        'aws': 'Amazon Web Services',
        'gcp': 'Google Cloud Platform',
        'ms office': 'Microsoft Office',
    }
    skill_lower = skill.strip().lower()
    return mapping.get(skill_lower, skill.strip())

def normalize_job_title(title: str) -> str:
    """
    Normalize a job title to a standard name using a simple mapping (O*NET/ESCO style).
    Args:
        title (str): The extracted job title.
    Returns:
        str: Normalized job title.
    """
    mapping = {
        'dev': 'Developer',
        'software engineer': 'Software Engineer',
        'data scientist': 'Data Scientist',
        'pm': 'Project Manager',
        'qa': 'Quality Assurance Engineer',
        'ba': 'Business Analyst',
        'frontend': 'Frontend Developer',
        'backend': 'Backend Developer',
    }
    title_lower = title.strip().lower()
    return mapping.get(title_lower, title.strip())

class ResumeExtractor:
    """
    Resume content extractor for PDF and DOCX files.
    Extracts structured data using regex and spaCy NER.
    """
    def __init__(self):
        self.email_pattern = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
        self.phone_pattern = re.compile(r'(\+?\d{1,2}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}')
        self.linkedin_pattern = re.compile(r'linkedin\.com/in/[\w-]+', re.IGNORECASE)
        self.url_pattern = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\$\$,]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')

    async def extract_content(self, file_content: bytes, file_extension: str, filename: str) -> ResumeData:
        """
        Extract content from resume file (PDF or DOCX).
        Args:
            file_content (bytes): File content as bytes.
            file_extension (str): File extension (pdf, docx).
            filename (str): Original filename.
        Returns:
            ResumeData: Structured resume data.
        """
        try:
            if file_extension.lower() == 'pdf':
                raw_text = await self._extract_from_pdf(file_content)
            elif file_extension.lower() in ['docx', 'doc']:
                raw_text = await self._extract_from_docx(file_content)
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
            structured_data = await self._parse_resume_content(raw_text)
            structured_data.rawText = raw_text
            return structured_data
        except Exception as e:
            logger.error(f"Error extracting content from {filename}: {str(e)}")
            raise

    async def _extract_from_pdf(self, file_content: bytes) -> str:
        """
        Extract text from PDF file using PyMuPDF (fitz) as primary, fallback to pdfplumber.
        Args:
            file_content (bytes): PDF file content.
        Returns:
            str: Extracted text.
        """
        # Try PyMuPDF (fitz) first
        try:
            text_content = []
            with fitz.open(stream=file_content, filetype="pdf") as doc:
                for page in doc:
                    page_text = page.get_text("text")
                    if page_text:
                        text_content.append(page_text)
            raw_text = '\n'.join(text_content)
            if raw_text.strip():
                logger.info(f"Extracted {len(raw_text)} characters from PDF using PyMuPDF (fitz)")
                return raw_text
            else:
                logger.warning("PyMuPDF returned empty text, falling back to pdfplumber")
        except Exception as e:
            logger.warning(f"PyMuPDF failed: {str(e)}. Falling back to pdfplumber.")
        # Fallback to pdfplumber
        try:
            import pdfplumber
            text_content = []
            from io import BytesIO
            with pdfplumber.open(BytesIO(file_content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_content.append(page_text)
            raw_text = '\n'.join(text_content)
            logger.info(f"Extracted {len(raw_text)} characters from PDF using pdfplumber")
            return raw_text
        except Exception as e:
            logger.error(f"Error extracting PDF content with pdfplumber: {str(e)}")
            raise ValueError(f"Failed to extract PDF content: {str(e)}")

    async def _extract_from_docx(self, file_content: bytes) -> str:
        """
        Extract text from DOCX file using docx2txt.
        Args:
            file_content (bytes): DOCX file content.
        Returns:
            str: Extracted text.
        """
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as temp_file:
                temp_file.write(file_content)
                temp_file_path = temp_file.name
            try:
                raw_text = docx2txt.process(temp_file_path)
                logger.info(f"Extracted {len(raw_text)} characters from DOCX")
                return raw_text
            finally:
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
        except Exception as e:
            logger.error(f"Error extracting DOCX content: {str(e)}")
            raise ValueError(f"Failed to extract DOCX content: {str(e)}")

    async def _parse_resume_content(self, raw_text: str) -> ResumeData:
        """
        Parse structured data from raw text.
        Args:
            raw_text (str): Raw extracted text.
        Returns:
            ResumeData: Structured resume data.
        """
        try:
            personal_info = await self._extract_personal_info(raw_text)
            summary = await self._extract_summary(raw_text)
            skills = await self._extract_skills(raw_text)
            experience = await self._extract_experience(raw_text)
            education = await self._extract_education(raw_text)
            return ResumeData(
                personalInfo=personal_info,
                summary=summary,
                skills=skills,
                experience=experience,
                education=education,
                rawText=raw_text
            )
        except Exception as e:
            logger.error(f"Error parsing resume content: {str(e)}")
            return ResumeData(
                personalInfo=PersonalInfo(fullName="Unknown", email="unknown@email.com"),
                summary="",
                skills=[],
                experience=[],
                education=[],
                rawText=raw_text
            )

    async def _extract_personal_info(self, text: str) -> PersonalInfo:
        """
        Extract personal information from text using spaCy NER for name extraction.
        Args:
            text (str): Resume text.
        Returns:
            PersonalInfo: Extracted personal information.
        """
        lines = text.split('\n')
        email_match = self.email_pattern.search(text)
        email = email_match.group() if email_match else ""
        phone_match = self.phone_pattern.search(text)
        phone = phone_match.group() if phone_match else None
        linkedin_match = self.linkedin_pattern.search(text)
        linkedin = f"https://{linkedin_match.group()}" if linkedin_match else None
        doc = nlp(text)
        name = ""
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                name = ent.text
                break
        if not name:
            for line in lines[:5]:
                line = line.strip()
                if line and not self.email_pattern.search(line) and not self.phone_pattern.search(line):
                    words = line.split()
                    if 2 <= len(words) <= 4 and all(word.replace('.', '').isalpha() for word in words):
                        name = line
                        break
        address = None
        address_keywords = ['street', 'st', 'avenue', 'ave', 'road', 'rd', 'city', 'state']
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in address_keywords) and len(line.split()) > 2:
                address = line.strip()
                break
        return PersonalInfo(
            fullName=name,
            email=email,
            phone=phone,
            address=address,
            linkedIn=linkedin
        )

    async def _extract_summary(self, text: str) -> Optional[str]:
        """
        Extract professional summary/objective section.
        Args:
            text (str): Resume text.
        Returns:
            Optional[str]: Extracted summary or None.
        """
        lines = text.split('\n')
        summary_keywords = ['summary', 'objective', 'profile', 'about', 'overview']
        summary_start = -1
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if any(keyword in line_lower for keyword in summary_keywords):
                summary_start = i
                break
        if summary_start != -1:
            summary_lines = []
            for i in range(summary_start + 1, min(summary_start + 5, len(lines))):
                line = lines[i].strip()
                if line and not line.lower().startswith(('experience', 'education', 'skills', 'work')):
                    summary_lines.append(line)
                else:
                    break
            if summary_lines:
                return ' '.join(summary_lines)
        return None

    async def _extract_experience(self, text: str) -> List[Experience]:
        """
        Extract work experience from text using section classification and spaCy NER. Normalize job titles.
        Args:
            text (str): Resume text.
        Returns:
            List[Experience]: List of extracted experiences with normalized job titles.
        """
        experience = []
        sections = classify_resume_sections(text)
        lines = sections.get('experience', [])
        if not lines:
            return experience
        exp_start = 0
        current_exp = None
        for i in range(exp_start, len(lines)):
            line = lines[i].strip()
            if not line:
                continue
            doc = nlp(line)
            company = None
            start_date = ''
            end_date = ''
            for ent in doc.ents:
                if ent.label_ == "ORG" and not company:
                    company = ent.text
                if ent.label_ == "DATE":
                    if not start_date:
                        start_date = ent.text
                    elif not end_date:
                        end_date = ent.text
            position = None
            if '-' in line:
                parts = [p.strip() for p in line.split('-')]
                if len(parts) >= 2:
                    position = normalize_job_title(parts[0])
                    if not company:
                        company = parts[1]
            description = line
            if current_exp:
                experience.append(current_exp)
            current_exp = Experience(
                company=company or '',
                position=position or '',
                startDate=start_date,
                endDate=end_date,
                current=False,
                description=description,
                achievements=[]
            )
        if current_exp:
            experience.append(current_exp)
        return experience

    async def _extract_education(self, text: str) -> List[Education]:
        """
        Extract education information from text using section classification.
        Args:
            text (str): Resume text.
        Returns:
            List[Education]: List of extracted education entries.
        """
        education = []
        sections = classify_resume_sections(text)
        lines = sections.get('education', [])
        if not lines:
            return education
        for line in lines:
            line = line.strip()
            if not line:
                continue
            degree = None
            institution = None
            field = None
            degree_keywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college']
            line_lower = line.lower()
            for keyword in degree_keywords:
                if keyword in line_lower:
                    degree = keyword.title()
                    break
            if ',' in line:
                parts = [p.strip() for p in line.split(',')]
                if len(parts) >= 2:
                    institution = parts[0]
                    field = parts[1]
            education.append(Education(
                institution=institution or '',
                degree=degree or '',
                field=field or '',
                endDate='',
            ))
        return education

    async def _extract_skills(self, text: str) -> List[str]:
        """
        Extract skills from text using section classification and normalize them.
        Args:
            text (str): Resume text.
        Returns:
            List[str]: List of normalized extracted skills.
        """
        skills = []
        sections = classify_resume_sections(text)
        lines = sections.get('skills', [])
        if not lines:
            return skills
        for line in lines:
            line = line.strip()
            if line and not line.lower().startswith(('experience', 'education', 'work', 'employment')):
                line_skills = re.split(r'[,;•·\|\n]', line)
                for skill in line_skills:
                    skill = skill.strip()
                    if skill and len(skill) > 1:
                        skills.append(normalize_skill(skill))
        return skills[:20]
