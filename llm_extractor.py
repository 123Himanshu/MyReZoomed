"""
LLM-based structured resume extraction using Gemini via LangChain.
Extracts all key fields from raw resume text in a single prompt.
"""
import os
import json
import logging
from typing import Dict
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser

logger = logging.getLogger(__name__)
load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
llm = ChatGoogleGenerativeAI(
    model="gemini-1.0-pro",
    temperature=0.3,
    google_api_key=GEMINI_API_KEY
)
output_parser = StrOutputParser()

def extract_structured_resume(raw_resume_text: str) -> Dict:
    """
    Extract structured resume data from raw text using Gemini LLM.
    Args:
        raw_resume_text (str): The raw resume text.
    Returns:
        dict: Structured resume data (personal info, experience, education, skills, etc.).
    """
    prompt = (
        "You are an expert resume parser. Extract the following fields from the resume below and return them as a JSON object.\n"
        "Fields: personalInfo (fullName, email, phone, address, linkedIn, website), summary, skills (list), experience (list of objects: company, position, startDate, endDate, current, description, achievements), education (list of objects: institution, degree, field, startDate, endDate, gpa), rawText.\n"
        "If a field is missing, use null or an empty list.\n"
        "Resume:\n"
        f"{raw_resume_text}\n"
        "Return only the JSON object, no extra text."
    )
    try:
        chain = llm | output_parser
        response = chain.invoke(prompt)
        data = json.loads(response)
        return data
    except Exception as e:
        logger.error(f"LLM extraction failed: {str(e)} | Response: {response if 'response' in locals() else ''}")
        return {}
