export interface PersonalInfo {
  fullName: string
  email: string
  phone?: string
  address?: string
  linkedIn?: string
  website?: string
  github?: string
  naukri?: string
  portfolio?: string
}

export interface Experience {
  id?: string
  company: string
  position?: string
  jobTitle?: string
  startDate: string
  endDate?: string
  current?: boolean
  description: string
  achievements?: string[]
}

export interface Education {
  id?: string
  institution: string
  degree: string
  field?: string
  startDate?: string
  endDate?: string
  year?: string
  gpa?: string
}

export interface Project {
  id?: string
  name: string
  description: string
  technologies?: string[]
  url?: string
  startDate?: string
  endDate?: string
}

export interface Certification {
  id?: string
  name: string
  issuer: string
  date?: string
  url?: string
}

export interface Language {
  name: string
  proficiency: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  summary?: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  projects?: Project[]
  certifications?: Certification[]
  languages?: Language[]
  unexpectedFields?: { [key: string]: any }
  rawText?: string
  jobDescription?: string
}

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  preview: string
}

export interface FeedbackResponse {
  atsScore: number
  missingSkills: string[]
  suggestions: string[]
  formatIssues: string[]
  matchPercentage: number
  keywordDensity: { [key: string]: number }
  recommendations: {
    skills: string[]
    experience: string[]
    education: string[]
    formatting: string[]
  }
}

export interface EnhancementResponse {
  enhancedText: ResumeData
  originalText: ResumeData
  improvements: string[]
  aiSuggestions: string[]
}

export interface ATSAnalysisRequest {
  resumeData: ResumeData
  jobDescription: string
}

export interface EnhancementRequest {
  text: string
  context: string
}
