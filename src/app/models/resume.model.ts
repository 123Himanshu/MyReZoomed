export interface ResumeData {
    id?: string
    personalInfo: PersonalInfo
    experience: Experience[]
    education: Education[]
    skills: string[]
    summary: string
    rawText?: string
  }
  
  export interface PersonalInfo {
    fullName: string
    email: string
    phone: string
    address: string
    linkedIn?: string
    website?: string
  }
  
  export interface Experience {
    id?: string
    company: string
    position: string
    startDate: string
    endDate: string
    current: boolean
    description: string
    achievements: string[]
  }
  
  export interface Education {
    id?: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa?: string
  }
  
  export interface ResumeTemplate {
    id: string
    name: string
    description: string
    previewUrl: string
    category: "modern" | "classic" | "creative"
  }
  
  export interface ATSScore {
    score: number
    feedback: ATSFeedback[]
    suggestions: string[]
  }
  
  export interface ATSFeedback {
    category: string
    score: number
    message: string
    severity: "low" | "medium" | "high"
  }
  
  export interface EnhancedResume {
    originalResume: ResumeData
    enhancedResume: ResumeData
    improvements: string[]
    aiSuggestions: string[]
  }
  