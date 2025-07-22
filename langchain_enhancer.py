from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os
from dotenv import load_dotenv
import logging
from typing import Optional

# Load your Google API key from environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")

logger = logging.getLogger(__name__)

llm = ChatGoogleGenerativeAI(
    model="gemini-1.0-pro",
    temperature=0.7,
    google_api_key=GOOGLE_API_KEY
)
output_parser = StrOutputParser()

resume_prompt = PromptTemplate(
    input_variables=["raw_resume", "job_description"],
    template="""
You are an expert resume enhancer AI. Improve the following resume by aligning it with the given job description.

Resume:
{raw_resume}

Job Description:
{job_description}

Return the enhanced resume only in clean bullet-point format. Make it concise, modern, and highly relevant to the job.
"""
)

def enhance_resume(raw_resume: str, job_description: str) -> str:
    """
    Enhance a resume using Gemini LLM via LangChain.
    Args:
        raw_resume (str): The raw resume text.
        job_description (str): The job description text.
    Returns:
        str: The enhanced resume text.
    """
    try:
        chain = resume_prompt | llm | output_parser
        enhanced_text = chain.invoke({
            "raw_resume": raw_resume,
            "job_description": job_description
        })
        return enhanced_text
    except Exception as e:
        logger.error(f"Error enhancing resume: {str(e)}")
        return ""
