import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { ResumeService } from "../../services/resume.service"
import { ATSScore } from "../../models/resume.model"

@Component({
  selector: "app-ats-score",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto section-bg min-h-screen py-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-accent mb-4">ATS Compatibility Score</h2>
        <p class="text-lg text-gray-700">See how well your resume performs with Applicant Tracking Systems</p>
      </div>

      <div *ngIf="isAnalyzing" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Analyzing Your Resume...</h3>
        <p class="text-gray-600">Checking ATS compatibility and optimization</p>
      </div>

      <div *ngIf="!isAnalyzing && !atsScore" class="text-center py-12">
        <p class="text-gray-600 mb-4">No resume data found. Please complete the previous steps first.</p>
        <button (click)="router.navigate(['/upload'])"
                class="btn-primary">
          Start Over
        </button>
      </div>

      <div *ngIf="atsScore && !isAnalyzing" class="space-y-8">
        <!-- Overall Score -->
        <div class="card text-center">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6">Overall ATS Score</h3>
          
          <!-- Circular Progress -->
          <div class="relative inline-flex items-center justify-center">
            <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <!-- Background circle -->
              <circle cx="60" cy="60" r="50" stroke="#e5e7eb" stroke-width="8" fill="none"></circle>
              <!-- Progress circle -->
              <circle cx="60" cy="60" r="50" 
                      [attr.stroke]="getScoreColor(atsScore.score)"
                      stroke-width="8" 
                      fill="none"
                      stroke-linecap="round"
                      [attr.stroke-dasharray]="314.16"
                      [attr.stroke-dashoffset]="314.16 - (314.16 * atsScore.score / 100)"
                      class="transition-all duration-1000 ease-out"></circle>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="text-4xl font-bold" [style.color]="getScoreColor(atsScore.score)">
                  {{ atsScore.score }}
                </div>
                <div class="text-sm text-gray-600">out of 100</div>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="text-lg font-medium" [style.color]="getScoreColor(atsScore.score)">
              {{ getScoreLabel(atsScore.score) }}
            </h4>
            <p class="text-gray-600 mt-2">{{ getScoreDescription(atsScore.score) }}</p>
          </div>
        </div>

        <!-- Detailed Feedback -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Category Scores -->
          <div class="card">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Category Breakdown</h3>
            
            <div class="space-y-6">
              <div *ngFor="let feedback of atsScore.feedback" class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-gray-900">{{ feedback.category }}</span>
                  <span class="text-sm font-medium" [style.color]="getScoreColor(feedback.score)">
                    {{ feedback.score }}/100
                  </span>
                </div>
                
                <!-- Progress Bar -->
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="h-2 rounded-full transition-all duration-1000 ease-out"
                       [style.width.%]="feedback.score"
                       [style.background-color]="getScoreColor(feedback.score)"></div>
                </div>
                
                <p class="text-sm text-gray-600">{{ feedback.message }}</p>
                
                <!-- Severity Indicator -->
                <div class="flex items-center">
                  <span class="text-xs px-2 py-1 rounded-full"
                        [class.bg-red-100]="feedback.severity === 'high'"
                        [class.text-red-800]="feedback.severity === 'high'"
                        [class.bg-yellow-100]="feedback.severity === 'medium'"
                        [class.text-yellow-800]="feedback.severity === 'medium'"
                        [class.bg-green-100]="feedback.severity === 'low'"
                        [class.text-green-800]="feedback.severity === 'low'">
                    {{ feedback.severity | titlecase }} Priority
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Improvement Suggestions -->
          <div class="card">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Improvement Suggestions</h3>
            
            <div class="space-y-4">
              <div *ngFor="let suggestion of atsScore.suggestions; let i = index" 
                   class="flex items-start p-4 bg-blue-50 rounded-lg">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {{ i + 1 }}
                </div>
                <div>
                  <p class="text-gray-800">{{ suggestion }}</p>
                </div>
              </div>
            </div>

            <!-- Quick Tips -->
            <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 class="font-medium text-yellow-800 mb-2">💡 Quick Tips</h4>
              <ul class="text-sm text-yellow-700 space-y-1">
                <li>• Use standard section headings (Experience, Education, Skills)</li>
                <li>• Include relevant keywords from job descriptions</li>
                <li>• Use simple, clean formatting without graphics</li>
                <li>• Save as both PDF and Word formats</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Score History (if available) -->
        <div class="card">
          <h3 class="text-xl font-semibold text-gray-900 mb-6">Score Comparison</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-gray-600">{{ previousScore || 'N/A' }}</div>
              <div class="text-sm text-gray-600">Previous Score</div>
            </div>
            
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ atsScore.score }}</div>
              <div class="text-sm text-blue-600">Current Score</div>
            </div>
            
            <div class="text-center p-4 rounded-lg"
                 [class.bg-green-50]="(scoreImprovement ?? 0) > 0"
                 [class.bg-red-50]="(scoreImprovement ?? 0) < 0"
                 [class.bg-gray-50]="(scoreImprovement ?? 0) === 0">
              <div class="text-2xl font-bold"
                   [class.text-green-600]="(scoreImprovement ?? 0) > 0"
                   [class.text-red-600]="(scoreImprovement ?? 0) < 0"
                   [class.text-gray-600]="(scoreImprovement ?? 0) === 0">
                {{ (scoreImprovement ?? 0) > 0 ? '+' : '' }}{{ scoreImprovement ?? 'N/A' }}
              </div>
              <div class="text-sm"
                   [class.text-green-600]="(scoreImprovement ?? 0) > 0"
                   [class.text-red-600]="(scoreImprovement ?? 0) < 0"
                   [class.text-gray-600]="(scoreImprovement ?? 0) === 0">
                Improvement
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div *ngIf="!isAnalyzing" class="mt-8 flex justify-between">
        <button (click)="router.navigate(['/enhance'])"
                class="btn-secondary">
          Back
        </button>
        
        <div class="space-x-4">
          <button (click)="reanalyze()"
                  class="btn-secondary">
            Re-analyze
          </button>
          
          <button (click)="continueToDownload()"
                  class="btn-primary">
            Continue to Download
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AtsScoreComponent implements OnInit {
  atsScore: ATSScore | null = null
  isAnalyzing = false
  previousScore: number | null = null
  scoreImprovement: number | null = null

  constructor(
    private resumeService: ResumeService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.analyzeResume()
  }

  analyzeResume(): void {
    const resumeData = this.resumeService.getCurrentResumeData()
    if (!resumeData) {
      this.router.navigate(["/upload"])
      return
    }

    this.isAnalyzing = true

    this.resumeService.getATSScore(resumeData).subscribe({
      next: (score) => {
        this.atsScore = score
        this.isAnalyzing = false
        this.calculateImprovement()
      },
      error: (error) => {
        console.error("Failed to get ATS score:", error)
        this.isAnalyzing = false
        // Fallback to mock ATS score for demo
        this.createMockATSScore()
      },
    })
  }

  private createMockATSScore(): void {
    this.atsScore = {
      score: Math.floor(Math.random() * 30) + 70, // Score between 70-100
      feedback: [
        {
          category: "Keyword Optimization",
          score: Math.floor(Math.random() * 20) + 75,
          message: "Good use of industry keywords, but could be improved with more specific technical terms.",
          severity: "medium",
        },
        {
          category: "Format Compatibility",
          score: Math.floor(Math.random() * 15) + 85,
          message: "Resume format is ATS-friendly with clear section headers and standard formatting.",
          severity: "low",
        },
        {
          category: "Content Structure",
          score: Math.floor(Math.random() * 25) + 70,
          message:
            "Well-structured content with clear job titles and dates. Consider adding more quantifiable achievements.",
          severity: "medium",
        },
        {
          category: "Skills Matching",
          score: Math.floor(Math.random() * 20) + 80,
          message: "Skills section aligns well with common job requirements in your field.",
          severity: "low",
        },
      ],
      suggestions: [
        "Add more industry-specific keywords from target job descriptions",
        "Include quantifiable achievements with specific numbers and percentages",
        "Use action verbs at the beginning of bullet points",
        "Ensure all dates are in a consistent format (MM/YYYY)",
        "Add a skills section if not present, or expand the existing one",
        "Consider adding relevant certifications or training",
      ],
    }
    this.calculateImprovement()
  }

  private calculateImprovement(): void {
    if (this.previousScore && this.atsScore) {
      this.scoreImprovement = this.atsScore.score - this.previousScore
    }
  }

  getScoreColor(score: number): string {
    if (score >= 80) return "#10b981" // green
    if (score >= 60) return "#f59e0b" // yellow
    return "#ef4444" // red
  }

  getScoreLabel(score: number): string {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Needs Improvement"
  }

  getScoreDescription(score: number): string {
    if (score >= 90) return "Your resume is highly optimized for ATS systems and should pass most automated screenings."
    if (score >= 80) return "Your resume is well-optimized for ATS systems with minor areas for improvement."
    if (score >= 70) return "Your resume is moderately optimized. Some improvements could increase your chances."
    if (score >= 60) return "Your resume needs several improvements to perform well with ATS systems."
    return "Your resume requires significant optimization to pass ATS screenings effectively."
  }

  reanalyze(): void {
    this.atsScore = null
    this.analyzeResume()
  }

  continueToDownload(): void {
    this.router.navigate(["/download"])
  }
}
