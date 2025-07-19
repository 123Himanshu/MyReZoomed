import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { ResumeService } from "../../services/resume.service"
import { ResumeTemplate } from "../../models/resume.model"

@Component({
  selector: "app-template-selector",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto section-bg min-h-screen py-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-accent mb-4">Choose Your Resume Template</h2>
        <p class="text-lg text-gray-700">Select a professional template that best represents your style</p>
      </div>

      <div *ngIf="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p class="text-gray-600">Loading templates...</p>
      </div>

      <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let template of templates"
             class="card cursor-pointer transform transition-transform hover:scale-105 border-2"
             [class.border-accent]="selectedTemplate?.id === template.id"
             (click)="selectTemplate(template)">

          <!-- Template Preview -->
          <div class="aspect-[3/4] bg-gray-100 relative overflow-hidden">
            <img [src]="template.previewUrl"
                 [alt]="template.name + ' template preview'"
                 class="w-full h-full object-cover">

            <!-- Category Badge -->
            <div class="absolute top-4 left-4">
              <span class="px-2 py-1 text-xs font-medium rounded-full"
                    [class.bg-blue-100]="template.category === 'modern'"
                    [class.text-blue-800]="template.category === 'modern'"
                    [class.bg-green-100]="template.category === 'classic'"
                    [class.text-green-800]="template.category === 'classic'"
                    [class.bg-purple-100]="template.category === 'creative'"
                    [class.text-purple-800]="template.category === 'creative'">
                {{ template.category | titlecase }}
              </span>
            </div>

            <!-- Selection Indicator -->
            <div *ngIf="selectedTemplate?.id === template.id"
                 class="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>

          <!-- Template Info -->
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ template.name }}</h3>
            <p class="text-gray-600 text-sm">{{ template.description }}</p>
          </div>
        </div>
      </div>

      <!-- Template Categories Filter -->
      <div class="mt-12 text-center">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Filter by Category</h3>
        <div class="flex justify-center space-x-4">
          <button *ngFor="let category of categories"
                  (click)="filterByCategory(category)"
                  class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  [class.bg-blue-600]="selectedCategory === category"
                  [class.text-white]="selectedCategory === category"
                  [class.bg-gray-200]="selectedCategory !== category"
                  [class.text-gray-700]="selectedCategory !== category"
                  [class.hover:bg-blue-700]="selectedCategory === category"
                  [class.hover:bg-gray-300]="selectedCategory !== category">
            {{ category | titlecase }}
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-12 flex justify-between">
        <button (click)="router.navigate(['/preview'])"
                class="btn-secondary">
          Back
        </button>
        <button (click)="continueToEnhance()"
                [disabled]="!selectedTemplate"
                class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
          Continue to Enhancement
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class TemplateSelectorComponent implements OnInit {
  templates: ResumeTemplate[] = []
  filteredTemplates: ResumeTemplate[] = []
  selectedTemplate: ResumeTemplate | null = null
  selectedCategory = "all"
  categories: string[] = ["all", "modern", "classic", "creative"]
  isLoading = true

  constructor(
    private resumeService: ResumeService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTemplates()

    // Check if template is already selected
    this.selectedTemplate = this.resumeService.getSelectedTemplate()
  }

  loadTemplates(): void {
    this.resumeService.getTemplates().subscribe({
      next: (templates) => {
        this.templates = templates
        this.filteredTemplates = templates
        this.isLoading = false
      },
      error: (error) => {
        console.error("Failed to load templates:", error)
        this.isLoading = false
        // Fallback to mock templates for demo
        this.loadMockTemplates()
      },
    })
  }

  private loadMockTemplates(): void {
    this.templates = [
      {
        id: "modern-1",
        name: "Modern Professional",
        description: "Clean and contemporary design perfect for tech and business professionals",
        previewUrl: "/placeholder.svg?height=400&width=300",
        category: "modern",
      },
      {
        id: "modern-2",
        name: "Minimalist",
        description: "Simple and elegant layout that focuses on content",
        previewUrl: "/placeholder.svg?height=400&width=300",
        category: "modern",
      },
      {
        id: "classic-1",
        name: "Traditional",
        description: "Timeless design suitable for conservative industries",
        previewUrl: "/placeholder.svg?height=400&width=300",
        category: "classic",
      },
      {
        id: "classic-2",
        name: "Executive",
        description: "Professional layout for senior-level positions",
        previewUrl: "/placeholder.svg?height=400&width=300",
        category: "classic",
      },
      {
        id: "creative-1",
        name: "Designer",
        description: "Creative layout perfect for design and marketing roles",
        previewUrl: "/placeholder.svg?height=400&width=300",
        category: "creative",
      },
      {
        id: "creative-2",
        name: "Artistic",
        description: "Bold and unique design for creative professionals",
        previewUrl: "/placeholder.svg?height=400&width=300",
        category: "creative",
      },
    ]
    this.filteredTemplates = this.templates
  }

  selectTemplate(template: ResumeTemplate): void {
    this.selectedTemplate = template
    this.resumeService.selectTemplate(template)
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category
    if (category === "all") {
      this.filteredTemplates = this.templates
    } else {
      this.filteredTemplates = this.templates.filter((t) => t.category === category)
    }
  }

  continueToEnhance(): void {
    if (this.selectedTemplate) {
      this.router.navigate(["/enhance"])
    }
  }
}
