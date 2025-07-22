import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { ResumeService } from "../../services/resume.service"
import type { ResumeData, ResumeTemplate } from "../../models/resume.model"

@Component({
  selector: "app-template-selector",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-4">
            Choose Your Resume Template
          </h2>
          <p class="text-xl text-gray-300">Select a professional template that best represents your style</p>
        </div>

        <div *ngIf="isLoading" class="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
          <div class="relative w-24 h-24 mx-auto mb-8">
            <div class="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-teal-500 border-l-transparent animate-spin"></div>
            <div class="absolute inset-3 rounded-full border-2 border-t-blue-400 border-r-transparent border-b-teal-400 border-l-transparent animate-spin animate-reverse"></div>
          </div>
          <p class="text-xl text-gray-400">Loading templates...</p>
        </div>

        <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let template of templates">
               class="bg-gray-800 rounded-xl shadow-2xl border-2 transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden group"
               [class.border-blue-500]="selectedTemplate?.id === template.id"
               [class.border-gray-700]="selectedTemplate?.id !== template.id"
               [class.shadow-blue-500/20]="selectedTemplate?.id === template.id"
               (click)="selectTemplate(template)">

            <!-- Template Preview -->
            <div class="aspect-[3/4] bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
              <img [src]="template.preview"
                   [alt]="template.name + ' template preview'"
                   class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                   (error)="onImageError($event, template)">

              <!-- Category Badge -->
              <div class="absolute top-4 left-4">
                <span class="px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm"
                      [ngClass]="{
                        'bg-blue-600/80 text-blue-100 border border-blue-400/50': template.id.includes('modern'),
                        'bg-green-600/80 text-green-100 border border-green-400/50': template.id.includes('minimalist'),
                        'bg-purple-600/80 text-purple-100 border border-purple-400/50': template.id.includes('traditional')
                      }">
                  {{ getTemplateCategory(template.id) }}
                </span>
              </div>

              <!-- Selection Indicator -->
              <div *ngIf="selectedTemplate?.id === template.id"
                   class="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-2 shadow-lg animate-pulse">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>

              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div class="p-4 text-white">
                  <p class="text-sm font-medium">Click to select</p>
                </div>
              </div>
            </div>

            <!-- Template Info -->
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-100 mb-2 group-hover:text-blue-400 transition-colors">
                {{ template.name }}
              </h3>
              <p class="text-gray-400 text-sm leading-relaxed">{{ template.description }}</p>
              
              <!-- Features -->
              <div class="mt-4 flex flex-wrap gap-2">
                <span *ngFor="let feature of getTemplateFeatures(template.id)" 
                      class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                  {{ feature }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Template Preview Modal -->
        <div *ngIf="showPreview" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div class="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <div class="flex justify-between items-center p-6 border-b border-gray-700">
              <div>
                <h3 class="text-2xl font-semibold text-gray-100">{{ selectedTemplate?.name }} Preview</h3>
                <p class="text-gray-400 mt-1">{{ selectedTemplate?.description }}</p>
              </div>
              <button (click)="showPreview = false" 
                      class="text-gray-400 hover:text-gray-200 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="p-6 overflow-y-auto max-h-[70vh]">
              <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <img [src]="selectedTemplate?.preview" 
                     [alt]="selectedTemplate?.name + ' full preview'" 
                     class="w-full h-auto">
              </div>
            </div>
            <div class="p-6 border-t border-gray-700 flex justify-between items-center">
              <div class="flex space-x-4">
                <button (click)="showPreview = false" 
                        class="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
                  Close
                </button>
                <button (click)="previewTemplate()" 
                        class="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  Live Preview
                </button>
              </div>
              <button (click)="continueToDownload()" 
                      class="px-8 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Use This Template
              </button>
            </div>
          </div>
        </div>

        <!-- Template Comparison -->
        <div *ngIf="!isLoading && templates.length > 0" class="mt-16 bg-gray-800 rounded-xl border border-gray-700 p-8">
          <h3 class="text-2xl font-semibold text-gray-100 mb-6 text-center">Template Comparison</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-700">
                  <th class="text-left py-3 px-4 text-gray-300">Feature</th>
                  <th *ngFor="let template of templates" class="text-center py-3 px-4 text-gray-300">
                    {{ template.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-700/50">
                  <td class="py-3 px-4 text-gray-400">ATS Friendly</td>
                  <td *ngFor="let template of templates" class="text-center py-3 px-4">
                    <svg class="w-5 h-5 text-green-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </td>
                </tr>
                <tr class="border-b border-gray-700/50">
                  <td class="py-3 px-4 text-gray-400">Print Optimized</td>
                  <td *ngFor="let template of templates" class="text-center py-3 px-4">
                    <svg class="w-5 h-5 text-green-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </td>
                </tr>
                <tr class="border-b border-gray-700/50">
                  <td class="py-3 px-4 text-gray-400">Color Scheme</td>
                  <td class="text-center py-3 px-4 text-gray-300">Minimal</td>
                  <td class="text-center py-3 px-4 text-gray-300">Gradient</td>
                  <td class="text-center py-3 px-4 text-gray-300">Classic</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 text-gray-400">Best For</td>
                  <td class="text-center py-3 px-4 text-gray-300">Tech/Creative</td>
                  <td class="text-center py-3 px-4 text-gray-300">Business/Sales</td>
                  <td class="text-center py-3 px-4 text-gray-300">Finance/Legal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-12 flex flex-col sm:flex-row justify-between gap-4">
          <button (click)="router.navigate(['/preview'])"
                  class="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-all duration-200 flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Preview
          </button>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <button (click)="showPreview = true"
                    [disabled]="!selectedTemplate"
                    class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              Preview Template
            </button>
            <button (click)="continueToDownload()"
                    [disabled]="!selectedTemplate"
                    class="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Generate PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class TemplateSelectorComponent implements OnInit {
  templates: ResumeTemplate[] = []
  selectedTemplate: ResumeTemplate | null = null
  isLoading = true
  showPreview = false
  resumeData: ResumeData | null = null

  constructor(
    private resumeService: ResumeService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTemplates()
    this.resumeData = this.resumeService.getResumeData()

    if (!this.resumeData) {
      this.router.navigate(["/upload"])
    }
  }

  loadTemplates(): void {
    this.resumeService.getTemplates().subscribe({
      next: (templates) => {
        this.templates = templates
        this.isLoading = false

        // If there's a stored template selection, use it
        const storedTemplateId = localStorage.getItem("selectedTemplateId")
        if (storedTemplateId) {
          const storedTemplate = this.templates.find((t) => t.id === storedTemplateId)
          if (storedTemplate) {
            this.selectedTemplate = storedTemplate
          }
        }
      },
      error: (error) => {
        console.error("Failed to load templates:", error)
        this.isLoading = false

        // Fallback to default templates
        this.templates = [
          {
            id: "minimalist",
            name: "Minimalist",
            description: "Clean and simple design focusing on content with elegant spacing and typography",
            preview: "/placeholder.svg?height=600&width=400&text=Minimalist+Template",
          },
          {
            id: "modern-professional",
            name: "Modern Professional",
            description: "Contemporary design with gradient accents and visual hierarchy for modern industries",
            preview: "/placeholder.svg?height=600&width=400&text=Modern+Professional+Template",
          },
          {
            id: "traditional",
            name: "Traditional",
            description: "Classic format preferred by traditional industries and conservative recruiters",
            preview: "/placeholder.svg?height=600&width=400&text=Traditional+Template",
          },
        ]
      },
    })
  }

  selectTemplate(template: ResumeTemplate): void {
    this.selectedTemplate = template
    localStorage.setItem("selectedTemplateId", template.id)
  }

  getTemplateCategory(templateId: string): string {
    if (templateId.includes("modern")) return "Modern"
    if (templateId.includes("minimalist")) return "Minimalist"
    if (templateId.includes("traditional")) return "Traditional"
    return "Standard"
  }

  getTemplateFeatures(templateId: string): string[] {
    const features: { [key: string]: string[] } = {
      minimalist: ["Clean Layout", "ATS Friendly", "Easy to Read"],
      "modern-professional": ["Gradient Design", "Visual Hierarchy", "Professional"],
      traditional: ["Classic Format", "Conservative", "Time-tested"],
    }
    return features[templateId] || ["Professional", "ATS Friendly"]
  }

  onImageError(event: any, template: ResumeTemplate): void {
    // Fallback to placeholder if image fails to load
    event.target.src = `/placeholder.svg?height=600&width=400&text=${encodeURIComponent(template.name + " Template")}`
  }

  previewTemplate(): void {
    if (this.selectedTemplate && this.resumeData) {
      // Generate a preview PDF or navigate to preview page
      this.showPreview = false
      this.router.navigate(["/download"], {
        queryParams: {
          templateId: this.selectedTemplate.id,
          preview: "true",
        },
      })
    }
  }

  continueToDownload(): void {
    if (this.selectedTemplate && this.resumeData) {
      this.showPreview = false
      this.router.navigate(["/download"], {
        queryParams: { templateId: this.selectedTemplate.id },
      })
    }
  }
}
