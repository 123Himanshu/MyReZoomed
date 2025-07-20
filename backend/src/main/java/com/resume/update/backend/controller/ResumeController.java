package com.resumeupdater.controller;

import com.resumeupdater.dto.*;
import com.resumeupdater.service.ResumeService;
import com.resumeupdater.service.TemplateService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
public class ResumeController {

    private static final Logger logger = LoggerFactory.getLogger(ResumeController.class);

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private TemplateService templateService;

    /**
     * Upload resume file and extract content via FastAPI
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeDataDto> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            logger.info("Received file upload request: {}", file.getOriginalFilename());
            
            // Validate file
            if (file.isEmpty()) {
                logger.error("Uploaded file is empty");
                return ResponseEntity.badRequest().build();
            }

            // Validate file type
            String contentType = file.getContentType();
            if (!isValidFileType(contentType)) {
                logger.error("Invalid file type: {}", contentType);
                return ResponseEntity.badRequest().build();
            }

            // Validate file size (10MB limit)
            if (file.getSize() > 10 * 1024 * 1024) {
                logger.error("File size exceeds limit: {} bytes", file.getSize());
                return ResponseEntity.badRequest().build();
            }

            ResumeDataDto resumeData = resumeService.extractResumeContent(file);
            logger.info("Successfully extracted resume content for: {}", file.getOriginalFilename());
            
            return ResponseEntity.ok(resumeData);
        } catch (Exception e) {
            logger.error("Error processing file upload", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Enhance resume content using AI via FastAPI
     */
    @PostMapping("/ai/enhance")
    public ResponseEntity<EnhancedResumeDto> enhanceResume(@Valid @RequestBody ResumeDataDto resumeData) {
        try {
            logger.info("Received resume enhancement request for: {}", 
                resumeData.getPersonalInfo().getFullName());
            
            EnhancedResumeDto enhancedResume = resumeService.enhanceResume(resumeData);
            logger.info("Successfully enhanced resume");
            
            return ResponseEntity.ok(enhancedResume);
        } catch (Exception e) {
            logger.error("Error enhancing resume", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get available resume templates
     */
    @GetMapping("/templates")
    public ResponseEntity<List<ResumeTemplateDto>> getTemplates() {
        try {
            logger.info("Received request for available templates");
            
            List<ResumeTemplateDto> templates = templateService.getAvailableTemplates();
            logger.info("Returning {} templates", templates.size());
            
            return ResponseEntity.ok(templates);
        } catch (Exception e) {
            logger.error("Error retrieving templates", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Generate PDF resume using selected template
     */
    @PostMapping("/generate-pdf")
    public ResponseEntity<byte[]> generatePdf(@Valid @RequestBody PdfGenerationRequestDto request) {
        try {
            logger.info("Received PDF generation request for template: {}", request.getTemplateId());
            
            byte[] pdfBytes = resumeService.generatePdf(request.getResumeData(), request.getTemplateId());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", 
                generatePdfFilename(request.getResumeData().getPersonalInfo().getFullName()));
            headers.setContentLength(pdfBytes.length);
            
            logger.info("Successfully generated PDF ({} bytes)", pdfBytes.length);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            logger.error("Error generating PDF", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Calculate ATS score via FastAPI
     */
    @PostMapping("/ats-score")
    public ResponseEntity<AtsScoreDto> calculateAtsScore(@Valid @RequestBody AtsScoreRequestDto request) {
        try {
            logger.info("Received ATS score calculation request");
            
            AtsScoreDto atsScore = resumeService.calculateAtsScore(request.getResumeData(), request.getJobDescription());
            logger.info("Successfully calculated ATS score: {}", atsScore.getScore());
            
            return ResponseEntity.ok(atsScore);
        } catch (Exception e) {
            logger.error("Error calculating ATS score", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Resume Backend is running");
    }

    private boolean isValidFileType(String contentType) {
        return contentType != null && (
            contentType.equals("application/pdf") ||
            contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
            contentType.equals("application/msword")
        );
    }

    private String generatePdfFilename(String fullName) {
        String sanitizedName = fullName.replaceAll("[^a-zA-Z0-9\\s]", "").replaceAll("\\s+", "_");
        return sanitizedName + "_Resume.pdf";
    }
}
