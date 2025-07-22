package com.resumeupdater.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeupdater.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResumeService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeService.class);

    @Value("${python.api.url:http://localhost:8001}")
    private String pythonApiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ResumeService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Extract resume content by calling Python FastAPI service
     */
    public ResumeDataDto extractResumeContent(MultipartFile file) throws Exception {
        logger.info("Extracting resume content from file: {}", file.getOriginalFilename());

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

            // Call Python API
            ResponseEntity<Map> response = restTemplate.postForEntity(
                pythonApiUrl + "/extract", 
                requestEntity, 
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return mapToResumeDataDto(response.getBody());
            } else {
                throw new RuntimeException("Failed to extract resume content from Python API");
            }

        } catch (Exception e) {
            logger.error("Error extracting resume content", e);
            throw new Exception("Failed to extract resume content: " + e.getMessage());
        }
    }

    /**
     * Enhance resume using AI via Python FastAPI service
     */
    public EnhancedResumeDto enhanceResume(ResumeDataDto resumeData) throws Exception {
        logger.info("Enhancing resume for: {}", resumeData.getPersonalInfo().getFullName());

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<ResumeDataDto> requestEntity = new HttpEntity<>(resumeData, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                pythonApiUrl + "/enhance",
                requestEntity,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return mapToEnhancedResumeDto(response.getBody());
            } else {
                throw new RuntimeException("Failed to enhance resume via Python API");
            }

        } catch (Exception e) {
            logger.error("Error enhancing resume", e);
            throw new Exception("Failed to enhance resume: " + e.getMessage());
        }
    }

    /**
     * Calculate ATS score via Python FastAPI service
     */
    public AtsScoreDto calculateAtsScore(ResumeDataDto resumeData, String jobDescription) throws Exception {
        logger.info("Calculating ATS score");

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("resume_data", resumeData);
            requestBody.put("job_description", jobDescription);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                pythonApiUrl + "/ats-score",
                requestEntity,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return mapToAtsScoreDto(response.getBody());
            } else {
                throw new RuntimeException("Failed to calculate ATS score via Python API");
            }

        } catch (Exception e) {
            logger.error("Error calculating ATS score", e);
            throw new Exception("Failed to calculate ATS score: " + e.getMessage());
        }
    }

    /**
     * Get real-time feedback via Python FastAPI service
     */
    public FeedbackResponseDto getFeedback(ResumeDataDto resumeData) throws Exception {
        logger.info("Getting real-time feedback");

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<ResumeDataDto> requestEntity = new HttpEntity<>(resumeData, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                pythonApiUrl + "/feedback",
                requestEntity,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return mapToFeedbackResponseDto(response.getBody());
            } else {
                throw new RuntimeException("Failed to get feedback via Python API");
            }

        } catch (Exception e) {
            logger.error("Error getting feedback", e);
            throw new Exception("Failed to get feedback: " + e.getMessage());
        }
    }

    // Mapping methods
    private ResumeDataDto mapToResumeDataDto(Map<String, Object> data) {
        try {
            return objectMapper.convertValue(data, ResumeDataDto.class);
        } catch (Exception e) {
            logger.error("Error mapping to ResumeDataDto", e);
            throw new RuntimeException("Failed to map resume data");
        }
    }

    private EnhancedResumeDto mapToEnhancedResumeDto(Map<String, Object> data) {
        try {
            EnhancedResumeDto dto = new EnhancedResumeDto();
            
            if (data.containsKey("originalResume")) {
                dto.setOriginalResume(objectMapper.convertValue(data.get("originalResume"), ResumeDataDto.class));
            }
            
            if (data.containsKey("enhancedResume")) {
                dto.setEnhancedResume(objectMapper.convertValue(data.get("enhancedResume"), ResumeDataDto.class));
            }
            
            if (data.containsKey("improvements")) {
                dto.setImprovements((List<String>) data.get("improvements"));
            }
            
            if (data.containsKey("aiSuggestions")) {
                dto.setAiSuggestions((List<String>) data.get("aiSuggestions"));
            }
            
            return dto;
        } catch (Exception e) {
            logger.error("Error mapping to EnhancedResumeDto", e);
            throw new RuntimeException("Failed to map enhanced resume data");
        }
    }

    private AtsScoreDto mapToAtsScoreDto(Map<String, Object> data) {
        try {
            AtsScoreDto dto = new AtsScoreDto();
            
            if (data.containsKey("atsScore")) {
                dto.setScore(((Number) data.get("atsScore")).intValue());
            }
            
            if (data.containsKey("suggestions")) {
                dto.setSuggestions((List<String>) data.get("suggestions"));
            }
            
            if (data.containsKey("missingSkills")) {
                dto.setMissingSkills((List<String>) data.get("missingSkills"));
            }
            
            if (data.containsKey("matchPercentage")) {
                dto.setMatchPercentage(((Number) data.get("matchPercentage")).intValue());
            }
            
            return dto;
        } catch (Exception e) {
            logger.error("Error mapping to AtsScoreDto", e);
            throw new RuntimeException("Failed to map ATS score data");
        }
    }

    private FeedbackResponseDto mapToFeedbackResponseDto(Map<String, Object> data) {
        try {
            FeedbackResponseDto dto = new FeedbackResponseDto();
            
            if (data.containsKey("ats_score")) {
                dto.setAtsScore(((Number) data.get("ats_score")).intValue());
            }
            
            if (data.containsKey("suggestions")) {
                dto.setSuggestions((List<String>) data.get("suggestions"));
            }
            
            if (data.containsKey("completeness")) {
                Map<String, Boolean> completeness = (Map<String, Boolean>) data.get("completeness");
                dto.setCompleteness(completeness);
            }
            
            return dto;
        } catch (Exception e) {
            logger.error("Error mapping to FeedbackResponseDto", e);
            throw new RuntimeException("Failed to map feedback data");
        }
    }

    /**
     * Validate resume data
     */
    public boolean validateResumeData(ResumeDataDto resumeData) {
        logger.info("Validating resume data");
        
        if (resumeData == null) {
            logger.warn("Resume data is null");
            return false;
        }
        
        if (resumeData.getPersonalInfo() == null) {
            logger.warn("Personal info is missing");
            return false;
        }
        
        if (resumeData.getPersonalInfo().getFullName() == null || 
            resumeData.getPersonalInfo().getFullName().trim().isEmpty()) {
            logger.warn("Full name is missing");
            return false;
        }
        
        if (resumeData.getPersonalInfo().getEmail() == null || 
            resumeData.getPersonalInfo().getEmail().trim().isEmpty()) {
            logger.warn("Email is missing");
            return false;
        }
        
        logger.info("Resume data validation passed");
        return true;
    }

    /**
     * Clean and normalize resume data
     */
    public ResumeDataDto cleanResumeData(ResumeDataDto resumeData) {
        logger.info("Cleaning resume data");
        
        if (resumeData == null) {
            return resumeData;
        }
        
        // Clean personal info
        if (resumeData.getPersonalInfo() != null) {
            if (resumeData.getPersonalInfo().getFullName() != null) {
                resumeData.getPersonalInfo().setFullName(
                    resumeData.getPersonalInfo().getFullName().trim()
                );
            }
            if (resumeData.getPersonalInfo().getEmail() != null) {
                resumeData.getPersonalInfo().setEmail(
                    resumeData.getPersonalInfo().getEmail().trim().toLowerCase()
                );
            }
        }
        
        // Clean summary
        if (resumeData.getSummary() != null) {
            resumeData.setSummary(resumeData.getSummary().trim());
        }
        
        // Clean skills
        if (resumeData.getSkills() != null) {
            resumeData.getSkills().replaceAll(String::trim);
            resumeData.getSkills().removeIf(skill -> skill.isEmpty());
        }
        
        logger.info("Resume data cleaning completed");
        return resumeData;
    }
}
