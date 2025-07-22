package com.resumeupdater.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class AtsScoreRequestDto {

    @NotNull
    @Valid
    @JsonProperty("resumeData")
    private ResumeDataDto resumeData;

    @JsonProperty("jobDescription")
    private String jobDescription;

    // Constructors
    public AtsScoreRequestDto() {}

    public AtsScoreRequestDto(ResumeDataDto resumeData, String jobDescription) {
        this.resumeData = resumeData;
        this.jobDescription = jobDescription;
    }

    // Getters and Setters
    public ResumeDataDto getResumeData() {
        return resumeData;
    }

    public void setResumeData(ResumeDataDto resumeData) {
        this.resumeData = resumeData;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    @Override
    public String toString() {
        return "AtsScoreRequestDto{" +
                "resumeData=" + resumeData +
                ", jobDescription='" + jobDescription + '\'' +
                '}';
    }
}
