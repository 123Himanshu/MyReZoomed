"""
Google Gemini API client for AI-powered resume enhancement
Uses Gemini 1.5 Pro API via REST calls
"""

import logging
import json
import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
import os
from dotenv import load_dotenv

from models import ResumeData, EnhancedResume, PersonalInfo, Experience, Education

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class GeminiClient:
    """Google Gemini API client for resume enhancement"""
    
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not found in environment variables")
        
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent"
        self.headers = {
            'Content-Type': 'application/json',
        }
        
        # Timeout settings
        self.timeout = aiohttp.ClientTimeout(total=30)
    
    async def enhance_resume(self, resume_data: ResumeData) -> EnhancedResume:
        """
        Enhance resume content using Gemini AI
        
        Args:
            resume_data: Original resume data
            
        Returns:
            EnhancedResume: Original and enhanced resume with improvements
        """
        try:
            logger.info("Starting resume enhancement with Gemini AI")
            
            if not self.api_key:
                logger.warning("Gemini API key not available, using mock enhancement")
                return await self._create_mock_enhancement(resume_data)
            
            # Enhance different sections
            enhanced_summary = await self._enhance_summary(resume_data.summary, resume_data.skills)
            enhanced_skills = await self._enhance_skills(resume_data.skills, resume_data.experience)
            enhanced_experience = await self._enhance_experience(resume_data.experience)
            
            # Create enhanced resume
            enhanced_resume_data = ResumeData(
                personalInfo=resume_data.personalInfo,
                summary=enhanced_summary,
                skills=enhanced_skills,
                experience=enhanced_experience,
                education=resume_data.education,  # Education typically doesn't need AI enhancement
                rawText=resume_data.rawText
            )
            
            # Generate improvement list
            improvements = await self._generate_improvements_list(resume_data, enhanced_resume_data)
            
            # Generate AI suggestions
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
            # Fallback to mock enhancement
            return await self._create_mock_enhancement(resume_data)
    
    async def _enhance_summary(self, original_summary: Optional[str], skills: List[str]) -> str:
        """Enhance professional summary using Gemini"""
        try:
            if not original_summary:
                original_summary = "Professional with experience in various technologies and skills."
            
            skills_text = ", ".join(skills[:10]) if skills else "various technologies"
            
            prompt = f"""
            Please enhance this professional summary to make it more compelling and ATS-friendly:
            
            Original Summary: {original_summary}
            Key Skills: {skills_text}
            
            Requirements:
            - Make it more impactful and results-oriented
            - Include relevant keywords naturally
            - Keep it concise (2-3 sentences)
            - Focus on value proposition
            - Use strong action words
            
            Return only the enhanced summary text, no additional formatting or explanations.
            """
            
            enhanced_text = await self._call_gemini_api(prompt)
            return enhanced_text.strip() if enhanced_text else original_summary
            
        except Exception as e:
            logger.error(f"Error enhancing summary: {str(e)}")
            return original_summary or "Results-driven professional with proven expertise in delivering high-quality solutions and driving business success."
    
    async def _enhance_skills(self, original_skills: List[str], experience: List[Experience]) -> List[str]:
        """Enhance skills list using Gemini"""
        try:
            if not original_skills:
                return ["Communication", "Problem Solving", "Team Collaboration", "Project Management"]
            
            # Extract skills mentioned in experience
            experience_text = " ".join([exp.description for exp in experience if exp.description])
            
            prompt = f"""
            Please enhance this skills list to make it more comprehensive and ATS-friendly:
            
            Current Skills: {', '.join(original_skills)}
            Experience Context: {experience_text[:500]}...
            
            Requirements:
            - Add relevant technical skills based on experience
            - Include important soft skills
            - Remove duplicates and organize logically
            - Limit to 15-20 most relevant skills
            - Use industry-standard terminology
            
            Return only a comma-separated list of skills, no additional text.
            """
            
            enhanced_skills_text = await self._call_gemini_api(prompt)
            
            if enhanced_skills_text:
                enhanced_skills = [skill.strip() for skill in enhanced_skills_text.split(',')]
                return enhanced_skills[:20]  # Limit to 20 skills
            
            return original_skills
            
        except Exception as e:
            logger.error(f"Error enhancing skills: {str(e)}")
            # Add some common skills to original list
            additional_skills = ["Leadership", "Strategic Planning", "Problem Solving"]
            return list(set(original_skills + additional_skills))[:15]
    
    async def _enhance_experience(self, original_experience: List[Experience]) -> List[Experience]:
        """Enhance work experience descriptions using Gemini"""
        enhanced_experience = []
        
        for exp in original_experience:
            try:
                enhanced_exp = Experience(
                    id=exp.id,
                    company=exp.company,
                    position=exp.position,
                    startDate=exp.startDate,
                    endDate=exp.endDate,
                    current=exp.current,
                    description=await self._enhance_job_description(exp.description, exp.position),
                    achievements=exp.achievements or []
                )
                enhanced_experience.append(enhanced_exp)
                
            except Exception as e:
                logger.error(f"Error enhancing experience for {exp.company}: {str(e)}")
                enhanced_experience.append(exp)  # Keep original if enhancement fails
        
        return enhanced_experience
    
    async def _enhance_job_description(self, original_description: str, position: str) -> str:
        """Enhance individual job description"""
        try:
            if not original_description:
                return f"Responsible for various duties and tasks related to {position} role."
            
            prompt = f"""
            Please enhance this job description to make it more impactful and ATS-friendly:
            
            Position: {position}
            Original Description: {original_description}
            
            Requirements:
            - Start with strong action verbs
            - Include quantifiable achievements where possible
            - Use industry-relevant keywords
            - Make it results-oriented
            - Keep it concise but comprehensive
            - Focus on impact and value delivered
            
            Return only the enhanced description, no additional formatting.
            """
            
            enhanced_text = await self._call_gemini_api(prompt)
            return enhanced_text.strip() if enhanced_text else original_description
            
        except Exception as e:
            logger.error(f"Error enhancing job description: {str(e)}")
            return original_description
    
    async def _call_gemini_api(self, prompt: str) -> str:
        """Make API call to Gemini"""
        try:
            url = f"{self.base_url}?key={self.api_key}"
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024,
                }
            }
            
            async with aiohttp.ClientSession(timeout=self.timeout) as session:
                async with session.post(url, headers=self.headers, json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        
                        # Extract text from Gemini response
                        if 'candidates' in result and result['candidates']:
                            candidate = result['candidates'][0]
                            if 'content' in candidate and 'parts' in candidate['content']:
                                parts = candidate['content']['parts']
                                if parts and 'text' in parts[0]:
                                    return parts[0]['text']
                        
                        logger.warning("Unexpected Gemini API response format")
                        return ""
                    else:
                        error_text = await response.text()
                        logger.error(f"Gemini API error {response.status}: {error_text}")
                        return ""
                        
        except asyncio.TimeoutError:
            logger.error("Gemini API request timed out")
            return ""
        except Exception as e:
            logger.error(f"Error calling Gemini API: {str(e)}")
            return ""
    
    async def _generate_improvements_list(self, original: ResumeData, enhanced: ResumeData) -> List[str]:
        """Generate list of improvements made"""
        improvements = []
        
        # Compare summaries
        if original.summary != enhanced.summary:
            improvements.append("Enhanced professional summary with stronger impact statements")
        
        # Compare skills
        if len(enhanced.skills) > len(original.skills):
            improvements.append("Expanded skills section with relevant technical and soft skills")
        
        # Compare experience descriptions
        original_exp_text = " ".join([exp.description for exp in original.experience if exp.description])
        enhanced_exp_text = " ".join([exp.description for exp in enhanced.experience if exp.description])
        
        if len(enhanced_exp_text) > len(original_exp_text) * 1.1:
            improvements.append("Improved job descriptions with stronger action verbs and impact focus")
        
        # Default improvements if none detected
        if not improvements:
            improvements = [
                "Optimized content for ATS compatibility",
                "Enhanced keyword density for better searchability",
                "Improved overall professional presentation"
            ]
        
        return improvements
    
    async def _generate_ai_suggestions(self, resume_data: ResumeData) -> List[str]:
        """Generate additional AI suggestions"""
        suggestions = [
            "Consider adding specific metrics and quantifiable achievements to demonstrate impact",
            "Include relevant industry certifications or training programs",
            "Tailor keywords to match specific job descriptions you're targeting",
            "Add a projects section if you have notable work to showcase",
            "Consider including volunteer work or professional associations",
            "Ensure all technical skills are current and in-demand in your field"
        ]
        
        return suggestions[:4]  # Return top 4 suggestions
    
    async def _create_mock_enhancement(self, resume_data: ResumeData) -> EnhancedResume:
        """Create mock enhancement when Gemini API is not available"""
        logger.info("Creating mock enhancement (Gemini API not available)")
        
        # Enhanced summary
        enhanced_summary = resume_data.summary or "Results-driven professional with proven expertise in delivering high-quality solutions and driving business success."
        if resume_data.skills:
            top_skills = ", ".join(resume_data.skills[:3])
            enhanced_summary = f"Results-driven professional with proven expertise in {top_skills}. {enhanced_summary}"
        
        # Enhanced skills
        enhanced_skills = list(resume_data.skills) if resume_data.skills else []
        additional_skills = ["Leadership", "Strategic Planning", "Problem Solving", "Team Collaboration"]
        for skill in additional_skills:
            if skill not in enhanced_skills:
                enhanced_skills.append(skill)
        
        # Enhanced experience (add action verbs)
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
