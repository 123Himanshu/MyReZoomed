from pydantic import BaseModel, Field
from typing import List, Optional

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

class ATSFeedback(BaseModel):
    category: str = Field(..., description="Feedback category")
    score: int = Field(..., description="Score for this category (0-100)")
    message: str = Field(..., description="Feedback message")
    severity: str = Field(..., description="Severity level: low, medium, high")

class ATSScore(BaseModel):
    score: int = Field(..., description="Overall ATS score (0-100)")
    feedback: List[ATSFeedback] = Field(..., description="Detailed feedback")
    suggestions: List[str] = Field(..., description="Improvement suggestions")

class EnhancedResume(BaseModel):
    originalResume: ResumeData
    enhancedResume: ResumeData
    improvements: List[str] = Field(..., description="List of improvements made")
    aiSuggestions: List[str] = Field(..., description="Additional AI suggestions") 