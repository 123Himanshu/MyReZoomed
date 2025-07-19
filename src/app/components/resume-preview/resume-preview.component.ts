import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { ResumeService } from "../../services/resume.service"
import { ResumeData } from "../../models/resume.model"

@Component({
  selector: "app-resume-preview",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto section-bg min-h-screen py-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-accent mb-4">Review & Edit Your Resume</h2>
        <p class="text-lg text-gray-700">Review the extracted content and make any necessary edits</p>
      </div>

      <div *ngIf="!resumeData" class="text-center py-12">
        <p class="text-gray-600">No resume data found. Please upload a resume first.</p>
        <button (click)="router.navigate(['/upload'])"
                class="btn-primary mt-4">
          Upload Resume
        </button>
      </div>

      <div *ngIf="resumeData" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Edit Form -->
        <div class="card">
          <h3 class="text-xl font-semibold text-gray-900 mb-6">Edit Resume Content</h3>
          
          <!-- Personal Information -->
          <div class="mb-8">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" 
                       [(ngModel)]="resumeData.personalInfo.fullName"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" 
                       [(ngModel)]="resumeData.personalInfo.email"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" 
                       [(ngModel)]="resumeData.personalInfo.phone"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input type="url" 
                       [(ngModel)]="resumeData.personalInfo.linkedIn"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" 
                     [(ngModel)]="resumeData.personalInfo.address"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>

          <!-- Professional Summary -->
          <div class="mb-8">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Professional Summary</h4>
            <textarea [(ngModel)]="resumeData.summary"
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write a brief professional summary..."></textarea>
          </div>

          <!-- Skills -->
          <div class="mb-8">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Skills</h4>
            <div class="flex flex-wrap gap-2 mb-4">
              <span *ngFor="let skill of resumeData.skills; let i = index" 
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                {{ skill }}
                <button (click)="removeSkill(i)" class="ml-2 text-blue-600 hover:text-blue-800">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </span>
            </div>
            <div class="flex gap-2">
              <input type="text" 
                     [(ngModel)]="newSkill"
                     (keyup.enter)="addSkill()"
                     placeholder="Add a skill..."
                     class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <button (click)="addSkill()" 
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Add
              </button>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="card">
          <h3 class="text-xl font-semibold text-gray-900 mb-6">Resume Preview</h3>
          
          <div class="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <!-- Personal Info Preview -->
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900">{{ resumeData.personalInfo.fullName }}</h2>
              <div class="text-gray-600 mt-2">
                <p>{{ resumeData.personalInfo.email }} | {{ resumeData.personalInfo.phone }}</p>
                <p>{{ resumeData.personalInfo.address }}</p>
                <p *ngIf="resumeData.personalInfo.linkedIn">{{ resumeData.personalInfo.linkedIn }}</p>
              </div>
            </div>

            <!-- Summary Preview -->
            <div *ngIf="resumeData.summary" class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h3>
              <p class="text-gray-700">{{ resumeData.summary }}</p>
            </div>

            <!-- Skills Preview -->
            <div *ngIf="resumeData.skills.length > 0" class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let skill of resumeData.skills" 
                      class="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- Experience Preview -->
            <div *ngIf="resumeData.experience.length > 0" class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Experience</h3>
              <div *ngFor="let exp of resumeData.experience" class="mb-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ exp.position }}</h4>
                    <p class="text-gray-600">{{ exp.company }}</p>
                  </div>
                  <span class="text-sm text-gray-500">{{ exp.startDate }} - {{ exp.current ? 'Present' : exp.endDate }}</span>
                </div>
                <p class="text-gray-700 text-sm mt-1">{{ exp.description }}</p>
              </div>
            </div>

            <!-- Education Preview -->
            <div *ngIf="resumeData.education.length > 0">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Education</h3>
              <div *ngFor="let edu of resumeData.education" class="mb-2">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ edu.degree }} in {{ edu.field }}</h4>
                    <p class="text-gray-600">{{ edu.institution }}</p>
                  </div>
                  <span class="text-sm text-gray-500">{{ edu.endDate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div *ngIf="resumeData" class="mt-8 flex justify-between">
        <button (click)="router.navigate(['/upload'])"
                class="btn-secondary">
          Back
        </button>
        
        <button (click)="saveAndContinue()"
                class="btn-primary">
          Continue to Templates
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class ResumePreviewComponent implements OnInit {
  resumeData: ResumeData | null = null
  newSkill = ""

  constructor(
    private resumeService: ResumeService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.resumeService.resumeData$.subscribe((data) => {
      this.resumeData = data
    })
  }

  addSkill(): void {
    if (this.newSkill.trim() && this.resumeData) {
      this.resumeData.skills.push(this.newSkill.trim())
      this.newSkill = ""
    }
  }

  removeSkill(index: number): void {
    if (this.resumeData) {
      this.resumeData.skills.splice(index, 1)
    }
  }

  saveAndContinue(): void {
    if (this.resumeData) {
      this.resumeService.updateResumeData(this.resumeData)
      this.router.navigate(["/templates"])
    }
  }
}
