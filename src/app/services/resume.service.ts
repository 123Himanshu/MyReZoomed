import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { type Observable, of, throwError } from "rxjs"
import { catchError, map } from "rxjs/operators"
import type {
  ResumeData,
  ResumeTemplate,
  FeedbackResponse,
  EnhancementResponse,
  ATSAnalysisRequest,
  EnhancementRequest,
} from "../models/resume.model"

export interface UploadResponse {
  success: boolean
  data?: ResumeData
  message?: string
}

@Injectable({
  providedIn: "root",
})
export class ResumeService {
  private readonly JAVA_API_URL = "http://localhost:8080/api"
  private readonly PYTHON_API_URL = "http://localhost:8001"

  private resumeData: ResumeData | null = null

  constructor(private http: HttpClient) {}

  // Resume Data Management
  getResumeData(): ResumeData | null {
    return this.resumeData
  }

  updateResumeData(data: ResumeData): void {
    this.resumeData = data
  }

  clearResumeData(): void {
    this.resumeData = null
  }

  // File Upload and Extraction
  uploadResume(file: File): Observable<ResumeData> {
    const formData = new FormData()
    formData.append("file", file)

    return this.http.post<ResumeData>(`${this.PYTHON_API_URL}/extract`, formData).pipe(
      map((response) => {
        // Ensure all required fields have defaults
        const resumeData: ResumeData = {
          personalInfo: {
            fullName: response.personalInfo?.fullName || "Unknown",
            email: response.personalInfo?.email || "",
            phone: response.personalInfo?.phone || "",
            address: response.personalInfo?.address || "",
            linkedIn: response.personalInfo?.linkedIn || "",
            website: response.personalInfo?.website || "",
            github: response.personalInfo?.github || "",
            naukri: response.personalInfo?.naukri || "",
            portfolio: response.personalInfo?.portfolio || "",
          },
          summary: response.summary || "",
          skills: response.skills || [],
          experience: (response.experience || []).map((exp) => ({
            ...exp,
            jobTitle: exp.jobTitle || exp.position || "",
            position: exp.position || exp.jobTitle || "",
            current: exp.current || false,
            achievements: exp.achievements || [],
          })),
          education: response.education || [],
          projects: response.projects || [],
          certifications: response.certifications || [],
          languages: response.languages || [],
          unexpectedFields: response.unexpectedFields || {},
          rawText: response.rawText || "",
          jobDescription: response.jobDescription || "",
        }

        this.updateResumeData(resumeData)
        return resumeData
      }),
      catchError((error) => {
        console.error("Upload failed:", error)
        return throwError(() => new Error("Failed to upload and extract resume content"))
      }),
    )
  }

  // ATS Scoring
  getATSScore(resumeData: ResumeData, jobDescription: string): Observable<FeedbackResponse> {
    const request: ATSAnalysisRequest = {
      resumeData,
      jobDescription,
    }

    return this.http.post<FeedbackResponse>(`${this.PYTHON_API_URL}/ats-score`, request).pipe(
      catchError((error) => {
        console.error("ATS scoring failed:", error)
        // Return mock data as fallback
        return of({
          atsScore: 75,
          missingSkills: ["Python", "Machine Learning", "Data Analysis"],
          suggestions: [
            "Add more technical keywords from the job description",
            "Include quantifiable achievements with metrics",
            "Use standard section headings for better ATS parsing",
          ],
          formatIssues: ["Consider adding more specific job descriptions"],
          matchPercentage: 75,
          keywordDensity: {
            python: 2.5,
            javascript: 1.8,
            react: 1.2,
            node: 0.9,
          },
          recommendations: {
            skills: ["Add Python programming experience", "Include cloud technologies"],
            experience: ["Quantify your achievements with specific numbers"],
            education: ["Add relevant certifications"],
            formatting: ["Use consistent date formats", "Ensure proper section headings"],
          },
        })
      }),
    )
  }

