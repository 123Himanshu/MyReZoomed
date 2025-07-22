"""
Pydantic models for resume data, experience, education, ATS feedback, and enhanced resume.
Defines the data structures used throughout the resume processing application.
"""
from pydantic import BaseModel, Field, EmailStr, ValidationError, validator, model_validator
from typing import List, Optional

class PersonalInfo(BaseModel):
    """Model for personal information in a resume."""
    fullName: str = Field(..., description="Full name of the person")
    email: EmailStr = Field(..., description="Email address")
    phone: Optional[str] = Field(None, description="Phone number")
    address: Optional[str] = Field(None, description="Physical address")
    linkedIn: Optional[str] = Field(None, description="LinkedIn profile URL")
    website: Optional[str] = Field(None, description="Personal website URL")

    @validator('fullName')
    def name_required(cls, v):
        if not v or not v.strip():
            raise ValueError('Full name is required')
        return v

class Experience(BaseModel):
    """Model for a work experience entry in a resume."""
    id: Optional[str] = Field(None, description="Unique identifier")
    company: str = Field(..., description="Company name")
    position: str = Field(..., description="Job position/title")
    startDate: str = Field(..., description="Start date")
    endDate: Optional[str] = Field(None, description="End date")
    current: bool = Field(False, description="Currently working here")
    description: str = Field(..., description="Job description")
    achievements: Optional[List[str]] = Field(default_factory=list, description="List of achievements")

    @model_validator(mode='after')
    def check_dates(self):
        start = self.startDate
        end = self.endDate
        if start and end:
            try:
                from datetime import datetime
                s = datetime.strptime(start, '%Y-%m-%d')
                e = datetime.strptime(end, '%Y-%m-%d')
                if e < s:
                    raise ValueError('End date must be after start date')
            except Exception:
                pass  # Ignore if format is not YYYY-MM-DD
        return self

class Education(BaseModel):
    """Model for an education entry in a resume."""
    id: Optional[str] = Field(None, description="Unique identifier")
    institution: str = Field(..., description="Educational institution")
    degree: str = Field(..., description="Degree obtained")
    field: str = Field(..., description="Field of study")
    startDate: Optional[str] = Field(None, description="Start date")
    endDate: str = Field(..., description="End date")
    gpa: Optional[str] = Field(None, description="GPA if applicable")

    @model_validator(mode='after')
    def check_edu_dates(self):
        start = self.startDate
        end = self.endDate
        if start and end:
            try:
                from datetime import datetime
                s = datetime.strptime(start, '%Y-%m-%d')
                e = datetime.strptime(end, '%Y-%m-%d')
                if e < s:
                    raise ValueError('Education end date must be after start date')
            except Exception:
                pass
        return self

class ResumeData(BaseModel):
    """Model for the full structured resume data."""
    personalInfo: PersonalInfo
    summary: Optional[str] = Field(None, description="Professional summary")
    skills: List[str] = Field(default_factory=list, description="List of skills")
    experience: List[Experience] = Field(default_factory=list, description="Work experience")
    education: List[Education] = Field(default_factory=list, description="Educational background")
    rawText: Optional[str] = Field(None, description="Raw extracted text")

class ATSFeedback(BaseModel):
    """Model for ATS feedback on a specific category."""
    category: str = Field(..., description="Feedback category")
    score: int = Field(..., description="Score for this category (0-100)")
    message: str = Field(..., description="Feedback message")
    severity: str = Field(..., description="Severity level: low, medium, high")

class ATSScore(BaseModel):
    """Model for the overall ATS score and feedback."""
    score: int = Field(..., description="Overall ATS score (0-100)")
    feedback: List[ATSFeedback] = Field(default_factory=list, description="Detailed feedback")
    suggestions: List[str] = Field(default_factory=list, description="Improvement suggestions")

class EnhancedResume(BaseModel):
    """Model for the enhanced resume and improvement suggestions."""
    originalResume: ResumeData
    enhancedResume: ResumeData
    improvements: List[str] = Field(default_factory=list, description="List of improvements made")
    aiSuggestions: List[str] = Field(default_factory=list, description="Additional AI suggestions")
