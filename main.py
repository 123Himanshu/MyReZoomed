"""
FastAPI Resume Processing Microservice
Handles AI-powered resume enhancement, content extraction, and ATS scoring
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging
import os
from dotenv import load_dotenv
import uvicorn

from extractor import ResumeExtractor
from ats_score import ATSScorer
from gemini_client import GeminiClient
from models import ResumeData, PersonalInfo, Experience, Education, ATSScore, ATSFeedback, EnhancedResume

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
    allow_origins=["http://localhost:8080", "http://localhost:4200", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
resume_extractor = ResumeExtractor()
ats_scorer = ATSScorer()
gemini_client = GeminiClient()

# Pydantic models
class PersonalInfo(BaseModel):
    fullName: str = Field(..., description="Full name of the person")
    email: str = Field(..., description="Email address")
    phone: Optional[str] = Field(None, description="Phone number")
    address: Optional[str] = Field(None, description="Physical address")
    linkedIn: Optional[str] = Field(None, description="LinkedIn profile URL")
    website: Optional[str] = Field(None, description="Personal website URL")

class Experience(BaseModel):
    id: Optional[str] = Field(None, description="Unique identifier")
    company: str = Field(..., description="Company name")
    position: str = Field(..., description="Job position/title")
    startDate: str = Field(..., description="Start date")
    endDate: Optional[str] = Field(None, description="End date")
    current: bool = Field(False, description="Currently working here")
    description: str = Field(..., description="Job description")
    achievements: Optional[List[str]] = Field([], description="List of achievements")

class Education(BaseModel):
    id: Optional[str] = Field(None, description="Unique identifier")
    institution: str = Field(..., description="Educational institution")
    degree: str = Field(..., description="Degree obtained")
    field: str = Field(..., description="Field of study")
    startDate: Optional[str] = Field(None, description="Start date")
    endDate: str = Field(..., description="End date")
    gpa: Optional[str] = Field(None, description="GPA if applicable")

class ResumeData(BaseModel):
    personalInfo: PersonalInfo
    summary: Optional[str] = Field(None, description="Professional summary")
    skills: List[str] = Field([], description="List of skills")
    experience: List[Experience] = Field([], description="Work experience")
    education: List[Education] = Field([], description="Educational background")
    rawText: Optional[str] = Field(None, description="Raw extracted text")

class EnhanceRequest(BaseModel):
    personalInfo: PersonalInfo
    summary: Optional[str] = Field(None, description="Current professional summary")
    skills: List[str] = Field([], description="Current skills list")
    experience: List[Experience] = Field([], description="Current work experience")
    education: List[Education] = Field([], description="Educational background")

class ATSRequest(BaseModel):
    resumeData: ResumeData
    jobDescription: Optional[str] = Field("", description="Job description for comparison")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Resume Processing AI Service"}

# Extract resume content from uploaded file
@app.post("/extract", response_model=ResumeData)
async def extract_resume(file: UploadFile = File(...)):
    """
    Extract content from uploaded resume file (PDF or DOCX)
    
    Args:
        file: Uploaded resume file
        
    Returns:
        ResumeData: Structured resume data
    """
    try:
        logger.info(f"Processing file upload: {file.filename}")
        
        # Validate file type
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
            
        file_extension = file.filename.lower().split('.')[-1]
        if file_extension not in ['pdf', 'docx', 'doc']:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type: {file_extension}. Only PDF and DOCX files are supported."
            )
        
        # Read file content
        file_content = await file.read()
        
        # Extract content using appropriate extractor
        extracted_data = await resume_extractor.extract_content(file_content, file_extension, file.filename)
        
        logger.info(f"Successfully extracted content from {file.filename}")
        return extracted_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extracting resume content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to extract resume content: {str(e)}")

# Enhance resume using Gemini AI
@app.post("/enhance", response_model=EnhancedResume)
async def enhance_resume(request: EnhanceRequest):
    """
    Enhance resume content using Gemini AI
    
    Args:
        request: Resume data to enhance
        
    Returns:
        EnhancedResume: Original and enhanced resume with improvements
    """
    try:
        logger.info("Processing resume enhancement request")
        
        # Convert request to ResumeData format
        original_resume = ResumeData(
            personalInfo=request.personalInfo,
            summary=request.summary,
            skills=request.skills,
            experience=request.experience,
            education=request.education
        )
        
        # Enhance resume using Gemini
        enhanced_data = await gemini_client.enhance_resume(original_resume)
        
        logger.info("Successfully enhanced resume content")
        return enhanced_data
        
    except Exception as e:
        logger.error(f"Error enhancing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to enhance resume: {str(e)}")

# Calculate ATS score
@app.post("/ats-score", response_model=ATSScore)
async def calculate_ats_score(request: ATSRequest):
    """
    Calculate ATS compatibility score using TF-IDF analysis
    
    Args:
        request: Resume data and optional job description
        
    Returns:
        ATSScore: ATS compatibility score with feedback and suggestions
    """
    try:
        logger.info("Processing ATS score calculation request")
        
        # Calculate ATS score
        ats_result = await ats_scorer.calculate_score(request.resumeData, request.jobDescription)
        
        logger.info(f"Successfully calculated ATS score: {ats_result.score}")
        return ats_result
        
    except Exception as e:
        logger.error(f"Error calculating ATS score: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to calculate ATS score: {str(e)}")

# Get service information
@app.get("/info")
async def get_service_info():
    """Get service information and available endpoints"""
    return {
        "service": "Resume Processing AI Service",
        "version": "1.0.0",
        "endpoints": {
            "/extract": "Extract content from resume files (PDF/DOCX)",
            "/enhance": "Enhance resume content using AI",
            "/ats-score": "Calculate ATS compatibility score",
            "/health": "Health check endpoint",
            "/docs": "API documentation"
        },
        "supported_formats": ["PDF", "DOCX"],
        "ai_provider": "Google Gemini 1.5 Pro"
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
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
