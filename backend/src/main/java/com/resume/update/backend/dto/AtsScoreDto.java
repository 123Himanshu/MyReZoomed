package com.resumeupdater.dto;

import java.util.List;

public class AtsScoreDto {
    
    private int score;
    private List<AtsFeedbackDto> feedback;
    private List<String> suggestions;

    // Constructors
    public AtsScoreDto() {}

    // Getters and Setters
    public int getScore() {
        return score;
    }

    public void setScore(int score) {
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
}
