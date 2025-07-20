package com.resumeupdater.service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.resumeupdater.dto.ResumeDataDto;
import freemarker.template.Configuration;
import freemarker.template.Template;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

@Service
public class PdfGenerator {

    private static final Logger logger = LoggerFactory.getLogger(PdfGenerator.class);

    @Autowired
    private Configuration freemarkerConfig;

    /**
     * Generate PDF from resume data using FreeMarker template
     */
    public byte[] generatePdf(ResumeDataDto resumeData, String templateId) throws Exception {
        logger.info("Generating PDF using template: {}", templateId);

        try {
            // Load and process FreeMarker template
            String htmlContent = processTemplate(resumeData, templateId);
            
            // Convert HTML to PDF using OpenHTMLtoPDF
            return convertHtmlToPdf(htmlContent);
        } catch (Exception e) {
            logger.error("Error generating PDF", e);
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    /**
     * Process FreeMarker template with resume data
     */
    private String processTemplate(ResumeDataDto resumeData, String templateId) throws Exception {
        logger.debug("Processing FreeMarker template: {}", templateId);

        // Prepare template data model
        Map<String, Object> dataModel = createDataModel(resumeData);

        // Load template
        String templateName = templateId + ".ftl";
        Template template = freemarkerConfig.getTemplate(templateName);

        // Process template
        StringWriter stringWriter = new StringWriter();
        template.process(dataModel, stringWriter);

        String htmlContent = stringWriter.toString();
        logger.debug("Generated HTML content length: {} characters", htmlContent.length());

        return htmlContent;
    }

    /**
     * Convert HTML content to PDF using OpenHTMLtoPDF
     */
    private byte[] convertHtmlToPdf(String htmlContent) throws Exception {
        logger.debug("Converting HTML to PDF");

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(outputStream);
            builder.run();

            byte[] pdfBytes = outputStream.toByteArray();
            logger.info("Successfully generated PDF ({} bytes)", pdfBytes.length);

            return pdfBytes;
        }
    }

    /**
     * Create FreeMarker data model from resume data
     */
    private Map<String, Object> createDataModel(ResumeDataDto resumeData) {
        Map<String, Object> dataModel = new HashMap<>();
        
        dataModel.put("personalInfo", resumeData.getPersonalInfo());
        dataModel.put("summary", resumeData.getSummary());
        dataModel.put("skills", resumeData.getSkills());
        dataModel.put("experience", resumeData.getExperience());
        dataModel.put("education", resumeData.getEducation());
        
        // Add utility functions
        dataModel.put("currentYear", java.time.Year.now().getValue());
        dataModel.put("generatedDate", java.time.LocalDate.now().toString());
        
        return dataModel;
    }
}
