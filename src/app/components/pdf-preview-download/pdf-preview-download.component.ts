import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router } from "@angular/router"
import { ResumeService } from "../../services/resume.service"
import type { ResumeData } from "../../models/resume.model"

@Component({
  selector: "app-pdf-preview-download",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-4">
          Your Resume is Ready!
        </h2>
        <p class="text-lg text-gray-300">Preview and download your professionally formatted resume</p>
      </div>

      <!-- Template Info -->
      <div *ngIf="selectedTemplate" class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="bg-blue-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-100">{{ selectedTemplate }} Template</h3>
              <p class="text-gray-400">Professional formatting applied</p>
            </div>
          </div>
          <button (click)="router.navigate(['/templates'])"
                  class="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors">
            Change Template
          </button>
        </div>
      </div>

      <!-- PDF Preview -->
      <div class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-100">Resume Preview</h3>
          <div class="flex space-x-3">
            <button 
              (click)="generatePDF()"
              [disabled]="isGenerating"
              class="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-white font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!isGenerating" class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download PDF
              </span>
              <span *ngIf="isGenerating" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            </button>
          </div>
        </div>

        <!-- Resume Content Preview -->
        <div *ngIf="resumeData" class="bg-white text-gray-900 rounded-lg p-8 shadow-lg max-h-96 overflow-y-auto">
          <!-- Header -->
          <div class="border-b border-gray-200 pb-4 mb-6">
            <h1 class="text-3xl font-bold text-gray-900">{{ resumeData.personalInfo.fullName }}</h1>
            <div class="mt-3 text-sm text-gray-600 space-y-1">
              <div *ngIf="resumeData.personalInfo.email" class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                {{ resumeData.personalInfo.email }}
              </div>
              <div *ngIf="resumeData.personalInfo.phone" class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                {{ resumeData.personalInfo.phone }}
              </div>
              <div *ngIf="resumeData.personalInfo.linkedIn" class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"></path>
                </svg>
                {{ resumeData.personalInfo.linkedIn }}
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div *ngIf="resumeData.summary" class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
            <p class="text-gray-700 text-sm leading-relaxed">{{ resumeData.summary }}</p>
          </div>

          <!-- Skills -->
          <div *ngIf="(resumeData?.skills?.length ?? 0) > 0" class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let skill of resumeData?.skills" 
                    class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Experience -->
          <div *ngIf="(resumeData?.experience?.length ?? 0) > 0" class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">Work Experience</h2>
          <div *ngFor="let exp of resumeData?.experience" class="mb-4 last:mb-0">
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-medium text-gray-900">{{ exp.jobTitle || exp.position }}</h3>
                <span class="text-sm text-gray-600">{{ exp.startDate }} - {{ exp.endDate }}</span>
              </div>
              <p class="text-sm text-gray-700 mb-2">{{ exp.company }}</p>
              <p class="text-sm text-gray-600 leading-relaxed">{{ exp.description }}</p>
            </div>
          </div>

          <!-- Education -->
          <div *ngIf="(resumeData?.education?.length ?? 0) > 0">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">Education</h2>
          <div *ngFor="let edu of resumeData?.education" class="mb-2 last:mb-0">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium text-gray-900">{{ edu.degree }}</h3>
                  <p class="text-sm text-gray-700">{{ edu.institution }}</p>
                </div>
                <span class="text-sm text-gray-600">{{ edu.year }}</span>
              </div>
            </div>
          </div>
        </div>
      <!-- Fixed closing tags and removed stray edu.year}} -->

      <!-- Success Message -->
      <div *ngIf="downloadSuccess" class="bg-green-900/20 border border-green-800/30 rounded-md p-4 mb-8">
        <div class="flex">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-300">Resume Downloaded Successfully!</h3>
            <p class="text-sm text-green-200 mt-1">Your professional resume has been generated and downloaded.</p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="bg-red-900/20 border border-red-800/30 rounded-md p-4 mb-8">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-300">Download Error</h3>
            <p class="text-sm text-red-200 mt-1">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Sharing Options -->
      <div class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-100 mb-4">Share Your Resume</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button class="flex items-center justify-center p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg hover:bg-blue-900/30 transition-colors">
            <svg class="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span class="text-blue-300">LinkedIn</span>
          </button>
          <button class="flex items-center justify-center p-4 bg-purple-900/20 border border-purple-800/30 rounded-lg hover:bg-purple-900/30 transition-colors">
            <svg class="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
            </svg>
            <span class="text-purple-300">Email</span>
          </button>
          <button class="flex items-center justify-center p-4 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors">
            <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
            </svg>
            <span class="text-gray-300">Copy Link</span>
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between">
        <button (click)="router.navigate(['/templates'])"
                class="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors">
          Change Template
        </button>
        
        <div class="flex space-x-4">
          <button (click)="router.navigate(['/upload'])"
                  class="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 text-white font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-200">
            Upload New Resume
          </button>
          <button (click)="generatePDF()"
                  [disabled]="isGenerating"
                  class="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Download Again
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class PdfPreviewDownloadComponent implements OnInit {
  resumeData: ResumeData | null = null
  selectedTemplate: string | null = null
  isGenerating = false
  downloadSuccess = false
  errorMessage = ""

  constructor(
    private route: ActivatedRoute,
    private resumeService: ResumeService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.resumeData = this.resumeService.getResumeData()
    this.selectedTemplate = this.route.snapshot.queryParams["templateId"] || "minimalist"

    if (!this.resumeData) {
      this.router.navigate(["/upload"])
    }
  }

  generatePDF(): void {
    if (!this.resumeData || !this.selectedTemplate) return

    this.isGenerating = true
    this.errorMessage = ""
    this.downloadSuccess = false

    this.resumeService.generatePDF(this.resumeData, this.selectedTemplate).subscribe({
      next: (blob) => {
        // Create download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${this.resumeData?.personalInfo.fullName || "Resume"}_${this.selectedTemplate}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        this.downloadSuccess = true
        this.isGenerating = false
      },
      error: (error) => {
        console.error("PDF generation failed:", error)
        this.errorMessage = "Failed to generate PDF. Please try again."
        this.isGenerating = false
      },
    })
  }
}
