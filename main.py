"""
FastAPI Resume Processing Microservice
Handles AI-powered resume enhancement, content extraction, and ATS scoring.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Body, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.requests import Request
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging
import os
from dotenv import load_dotenv
import uvicorn

from langchain_enhancer import enhance_resume
from extractor import ResumeExtractor
from ats_score import ATSScorer
from gemini_client import GeminiClient
from models import ResumeData, PersonalInfo, Experience, Education, ATSScore, ATSFeedback, EnhancedResume
from llm_extractor import extract_structured_resume
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Resume Processing AI Service",
    description="FastAPI microservice for AI-powered resume processing, enhancement, and ATS scoring",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
resume_extractor = ResumeExtractor()
ats_scorer = ATSScorer()
gemini_client = GeminiClient()

# LLM setup for new endpoints
llm = ChatGoogleGenerativeAI(
    model="gemini-1.0-pro",
    temperature=0.7,
    google_api_key=os.getenv("GEMINI_API_KEY")
)
output_parser = StrOutputParser()

class EnhanceRequest(BaseModel):
    """Request model for resume enhancement."""
    text: str
    context: str = "professional resume"

class ATSRequest(BaseModel):
    """Request model for ATS scoring."""
    resume_data: dict
    job_description: str

class OCRRequest(BaseModel):
    """Request model for OCR extraction."""
    image_url: str

@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy", "service": "Resume Processing AI Service"}

@app.post("/extract")
async def extract_resume(file: UploadFile = File(...)) -> dict:
    """
    Extract content from uploaded resume file (PDF or DOCX).
    Args:
        file (UploadFile): Uploaded resume file.
    Returns:
        dict: Structured resume data.
    """
    try:
        logger.info(f"Processing file upload: {file.filename}")
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
        file_extension = file.filename.lower().split('.')[-1]
        if file_extension not in ['pdf', 'docx', 'doc']:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file_extension}. Only PDF and DOCX files are supported."
            )
        file_content = await file.read()
        
        try:
            # Try normal extraction first
            extracted_data = await resume_extractor.extract_content(file_content, file_extension, file.filename)
            logger.info(f"Successfully extracted content from {file.filename}")
            return extracted_data
        except Exception as e:
            logger.warning(f"Standard extraction failed: {str(e)}. Falling back to OCR...")
            # Fall back to OCR if standard extraction fails
            return await ocr_extract(file_content, file_extension, file.filename)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extracting resume content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to extract resume content: {str(e)}")

@app.post("/ocr-extract")
async def ocr_extract(file_content: bytes, file_extension: str, filename: str) -> dict:
    """
    Extract content from resume using OCR when standard extraction fails.
    Args:
        file_content (bytes): File content as bytes.
        file_extension (str): File extension.
        filename (str): Original filename.
    Returns:
        dict: Structured resume data.
    """
    try:
        logger.info(f"Using OCR extraction for {filename}")
        # Use PyMuPDF (fitz) for PDF extraction with OCR fallback
        import fitz
        import pytesseract
        from PIL import Image
        import io
        
        text_content = ""
        
        if file_extension == 'pdf':
            with fitz.open(stream=file_content, filetype="pdf") as doc:
                for page_num in range(len(doc)):
                    page = doc.load_page(page_num)
                    
                    # Try to get text directly first
                    text = page.get_text("text")
                    if text.strip():
                        text_content += text + "\n"
                    else:
                        # If no text, use OCR on the page image
                        pix = page.get_pixmap()
                        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                        text_content += pytesseract.image_to_string(img) + "\n"
        else:
            # For non-PDF files, convert to image and use OCR
            img = Image.open(io.BytesIO(file_content))
            text_content = pytesseract.image_to_string(img)
        
        # Use LLM to extract structured data from OCR text
        structured_data = extract_structured_resume(text_content)
        logger.info(f"Successfully extracted content using OCR from {filename}")
        return structured_data
    except Exception as e:
        logger.error(f"OCR extraction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OCR extraction failed: {str(e)}")

@app.post("/enhance")
async def enhance_text(request: EnhanceRequest) -> Dict[str, str]:
    """
    Enhance text content using Gemini AI.
    Args:
        request (EnhanceRequest): Text to enhance and context.
    Returns:
        Dict[str, str]: Enhanced text and original text.
    """
    try:
        logger.info("Processing text enhancement request")
        prompt = (
            f"You are a professional resume writer. Enhance the following text to make it more impactful, "
            f"professional, and effective for a {request.context}. Use strong action verbs, quantify achievements "
            f"where possible, and maintain a professional tone. Keep the same general information but make it more compelling.\n\n"
            f"Text to enhance: {request.text}\n\n"
            f"Enhanced version:"
        )
        
        chain = llm | output_parser
        enhanced_text = chain.invoke(prompt)
        
        # Generate improvements list
        improvements_prompt = (
            f"Based on the original text and your enhanced version, list 3-5 specific improvements you made. "
            f"Format as a JSON array of strings.\n\n"
            f"Original: {request.text}\n\n"
            f"Enhanced: {enhanced_text}\n\n"
            f"Improvements:"
        )
        
        improvements_chain = llm | output_parser
        improvements_text = improvements_chain.invoke(improvements_prompt)
        
        try:
            import json
            improvements = json.loads(improvements_text)
        except:
            improvements = ["Improved professional language", "Added impact statements", "Enhanced clarity"]
        
        logger.info("Successfully enhanced text content")
        return {
            "enhancedText": enhanced_text,
            "originalText": request.text,
            "improvements": improvements
        }
    except Exception as e:
        logger.error(f"Error enhancing text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to enhance text: {str(e)}")

@app.post("/ats-score")
async def calculate_ats_score(request: ATSRequest) -> Dict[str, Any]:
    """
    Calculate ATS compatibility score using TF-IDF analysis.
    Args:
        request (ATSRequest): Resume data and job description.
    Returns:
        Dict[str, Any]: ATS compatibility score with feedback and suggestions.
    """
    try:
        logger.info("Processing ATS score calculation request")
        
        # Convert dict to ResumeData
        from models import ResumeData
        resume_data = ResumeData(**request.resume_data)
        
        ats_result = await ats_scorer.calculate_score(resume_data, request.job_description)
        
        # Extract missing skills from job description
        missing_skills = []
        if request.job_description:
            from sklearn.feature_extraction.text import CountVectorizer
            import re
            
            # Extract skills from job description
            job_skills = set()
            skill_patterns = [
                r'proficient in ([\w\s,]+)',
                r'experience with ([\w\s,]+)',
                r'knowledge of ([\w\s,]+)',
                r'skills:? ([\w\s,]+)',
                r'requirements:? ([\w\s,]+)'
            ]
            
            for pattern in skill_patterns:
                matches = re.findall(pattern, request.job_description.lower())
                for match in matches:
                    skills = [s.strip() for s in re.split(r'[,;]', match)]
                    job_skills.update(skills)
            
            # Compare with resume skills
            resume_skills = set([s.lower() for s in resume_data.skills])
            missing_skills = list(job_skills - resume_skills)
            missing_skills = [s for s in missing_skills if len(s) > 3][:10]  # Limit to 10 meaningful skills
        
        # Format issues
        format_issues = []
        if not resume_data.summary or len(resume_data.summary) < 50:
            format_issues.append("Professional summary is too short or missing")
        if len(resume_data.skills) < 5:
            format_issues.append("Not enough skills listed (aim for 8-12 relevant skills)")
        if not resume_data.experience or len(resume_data.experience) == 0:
            format_issues.append("Work experience section is missing")
        for exp in resume_data.experience:
            if not exp.description or len(exp.description) < 50:
                format_issues.append("Some job descriptions are too brief")
                break
        
        # Calculate keyword density
        keyword_density = {}
        if request.job_description:
            from sklearn.feature_extraction.text import CountVectorizer
            import numpy as np
            
            # Extract keywords from job description
            vectorizer = CountVectorizer(stop_words='english', max_features=20)
            job_desc_matrix = vectorizer.fit_transform([request.job_description])
            feature_names = vectorizer.get_feature_names_out()
            
            # Get resume text
            resume_text = ""
            if resume_data.summary:
                resume_text += resume_data.summary + " "
            for skill in resume_data.skills:
                resume_text += skill + " "
            for exp in resume_data.experience:
                if exp.description:
                    resume_text += exp.description + " "
            
            # Calculate density
            resume_matrix = vectorizer.transform([resume_text])
            resume_counts = np.asarray(resume_matrix.sum(axis=0)).flatten()
            total_words = sum(resume_counts)
            
            if total_words > 0:
                for i, word in enumerate(feature_names):
                    density = (resume_counts[i] / total_words) * 100
                    if density > 0:
                        keyword_density[word] = round(density, 1)
        
        # Generate recommendations
        recommendations = {
            "skills": [],
            "experience": [],
            "education": [],
            "formatting": []
        }
        
        # Skills recommendations
        if missing_skills:
            recommendations["skills"].append(f"Add these missing skills that appear in the job description: {', '.join(missing_skills[:5])}")
        if len(resume_data.skills) < 8:
            recommendations["skills"].append("Expand your skills section to include 8-12 relevant technical and soft skills")
        
        # Experience recommendations
        has_metrics = False
        for exp in resume_data.experience:
            if exp.description and re.search(r'\d+%|\$\d+|\d+\+|increased|decreased|improved|reduced', exp.description, re.IGNORECASE):
                has_metrics = True
                break
        
        if not has_metrics:
            recommendations["experience"].append("Add quantifiable achievements with metrics (%, $, numbers) to your experience")
        
        recommendations["experience"].append("Start each bullet point with strong action verbs (e.g., Implemented, Developed, Led)")
        
        # Formatting recommendations
        recommendations["formatting"].append("Use consistent date formats throughout your resume")
        recommendations["formatting"].append("Ensure proper spacing and alignment for better readability")
        recommendations["formatting"].append("Use a clean, ATS-friendly template without tables or complex formatting")
        
        response = {
            "atsScore": ats_result.score,
            "missingSkills": missing_skills,
            "suggestions": ats_result.suggestions,
            "formatIssues": format_issues,
            "matchPercentage": ats_result.score,
            "keywordDensity": keyword_density,
            "recommendations": recommendations
        }
        
        logger.info(f"ATS score calculated: {ats_result.score}")
        return response
    except Exception as e:
        logger.error(f"Error calculating ATS score: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to calculate ATS score: {str(e)}")

@app.post("/feedback")
async def feedback_endpoint(resume_data: dict = Body(...)) -> Dict[str, Any]:
    """
    Provide real-time feedback for resume editing: ATS score, suggestions, and section completeness.
    Args:
        resume_data (dict): The current resume data from the frontend.
    Returns:
        dict: Feedback including ATS score, suggestions, and completeness info.
    """
    try:
        # Convert dict to ResumeData
        from models import ResumeData
        resume_data_obj = ResumeData(**resume_data)
        
        # ATS score and feedback
        ats_result = await ats_scorer.calculate_score(resume_data_obj, "")
        
        # Suggestions (from Gemini or rule-based)
        try:
            ai_suggestions = await gemini_client._generate_ai_suggestions(resume_data_obj)
        except Exception:
            ai_suggestions = []
            
        # Section completeness
        completeness = {
            "personalInfo": bool(resume_data_obj.personalInfo and resume_data_obj.personalInfo.fullName and resume_data_obj.personalInfo.email),
            "summary": bool(resume_data_obj.summary and len(resume_data_obj.summary.strip()) > 0),
            "skills": bool(resume_data_obj.skills and len(resume_data_obj.skills) > 0),
            "experience": bool(resume_data_obj.experience and len(resume_data_obj.experience) > 0),
            "education": bool(resume_data_obj.education and len(resume_data_obj.education) > 0),
        }
        
        return {
            "ats_score": ats_result.score,
            "ats_feedback": [f"{f.category}: {f.message}" for f in ats_result.feedback],
            "suggestions": ai_suggestions,
            "completeness": completeness
        }
    except Exception as e:
        logger.error(f"Error in feedback_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate feedback: {str(e)}")

@app.get("/info")
async def get_service_info() -> Dict[str, Any]:
    """Get service information and available endpoints."""
    return {
        "service": "Resume Processing AI Service",
        "version": "1.0.0",
        "endpoints": {
            "/extract": "Extract content from resume files (PDF/DOCX)",
            "/ocr-extract": "Extract content using OCR for unreadable files",
            "/enhance": "Enhance resume content using AI",
            "/ats-score": "Calculate ATS compatibility score",
            "/feedback": "Get real-time feedback during editing",
            "/health": "Health check endpoint",
            "/docs": "API documentation"
        },
        "supported_formats": ["PDF", "DOCX"],
        "ai_provider": "Google Gemini 1.5 Pro"
    }

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions."""
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors and return field-specific messages."""
    logger.error(f"Validation error: {exc.errors()}")
    errors = [
        {
            "loc": err["loc"],
            "msg": err["msg"],
            "type": err["type"]
        }
        for err in exc.errors()
    ]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": errors, "status_code": 422}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions."""
    logger.error(f"Unexpected error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "status_code": 500}
    )

if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
