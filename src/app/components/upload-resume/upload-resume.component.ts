import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { ResumeService } from "../../services/resume.service"

@Component({
  selector: "app-upload-resume",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto section-bg min-h-screen py-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-accent mb-4">Upload Your Resume</h2>
        <p class="text-lg text-gray-700">Upload your current resume to get started with AI-powered enhancements</p>
      </div>
      <div class="card">
        <!-- Upload Area -->
        <div class="border-2 border-dashed border-accent rounded-lg p-12 text-center hover:border-accent2 transition-colors bg-white shadow-lg"
             [class.border-accent2]="isDragOver"
             [class.bg-blue-50]="isDragOver"
             (dragover)="onDragOver($event)"
             (dragleave)="onDragLeave($event)"
             (drop)="onDrop($event)"
             (click)="fileInput.click()">
          
          <div *ngIf="!selectedFile && !isUploading">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Upload your resume</h3>
            <p class="text-gray-600 mb-4">Drag and drop your file here, or click to browse</p>
            <p class="text-sm text-gray-500">Supports PDF and DOCX files up to 10MB</p>
          </div>

          <div *ngIf="selectedFile && !isUploading" class="text-center">
            <svg class="mx-auto h-12 w-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">File Selected</h3>
            <p class="text-gray-600 mb-4">{{ selectedFile.name }}</p>
            <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
          </div>

          <div *ngIf="isUploading" class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Processing Resume...</h3>
            <p class="text-gray-600">Extracting content and analyzing structure</p>
          </div>

          <input #fileInput
                 type="file"
                 class="hidden"
                 accept=".pdf,.docx"
                 (change)="onFileSelected($event)">
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Upload Error</h3>
              <p class="text-sm text-red-700 mt-1">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex justify-between">
          <button type="button" 
                  class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  (click)="clearFile()"
                  [disabled]="isUploading">
            Clear
          </button>
          
          <button type="button"
                  class="btn-primary"
                  [disabled]="!selectedFile || isUploading"
                  (click)="uploadFile()">
            {{ isUploading ? 'Processing...' : 'Continue' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class UploadResumeComponent {
  selectedFile: File | null = null
  isDragOver = false
  isUploading = false
  errorMessage = ""

  constructor(
    private resumeService: ResumeService,
    private router: Router,
  ) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault()
    this.isDragOver = true
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    this.isDragOver = false
  }

  onDrop(event: DragEvent): void {
    event.preventDefault()
    this.isDragOver = false

    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      this.handleFile(files[0])
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if (file) {
      this.handleFile(file)
    }
  }

  private handleFile(file: File): void {
    this.errorMessage = ""

    // Validate file type
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = "Please upload a PDF or DOCX file."
      return
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      this.errorMessage = "File size must be less than 10MB."
      return
    }

    this.selectedFile = file
  }

  uploadFile(): void {
    if (!this.selectedFile) return

    this.isUploading = true
    this.errorMessage = ""

    this.resumeService.uploadResume(this.selectedFile).subscribe({
      next: (resumeData) => {
        this.resumeService.updateResumeData(resumeData)
        this.router.navigate(["/preview"])
      },
      error: (error) => {
        this.isUploading = false
        this.errorMessage = error.error?.message || "Failed to upload resume. Please try again."
      },
    })
  }

  clearFile(): void {
    this.selectedFile = null
    this.errorMessage = ""
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
}
