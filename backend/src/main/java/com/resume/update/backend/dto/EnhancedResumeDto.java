package com.resumeupdater.dto;

import java.util.List;

public class EnhancedResumeDto {
    
    private ResumeDataDto originalResume;
    private ResumeDataDto enhancedResume;
    private List<String> improvements;
    private List<String> aiSuggestions;

    // Constructors
    public EnhancedResumeDto() {}

    // Getters and Setters
    public ResumeDataDto getOriginalResume() {
        return originalResume;
    }

    public void setOriginalResume(ResumeDataDto originalResume) {
        this.originalResume = originalResume;
    }

    public ResumeDataDto getEnhancedResume() {
        return enhancedResume;
    }

    public void setEnhancedResume(ResumeDataDto enhancedResume) {
        this.enhancedResume = enhancedResume;
    }

    public List<String> getImprovements() {
        return improvements;
    }

    public void setImprovements(List<String> improvements) {
        this.improvements = improvements;
    }

    public List<String> getAiSuggestions() {
        return aiSuggestions;
    }

    public void setAiSuggestions(List<String> aiSuggestions) {
        this.aiSuggestions = aiSuggestions;
    }
}
