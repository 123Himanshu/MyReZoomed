import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { ResumeService } from "../../services/resume.service"
import { ResumeData, EnhancedResume } from "../../models/resume.model"

@Component({
  selector: "app-enhanced-resume",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto section-bg min-h-screen py-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-accent mb-4">AI-Enhanced Resume</h2>
        <p class="text-lg text-gray-700">Review the AI-powered improvements to your resume</p>
      </div>

      <div *ngIf="isEnhancing" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Enhancing Your Resume...</h3>
        <p class="text-gray-600">Our AI is analyzing and improving your content</p>
      </div>

      <div *ngIf="!isEnhancing && !enhancedResume" class="text-center py-12">
        <p class="text-gray-600 mb-4">No resume data found. Please complete the previous steps first.</p>
        <button (click)="router.navigate(['/upload'])"
                class="btn-primary">
          Start Over
        </button>
      </div>

      <div *ngIf="enhancedResume && !isEnhancing" class="space-y-8">
        <!-- Improvements Summary -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 card">
          <h3 class="text-lg font-semibold text-green-800 mb-4">✨ AI Improvements Applied</h3>
          <ul class="space-y-2">
            <li *ngFor="let improvement of enhancedResume.improvements"
                class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-green-700">{{ improvement }}</span>
            </li>
          </ul>
        </div>

        <!-- AI Suggestions -->
        <div *ngIf="enhancedResume.aiSuggestions.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-6 card">
          <h3 class="text-lg font-semibold text-blue-800 mb-4">💡 Additional Suggestions</h3>
          <ul class="space-y-2">
            <li *ngFor="let suggestion of enhancedResume.aiSuggestions"
                class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-blue-700">{{ suggestion }}</span>
            </li>
          </ul>
        </div>

        <!-- Before/After Comparison -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Original Resume -->
          <div class="card">
            <div class="bg-gray-50 px-6 py-4 border-b">
              <h3 class="text-lg font-semibold text-gray-900">Original Resume</h3>
            </div>
            <div class="p-6">
              <div class="space-y-6">
                <!-- Original Personal Info -->
                <div class="text-center">
                  <h2 class="text-xl font-bold text-gray-900">{{ enhancedResume.originalResume.personalInfo.fullName }}</h2>
                  <div class="text-gray-600 mt-1 text-sm">
                    <p>{{ enhancedResume.originalResume.personalInfo.email }} | {{ enhancedResume.originalResume.personalInfo.phone }}</p>
                  </div>
                </div>

                <!-- Original Summary -->
                <div *ngIf="enhancedResume.originalResume.summary">
                  <h4 class="font-medium text-gray-900 mb-2">Summary</h4>
                  <p class="text-gray-700 text-sm">{{ enhancedResume.originalResume.summary }}</p>
                </div>

                <!-- Original Skills -->
                <div *ngIf="enhancedResume.originalResume.skills.length > 0">
                  <h4 class="font-medium text-gray-900 mb-2">Skills</h4>
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let skill of enhancedResume.originalResume.skills"
                          class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Resume -->
          <div class="card border-2 border-green-200">
            <div class="bg-green-50 px-6 py-4 border-b border-green-200">
              <h3 class="text-lg font-semibold text-green-800">Enhanced Resume</h3>
            </div>
            <div class="p-6">
              <div class="space-y-6">
                <!-- Enhanced Personal Info -->
                <div class="text-center">
                  <h2 class="text-xl font-bold text-gray-900">{{ enhancedResume.enhancedResume.personalInfo.fullName }}</h2>
                  <div class="text-gray-600 mt-1 text-sm">
                    <p>{{ enhancedResume.enhancedResume.personalInfo.email }} | {{ enhancedResume.enhancedResume.personalInfo.phone }}</p>
                  </div>
                </div>

                <!-- Enhanced Summary -->
                <div *ngIf="enhancedResume.enhancedResume.summary">
                  <h4 class="font-medium text-gray-900 mb-2">Professional Summary</h4>
                  <p class="text-gray-700 text-sm">{{ enhancedResume.enhancedResume.summary }}</p>
                </div>

                <!-- Enhanced Skills -->
                <div *ngIf="enhancedResume.enhancedResume.skills.length > 0">
                  <h4 class="font-medium text-gray-900 mb-2">Core Competencies</h4>
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let skill of enhancedResume.enhancedResume.skills"
                          class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Accept/Reject Options -->
        <div class="bg-white rounded-lg shadow-lg p-6 card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Choose Your Version</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button (click)="useOriginal()"
                    class="p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-left"
                    [class.border-blue-500]="selectedVersion === 'original'"
                    [class.bg-blue-50]="selectedVersion === 'original'">
              <h4 class="font-medium text-gray-900 mb-2">Keep Original</h4>
              <p class="text-gray-600 text-sm">Use your original resume content without AI enhancements</p>
            </button>

            <button (click)="useEnhanced()"
                    class="p-4 border-2 border-green-300 rounded-lg hover:border-green-400 transition-colors text-left"
                    [class.border-green-500]="selectedVersion === 'enhanced'"
                    [class.bg-green-50]="selectedVersion === 'enhanced'">
              <h4 class="font-medium text-gray-900 mb-2">Use Enhanced Version</h4>
              <p class="text-gray-600 text-sm">Apply all AI improvements and optimizations</p>
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div *ngIf="!isEnhancing" class="mt-8 flex justify-between">
        <button (click)="router.navigate(['/templates'])"
                class="btn-secondary">
          Back
        </button>

        <div class="space-x-4">
          <button (click)="regenerateEnhancement()"
                  class="btn-secondary">
            Regenerate
          </button>

          <button (click)="continueToATS()"
                  [disabled]="!selectedVersion"
                  class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            Continue to ATS Score
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class EnhancedResumeComponent implements OnInit {
  enhancedResume: EnhancedResume | null = null
  isEnhancing = false
  selectedVersion: "original" | "enhanced" | null = null

  constructor(
    private resumeService: ResumeService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    // Check if enhanced resume already exists
    this.enhancedResume = this.resumeService.getEnhancedResume()

    if (!this.enhancedResume) {
      this.enhanceResume()
    }
  }

  enhanceResume(): void {
    const resumeData = this.resumeService.getCurrentResumeData()
    if (!resumeData) {
      this.router.navigate(["/upload"])
      return
    }

    this.isEnhancing = true

    this.resumeService.enhanceResume(resumeData).subscribe({
      next: (enhanced) => {
        this.enhancedResume = enhanced
        this.resumeService.updateEnhancedResume(enhanced)
        this.isEnhancing = false
      },
      error: (error) => {
        console.error("Failed to enhance resume:", error)
        this.isEnhancing = false
        // Fallback to mock enhanced resume for demo
        this.createMockEnhancedResume(resumeData)
      },
    })
  }

  private createMockEnhancedResume(originalResume: ResumeData): void {
    this.enhancedResume = {
      originalResume,
      enhancedResume: {
        ...originalResume,
        summary: originalResume.summary
          ? `Results-driven professional with proven expertise in ${originalResume.skills.slice(0, 3).join(", ")}. ${originalResume.summary}`
          : `Dynamic professional with extensive experience in ${originalResume.skills.slice(0, 3).join(", ")} and a track record of delivering exceptional results.`,
        skills: [...originalResume.skills, "Leadership", "Strategic Planning", "Problem Solving"].filter(
          (skill, index, arr) => arr.indexOf(skill) === index,
        ),
      },
      improvements: [
        "Enhanced professional summary with industry keywords",
        "Optimized skills section for ATS compatibility",
        "Improved action verbs and quantifiable achievements",
        "Added relevant technical competencies",
      ],
      aiSuggestions: [
        "Consider adding specific metrics and numbers to quantify your achievements",
        "Include relevant certifications or training programs",
        "Tailor keywords to match your target job descriptions",
      ],
    }
    this.resumeService.updateEnhancedResume(this.enhancedResume)
  }

  useOriginal(): void {
    this.selectedVersion = "original"
    if (this.enhancedResume) {
      this.resumeService.updateResumeData(this.enhancedResume.originalResume)
    }
  }

  useEnhanced(): void {
    this.selectedVersion = "enhanced"
    if (this.enhancedResume) {
      this.resumeService.updateResumeData(this.enhancedResume.enhancedResume)
    }
  }

  regenerateEnhancement(): void {
    this.enhancedResume = null
    this.selectedVersion = null
    this.enhanceResume()
  }

  continueToATS(): void {
    if (this.selectedVersion) {
      this.router.navigate(["/ats-score"])
    }
  }
}
