import { Component } from "@angular/core"
import { RouterOutlet, RouterLink, Router } from "@angular/router"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen section-bg">
      <!-- Header -->
      <header class="bg-gradient-to-r from-blue-600 to-teal-500 shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-white drop-shadow">Resume Updater</h1>
            </div>
            <nav class="flex space-x-8">
              <a routerLink="/upload" class="btn-primary">Upload</a>
              <a routerLink="/preview" class="btn-primary">Preview</a>
              <a routerLink="/templates" class="btn-primary">Templates</a>
              <a routerLink="/enhance" class="btn-primary">Enhance</a>
              <a routerLink="/ats-score" class="btn-primary">ATS Score</a>
              <a routerLink="/download" class="btn-primary">Download</a>
            </nav>
          </div>
        </div>
      </header>

      <!-- Progress Bar -->
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-4">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center space-x-8">
                <div class="flex items-center" [class.text-blue-600]="isStepActive('upload')" [class.text-green-600]="isStepCompleted('upload')">
                  <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2" 
                       [class.border-blue-600]="isStepActive('upload')" 
                       [class.border-green-600]="isStepCompleted('upload')"
                       [class.bg-green-600]="isStepCompleted('upload')"
                       [class.text-white]="isStepCompleted('upload')">
                    <span *ngIf="!isStepCompleted('upload')">1</span>
                    <svg *ngIf="isStepCompleted('upload')" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  Upload
                </div>
                <div class="flex items-center" [class.text-blue-600]="isStepActive('preview')" [class.text-green-600]="isStepCompleted('preview')">
                  <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2" 
                       [class.border-blue-600]="isStepActive('preview')" 
                       [class.border-green-600]="isStepCompleted('preview')"
                       [class.bg-green-600]="isStepCompleted('preview')"
                       [class.text-white]="isStepCompleted('preview')">
                    <span *ngIf="!isStepCompleted('preview')">2</span>
                    <svg *ngIf="isStepCompleted('preview')" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  Preview
                </div>
                <div class="flex items-center" [class.text-blue-600]="isStepActive('templates')" [class.text-green-600]="isStepCompleted('templates')">
                  <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2" 
                       [class.border-blue-600]="isStepActive('templates')" 
                       [class.border-green-600]="isStepCompleted('templates')"
                       [class.bg-green-600]="isStepCompleted('templates')"
                       [class.text-white]="isStepCompleted('templates')">
                    <span *ngIf="!isStepCompleted('templates')">3</span>
                    <svg *ngIf="isStepCompleted('templates')" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  Template
                </div>
                <div class="flex items-center" [class.text-blue-600]="isStepActive('enhance')" [class.text-green-600]="isStepCompleted('enhance')">
                  <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2" 
                       [class.border-blue-600]="isStepActive('enhance')" 
                       [class.border-green-600]="isStepCompleted('enhance')"
                       [class.bg-green-600]="isStepCompleted('enhance')"
                       [class.text-white]="isStepCompleted('enhance')">
                    <span *ngIf="!isStepCompleted('enhance')">4</span>
                    <svg *ngIf="isStepCompleted('enhance')" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  Enhance
                </div>
                <div class="flex items-center" [class.text-blue-600]="isStepActive('ats-score')" [class.text-green-600]="isStepCompleted('ats-score')">
                  <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2" 
                       [class.border-blue-600]="isStepActive('ats-score')" 
                       [class.border-green-600]="isStepCompleted('ats-score')"
                       [class.bg-green-600]="isStepCompleted('ats-score')"
                       [class.text-white]="isStepCompleted('ats-score')">
                    <span *ngIf="!isStepCompleted('ats-score')">5</span>
                    <svg *ngIf="isStepCompleted('ats-score')" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  ATS Score
                </div>
                <div class="flex items-center" [class.text-blue-600]="isStepActive('download')" [class.text-green-600]="isStepCompleted('download')">
                  <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2" 
                       [class.border-blue-600]="isStepActive('download')" 
                       [class.border-green-600]="isStepCompleted('download')"
                       [class.bg-green-600]="isStepCompleted('download')"
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
        <div class="card">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  constructor(private router: Router) {}

  isStepActive(step: string): boolean {
    return this.router.url.includes(step)
  }

  isStepCompleted(step: string): boolean {
    // This would be managed by a service in a real app
    // For demo purposes, we'll just return false
    return false
  }
}
