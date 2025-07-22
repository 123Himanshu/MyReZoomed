package com.resumeupdater.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class AtsScoreDto {

    @JsonProperty("score")
    private Integer score;

    @JsonProperty("feedback")
    private List<AtsFeedbackDto> feedback;

    @JsonProperty("suggestions")
    private List<String> suggestions;

    @JsonProperty("missingSkills")
    private List<String> missingSkills;

    @JsonProperty("matchPercentage")
    private Integer matchPercentage;

    // Constructors
    public AtsScoreDto() {}

    public AtsScoreDto(Integer score, List<String> suggestions) {
        this.score = score;
        this.suggestions = suggestions;
    }

    // Getters and Setters
    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public List<AtsFeedbackDto> getFeedback() {
        return feedback;
    }

    public void setFeedback(List<AtsFeedbackDto> feedback) {
        this.feedback = feedback;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public Integer getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(Integer matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    @Override
    public String toString() {
        return "AtsScoreDto{" +
                "score=" + score +
                ", feedback=" + feedback +
                ", suggestions=" + suggestions +
                ", missingSkills=" + missingSkills +
                ", matchPercentage=" + matchPercentage +
                '}';
    }
}
