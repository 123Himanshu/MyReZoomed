import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { ResumeService, FeedbackResponse } from "../../services/resume.service"
import type { ResumeData } from "../../models/resume.model"
import { ResumeFeedbackComponent } from "../resume-feedback/resume-feedback.component"
import { Subject } from "rxjs"
import { debounceTime, distinctUntilChanged } from "rxjs/operators"
import { HttpClient } from "@angular/common/http"

@Component({
  selector: "app-resume-preview",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ResumeFeedbackComponent],
  templateUrl: "./resume-preview.component.html",
  styleUrls: ["./resume-preview.component.css"],
})
export class ResumePreviewComponent implements OnInit {
  resumeData: ResumeData | null = null
  isLoading = false
  errorMessage = ""
  editingSection: string | null = null
  jobDescription = ""
  showJobDescriptionInput = false
  newSkill = ""
  atsFeedback: FeedbackResponse | null = null
  isAnalyzing = false
  atsError: string | null = null
  isEnhancing = false
  enhancementSuggestion = ""
  enhancementType = ""
  enhancementIndex = -1

  // Undo/Redo functionality
  undoStack: ResumeData[] = []
  redoStack: ResumeData[] = []
  lastSaved: Date | null = null

  private editSubject = new Subject<void>()

  constructor(
    private resumeService: ResumeService,
    public router: Router,
    private http: HttpClient,
  ) {
    // Auto-save functionality
    this.editSubject.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
      this.saveToUndoStack()
      this.lastSaved = new Date()
    })
  }

  ngOnInit(): void {
    this.loadResumeData()
  }

  private loadResumeData(): void {
    this.resumeData = this.resumeService.getResumeData()

    if (!this.resumeData) {
      this.errorMessage = "No resume data found. Please upload a resume first."
      setTimeout(() => {
        this.router.navigate(["/upload"])
      }, 3000)
    }
  }

  editSection(section: string): void {
    this.editingSection = section
  }

  saveSection(): void {
    if (this.resumeData) {
      this.resumeService.updateResumeData(this.resumeData)
    }
    this.editingSection = null
  }

  cancelEdit(): void {
    this.editingSection = null
    this.loadResumeData() // Reload original data
  }

  addExperience(): void {
    if (this.resumeData) {
      this.resumeData.experience.push({
        id: Date.now().toString(),
        jobTitle: "",
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        achievements: [],
      })
      this.editSection("experience")
    }
  }

  removeExperience(index: number): void {
    if (this.resumeData) {
      this.resumeData.experience.splice(index, 1)
      this.resumeService.updateResumeData(this.resumeData)
    }
  }

  addEducation(): void {
    if (this.resumeData) {
      this.resumeData.education.push({
        id: Date.now().toString(),
        degree: "",
        institution: "",
        field: "",
        startDate: "",
        endDate: "",
        year: "",
      })
      this.editSection("education")
    }
  }

  removeEducation(index: number): void {
    if (this.resumeData) {
      this.resumeData.education.splice(index, 1)
      this.resumeService.updateResumeData(this.resumeData)
    }
  }

  addSkill(): void {
    if (this.newSkill.trim() && this.resumeData) {
      this.resumeData.skills.push(this.newSkill.trim())
      this.newSkill = ""
      this.onEdit()
    }
  }

  removeSkill(index: number): void {
    if (this.resumeData) {
      this.resumeData.skills.splice(index, 1)
      this.onEdit()
    }
  }

  onEdit(): void {
    this.editSubject.next()
  }

  saveToUndoStack(): void {
    if (this.resumeData) {
      this.undoStack.push(JSON.parse(JSON.stringify(this.resumeData)))
      if (this.undoStack.length > 20) {
        this.undoStack.shift()
      }
      this.redoStack = []
    }
  }

  undo(): void {
    if (this.undoStack.length > 1) {
      const current = this.undoStack.pop()
      if (current) {
        this.redoStack.push(current)
      }
      this.resumeData = JSON.parse(JSON.stringify(this.undoStack[this.undoStack.length - 1]))
    }
  }

  redo(): void {
    if (this.redoStack.length > 0) {
      const next = this.redoStack.pop()
      if (next) {
        this.undoStack.push(next)
        this.resumeData = JSON.parse(JSON.stringify(next))
      }
    }
  }

  enhanceSection(type: string, content: string, index = -1): void {
    if (!content.trim()) {
      return
    }

    this.isEnhancing = true
    this.enhancementType = type
    this.enhancementIndex = index

    this.resumeService.enhanceText(content, `professional resume ${type}`).subscribe({
      next: (response) => {
        this.enhancementSuggestion = response.enhancedText || response.enhanced_text
        this.isEnhancing = false
      },
      error: (error) => {
        console.error("Enhancement failed:", error)
        this.isEnhancing = false
      },
    })
  }

  applyEnhancement(type: string, index = -1): void {
    if (!this.enhancementSuggestion || !this.resumeData) return

    if (type === "summary") {
      this.resumeData.summary = this.enhancementSuggestion
    } else if (type === "experience" && index >= 0) {
      this.resumeData.experience[index].description = this.enhancementSuggestion
    }

    this.onEdit()
    this.dismissEnhancement()
  }

  dismissEnhancement(): void {
    this.enhancementSuggestion = ""
    this.enhancementType = ""
    this.enhancementIndex = -1
  }

  analyzeATS(): void {
    if (!this.jobDescription.trim() || !this.resumeData) return

    this.isAnalyzing = true
    this.atsError = null

    this.resumeService.getATSScore(this.resumeData, this.jobDescription).subscribe({
      next: (feedback) => {
        this.atsFeedback = feedback
        this.isAnalyzing = false
      },
      error: (error) => {
        console.error("ATS analysis failed:", error)
        this.atsError = "Failed to analyze ATS score. Please try again."
        this.isAnalyzing = false
      },
    })
  }

  proceedToATS(): void {
    if (this.jobDescription.trim()) {
      if (this.resumeData) {
        this.resumeData.jobDescription = this.jobDescription
        this.resumeService.updateResumeData(this.resumeData)
      }
      this.router.navigate(["/ats-score"])
    } else {
      this.showJobDescriptionInput = true
    }
  }

  proceedToEnhancement(): void {
    this.router.navigate(["/enhance"])
  }

  proceedToTemplates(): void {
    this.router.navigate(["/templates"])
  }

  goBack(): void {
    this.router.navigate(["/upload"])
  }

  trackByIndex(index: number): number {
    return index
  }
}
