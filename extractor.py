"""
Resume content extraction module
Handles PDF and DOCX file parsing using pdfplumber and docx2txt
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
nlp = spacy.load("en_core_web_sm")

from models import ResumeData, PersonalInfo, Experience, Education

logger = logging.getLogger(__name__)

class ResumeExtractor:
    """Resume content extractor for PDF and DOCX files"""
    
    def __init__(self):
        self.email_pattern = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
        self.phone_pattern = re.compile(r'(\+?\d{1,2}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}')
        self.linkedin_pattern = re.compile(r'linkedin\.com/in/[\w-]+', re.IGNORECASE)
        self.url_pattern = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\$$\$$,]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
    
    async def extract_content(self, file_content: bytes, file_extension: str, filename: str) -> ResumeData:
        """
        Extract content from resume file
        
        Args:
            file_content: File content as bytes
            file_extension: File extension (pdf, docx)
            filename: Original filename
            
        Returns:
            ResumeData: Structured resume data
        """
        try:
            # Extract raw text based on file type
            if file_extension.lower() == 'pdf':
                raw_text = await self._extract_from_pdf(file_content)
            elif file_extension.lower() in ['docx', 'doc']:
                raw_text = await self._extract_from_docx(file_content)
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
            
            # Parse structured data from raw text
            structured_data = await self._parse_resume_content(raw_text)
            structured_data.rawText = raw_text
            
            return structured_data
            
        except Exception as e:
            logger.error(f"Error extracting content from {filename}: {str(e)}")
            raise
    
    async def _extract_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file using pdfplumber"""
        try:
            text_content = []
            
            with pdfplumber.open(BytesIO(file_content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_content.append(page_text)
            
            raw_text = '\n'.join(text_content)
            logger.info(f"Extracted {len(raw_text)} characters from PDF")
            
            return raw_text
            
        except Exception as e:
            logger.error(f"Error extracting PDF content: {str(e)}")
            raise ValueError(f"Failed to extract PDF content: {str(e)}")
    
    async def _extract_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file using docx2txt"""
        try:
            # Create temporary file for docx2txt
            with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as temp_file:
                temp_file.write(file_content)
                temp_file_path = temp_file.name
            
            try:
                # Extract text using docx2txt
                raw_text = docx2txt.process(temp_file_path)
                logger.info(f"Extracted {len(raw_text)} characters from DOCX")
                
                return raw_text
                
            finally:
                # Clean up temporary file
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
                    
        except Exception as e:
            logger.error(f"Error extracting DOCX content: {str(e)}")
            raise ValueError(f"Failed to extract DOCX content: {str(e)}")
    
    async def _parse_resume_content(self, raw_text: str) -> ResumeData:
        """
        Parse structured data from raw text
        
        Args:
            raw_text: Raw extracted text
            
        Returns:
            ResumeData: Structured resume data
        """
        try:
            # Extract personal information
            personal_info = await self._extract_personal_info(raw_text)
            
            # Extract sections
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
            # Return basic structure with raw text if parsing fails
            return ResumeData(
                personalInfo=PersonalInfo(fullName="Unknown", email="unknown@email.com"),
                summary="",
                skills=[],
                experience=[],
                education=[],
                rawText=raw_text
            )
    
    async def _extract_personal_info(self, text: str) -> PersonalInfo:
        """Extract personal information from text using spaCy NER for name extraction"""
        lines = text.split('\n')
        # Extract email
        email_match = self.email_pattern.search(text)
        email = email_match.group() if email_match else ""
        # Extract phone
        phone_match = self.phone_pattern.search(text)
        phone = phone_match.group() if phone_match else None
        # Extract LinkedIn
        linkedin_match = self.linkedin_pattern.search(text)
        linkedin = f"https://{linkedin_match.group()}" if linkedin_match else None
        # Use spaCy to extract person name
        doc = nlp(text)
        name = ""
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                name = ent.text
                break
        # Fallback: first non-empty line
        if not name:
            for line in lines[:5]:
                line = line.strip()
                if line and not self.email_pattern.search(line) and not self.phone_pattern.search(line):
                    words = line.split()
                    if 2 <= len(words) <= 4 and all(word.replace('.', '').isalpha() for word in words):
                        name = line
                        break
        # Extract address (look for common address patterns)
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
        """Extract professional summary/objective"""
        lines = text.split('\n')
        summary_keywords = ['summary', 'objective', 'profile', 'about', 'overview']
        
        summary_start = -1
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if any(keyword in line_lower for keyword in summary_keywords):
                summary_start = i
                break
        
        if summary_start != -1:
            # Extract next few lines as summary
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
    
    async def _extract_skills(self, text: str) -> List[str]:
        """Extract skills from text"""
        skills = []
        lines = text.split('\n')
        
        # Look for skills section
        skills_start = -1
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if 'skill' in line_lower and len(line.split()) <= 3:
                skills_start = i
                break
        
        if skills_start != -1:
            # Extract skills from next few lines
            for i in range(skills_start + 1, min(skills_start + 10, len(lines))):
                line = lines[i].strip()
                if line and not line.lower().startswith(('experience', 'education', 'work', 'employment')):
                    # Split by common delimiters
                    line_skills = re.split(r'[,;•·\|\n]', line)
                    for skill in line_skills:
                        skill = skill.strip()
                        if skill and len(skill) > 1:
                            skills.append(skill)
                else:
                    break
        
        # Common technical skills to look for throughout the document
        common_skills = [
            'Python', 'Java', 'JavaScript', 'React', 'Angular', 'Node.js', 'SQL', 'MongoDB',
            'AWS', 'Docker', 'Kubernetes', 'Git', 'HTML', 'CSS', 'TypeScript', 'Spring Boot',
            'FastAPI', 'Django', 'Flask', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
            'Machine Learning', 'Data Analysis', 'Project Management', 'Agile', 'Scrum'
        ]
        
        text_lower = text.lower()
        for skill in common_skills:
            if skill.lower() in text_lower and skill not in skills:
                skills.append(skill)
        
        return skills[:20]  # Limit to 20 skills
    
    async def _extract_experience(self, text: str) -> List[Experience]:
        """Extract work experience from text using spaCy NER for company and date extraction"""
        experience = []
        lines = text.split('\n')
        exp_start = -1
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if any(keyword in line_lower for keyword in ['experience', 'employment', 'work history']):
                exp_start = i
                break
        if exp_start != -1:
            current_exp = None
            for i in range(exp_start + 1, len(lines)):
                line = lines[i].strip()
                if not line:
                    continue
                line_lower = line.lower()
                if any(keyword in line_lower for keyword in ['education', 'skills', 'projects']):
                    break
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
                # Heuristic: if line has a dash, split into position and company
                position = None
                if '-' in line:
                    parts = [p.strip() for p in line.split('-')]
                    if len(parts) >= 2:
                        position = parts[0]
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
        """Extract education information from text"""
        education = []
        lines = text.split('\n')
        edu_start = -1
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if 'education' in line_lower and len(line.split()) <= 3:
                edu_start = i
                break
        if edu_start != -1:
            for i in range(edu_start + 1, min(edu_start + 10, len(lines))):
                line = lines[i].strip()
                if not line:
                    continue
                line_lower = line.lower()
                if any(keyword in line_lower for keyword in ['experience', 'skills', 'work']):
                    break
                # Try to extract degree, institution, and field from the line
                degree = None
                institution = None
                field = None
                # Heuristic: look for degree keywords
                degree_keywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college']
                for keyword in degree_keywords:
                    if keyword in line_lower:
                        degree = keyword.title()
                        break
                # Try to split by comma to get institution and field
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
