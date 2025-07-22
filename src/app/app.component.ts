import { Component } from "@angular/core"
import { RouterOutlet, RouterLink, Router } from "@angular/router"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <!-- Header -->
      <header class="bg-gradient-to-r from-gray-900 to-gray-800 shadow-md border-b border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center">
              <div class="bg-gradient-to-r from-blue-500 to-teal-400 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">{{ title }}</h1>
            </div>
            <nav class="flex space-x-4 sm:space-x-8">
              <a *ngIf="!isLandingPage()" routerLink="/" class="nav-link">Home</a>
              <a routerLink="/upload" class="nav-link" [class.active]="isStepActive('upload')">Upload</a>
              <a routerLink="/preview" class="nav-link" [class.active]="isStepActive('preview')">Preview</a>
              <a routerLink="/templates" class="nav-link" [class.active]="isStepActive('templates')">Templates</a>
              <a routerLink="/enhance" class="nav-link" [class.active]="isStepActive('enhance')">Enhance</a>
              <a routerLink="/ats-score" class="nav-link" [class.active]="isStepActive('ats-score')">ATS Score</a>
              <a routerLink="/download" class="nav-link" [class.active]="isStepActive('download')">Download</a>
            </nav>
          </div>
        </div>
      </header>

      <!-- Progress Bar (only show on non-landing pages) -->
      <div *ngIf="!isLandingPage()" class="bg-gray-800 border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-4">
            <div class="flex items-center justify-between text-sm overflow-x-auto">
              <div class="flex items-center space-x-8">
                <div class="flex items-center" [class.text-blue-400]="isStepActive('upload')" [class.text-green-400]="isStepCompleted('upload')">
                  <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2" 
                       [class.border-blue-400]="isStepActive('upload')" 
                       [class.border-green-400]="isStepCompleted('upload')"
                       [class.bg-green-400]="isStepCompleted('upload')"
                       [class.text-white]="isStepCompleted('upload')">
                    <span *ngIf="!isStepCompleted('upload')">1</span>
                    <svg *ngIf="isStepCompleted('upload')" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  Upload
                </div>
                <div class="flex items-center" [class.text-blue-400]="isStepActive('preview')" [class.text-green-400]="isStepCompleted('preview')">
                  <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2" 
                       [class.border-blue-400]="isStepActive('preview')" 
                       [class.border-green-400]="isStepCompleted('preview')"
                       [class.bg-green-400]="isStepCompleted('preview')"
                       [class.text-white]="isStepCompleted('preview')">
                    <span *ngIf="!isStepCompleted('preview')">2</span>
                    <svg *ngIf="isStepCompleted('preview')" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  Preview
                </div>
                <div class="flex items-center" [class.text-blue-400]="isStepActive('templates')" [class.text-green-400]="isStepCompleted('templates')">
                  <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2" 
                       [class.border-blue-400]="isStepActive('templates')" 
                       [class.border-green-400]="isStepCompleted('templates')"
                       [class.bg-green-400]="isStepCompleted('templates')"
                       [class.text-white]="isStepCompleted('templates')">
                    <span *ngIf="!isStepCompleted('templates')">3</span>
                    <svg *ngIf="isStepCompleted('templates')" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  Template
                </div>
                <div class="flex items-center" [class.text-blue-400]="isStepActive('enhance')" [class.text-green-400]="isStepCompleted('enhance')">
                  <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2" 
                       [class.border-blue-400]="isStepActive('enhance')" 
                       [class.border-green-400]="isStepCompleted('enhance')"
                       [class.bg-green-400]="isStepCompleted('enhance')"
                       [class.text-white]="isStepCompleted('enhance')">
                    <span *ngIf="!isStepCompleted('enhance')">4</span>
                    <svg *ngIf="isStepCompleted('enhance')" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  Enhance
                </div>
                <div class="flex items-center" [class.text-blue-400]="isStepActive('ats-score')" [class.text-green-400]="isStepCompleted('ats-score')">
                  <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2" 
                       [class.border-blue-400]="isStepActive('ats-score')" 
                       [class.border-green-400]="isStepCompleted('ats-score')"
                       [class.bg-green-400]="isStepCompleted('ats-score')"
                       [class.text-white]="isStepCompleted('ats-score')">
                    <span *ngIf="!isStepCompleted('ats-score')">5</span>
                    <svg *ngIf="isStepCompleted('ats-score')" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  ATS Score
                </div>
                <div class="flex items-center" [class.text-blue-400]="isStepActive('download')" [class.text-green-400]="isStepCompleted('download')">
                  <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2" 
                       [class.border-blue-400]="isStepActive('download')" 
                       [class.border-green-400]="isStepCompleted('download')"
                       [class.bg-green-400]="isStepCompleted('download')"
                       [class.text-white]="isStepCompleted('download')">
                    <span *ngIf="!isStepCompleted('download')">6</span>
                    <svg *ngIf="isStepCompleted('download')" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  Download
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
    .nav-link {
      @apply text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors;
    }
    .nav-link.active {
      @apply bg-gray-800 text-white;
    }
    `,
  ],
})
export class AppComponent {
  title = "MyRezoomed"

  constructor(private router: Router) {}

  isStepActive(step: string): boolean {
    return this.router.url.includes(step)
  }

  isStepCompleted(step: string): boolean {
    // This would be managed by a service in a real app
    // For demo purposes, we'll just return false
    return false
  }

  isLandingPage(): boolean {
    return this.router.url === "/" || this.router.url === ""
  }
}
