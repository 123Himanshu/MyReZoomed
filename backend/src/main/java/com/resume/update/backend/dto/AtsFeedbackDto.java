package com.resumeupdater.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AtsFeedbackDto {

    @JsonProperty("category")
    private String category;

    @JsonProperty("score")
    private Integer score;

    @JsonProperty("message")
    private String message;

    @JsonProperty("severity")
    private String severity;

    // Constructors
    public AtsFeedbackDto() {}

    public AtsFeedbackDto(String category, Integer score, String message, String severity) {
        this.category = category;
        this.score = score;
        this.message = message;
        this.severity = severity;
    }

    // Getters and Setters
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    @Override
    public String toString() {
        return "AtsFeedbackDto{" +
                "category='" + category + '\'' +
                ", score=" + score +
                ", message='" + message + '\'' +
                ", severity='" + severity + '\'' +
                '}';
    }
}
