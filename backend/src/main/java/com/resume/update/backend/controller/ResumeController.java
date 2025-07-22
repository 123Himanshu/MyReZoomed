package com.resumeupdater.controller;

import com.resumeupdater.dto.*;
import com.resumeupdater.service.*;
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
@CrossOrigin(origins = "*")
public class ResumeController {

    private static final Logger logger = LoggerFactory.getLogger(ResumeController.class);

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private TemplateService templateService;

    @Autowired
    private PdfGenerator pdfGenerator;

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
            logger.info("Fetching available resume templates");
            
            List<ResumeTemplateDto> templates = templateService.getAvailableTemplates();
            logger.info("Returning {} templates", templates.size());
            
            return ResponseEntity.ok(templates);
        } catch (Exception e) {
            logger.error("Error fetching templates", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Generate PDF resume using selected template
     */
    @PostMapping("/generate-pdf")
    public ResponseEntity<byte[]> generatePdf(@Valid @RequestBody PdfGenerationRequestDto request) {
        try {
            logger.info("Generating PDF for template: {}", request.getTemplateId());
            
            byte[] pdfBytes = pdfGenerator.generatePdf(request.getResumeData(), request.getTemplateId());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", 
                request.getResumeData().getPersonalInfo().getFullName() + "_Resume.pdf");
            headers.setContentLength(pdfBytes.length);
            
            logger.info("PDF generated successfully, size: {} bytes", pdfBytes.length);
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
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
     * Provide real-time feedback for resume editing
     */
    @PostMapping("/feedback")
    public ResponseEntity<FeedbackResponseDto> getFeedback(@Valid @RequestBody ResumeDataDto resumeData) {
        try {
            logger.info("Received real-time feedback request for: {}",
                resumeData.getPersonalInfo().getFullName());

            FeedbackResponseDto feedback = resumeService.getFeedback(resumeData);
            logger.info("Successfully generated real-time feedback");

            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            logger.error("Error generating real-time feedback", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Resume Backend Service is running");
    }

    /**
     * Get template preview
     */
    @GetMapping("/templates/{templateId}/preview")
    public ResponseEntity<String> getTemplatePreview(@PathVariable String templateId) {
        try {
            logger.info("Fetching preview for template: {}", templateId);
            String preview = templateService.getTemplatePreview(templateId);
            return ResponseEntity.ok(preview);
        } catch (Exception e) {
            logger.error("Error fetching template preview for: " + templateId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    private boolean isValidFileType(String contentType) {
        return contentType != null && (
            contentType.equals("application/pdf") ||
            contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
            contentType.equals("application/msword")
        );
    }
}
