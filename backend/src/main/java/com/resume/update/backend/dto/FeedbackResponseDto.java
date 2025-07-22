package com.resumeupdater.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

public class FeedbackResponseDto {

    @JsonProperty("atsScore")
    private Integer atsScore;

    @JsonProperty("suggestions")
    private List<String> suggestions;

    @JsonProperty("completeness")
    private Map<String, Boolean> completeness;

    @JsonProperty("atsFeedback")
    private List<String> atsFeedback;

    // Constructors
    public FeedbackResponseDto() {}

    public FeedbackResponseDto(Integer atsScore, List<String> suggestions, Map<String, Boolean> completeness) {
        this.atsScore = atsScore;
        this.suggestions = suggestions;
        this.completeness = completeness;
    }

    // Getters and Setters
    public Integer getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(Integer atsScore) {
        this.atsScore = atsScore;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public Map<String, Boolean> getCompleteness() {
        return completeness;
    }

    public void setCompleteness(Map<String, Boolean> completeness) {
        this.completeness = completeness;
    }

    public List<String> getAtsFeedback() {
        return atsFeedback;
    }

    public void setAtsFeedback(List<String> atsFeedback) {
        this.atsFeedback = atsFeedback;
    }

    @Override
    public String toString() {
        return "FeedbackResponseDto{" +
                "atsScore=" + atsScore +
                ", suggestions=" + suggestions +
                ", completeness=" + completeness +
                ", atsFeedback=" + atsFeedback +
                '}';
    }
}
