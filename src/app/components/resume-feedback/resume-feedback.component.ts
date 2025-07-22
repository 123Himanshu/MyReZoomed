import { Component, Input, type OnChanges, type SimpleChanges } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { FeedbackResponse } from "../../services/resume.service"

@Component({
  selector: "app-resume-feedback",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h3 class="text-xl font-semibold text-gray-100 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            ATS Score Analysis
          </h3>
          <p class="text-gray-400">How well your resume matches the job description</p>
        </div>
        
        <div *ngIf="feedback" class="mt-4 md:mt-0 flex items-center">
          <div class="relative h-20 w-20">
            <svg class="h-20 w-20 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                class="text-gray-700"
                stroke-width="10"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                [ngClass]="{
                  'text-red-500': feedback.atsScore < 60,
                  'text-yellow-500': feedback.atsScore >= 60 && feedback.atsScore < 80,
                  'text-green-500': feedback.atsScore >= 80
                }"
                stroke-width="10"
                stroke-dasharray="251.2"
                [attr.stroke-dashoffset]="calculateDashOffset(feedback.atsScore)"
                stroke-linecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-2xl font-bold"
                [ngClass]="{
                  'text-red-400': feedback.atsScore < 60,
                  'text-yellow-400': feedback.atsScore >= 60 && feedback.atsScore < 80,
                  'text-green-400': feedback.atsScore >= 80
                }">
                {{ feedback.atsScore }}%
              </span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-300">Match Score</p>
            <p class="text-xs text-gray-400">{{ getScoreMessage(feedback.atsScore) }}</p>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="text-center py-12">
        <div class="relative w-16 h-16 mx-auto mb-6">
          <div class="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-teal-500 border-l-transparent animate-spin"></div>
        </div>
        <p class="text-gray-400">Analyzing your resume...</p>
      </div>

      <div *ngIf="error" class="bg-red-900/20 border border-red-800/30 rounded-md p-4 mb-6">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-300">Analysis Error</h3>
            <p class="text-sm text-red-200 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <div *ngIf="feedback && !loading && !error">
        <!-- Missing Skills -->
        <div class="mb-8">
          <h4 class="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Missing Skills
          </h4>
          
          <div *ngIf="feedback.missingSkills.length === 0" class="bg-green-900/20 border border-green-800/30 rounded-md p-4">
            <p class="text-green-300">Great job! Your resume includes all the key skills mentioned in the job description.</p>
          </div>
          
          <div *ngIf="feedback.missingSkills.length > 0" class="bg-yellow-900/20 border border-yellow-800/30 rounded-md p-4">
            <p class="text-yellow-300 mb-2">Consider adding these skills to your resume if you have them:</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <span *ngFor="let skill of feedback.missingSkills" 
                    class="px-3 py-1 bg-yellow-900/40 text-yellow-200 text-sm rounded-full border border-yellow-800/30">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Keyword Density -->
        <div class="mb-8">
          <h4 class="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            Keyword Density
          </h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let keyword of getTopKeywords()" class="bg-gray-700/50 rounded-lg p-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-200 font-medium">{{ keyword.key }}</span>
                <span class="text-sm text-gray-400">{{ keyword.value }}%</span>
              </div>
              <div class="w-full bg-gray-600 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full" [style.width]="keyword.value + '%'"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Format Issues -->
        <div class="mb-8">
          <h4 class="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Format & Structure
          </h4>
          
          <div *ngIf="feedback.formatIssues.length === 0" class="bg-green-900/20 border border-green-800/30 rounded-md p-4">
            <p class="text-green-300">Your resume format is ATS-friendly. Good job!</p>
          </div>
          
          <div *ngIf="feedback.formatIssues.length > 0" class="bg-gray-700/50 rounded-lg p-4">
            <ul class="space-y-2">
              <li *ngFor="let issue of feedback.formatIssues" class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-gray-300">{{ issue }}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Recommendations -->
        <div>
          <h4 class="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Recommendations
          </h4>
          
          <div class="space-y-4">
            <!-- Skills Recommendations -->
            <div *ngIf="feedback.recommendations.skills.length > 0" class="bg-gray-700/50 rounded-lg p-4">
              <h5 class="text-sm font-medium text-blue-300 mb-2">Skills</h5>
              <ul class="space-y-2">
                <li *ngFor="let rec of feedback.recommendations.skills" class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span class="text-gray-300">{{ rec }}</span>
                </li>
              </ul>
            </div>
            
            <!-- Experience Recommendations -->
            <div *ngIf="feedback.recommendations.experience.length > 0" class="bg-gray-700/50 rounded-lg p-4">
              <h5 class="text-sm font-medium text-teal-300 mb-2">Experience</h5>
              <ul class="space-y-2">
                <li *ngFor="let rec of feedback.recommendations.experience" class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-teal-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span class="text-gray-300">{{ rec }}</span>
                </li>
              </ul>
            </div>
            
            <!-- Formatting Recommendations -->
            <div *ngIf="feedback.recommendations.formatting.length > 0" class="bg-gray-700/50 rounded-lg p-4">
              <h5 class="text-sm font-medium text-purple-300 mb-2">Formatting</h5>
              <ul class="space-y-2">
                <li *ngFor="let rec of feedback.recommendations.formatting" class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span class="text-gray-300">{{ rec }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ResumeFeedbackComponent implements OnChanges {
  @Input() feedback: FeedbackResponse | null = null
  @Input() loading = false
  @Input() error: string | null = null

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["feedback"] && this.feedback) {
      // Any initialization needed when feedback changes
    }
  }

  calculateDashOffset(score: number): number {
    // Circle circumference is 2πr = 2 * 3.14 * 40 = 251.2
    const circumference = 251.2
    return circumference - (circumference * score) / 100
  }

  getScoreMessage(score: number): string {
    if (score >= 80) return "Excellent match!"
    if (score >= 60) return "Good match with room for improvement"
    return "Needs significant improvement"
  }

  getTopKeywords(): { key: string; value: number }[] {
    if (!this.feedback || !this.feedback.keywordDensity) return []

    return Object.entries(this.feedback.keywordDensity)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 9) // Get top 9 keywords
  }
}
