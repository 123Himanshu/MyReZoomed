import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"

@Component({
  selector: "app-landing-page",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <!-- Navigation -->
      <nav class="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                  MyRezoomed
                </h1>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <button 
                (click)="router.navigate(['/upload'])"
                class="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <div class="relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div class="text-center">
            <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
              AI-Powered Resume
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                Enhancement
              </span>
            </h1>
            <p class="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your resume with cutting-edge AI technology. Get ATS optimization, 
              professional templates, and intelligent content enhancement powered by Gemini AI.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                (click)="router.navigate(['/upload'])"
                class="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Upload Your Resume
              </button>
              <button class="border border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200">
                View Demo
              </button>
            </div>
          </div>
        </div>

        <!-- Background Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="py-24 bg-gray-800/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-white mb-4">Powerful Features</h2>
            <p class="text-gray-400 text-lg">Everything you need to create the perfect resume</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- AI Enhancement -->
            <div class="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
              <div class="bg-blue-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-4">AI-Powered Enhancement</h3>
              <p class="text-gray-400">Leverage Gemini 1.5 Pro to transform your resume content with professional language and impact-driven achievements.</p>
            </div>

            <!-- ATS Optimization -->
            <div class="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-teal-500/50 transition-all duration-300">
              <div class="bg-teal-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-4">ATS Optimization</h3>
              <p class="text-gray-400">Get detailed ATS compatibility scores and recommendations to ensure your resume passes through applicant tracking systems.</p>
            </div>

            <!-- Professional Templates -->
            <div class="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div class="bg-purple-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-4">Professional Templates</h3>
              <p class="text-gray-400">Choose from carefully designed templates that look great and work perfectly with ATS systems.</p>
            </div>

            <!-- Smart Parsing -->
            <div class="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-green-500/50 transition-all duration-300">
              <div class="bg-green-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-4">Smart Parsing</h3>
              <p class="text-gray-400">Advanced OCR and AI parsing extracts content from any resume format, even scanned documents.</p>
            </div>

            <!-- Real-time Feedback -->
            <div class="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
              <div class="bg-yellow-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-4">Real-time Feedback</h3>
              <p class="text-gray-400">Get instant suggestions and improvements as you edit your resume content.</p>
            </div>

            <!-- Multiple Formats -->
            <div class="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-red-500/50 transition-all duration-300">
              <div class="bg-red-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-4">Multiple Formats</h3>
              <p class="text-gray-400">Support for PDF, DOCX, and other formats with high-quality PDF output generation.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- How It Works -->
      <div class="py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p class="text-gray-400 text-lg">Simple steps to create your perfect resume</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 class="text-lg font-semibold text-white mb-2">Upload Resume</h3>
              <p class="text-gray-400">Upload your existing resume in PDF or DOCX format</p>
            </div>
            <div class="text-center">
              <div class="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 class="text-lg font-semibold text-white mb-2">AI Analysis</h3>
              <p class="text-gray-400">Our AI analyzes and extracts your resume content</p>
            </div>
            <div class="text-center">
              <div class="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 class="text-lg font-semibold text-white mb-2">Enhance & Optimize</h3>
              <p class="text-gray-400">Get ATS optimization and AI-powered enhancements</p>
            </div>
            <div class="text-center">
              <div class="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 class="text-lg font-semibold text-white mb-2">Download</h3>
              <p class="text-gray-400">Choose a template and download your perfect resume</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="py-24 bg-gradient-to-r from-blue-900/20 to-teal-900/20">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-white mb-4">Ready to Transform Your Resume?</h2>
          <p class="text-xl text-gray-300 mb-8">Join thousands of professionals who have enhanced their careers with MyRezoomed</p>
          <button 
            (click)="router.navigate(['/upload'])"
            class="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            Get Started Now - It's Free
          </button>
        </div>
      </div>

      <!-- Footer -->
      <footer class="bg-gray-900 border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="text-center">
            <h3 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-4">
              MyRezoomed
            </h3>
            <p class="text-gray-400 mb-4">AI-Powered Resume Enhancement Platform</p>
            <p class="text-gray-500 text-sm">&copy; 2024 MyRezoomed. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [],
})
export class LandingPageComponent {
  constructor(public router: Router) {}
}
