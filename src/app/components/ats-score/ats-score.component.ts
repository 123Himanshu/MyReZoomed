import { Component, Input, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import type { Router } from "@angular/router"
import type { ResumeService, FeedbackResponse } from "../../services/resume.service"
import type { ResumeData } from "../../models/resume.model"

@Component({
  selector: "app-ats-score",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-4">
          ATS Compatibility Analysis
        </h2>
        <p class="text-lg text-gray-300">Optimize your resume for Applicant Tracking Systems</p>
      </div>

      <!-- Job Description Input -->
      <div class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8 mb-8">
        <h3 class="text-xl font-semibold text-gray-100 mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Job Description Analysis
        </h3>
        <p class="text-gray-300 mb-4">Paste the job description to get personalized ATS optimization recommendations.</p>
        
        <textarea 
          [(ngModel)]="jobDescription"
          rows="8"
          class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
          placeholder="Paste the job description here for detailed ATS analysis and keyword matching...">
        </textarea>
        
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-400">
            <span *ngIf="jobDescription">{{ jobDescription.length }} characters</span>
            <span *ngIf="!jobDescription">Enter job description for detailed analysis</span>
          </div>
          <button 
            (click)="analyzeATS()"
            [disabled]="isAnalyzing || !resumeData"
            class="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="!isAnalyzing">Analyze ATS Score</span>
            <span *ngIf="isAnalyzing" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          </button>
        </div>
      </div>

      <!-- ATS Results -->
      <div *ngIf="atsResults" class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8 mb-8">
        <!-- Overall Score -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
              ATS Compatibility Score
            </h3>
            <p class="text-gray-400">How well your resume matches the job requirements</p>
          </div>
          
          <div class="mt-4 md:mt-0 flex items-center">
            <div class="relative h-24 w-24">
              <svg class="h-24 w-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  class="text-gray-700"
                  stroke-width="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  [ngClass]="{
                    'text-red-500': atsResults.atsScore < 60,
                    'text-yellow-500': atsResults.atsScore >= 60 && atsResults.atsScore < 80,
                    'text-green-500': atsResults.atsScore >= 80
                  }"
                  stroke-width="8"
                  stroke-dasharray="251.2"
                  [attr.stroke-dashoffset]="calculateDashOffset(atsResults.atsScore)"
                  stroke-linecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-3xl font-bold"
                  [ngClass]="{
                    'text-red-400': atsResults.atsScore < 60,
                    'text-yellow-400': atsResults.atsScore >= 60 && atsResults.atsScore < 80,
                    'text-green-400': atsResults.atsScore >= 80
                  }">
                  {{ atsResults.atsScore }}%
                </span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-300">Match Score</p>
              <p class="text-xs text-gray-400">{{ getScoreMessage(atsResults.atsScore) }}</p>
            </div>
          </div>
        </div>

        <!-- Detailed Analysis -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Missing Skills -->
          <div class="bg-gray-700/50 rounded-lg p-6">
            <h4 class="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Missing Skills
            </h4>
            
            <div *ngIf="atsResults.missingSkills.length === 0" class="text-green-300">
              <p>Great! Your resume includes all key skills from the job description.</p>
            </div>
            
            <div *ngIf="atsResults.missingSkills.length > 0">
              <p class="text-yellow-300 mb-3">Consider adding these skills if you have them:</p>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let skill of atsResults.missingSkills" 
                      class="px-3 py-1 bg-yellow-900/40 text-yellow-200 text-sm rounded-full border border-yellow-800/30">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>

          <!-- Keyword Density -->
          <div class="bg-gray-700/50 rounded-lg p-6">
            <h4 class="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              Top Keywords
            </h4>
            
            <div class="space-y-3">
              <div *ngFor="let keyword of getTopKeywords()" class="flex justify-between items-center">
                <span class="text-gray-200 font-medium">{{ keyword.key }}</span>
                <div class="flex items-center">
                  <div class="w-20 bg-gray-600 rounded-full h-2 mr-2">
                    <div class="bg-blue-500 h-2 rounded-full" [style.width]="keyword.value + '%'"></div>
                  </div>
                  <span class="text-sm text-gray-400">{{ keyword.value }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="mt-8">
          <h4 class="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Improvement Recommendations
          </h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Skills Recommendations -->
            <div *ngIf="atsResults.recommendations.skills.length > 0" class="bg-gray-700/30 rounded-lg p-4">
              <h5 class="text-sm font-medium text-blue-300 mb-2">Skills</h5>
              <ul class="space-y-2">
                <li *ngFor="let rec of atsResults.recommendations.skills" class="flex items-start text-sm text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {{ rec }}
                </li>
              </ul>
            </div>
            
            <!-- Experience Recommendations -->
            <div *ngIf="atsResults.recommendations.experience.length > 0" class="bg-gray-700/30 rounded-lg p-4">
              <h5 class="text-sm font-medium text-teal-300 mb-2">Experience</h5>
              <ul class="space-y-2">
                <li *ngFor="let rec of atsResults.recommendations.experience" class="flex items-start text-sm text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-teal-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {{ rec }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between">
        <button (click)="router.navigate(['/preview'])"
                class="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors">
          Back to Preview
        </button>
        
        <div class="flex space-x-4">
          <button (click)="router.navigate(['/enhance'])"
                  class="px-6 py-2 bg-gradient-to-r from-teal-600 to-blue-500 hover:from-teal-700 hover:to-blue-600 text-white font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-200">
            Enhance with AI
          </button>
          <button (click)="router.navigate(['/templates'])"
                  class="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-200">
            Choose Template
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AtsScoreComponent implements OnInit {
  @Input() resumeData: ResumeData | null = null

  jobDescription = ""
  atsResults: FeedbackResponse | null = null
  isAnalyzing = false

  constructor(
    private resumeService: ResumeService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.resumeData) {
      this.resumeData = this.resumeService.getResumeData()
    }

    if (!this.resumeData) {
      this.router.navigate(["/upload"])
    }
  }

  analyzeATS(): void {
    if (!this.resumeData) return

    this.isAnalyzing = true
    this.resumeService.getATSScore(this.resumeData, this.jobDescription).subscribe({
      next: (results) => {
        this.atsResults = results
        this.isAnalyzing = false
      },
      error: (error) => {
        console.error("ATS analysis failed:", error)
        this.isAnalyzing = false
      },
    })
  }

  calculateDashOffset(score: number): number {
    const circumference = 251.2
    return circumference - (circumference * score) / 100
  }

  getScoreMessage(score: number): string {
    if (score >= 80) return "Excellent match!"
    if (score >= 60) return "Good match with room for improvement"
    return "Needs significant improvement"
  }

  getTopKeywords(): { key: string; value: number }[] {
    if (!this.atsResults || !this.atsResults.keywordDensity) return []

    return Object.entries(this.atsResults.keywordDensity)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }
}
