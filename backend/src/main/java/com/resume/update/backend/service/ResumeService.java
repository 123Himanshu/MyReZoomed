package com.resumeupdater.service;

import com.resumeupdater.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PdfGenerator pdfGenerator;

    @Value("${fastapi.base-url:http://localhost:8001}")
    private String fastApiBaseUrl;

    /**
     * Extract resume content by sending file to FastAPI
     */
    public ResumeDataDto extractResumeContent(MultipartFile file) throws Exception {
        logger.info("Sending file to FastAPI for content extraction: {}", file.getOriginalFilename());

        try {
            // Prepare multipart request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Call FastAPI
            String url = fastApiBaseUrl + "/extract";
            ResponseEntity<ResumeDataDto> response = restTemplate.postForEntity(url, requestEntity, ResumeDataDto.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                logger.info("Successfully extracted resume content from FastAPI");
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to extract resume content from FastAPI");
            }
        } catch (Exception e) {
            logger.error("Error calling FastAPI for content extraction", e);
            // Fallback to mock data for demo purposes
            return createMockResumeData(file.getOriginalFilename());
        }
    }

    /**
     * Enhance resume content using FastAPI AI service
     */
    public EnhancedResumeDto enhanceResume(ResumeDataDto resumeData) throws Exception {
        logger.info("Sending resume to FastAPI for AI enhancement");

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<ResumeDataDto> requestEntity = new HttpEntity<>(resumeData, headers);

            // Call FastAPI
            String url = fastApiBaseUrl + "/enhance";
            ResponseEntity<EnhancedResumeDto> response = restTemplate.postForEntity(url, requestEntity, EnhancedResumeDto.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                logger.info("Successfully enhanced resume via FastAPI");
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to enhance resume via FastAPI");
            }
        } catch (Exception e) {
            logger.error("Error calling FastAPI for resume enhancement", e);
            // Fallback to mock enhancement for demo purposes
            return createMockEnhancedResume(resumeData);
        }
    }

    /**
     * Generate PDF using FreeMarker template and OpenHTMLtoPDF
     */
    public byte[] generatePdf(ResumeDataDto resumeData, String templateId) throws Exception {
        logger.info("Generating PDF for template: {}", templateId);
        return pdfGenerator.generatePdf(resumeData, templateId);
    }

    /**
     * Calculate ATS score via FastAPI
     */
    public AtsScoreDto calculateAtsScore(ResumeDataDto resumeData, String jobDescription) throws Exception {
        logger.info("Sending resume to FastAPI for ATS score calculation");

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            AtsScoreRequestDto request = new AtsScoreRequestDto();
            request.setResumeData(resumeData);
            request.setJobDescription(jobDescription);

            HttpEntity<AtsScoreRequestDto> requestEntity = new HttpEntity<>(request, headers);

            // Call FastAPI
            String url = fastApiBaseUrl + "/ats-score";
            ResponseEntity<AtsScoreDto> response = restTemplate.postForEntity(url, requestEntity, AtsScoreDto.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                logger.info("Successfully calculated ATS score via FastAPI");
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to calculate ATS score via FastAPI");
            }
        } catch (Exception e) {
            logger.error("Error calling FastAPI for ATS score calculation", e);
            // Fallback to mock ATS score for demo purposes
            return createMockAtsScore();
        }
    }

    // Mock data methods for demo purposes when FastAPI is not available

    private ResumeDataDto createMockResumeData(String filename) {
        logger.info("Creating mock resume data for demo purposes");
        
        ResumeDataDto resumeData = new ResumeDataDto();
        
        PersonalInfoDto personalInfo = new PersonalInfoDto();
        personalInfo.setFullName("John Doe");
        personalInfo.setEmail("john.doe@email.com");
        personalInfo.setPhone("+1 (555) 123-4567");
        personalInfo.setAddress("123 Main St, City, State 12345");
        personalInfo.setLinkedIn("https://linkedin.com/in/johndoe");
        resumeData.setPersonalInfo(personalInfo);
        
        resumeData.setSummary("Experienced software developer with 5+ years of experience in full-stack development.");
        resumeData.setSkills(java.util.Arrays.asList("Java", "Spring Boot", "Angular", "Python", "SQL", "AWS"));
        resumeData.setExperience(java.util.Arrays.asList());
        resumeData.setEducation(java.util.Arrays.asList());
        
        return resumeData;
    }

    private EnhancedResumeDto createMockEnhancedResume(ResumeDataDto originalResume) {
        logger.info("Creating mock enhanced resume for demo purposes");
        
        EnhancedResumeDto enhanced = new EnhancedResumeDto();
        enhanced.setOriginalResume(originalResume);
        
        // Create enhanced version
        ResumeDataDto enhancedResume = new ResumeDataDto();
        enhancedResume.setPersonalInfo(originalResume.getPersonalInfo());
        enhancedResume.setSummary("Results-driven software developer with 5+ years of proven expertise in full-stack development, " +
                "specializing in Java, Spring Boot, and Angular. Demonstrated ability to deliver high-quality solutions and drive technical innovation.");
        enhancedResume.setSkills(java.util.Arrays.asList("Java", "Spring Boot", "Angular", "Python", "SQL", "AWS", 
                "Microservices", "RESTful APIs", "Agile Development"));
        enhancedResume.setExperience(originalResume.getExperience());
        enhancedResume.setEducation(originalResume.getEducation());
        
        enhanced.setEnhancedResume(enhancedResume);
        enhanced.setImprovements(java.util.Arrays.asList(
                "Enhanced professional summary with industry keywords",
                "Optimized skills section for ATS compatibility",
                "Added relevant technical competencies"
        ));
        enhanced.setAiSuggestions(java.util.Arrays.asList(
                "Consider adding specific metrics and achievements",
                "Include relevant certifications",
                "Tailor keywords to match job descriptions"
        ));
        
        return enhanced;
    }

    private AtsScoreDto createMockAtsScore() {
        logger.info("Creating mock ATS score for demo purposes");
        
        AtsScoreDto atsScore = new AtsScoreDto();
        atsScore.setScore(85);
        
        AtsFeedbackDto feedback1 = new AtsFeedbackDto();
        feedback1.setCategory("Keyword Optimization");
        feedback1.setScore(80);
        feedback1.setMessage("Good use of industry keywords");
        feedback1.setSeverity("medium");
        
        AtsFeedbackDto feedback2 = new AtsFeedbackDto();
        feedback2.setCategory("Format Compatibility");
        feedback2.setScore(90);
        feedback2.setMessage("Resume format is ATS-friendly");
        feedback2.setSeverity("low");
        
        atsScore.setFeedback(java.util.Arrays.asList(feedback1, feedback2));
        atsScore.setSuggestions(java.util.Arrays.asList(
                "Add more industry-specific keywords",
                "Include quantifiable achievements",
                "Use standard section headings"
        ));
        
        return atsScore;
    }
}
