import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, BehaviorSubject } from "rxjs"
import { ResumeData, ResumeTemplate, ATSScore, EnhancedResume } from "../models/resume.model"

@Injectable({
  providedIn: "root",
})
export class ResumeService {
  private baseUrl = "http://localhost:8000/api" // Backend URL
  private resumeDataSubject = new BehaviorSubject<ResumeData | null>(null)
  private selectedTemplateSubject = new BehaviorSubject<ResumeTemplate | null>(null)
  private enhancedResumeSubject = new BehaviorSubject<EnhancedResume | null>(null)

  public resumeData$ = this.resumeDataSubject.asObservable()
  public selectedTemplate$ = this.selectedTemplateSubject.asObservable()
  public enhancedResume$ = this.enhancedResumeSubject.asObservable()

  constructor(private http: HttpClient) {}

  // Upload resume file
  uploadResume(file: File): Observable<ResumeData> {
    const formData = new FormData()
    formData.append("file", file)

    return this.http.post<ResumeData>(`${this.baseUrl}/upload`, formData)
  }

  // Update resume data
  updateResumeData(resumeData: ResumeData): void {
    this.resumeDataSubject.next(resumeData)
  }

  // Get current resume data
  getCurrentResumeData(): ResumeData | null {
    return this.resumeDataSubject.value
  }

  // Get available templates
  getTemplates(): Observable<ResumeTemplate[]> {
    return this.http.get<ResumeTemplate[]>(`${this.baseUrl}/templates`)
  }

  // Select template
  selectTemplate(template: ResumeTemplate): void {
    this.selectedTemplateSubject.next(template)
  }

  // Get selected template
  getSelectedTemplate(): ResumeTemplate | null {
    return this.selectedTemplateSubject.value
  }

  // Enhance resume with AI
  enhanceResume(resumeData: ResumeData): Observable<EnhancedResume> {
    return this.http.post<EnhancedResume>(`${this.baseUrl}/ai/enhance`, resumeData)
  }

  // Update enhanced resume
  updateEnhancedResume(enhancedResume: EnhancedResume): void {
    this.enhancedResumeSubject.next(enhancedResume)
  }

  // Get enhanced resume
  getEnhancedResume(): EnhancedResume | null {
    return this.enhancedResumeSubject.value
  }

  // Get ATS score
  getATSScore(resumeData: ResumeData): Observable<ATSScore> {
    return this.http.post<ATSScore>(`${this.baseUrl}/ats-score`, resumeData)
  }

  // Generate PDF
  generatePDF(resumeData: ResumeData, templateId: string): Observable<Blob> {
    const payload = {
      resumeData,
      templateId,
    }

    return this.http.post(`${this.baseUrl}/generate-pdf`, payload, {
      responseType: "blob",
    })
  }

  // Reset all data
  resetData(): void {
    this.resumeDataSubject.next(null)
    this.selectedTemplateSubject.next(null)
    this.enhancedResumeSubject.next(null)
  }
}