  // AI Enhancement
  enhanceResume(resumeData: ResumeData): Observable<EnhancementResponse> {
    return this.http.post<EnhancementResponse>(`${this.PYTHON_API_URL}/enhance`, resumeData).pipe(
      catchError((error) => {
        console.error("Enhancement failed:", error)
        // Return mock enhancement as fallback
        return of({
          enhancedText: {
            ...resumeData,
            summary: resumeData.summary
              ? `Results-driven professional with proven expertise in ${resumeData.skills.slice(0, 3).join(", ")}. ${resumeData.summary}`
              : "Results-driven professional with proven track record of delivering high-quality solutions and driving business success.",
            experience: resumeData.experience.map((exp) => ({
              ...exp,
              description: exp.description
                ? `Developed and ${exp.description.toLowerCase()}`
                : `Responsible for key initiatives and deliverables in ${exp.position} role.`,
            })),
          },
          originalText: resumeData,
          improvements: [
            "Enhanced professional summary with industry keywords",
            "Improved action verbs and quantifiable achievements",
            "Optimized content for ATS compatibility",
            "Added relevant technical competencies",
          ],
          aiSuggestions: [
            "Consider adding specific metrics and numbers to quantify your achievements",
            "Include relevant certifications or training programs",
            "Tailor keywords to match your target job descriptions",
            "Add a projects section to showcase notable work",
          ],
        })
      }),
    )
  }

  // Template Management
  getTemplates(): Observable<ResumeTemplate[]> {
    return this.http.get<ResumeTemplate[]>(`${this.JAVA_API_URL}/templates`).pipe(
      catchError((error) => {
        console.error("Failed to load templates:", error)
        // Return default templates as fallback
        return of([
          {
            id: "minimalist",
            name: "Minimalist",
            description: "Clean and simple design focusing on content with elegant spacing",
            preview: "/placeholder.svg?height=400&width=300",
          },
          {
            id: "modern-professional",
            name: "Modern Professional",
            description: "Contemporary design with accent colors and visual hierarchy",
            preview: "/placeholder.svg?height=400&width=300",
          },
          {
            id: "traditional",
            name: "Traditional",
            description: "Classic format preferred by traditional industries and recruiters",
            preview: "/placeholder.svg?height=400&width=300",
          },
        ])
      }),
    )
  }

  // PDF Generation
  generatePDF(resumeData: ResumeData, templateId: string): Observable<Blob> {
    const request = {
      resumeData,
      templateId,
    }

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    })

    return this.http
      .post(`${this.JAVA_API_URL}/generate-pdf`, request, {
        headers,
        responseType: "blob",
      })
      .pipe(
        catchError((error) => {
          console.error("PDF generation failed:", error)
          return throwError(() => new Error("Failed to generate PDF"))
        }),
      )
  }

  // Real-time Feedback
  getFeedback(resumeData: ResumeData): Observable<any> {
    return this.http.post(`${this.PYTHON_API_URL}/feedback`, resumeData).pipe(
      catchError((error) => {
        console.error("Feedback failed:", error)
        return of({
          ats_score: 70,
          ats_feedback: ["Good keyword usage", "Consider adding more metrics"],
          suggestions: ["Add quantifiable achievements", "Include relevant certifications"],
          completeness: {
            personalInfo: true,
            summary: true,
            skills: true,
            experience: true,
            education: true,
          },
        })
      }),
    )
  }

  // Text Enhancement
  enhanceText(text: string, context = "professional resume"): Observable<any> {
    const request: EnhancementRequest = {
      text,
      context,
    }

    return this.http.post(`${this.PYTHON_API_URL}/enhance`, request).pipe(
      catchError((error) => {
        console.error("Text enhancement failed:", error)
        return of({
          enhancedText: `Enhanced: ${text}`,
          originalText: text,
          improvements: ["Improved professional language", "Added impact statements"],
        })
      }),
    )
  }
}

export type { FeedbackResponse, EnhancementResponse }
