import type { Routes } from "@angular/router"
import { LandingPageComponent } from "./components/landing-page/landing-page.component"
import { UploadResumeComponent } from "./components/upload-resume/upload-resume.component"
import { ResumePreviewComponent } from "./components/resume-preview/resume-preview.component"
import { EnhancedResumeComponent } from "./components/enhanced-resume/enhanced-resume.component"
import { TemplateSelectorComponent } from "./components/template-selector/template-selector.component"
import { PdfPreviewDownloadComponent } from "./components/pdf-preview-download/pdf-preview-download.component"

export const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "upload", component: UploadResumeComponent },
  { path: "preview", component: ResumePreviewComponent },
  { path: "enhance", component: EnhancedResumeComponent },
  { path: "templates", component: TemplateSelectorComponent },
  { path: "download", component: PdfPreviewDownloadComponent },
  { path: "**", redirectTo: "" },
]
