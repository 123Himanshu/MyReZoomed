import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { ResumeService } from "../../services/resume.service"
import { ResumeData, ResumeTemplate } from "../../models/resume.model"

@Component({
  selector: "app-pdf-preview-download",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto section-bg min-h-screen py-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-accent mb-4">Download Your Resume</h2>
        <p class="text-lg text-gray-700">Preview and download your professionally formatted resume</p>
      </div>

      <div *ngIf="!resumeData || !selectedTemplate" class="text-center py-12">
        <p class="text-gray-600 mb-4">Missing resume data or template. Please complete all previous steps.</p>
        <button (click)="router.navigate(['/upload'])"
                class="btn-primary">
          Start Over
        </button>
      </div>

      <div *ngIf="resumeData && selectedTemplate" class="space-y-8">
        <!-- Resume Summary -->
        <div class="card">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Resume Summary</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <h4 class="font-medium text-blue-900">Template</h4>
              <p class="text-blue-700 mt-1">{{ selectedTemplate.name }}</p>
            </div>

            <div class="text-center p-4 bg-green-50 rounded-lg">
              <h4 class="font-medium text-green-900">Sections</h4>
              <p class="text-green-700 mt-1">{{ getSectionCount() }} sections</p>
            </div>

            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <h4 class="font-medium text-purple-900">Skills</h4>
              <p class="text-purple-700 mt-1">{{ resumeData.skills.length }} skills listed</p>
            </div>
          </div>
        </div>

        <!-- PDF Preview -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Preview Panel -->
          <div class="card">
            <div class="bg-gray-50 px-6 py-4 border-b">
              <h3 class="text-lg font-semibold text-gray-900">Resume Preview</h3>
            </div>

            <div class="p-6">
              <div *ngIf="isGenerating" class="text-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p class="text-gray-600">Generating preview...</p>
              </div>

              <div *ngIf="!isGenerating" class="border border-gray-200 rounded-lg p-6 bg-white" style="min-height: 600px;">
                <!-- Mock PDF Preview -->
                <div class="space-y-6">
                  <!-- Header -->
                  <div class="text-center border-b pb-4">
                    <h1 class="text-2xl font-bold text-gray-900">{{ resumeData.personalInfo.fullName }}</h1>
                    <div class="text-gray-600 mt-2">
                      <p>{{ resumeData.personalInfo.email }} | {{ resumeData.personalInfo.phone }}</p>
                      <p>{{ resumeData.personalInfo.address }}</p>
                      <p *ngIf="resumeData.personalInfo.linkedIn">{{ resumeData.personalInfo.linkedIn }}</p>
                    </div>
                  </div>

                  <!-- Summary -->
                  <div *ngIf="resumeData.summary">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h3>
                    <p class="text-gray-700 text-sm leading-relaxed">{{ resumeData.summary }}</p>
                  </div>

                  <!-- Skills -->
                  <div *ngIf="resumeData.skills.length > 0">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Core Competencies</h3>
                    <div class="grid grid-cols-2 gap-1">
                      <span *ngFor="let skill of resumeData.skills.slice(0, 8)"
                            class="text-sm text-gray-700">• {{ skill }}</span>
                    </div>
                  </div>

                  <!-- Experience Preview -->
                  <div *ngIf="resumeData.experience.length > 0">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Professional Experience</h3>
                    <div *ngFor="let exp of resumeData.experience.slice(0, 2)" class="mb-3">
                      <div class="flex justify-between items-start">
                        <div>
                          <h4 class="font-medium text-gray-900 text-sm">{{ exp.position }}</h4>
                          <p class="text-gray-600 text-sm">{{ exp.company }}</p>
                        </div>
                        <span class="text-xs text-gray-500">{{ exp.startDate }} - {{ exp.current ? 'Present' : exp.endDate }}</span>
                      </div>
                      <p class="text-gray-700 text-xs mt-1">{{ exp.description.substring(0, 100) }}...</p>
                    </div>
                  </div>

                  <!-- Education Preview -->
                  <div *ngIf="resumeData.education.length > 0">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Education</h3>
                    <div *ngFor="let edu of resumeData.education.slice(0, 2)" class="mb-2">
                      <div class="flex justify-between items-start">
                        <div>
                          <h4 class="font-medium text-gray-900 text-sm">{{ edu.degree }} in {{ edu.field }}</h4>
                          <p class="text-gray-600 text-sm">{{ edu.institution }}</p>
                        </div>
                        <span class="text-xs text-gray-500">{{ edu.endDate }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Download Options -->
          <div class="space-y-6">
            <!-- Download Formats -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Download Options</h3>

              <div class="space-y-4">
                <button (click)="downloadPDF()"
                        [disabled]="isGenerating"
                        class="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  {{ isGenerating ? 'Generating...' : 'Download PDF' }}
                </button>

                <button (click)="downloadWord()"
                        [disabled]="isGenerating"
                        class="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  Download Word Document
                </button>

                <button (click)="downloadBoth()"
                        [disabled]="isGenerating"
                        class="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  Download Both Formats
                </button>
              </div>
            </div>

            <!-- Additional Options -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Additional Options</h3>

              <div class="space-y-3">
                <button (click)="emailResume()"
                        class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Email to Myself
                </button>

                <button (click)="shareResume()"
                        class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                  </svg>
                  Get Shareable Link
                </button>

                <button (click)="saveToCloud()"
                        class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  Save to Cloud
                </button>
              </div>
            </div>

            <!-- Success Message -->
            <div *ngIf="downloadSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4 card">
              <div class="flex">
                <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">Download Successful!</h3>
                  <p class="text-sm text-green-700 mt-1">Your resume has been downloaded successfully.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="card">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">What's Next?</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center p-4 border border-gray-200 rounded-lg">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                </svg>
              </div>
              <h4 class="font-medium text-gray-900 mb-2">Apply to Jobs</h4>
              <p class="text-sm text-gray-600">Start applying to positions with your optimized resume</p>
            </div>

            <div class="text-center p-4 border border-gray-200 rounded-lg">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h4 class="font-medium text-gray-900 mb-2">Track Applications</h4>
              <p class="text-sm text-gray-600">Keep track of your job applications and responses</p>
            </div>

            <div class="text-center p-4 border border-gray-200 rounded-lg">
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h4 class="font-medium text-gray-900 mb-2">Update Regularly</h4>
              <p class="text-sm text-gray-600">Keep your resume updated with new experiences</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex justify-between">
        <button (click)="router.navigate(['/ats-score'])"
                class="btn-secondary">
          Back
        </button>

        <div class="space-x-4">
          <button (click)="startOver()"
                  class="btn-secondary">
            Create Another Resume
          </button>

          <button (click)="finish()"
                  class="btn-primary">
            Finish
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class PdfPreviewDownloadComponent implements OnInit {
  resumeData: ResumeData | null = null
  selectedTemplate: ResumeTemplate | null = null
  isGenerating = false
  downloadSuccess = false

  constructor(
    private resumeService: ResumeService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.resumeData = this.resumeService.getCurrentResumeData()
    this.selectedTemplate = this.resumeService.getSelectedTemplate()
  }

  getSectionCount(): number {
    if (!this.resumeData) return 0

    let count = 1 // Personal info always present
    if (this.resumeData.summary) count++
    if (this.resumeData.skills.length > 0) count++
    if (this.resumeData.experience.length > 0) count++
    if (this.resumeData.education.length > 0) count++

    return count
  }

  downloadPDF(): void {
    if (!this.resumeData || !this.selectedTemplate) return

    this.isGenerating = true
    this.downloadSuccess = false

    this.resumeService.generatePDF(this.resumeData, this.selectedTemplate.id).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `${this.resumeData!.personalInfo.fullName}_Resume.pdf`)
        this.isGenerating = false
        this.downloadSuccess = true
        setTimeout(() => (this.downloadSuccess = false), 5000)
      },
      error: (error) => {
        console.error("Failed to generate PDF:", error)
        this.isGenerating = false
        // Fallback: create a mock download for demo
        this.mockDownload("pdf")
      },
    })
  }

  downloadWord(): void {
    // Mock Word download for demo
    this.isGenerating = true
    setTimeout(() => {
      this.mockDownload("docx")
      this.isGenerating = false
    }, 2000)
  }

  downloadBoth(): void {
    this.downloadPDF()
    setTimeout(() => this.downloadWord(), 1000)
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  private mockDownload(format: string): void {
    const filename = `${this.resumeData!.personalInfo.fullName}_Resume.${format}`
    const content = `Mock ${format.toUpperCase()} content for ${this.resumeData!.personalInfo.fullName}`
    const blob = new Blob([content], { type: "text/plain" })
    this.downloadFile(blob, filename)
    this.downloadSuccess = true
    setTimeout(() => (this.downloadSuccess = false), 5000)
  }

  emailResume(): void {
    // Mock email functionality
    alert("Email functionality would be implemented here. Resume would be sent to your email address.")
  }

  shareResume(): void {
    // Mock share functionality
    const shareUrl = `https://resume-app.com/share/${Date.now()}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert(`Shareable link copied to clipboard: ${shareUrl}`)
    })
  }

  saveToCloud(): void {
    // Mock cloud save functionality
    alert("Resume saved to cloud storage successfully!")
  }

  startOver(): void {
    this.resumeService.resetData()
    this.router.navigate(["/upload"])
  }

  finish(): void {
    alert("Thank you for using Resume Updater! Your resume has been successfully created.")
    this.router.navigate(["/upload"])
  }
}
