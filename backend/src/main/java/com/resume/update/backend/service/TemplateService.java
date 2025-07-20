package com.resumeupdater.service;

import com.resumeupdater.dto.ResumeTemplateDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class TemplateService {

    private static final Logger logger = LoggerFactory.getLogger(TemplateService.class);

    /**
     * Get list of available resume templates
     */
    public List<ResumeTemplateDto> getAvailableTemplates() {
        logger.info("Retrieving available resume templates");

        try {
            List<ResumeTemplateDto> templates = new ArrayList<>();
            
            // Scan for .ftl files in templates directory
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath:templates/*.ftl");
            
            for (Resource resource : resources) {
                String filename = resource.getFilename();
                if (filename != null && filename.endsWith(".ftl")) {
                    String templateId = filename.substring(0, filename.length() - 4); // Remove .ftl extension
                    ResumeTemplateDto template = createTemplateDto(templateId);
                    templates.add(template);
                }
            }
            
            // If no templates found, return predefined templates
            if (templates.isEmpty()) {
                templates = getPredefinedTemplates();
            }
            
            logger.info("Found {} available templates", templates.size());
            return templates;
        } catch (Exception e) {
            logger.error("Error retrieving templates", e);
            // Return predefined templates as fallback
            return getPredefinedTemplates();
        }
    }

    /**
     * Create template DTO from template ID
     */
    private ResumeTemplateDto createTemplateDto(String templateId) {
        ResumeTemplateDto template = new ResumeTemplateDto();
        template.setId(templateId);
        
        // Set template properties based on ID
        switch (templateId) {
            case "modern-professional":
                template.setName("Modern Professional");
                template.setDescription("Clean and contemporary design perfect for tech and business professionals");
                template.setCategory("modern");
                break;
            case "minimalist":
                template.setName("Minimalist");
                template.setDescription("Simple and elegant layout that focuses on content");
                template.setCategory("modern");
                break;
            case "traditional":
                template.setName("Traditional");
                template.setDescription("Timeless design suitable for conservative industries");
                template.setCategory("classic");
                break;
            case "executive":
                template.setName("Executive");
                template.setDescription("Professional layout for senior-level positions");
                template.setCategory("classic");
                break;
            case "creative-designer":
                template.setName("Creative Designer");
                template.setDescription("Creative layout perfect for design and marketing roles");
                template.setCategory("creative");
                break;
            case "artistic":
                template.setName("Artistic");
                template.setDescription("Bold and unique design for creative professionals");
                template.setCategory("creative");
                break;
            default:
                template.setName(templateId.replace("-", " ").toUpperCase());
                template.setDescription("Professional resume template");
                template.setCategory("modern");
        }
        
        template.setPreviewUrl("/api/templates/" + templateId + "/preview");
        
        return template;
    }

    /**
     * Get predefined templates when no .ftl files are found
     */
    private List<ResumeTemplateDto> getPredefinedTemplates() {
        return Arrays.asList(
            createTemplateDto("modern-professional"),
            createTemplateDto("minimalist"),
            createTemplateDto("traditional"),
            createTemplateDto("executive"),
            createTemplateDto("creative-designer"),
            createTemplateDto("artistic")
        );
    }
}
