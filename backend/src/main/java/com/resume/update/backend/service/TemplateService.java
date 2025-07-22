package com.resumeupdater.service;

import com.resumeupdater.dto.ResumeTemplateDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Service
public class TemplateService {

    private static final Logger logger = LoggerFactory.getLogger(TemplateService.class);

    /**
     * Get all available resume templates
     */
    public List<ResumeTemplateDto> getAvailableTemplates() {
        logger.info("Fetching available resume templates");

        return Arrays.asList(
            new ResumeTemplateDto(
                "minimalist",
                "Minimalist",
                "Clean and simple design focusing on content with elegant spacing and typography",
                "/assets/templates/minimalist-preview.png"
            ),
            new ResumeTemplateDto(
                "modern-professional",
                "Modern Professional",
                "Contemporary design with accent colors, visual hierarchy, and modern layout elements",
                "/assets/templates/modern-professional-preview.png"
            ),
            new ResumeTemplateDto(
                "traditional",
                "Traditional",
                "Classic format preferred by traditional industries and conservative recruiters",
                "/assets/templates/traditional-preview.png"
            ),
            new ResumeTemplateDto(
                "creative",
                "Creative",
                "Innovative design with unique layout elements for creative professionals",
                "/assets/templates/creative-preview.png"
            ),
            new ResumeTemplateDto(
                "executive",
                "Executive",
                "Professional executive format with emphasis on leadership and achievements",
                "/assets/templates/executive-preview.png"
            )
        );
    }

    /**
     * Get template preview HTML
     */
    public String getTemplatePreview(String templateId) throws IOException {
        logger.info("Getting preview for template: {}", templateId);

        try {
            ClassPathResource resource = new ClassPathResource("templates/" + templateId + ".ftl");
            if (!resource.exists()) {
                throw new IOException("Template not found: " + templateId);
            }

            String templateContent = StreamUtils.copyToString(
                resource.getInputStream(), 
                StandardCharsets.UTF_8
            );

            // Return a simplified preview version
            return generatePreviewHtml(templateId, templateContent);

        } catch (IOException e) {
            logger.error("Error loading template preview for: " + templateId, e);
            throw e;
        }
    }

    /**
     * Check if template exists
     */
    public boolean templateExists(String templateId) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/" + templateId + ".ftl");
            return resource.exists();
        } catch (Exception e) {
            logger.error("Error checking template existence: " + templateId, e);
            return false;
        }
    }

    /**
     * Get template metadata
     */
    public ResumeTemplateDto getTemplateById(String templateId) {
        return getAvailableTemplates().stream()
            .filter(template -> template.getId().equals(templateId))
            .findFirst()
            .orElse(null);
    }

    private String generatePreviewHtml(String templateId, String templateContent) {
        // Generate a preview version with sample data
        return "<!DOCTYPE html>" +
               "<html><head><title>Template Preview</title>" +
               "<style>body { font-family: Arial, sans-serif; margin: 20px; }</style>" +
               "</head><body>" +
               "<h2>Template: " + templateId + "</h2>" +
               "<p>This is a preview of the " + templateId + " template.</p>" +
               "<div style='border: 1px solid #ccc; padding: 20px; margin: 10px 0;'>" +
               "Sample resume content would appear here..." +
               "</div>" +
               "</body></html>";
    }
}
