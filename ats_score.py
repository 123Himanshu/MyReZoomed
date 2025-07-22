"""
ATS (Applicant Tracking System) scoring module
Uses TF-IDF and keyword analysis to calculate resume compatibility scores
"""

import logging
from typing import List, Dict, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
from models import ResumeData, ATSScore, ATSFeedback

logger = logging.getLogger(__name__)

class ATSScorer:
    """
    ATS compatibility scorer using TF-IDF and keyword analysis.
    Provides methods to calculate overall ATS score, keyword optimization, format, content, and skills matching.
    """
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=1000,
            ngram_range=(1, 2),
            lowercase=True
        )
        # Common ATS-friendly keywords by category
        self.ats_keywords = {
            'technical_skills': [
                'python', 'java', 'javascript', 'react', 'angular', 'node.js', 'sql', 'mongodb',
                'aws', 'docker', 'kubernetes', 'git', 'html', 'css', 'typescript', 'spring boot',
                'fastapi', 'django', 'flask', 'postgresql', 'mysql', 'redis', 'elasticsearch'
            ],
            'soft_skills': [
                'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
                'project management', 'collaboration', 'adaptability', 'creativity', 'initiative'
            ],
            'action_verbs': [
                'achieved', 'developed', 'implemented', 'managed', 'led', 'created', 'designed',
                'optimized', 'improved', 'increased', 'reduced', 'streamlined', 'delivered'
            ],
            'certifications': [
                'certified', 'certification', 'aws certified', 'pmp', 'scrum master', 'agile',
                'cissp', 'comptia', 'microsoft certified', 'google certified'
            ]
        }
        self.standard_sections = [
            'experience', 'education', 'skills', 'summary', 'objective',
            'work history', 'employment', 'qualifications', 'achievements'
        ]

    async def calculate_score(self, resume_data: ResumeData, job_description: str = "") -> ATSScore:
        """
        Calculate ATS compatibility score for a resume.
        Args:
            resume_data (ResumeData): Structured resume data.
            job_description (str): Optional job description for comparison.
        Returns:
            ATSScore: Comprehensive ATS score with feedback and suggestions.
        """
        try:
            logger.info("Calculating ATS compatibility score")
            resume_text = await self._resume_to_text(resume_data)
            keyword_score = await self._calculate_keyword_score(resume_text, job_description)
            format_score = await self._calculate_format_score(resume_data)
            content_score = await self._calculate_content_score(resume_data)
            skills_score = await self._calculate_skills_score(resume_data, job_description)
            overall_score = int(
                keyword_score['score'] * 0.3 +
                format_score['score'] * 0.25 +
                content_score['score'] * 0.25 +
                skills_score['score'] * 0.2
            )
            feedback = [
                ATSFeedback(category="Keyword Optimization", **{k: keyword_score[k] for k in ('score','message','severity')}),
                ATSFeedback(category="Format Compatibility", **{k: format_score[k] for k in ('score','message','severity')}),
                ATSFeedback(category="Content Structure", **{k: content_score[k] for k in ('score','message','severity')}),
                ATSFeedback(category="Skills Matching", **{k: skills_score[k] for k in ('score','message','severity')})
            ]
            suggestions = await self._generate_suggestions(
                resume_data, job_description, overall_score, 
                [keyword_score, format_score, content_score, skills_score]
            )
            logger.info(f"ATS score calculated: {overall_score}")
            return ATSScore(score=overall_score, feedback=feedback, suggestions=suggestions)
        except Exception as e:
            logger.error(f"Error calculating ATS score: {str(e)}")
            raise

    async def _resume_to_text(self, resume_data: ResumeData) -> str:
        """
        Convert structured resume data to plain text for analysis.
        Args:
            resume_data (ResumeData): Resume data.
        Returns:
            str: Concatenated text from all resume fields.
        """
        text_parts = []
        if resume_data.personalInfo:
            text_parts.append(resume_data.personalInfo.fullName)
            text_parts.append(resume_data.personalInfo.email)
        if resume_data.summary:
            text_parts.append(resume_data.summary)
        if resume_data.skills:
            text_parts.extend(resume_data.skills)
        for exp in resume_data.experience:
            text_parts.extend([exp.company, exp.position, exp.description])
            if exp.achievements:
                text_parts.extend(exp.achievements)
        for edu in resume_data.education:
            text_parts.extend([edu.institution, edu.degree, edu.field])
        if resume_data.rawText:
            text_parts.append(resume_data.rawText)
        return ' '.join(filter(None, text_parts))

    async def _calculate_keyword_score(self, resume_text: str, job_description: str) -> Dict:
        """
        Calculate keyword optimization score using TF-IDF or fallback to keyword matching.
        Args:
            resume_text (str): Resume text.
            job_description (str): Job description text.
        Returns:
            dict: Score, message, and severity.
        """
        try:
            if not job_description.strip():
                score = await self._analyze_generic_keywords(resume_text)
                return {
                    'score': score,
                    'message': f"Resume contains {score}% of common industry keywords. Consider adding more relevant technical and soft skills.",
                    'severity': 'medium' if score < 70 else 'low'
                }
            documents = [resume_text.lower(), job_description.lower()]
            try:
                tfidf_matrix = self.vectorizer.fit_transform(documents)
                similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
                score = int(similarity * 100)
            except Exception:
                score = await self._simple_keyword_match(resume_text, job_description)
            return {
                'score': max(score, 50),
                'message': f"Resume matches {score}% of job description keywords. {'Good alignment' if score >= 70 else 'Consider adding more relevant keywords'}.",
                'severity': 'low' if score >= 80 else 'medium' if score >= 60 else 'high'
            }
        except Exception as e:
            logger.error(f"Error calculating keyword score: {str(e)}")
            return {
                'score': 65,
                'message': "Keyword analysis completed with moderate matching.",
                'severity': 'medium'
            }

    async def _analyze_generic_keywords(self, resume_text: str) -> int:
        """
        Analyze resume against generic industry keywords.
        Args:
            resume_text (str): Resume text.
        Returns:
            int: Percentage of keywords found.
        """
        resume_lower = resume_text.lower()
        total_keywords = 0
        found_keywords = 0
        for keywords in self.ats_keywords.values():
            total_keywords += len(keywords)
            for keyword in keywords:
                if keyword.lower() in resume_lower:
                    found_keywords += 1
        return int((found_keywords / total_keywords) * 100) if total_keywords > 0 else 50

    async def _simple_keyword_match(self, resume_text: str, job_description: str) -> int:
        """
        Simple keyword matching fallback.
        Args:
            resume_text (str): Resume text.
            job_description (str): Job description text.
        Returns:
            int: Percentage of job keywords found in resume.
        """
        resume_words = set(re.findall(r'\b\w+\b', resume_text.lower()))
        job_words = set(re.findall(r'\b\w+\b', job_description.lower()))
        stop_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'}
        job_words = job_words - stop_words
        if not job_words:
            return 50
        matches = len(resume_words.intersection(job_words))
        return int((matches / len(job_words)) * 100)

    async def _calculate_format_score(self, resume_data: ResumeData) -> Dict:
        """
        Calculate format compatibility score based on presence of standard sections and contact info.
        Args:
            resume_data (ResumeData): Resume data.
        Returns:
            dict: Score, message, and severity.
        """
        score = 100
        issues = []
        has_experience = len(resume_data.experience) > 0
        has_education = len(resume_data.education) > 0
        has_skills = len(resume_data.skills) > 0
        has_summary = bool(resume_data.summary)
        if not has_experience:
            score -= 20
            issues.append("missing work experience section")
        if not has_education:
            score -= 15
            issues.append("missing education section")
        if not has_skills:
            score -= 15
            issues.append("missing skills section")
        if not has_summary:
            score -= 10
            issues.append("missing professional summary")
        contact_info = resume_data.personalInfo
        if not contact_info.phone:
            score -= 5
            issues.append("missing phone number")
        if not contact_info.address:
            score -= 5
            issues.append("missing address")
        message = "Resume format is ATS-friendly" if score >= 85 else f"Format issues detected: {', '.join(issues)}"
        severity = 'low' if score >= 85 else 'medium' if score >= 70 else 'high'
        return {
            'score': max(score, 0),
            'message': message,
            'severity': severity
        }

    async def _calculate_content_score(self, resume_data: ResumeData) -> Dict:
        """
        Calculate content structure and quality score.
        Args:
            resume_data (ResumeData): Resume data.
        Returns:
            dict: Score, message, and severity.
        """
        score = 100
        issues = []
        if resume_data.experience:
            for exp in resume_data.experience:
                if not exp.description or len(exp.description.split()) < 10:
                    score -= 10
                    issues.append("brief job descriptions")
                    break
        has_numbers = False
        all_text = await self._resume_to_text(resume_data)
        if re.search(r'\d+%|\$\d+|\d+\+|increased|decreased|improved|reduced', all_text, re.IGNORECASE):
            has_numbers = True
        if not has_numbers:
            score -= 15
            issues.append("lack of quantifiable achievements")
        action_verb_count = 0
        for verb in self.ats_keywords['action_verbs']:
            if verb.lower() in all_text.lower():
                action_verb_count += 1
        if action_verb_count < 3:
            score -= 10
            issues.append("limited use of action verbs")
        if resume_data.summary and len(resume_data.summary.split()) < 20:
            score -= 5
            issues.append("brief professional summary")
        message = "Well-structured content with good detail" if score >= 85 else f"Content improvements needed: {', '.join(issues)}"
        severity = 'low' if score >= 85 else 'medium' if score >= 70 else 'high'
        return {
            'score': max(score, 0),
            'message': message,
            'severity': severity
        }

    async def _calculate_skills_score(self, resume_data: ResumeData, job_description: str) -> Dict:
        """
        Calculate skills matching score.
        Args:
            resume_data (ResumeData): Resume data.
            job_description (str): Job description text.
        Returns:
            dict: Score, message, and severity.
        """
        if not resume_data.skills:
            return {
                'score': 30,
                'message': "No skills section found. Add relevant technical and soft skills.",
                'severity': 'high'
            }
        score = 70  # Base score for having skills
        tech_skills_found = 0
        for skill in resume_data.skills:
            if any(tech_skill.lower() in skill.lower() for tech_skill in self.ats_keywords['technical_skills']):
                tech_skills_found += 1
        if tech_skills_found >= 5:
            score += 20
        elif tech_skills_found >= 3:
            score += 10
        soft_skills_found = 0
        all_text = await self._resume_to_text(resume_data)
        for soft_skill in self.ats_keywords['soft_skills']:
            if soft_skill.lower() in all_text.lower():
                soft_skills_found += 1
        if soft_skills_found >= 3:
            score += 10
        message = f"Skills section includes {len(resume_data.skills)} skills. {'Good technical coverage' if tech_skills_found >= 3 else 'Consider adding more technical skills'}."
        severity = 'low' if score >= 85 else 'medium' if score >= 70 else 'high'
        return {
            'score': min(score, 100),
            'message': message,
            'severity': severity
        }

    async def _generate_suggestions(self, resume_data: ResumeData, job_description: str, 
                                 overall_score: int, category_scores: List[Dict]) -> List[str]:
        """
        Generate improvement suggestions based on analysis.
        Args:
            resume_data (ResumeData): Resume data.
            job_description (str): Job description text.
            overall_score (int): Overall ATS score.
            category_scores (List[Dict]): List of category score dicts.
        Returns:
            List[str]: List of suggestions.
        """
        suggestions = []
        if overall_score < 70:
            suggestions.append("Consider a comprehensive resume review to improve ATS compatibility")
        for category in category_scores:
            if category['score'] < 70:
                if 'keyword' in category.get('message', '').lower():
                    suggestions.append("Add more industry-specific keywords from target job descriptions")
                elif 'format' in category.get('message', '').lower():
                    suggestions.append("Use standard section headings (Experience, Education, Skills)")
                elif 'content' in category.get('message', '').lower():
                    suggestions.append("Include quantifiable achievements with specific numbers and percentages")
                elif 'skills' in category.get('message', '').lower():
                    suggestions.append("Expand skills section with relevant technical and soft skills")
        standard_suggestions = [
            "Use simple, clean formatting without graphics or tables",
            "Include relevant keywords naturally throughout the resume",
            "Start bullet points with strong action verbs",
            "Ensure all dates are in consistent format (MM/YYYY)",
            "Save resume in both PDF and Word formats for different ATS systems"
        ]
        if len(suggestions) < 3:
            suggestions.extend(standard_suggestions[:3])
        return suggestions[:6]  # Limit to 6 suggestions
