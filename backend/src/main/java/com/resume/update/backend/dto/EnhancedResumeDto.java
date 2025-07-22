package com.resumeupdater.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class EnhancedResumeDto {

    @JsonProperty("originalResume")
    private ResumeDataDto originalResume;

    @JsonProperty("enhancedResume")
    private ResumeDataDto enhancedResume;

    @JsonProperty("improvements")
    private List<String> improvements;

    @JsonProperty("aiSuggestions")
    private List<String> aiSuggestions;

    // Constructors
    public EnhancedResumeDto() {}

    public EnhancedResumeDto(ResumeDataDto originalResume, ResumeDataDto enhancedResume,
                            List<String> improvements, List<String> aiSuggestions) {
        this.originalResume = originalResume;
        this.enhancedResume = enhancedResume;
        this.improvements = improvements;
        this.aiSuggestions = aiSuggestions;
    }

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

    @Override
    public String toString() {
        return "EnhancedResumeDto{" +
                "originalResume=" + originalResume +
                ", enhancedResume=" + enhancedResume +
                ", improvements=" + improvements +
                ", aiSuggestions=" + aiSuggestions +
                '}';
    }
}
