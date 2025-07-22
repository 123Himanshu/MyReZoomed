import { Component, type OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { ResumeService } from "../../services/resume.service"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-upload-resume",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./upload-resume.component.html",
  styleUrls: ["./upload-resume.component.css"],
})
export class UploadResumeComponent implements OnInit {
  selectedFile: File | null = null
  isUploading = false
  uploadProgress = 0
  errorMessage = ""
  successMessage = ""
  dragOver = false

  constructor(
    private resumeService: ResumeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Clear any existing resume data when starting fresh
    this.resumeService.clearResumeData()
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    this.handleFileSelection(file)
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault()
    this.dragOver = true
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    this.dragOver = false
  }

  onDrop(event: DragEvent): void {
    event.preventDefault()
    this.dragOver = false

    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      this.handleFileSelection(files[0])
    }
  }

  private handleFileSelection(file: File): void {
    this.errorMessage = ""
    this.successMessage = ""

    if (!file) {
      return
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ]
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = "Please select a PDF or Word document (.pdf, .docx, .doc)"
      return
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      this.errorMessage = "File size must be less than 10MB"
      return
    }

    this.selectedFile = file
    this.successMessage = `Selected: ${file.name} (${this.formatFileSize(file.size)})`
  }

  uploadResume(): void {
    if (!this.selectedFile) {
      this.errorMessage = "Please select a file first"
      return
    }

    this.isUploading = true
    this.uploadProgress = 0
    this.errorMessage = ""

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      this.uploadProgress += 10
      if (this.uploadProgress >= 90) {
        clearInterval(progressInterval)
      }
    }, 200)

    this.resumeService.uploadResume(this.selectedFile).subscribe({
      next: (resumeData) => {
        clearInterval(progressInterval)
        this.uploadProgress = 100
        this.isUploading = false

        console.log("Resume uploaded successfully:", resumeData)

        // Navigate to preview page after successful upload
        setTimeout(() => {
          this.router.navigate(["/preview"])
        }, 500)
      },
      error: (error) => {
        clearInterval(progressInterval)
        this.isUploading = false
        this.uploadProgress = 0
        this.errorMessage = error.message || "Failed to upload resume. Please try again."
        console.error("Upload error:", error)
      },
    })
  }

  public formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  removeFile(): void {
    this.selectedFile = null
    this.successMessage = ""
    this.errorMessage = ""
  }
}
