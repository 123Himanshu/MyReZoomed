import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { ResumeService, EnhancementResponse } from "../../services/resume.service"
import type { ResumeData } from "../../models/resume.model"

@Component({
  selector: "app-enhanced-resume",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-4">
          AI-Powered Resume Enhancement
        </h2>
        <p class="text-lg text-gray-300">Powered by Gemini 1.5 Pro for professional content optimization</p>
      </div>

      <!-- Enhancement Controls -->
      <div class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-100">Enhancement Options</h3>
            <p class="text-gray-400">Choose what to enhance with AI</p>
          </div>
          <div class="flex space-x-4">
            <button 
              (click)="enhanceResume()"
              [disabled]="isEnhancing"
              class="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!isEnhancing">Enhance Full Resume</span>
              <span *ngIf="isEnhancing" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enhancing...
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Enhancement Results -->
      <div *ngIf="enhancementResults" class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Original Resume -->
        <div class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-gray-100">Original Resume</h3>
            <span class="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">Before</span>
          </div>
          
          <div class="space-y-6">
            <!-- Original Summary -->
            <div *ngIf="originalResume?.summary">
              <h4 class="text-sm font-medium text-gray-400 mb-2">PROFESSIONAL SUMMARY</h4>
        <p class="text-gray-300 text-sm leading-relaxed">{{ originalResume?.summary }}</p>
            </div>

            <!-- Original Experience -->
        <div *ngIf="(originalResume?.experience?.length ?? 0) > 0">
              <h4 class="text-sm font-medium text-gray-400 mb-3">WORK EXPERIENCE</h4>
        <div *ngFor="let exp of originalResume?.experience?.slice(0, 2)" class="mb-4">
                <div class="flex justify-between items-start mb-1">
                  <h5 class="font-medium text-gray-200 text-sm">{{ exp.jobTitle || exp.position }}</h5>
                  <span class="text-xs text-gray-400">{{ exp.startDate }} - {{ exp.endDate }}</span>
                </div>
                <p class="text-xs text-gray-400 mb-2">{{ exp.company }}</p>
                <p class="text-gray-300 text-xs leading-relaxed">{{ exp.description }}</p>
              </div>
            </div>

            <!-- Original Skills -->
        <div *ngIf="(originalResume?.skills?.length ?? 0) > 0">
              <h4 class="text-sm font-medium text-gray-400 mb-2">SKILLS</h4>
              <div class="flex flex-wrap gap-1">
        <span *ngFor="let skill of originalResume?.skills?.slice(0, 8)" 
                      class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Resume -->
        <div class="bg-gray-800 rounded-xl shadow-xl border border-green-700 p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-gray-100">Enhanced Resume</h3>
            <span class="px-3 py-1 bg-green-700 text-green-200 text-sm rounded-full">After AI</span>
          </div>
          
          <div class="space-y-6">
            <!-- Enhanced Summary -->
            <div *ngIf="enhancedResume?.summary">
              <h4 class="text-sm font-medium text-green-400 mb-2">PROFESSIONAL SUMMARY</h4>
        <p class="text-gray-200 text-sm leading-relaxed">{{ enhancedResume?.summary }}</p>
            </div>

            <!-- Enhanced Experience -->
        <div *ngIf="(enhancedResume?.experience?.length ?? 0) > 0">
              <h4 class="text-sm font-medium text-green-400 mb-3">WORK EXPERIENCE</h4>
        <div *ngFor="let exp of enhancedResume?.experience?.slice(0, 2)" class="mb-4">
                <div class="flex justify-between items-start mb-1">
                  <h5 class="font-medium text-gray-100 text-sm">{{ exp.jobTitle || exp.position }}</h5>
                  <span class="text-xs text-gray-400">{{ exp.startDate }} - {{ exp.endDate }}</span>
                </div>
                <p class="text-xs text-gray-400 mb-2">{{ exp.company }}</p>
                <p class="text-gray-200 text-xs leading-relaxed">{{ exp.description }}</p>
              </div>
            </div>

            <!-- Enhanced Skills -->
        <div *ngIf="(enhancedResume?.skills?.length ?? 0) > 0">
              <h4 class="text-sm font-medium text-green-400 mb-2">SKILLS</h4>
              <div class="flex flex-wrap gap-1">
        <span *ngFor="let skill of enhancedResume?.skills?.slice(0, 8)" 
                      class="px-2 py-1 bg-green-900/30 text-green-200 text-xs rounded border border-green-800/30">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Improvements Made -->
      <div *ngIf="enhancementResults?.improvements" class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 mb-8">
        <h3 class="text-xl font-semibold text-gray-100 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Improvements Made
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div *ngFor="let improvement of enhancementResults?.improvements" 
               class="flex items-start p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="text-green-200 text-sm">{{ improvement }}</span>
          </div>
        </div>
      </div>

      <!-- AI Suggestions -->
      <div *ngIf="enhancementResults?.aiSuggestions" class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 mb-8">
        <h3 class="text-xl font-semibold text-gray-100 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Suggestions for Further Improvement
        </h3>
        <div class="space-y-3">
        <div *ngFor="let suggestion of enhancementResults?.aiSuggestions" 
               class="flex items-start p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-blue-200 text-sm">{{ suggestion }}</span>
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
          <button *ngIf="enhancementResults" 
                  (click)="applyEnhancements()"
                  class="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-white font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-200">
            Apply Enhancements
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
export class EnhancedResumeComponent implements OnInit {
  originalResume: ResumeData | null = null
  enhancedResume: ResumeData | null = null
  enhancementResults: EnhancementResponse | null = null
  isEnhancing = false

  constructor(
    private resumeService: ResumeService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.originalResume = this.resumeService.getResumeData()

    if (!this.originalResume) {
      this.router.navigate(["/upload"])
    }
  }

  enhanceResume(): void {
    if (!this.originalResume) return

    this.isEnhancing = true
    this.resumeService.enhanceResume(this.originalResume).subscribe({
      next: (results) => {
        this.enhancementResults = results
        this.enhancedResume = results.enhancedText
        this.isEnhancing = false
      },
      error: (error) => {
        console.error("Enhancement failed:", error)
        this.isEnhancing = false
      },
    })
  }

  applyEnhancements(): void {
    if (this.enhancedResume) {
      this.resumeService.updateResumeData(this.enhancedResume)
      this.router.navigate(["/templates"])
    }
  }
}
