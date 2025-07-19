import { Routes } from "@angular/router"

export const routes: Routes = [
  { path: "", redirectTo: "upload", pathMatch: "full" },
  {
    path: "upload",
    loadComponent: () =>
      import("./components/upload-resume/upload-resume.component").then((m) => m.UploadResumeComponent),
  },
  {
    path: "preview",
    loadComponent: () =>
      import("./components/resume-preview/resume-preview.component").then((m) => m.ResumePreviewComponent),
  },
  {
    path: "templates",
    loadComponent: () =>
      import("./components/template-selector/template-selector.component").then((m) => m.TemplateSelectorComponent),
  },
  {
    path: "enhance",
    loadComponent: () =>
      import("./components/enhanced-resume/enhanced-resume.component").then((m) => m.EnhancedResumeComponent),
  },
  {
    path: "ats-score",
    loadComponent: () => import("./components/ats-score/ats-score.component").then((m) => m.AtsScoreComponent),
  },
  {
    path: "download",
    loadComponent: () =>
      import("./components/pdf-preview-download/pdf-preview-download.component").then(
        (m) => m.PdfPreviewDownloadComponent,
      ),
  },
]
