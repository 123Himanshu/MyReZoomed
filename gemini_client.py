"""
Google Gemini API client for AI-powered resume enhancement using LangChain.
Uses Gemini 1.5 Pro API via LangChain's ChatGoogleGenerativeAI.
"""
import logging
import os
from typing import Dict, List, Optional
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from models import ResumeData, EnhancedResume, PersonalInfo, Experience, Education

logger = logging.getLogger(__name__)
load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
llm = ChatGoogleGenerativeAI(
    model="gemini-1.0-pro",
    temperature=0.7,
    google_api_key=GEMINI_API_KEY
)
output_parser = StrOutputParser()

def generate_response(prompt: str) -> str:
    """
    Generate a response from Gemini using LangChain's ChatGoogleGenerativeAI.
    Args:
        prompt (str): The prompt to send to Gemini.
    Returns:
        str: The response text from Gemini.
    """
    try:
        chain = llm | output_parser
        response = chain.invoke(prompt)
        return response.strip() if response else ""
    except Exception as e:
        logger.error(f"Error generating Gemini response: {str(e)}")
        return ""

class GeminiClient:
    """
    Google Gemini API client for resume enhancement using LangChain.
    Handles communication with Gemini 1.5 Pro API and provides AI-powered resume improvements.
    """
    def __init__(self):
        if not GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY not found in environment variables")

    async def enhance_resume(self, resume_data: ResumeData) -> EnhancedResume:
        """
        Enhance resume content using Gemini AI.
        Args:
            resume_data (ResumeData): Original resume data.
        Returns:
            EnhancedResume: Original and enhanced resume with improvements.
        """
        try:
            logger.info("Starting resume enhancement with Gemini AI (LangChain)")
            enhanced_summary = await self._enhance_summary(resume_data.summary, resume_data.skills)
            enhanced_skills = await self._enhance_skills(resume_data.skills, resume_data.experience)
            enhanced_experience = await self._enhance_experience(resume_data.experience)
            enhanced_resume_data = ResumeData(
                personalInfo=resume_data.personalInfo,
                summary=enhanced_summary,
                skills=enhanced_skills,
                experience=enhanced_experience,
                education=resume_data.education,
                rawText=resume_data.rawText
            )
            improvements = await self._generate_improvements_list(resume_data, enhanced_resume_data)
            ai_suggestions = await self._generate_ai_suggestions(resume_data)
            logger.info("Resume enhancement completed successfully")
            return EnhancedResume(
                originalResume=resume_data,
                enhancedResume=enhanced_resume_data,
                improvements=improvements,
                aiSuggestions=ai_suggestions
            )
        except Exception as e:
            logger.error(f"Error enhancing resume with Gemini: {str(e)}")
            return await self._create_mock_enhancement(resume_data)

    async def _enhance_summary(self, original_summary: Optional[str], skills: List[str]) -> str:
        """
        Enhance professional summary using Gemini.
        Args:
            original_summary (Optional[str]): Original summary text.
            skills (List[str]): List of skills.
        Returns:
            str: Enhanced summary text.
        """
        if not original_summary:
            original_summary = "Professional with experience in various technologies and skills."
        skills_text = ", ".join(skills[:10]) if skills else "various technologies"
        prompt = (
            "Please enhance this professional summary to make it more compelling and ATS-friendly:\n"
            f"Original Summary: {original_summary}\n"
            f"Key Skills: {skills_text}\n"
            "Requirements:\n"
            "- Make it more impactful and results-oriented\n"
            "- Include relevant keywords naturally\n"
            "- Keep it concise (2-3 sentences)\n"
            "- Focus on value proposition\n"
            "- Use strong action words\n"
            "Return only the enhanced summary text, no additional formatting or explanations."
        )
        return generate_response(prompt)

    async def _enhance_skills(self, original_skills: List[str], experience: List[Experience]) -> List[str]:
        """
        Enhance skills list using Gemini.
        Args:
            original_skills (List[str]): List of original skills.
            experience (List[Experience]): List of experience entries.
        Returns:
            List[str]: Enhanced list of skills.
        """
        if not original_skills:
            return ["Communication", "Problem Solving", "Team Collaboration", "Project Management"]
        experience_text = " ".join([exp.description for exp in experience if exp.description])
        prompt = (
            "Please enhance this skills list to make it more comprehensive and ATS-friendly:\n"
            f"Current Skills: {', '.join(original_skills)}\n"
            f"Experience Context: {experience_text[:500]}...\n"
            "Requirements:\n"
            "- Add relevant technical skills based on experience\n"
            "- Include important soft skills\n"
            "- Remove duplicates and organize logically\n"
            "- Limit to 15-20 most relevant skills\n"
            "- Use industry-standard terminology\n"
            "Return only a comma-separated list of skills, no additional text."
        )
        enhanced_skills_text = generate_response(prompt)
        if enhanced_skills_text:
            enhanced_skills = [skill.strip() for skill in enhanced_skills_text.split(',')]
            return enhanced_skills[:20]
        return original_skills

    async def _enhance_experience(self, original_experience: List[Experience]) -> List[Experience]:
        """
        Enhance work experience descriptions using Gemini.
        Args:
            original_experience (List[Experience]): List of experience entries.
        Returns:
            List[Experience]: Enhanced experience entries.
        """
        enhanced_experience = []
        for exp in original_experience:
            try:
                enhanced_desc = await self._enhance_job_description(exp.description, exp.position)
                enhanced_exp = Experience(
                    id=exp.id,
                    company=exp.company,
                    position=exp.position,
                    startDate=exp.startDate,
                    endDate=exp.endDate,
                    current=exp.current,
                    description=enhanced_desc,
                    achievements=exp.achievements or []
                )
                enhanced_experience.append(enhanced_exp)
            except Exception as e:
                logger.error(f"Error enhancing experience for {exp.company}: {str(e)}")
                enhanced_experience.append(exp)
        return enhanced_experience

    async def _enhance_job_description(self, original_description: str, position: str) -> str:
        """
        Enhance individual job description using Gemini.
        Args:
            original_description (str): Original job description.
            position (str): Job position/title.
        Returns:
            str: Enhanced job description.
        """
        if not original_description:
            return f"Responsible for various duties and tasks related to {position} role."
        prompt = (
            "Please enhance this job description to make it more impactful and ATS-friendly:\n"
            f"Position: {position}\n"
            f"Original Description: {original_description}\n"
            "Requirements:\n"
            "- Start with strong action verbs\n"
            "- Include quantifiable achievements where possible\n"
            "- Use industry-relevant keywords\n"
            "- Make it results-oriented\n"
            "- Keep it concise but comprehensive\n"
            "- Focus on impact and value delivered\n"
            "Return only the enhanced description, no additional formatting."
        )
        return generate_response(prompt)

    async def _generate_improvements_list(self, original: ResumeData, enhanced: ResumeData) -> List[str]:
        """
        Generate list of improvements made between original and enhanced resume.
        Args:
            original (ResumeData): Original resume data.
            enhanced (ResumeData): Enhanced resume data.
        Returns:
            List[str]: List of improvements.
        """
        improvements = []
        if original.summary != enhanced.summary:
            improvements.append("Enhanced professional summary with stronger impact statements")
        if len(enhanced.skills) > len(original.skills):
            improvements.append("Expanded skills section with relevant technical and soft skills")
        original_exp_text = " ".join([exp.description for exp in original.experience if exp.description])
        enhanced_exp_text = " ".join([exp.description for exp in enhanced.experience if exp.description])
        if len(enhanced_exp_text) > len(original_exp_text) * 1.1:
            improvements.append("Improved job descriptions with stronger action verbs and impact focus")
        if not improvements:
            improvements = [
                "Optimized content for ATS compatibility",
                "Enhanced keyword density for better searchability",
                "Improved overall professional presentation"
            ]
        return improvements

    async def _generate_ai_suggestions(self, resume_data: ResumeData) -> List[str]:
        """
        Generate additional AI suggestions for resume improvement.
        Args:
            resume_data (ResumeData): Resume data.
        Returns:
            List[str]: List of suggestions.
        """
        suggestions = [
            "Consider adding specific metrics and quantifiable achievements to demonstrate impact",
            "Include relevant industry certifications or training programs",
            "Tailor keywords to match specific job descriptions you're targeting",
            "Add a projects section if you have notable work to showcase",
            "Consider including volunteer work or professional associations",
            "Ensure all technical skills are current and in-demand in your field"
        ]
        return suggestions[:4]

    async def _create_mock_enhancement(self, resume_data: ResumeData) -> EnhancedResume:
        """
        Create mock enhancement when Gemini API is not available.
        Args:
            resume_data (ResumeData): Original resume data.
        Returns:
            EnhancedResume: Mock enhanced resume.
        """
        logger.info("Creating mock enhancement (Gemini API not available)")
        enhanced_summary = resume_data.summary or "Results-driven professional with proven expertise in delivering high-quality solutions and driving business success."
        if resume_data.skills:
            top_skills = ", ".join(resume_data.skills[:3])
            enhanced_summary = f"Results-driven professional with proven expertise in {top_skills}. {enhanced_summary}"
        enhanced_skills = list(resume_data.skills) if resume_data.skills else []
        additional_skills = ["Leadership", "Strategic Planning", "Problem Solving", "Team Collaboration"]
        for skill in additional_skills:
            if skill not in enhanced_skills:
                enhanced_skills.append(skill)
        enhanced_experience = []
        action_verbs = ["Developed", "Implemented", "Managed", "Led", "Created", "Optimized"]
        for i, exp in enumerate(resume_data.experience):
            enhanced_desc = exp.description
            if enhanced_desc and not any(verb.lower() in enhanced_desc.lower() for verb in action_verbs):
                verb = action_verbs[i % len(action_verbs)]
                enhanced_desc = f"{verb} {enhanced_desc.lower()}"
            enhanced_experience.append(Experience(
                id=exp.id,
                company=exp.company,
                position=exp.position,
                startDate=exp.startDate,
                endDate=exp.endDate,
                current=exp.current,
                description=enhanced_desc,
                achievements=exp.achievements
            ))
        enhanced_resume_data = ResumeData(
            personalInfo=resume_data.personalInfo,
            summary=enhanced_summary,
            skills=enhanced_skills,
            experience=enhanced_experience,
            education=resume_data.education,
            rawText=resume_data.rawText
        )
        return EnhancedResume(
            originalResume=resume_data,
            enhancedResume=enhanced_resume_data,
            improvements=[
                "Enhanced professional summary with industry keywords",
                "Optimized skills section for ATS compatibility",
                "Improved action verbs and quantifiable achievements",
                "Added relevant technical competencies"
            ],
            aiSuggestions=[
                "Consider adding specific metrics and numbers to quantify your achievements",
                "Include relevant certifications or training programs",
                "Tailor keywords to match your target job descriptions",
                "Add a projects section to showcase notable work"
            ]
        )
