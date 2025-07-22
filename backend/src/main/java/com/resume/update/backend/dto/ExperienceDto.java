package com.resumeupdater.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class ExperienceDto {

    @JsonProperty("id")
    private String id;

    @NotBlank(message = "Company name is required")
    @JsonProperty("company")
    private String company;

    @JsonProperty("position")
    private String position;

    @JsonProperty("jobTitle")
    private String jobTitle;

    @NotBlank(message = "Start date is required")
    @JsonProperty("startDate")
    private String startDate;

    @JsonProperty("endDate")
    private String endDate;

    @JsonProperty("current")
    private Boolean current = false;

    @NotBlank(message = "Job description is required")
    @JsonProperty("description")
    private String description;

    @JsonProperty("achievements")
    private List<String> achievements;

    // Constructors
    public ExperienceDto() {}

    public ExperienceDto(String company, String position, String startDate, String description) {
        this.company = company;
        this.position = position;
        this.startDate = startDate;
        this.description = description;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Boolean getCurrent() {
        return current;
    }

    public void setCurrent(Boolean current) {
        this.current = current;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getAchievements() {
        return achievements;
    }

    public void setAchievements(List<String> achievements) {
        this.achievements = achievements;
    }

    @Override
    public String toString() {
        return "ExperienceDto{" +
                "id='" + id + '\'' +
                ", company='" + company + '\'' +
                ", position='" + position + '\'' +
                ", jobTitle='" + jobTitle + '\'' +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", current=" + current +
                ", description='" + description + '\'' +
                ", achievements=" + achievements +
                '}';
    }
}
