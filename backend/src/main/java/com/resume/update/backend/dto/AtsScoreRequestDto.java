package com.resumeupdater.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class AtsScoreRequestDto {
    
    @NotNull
    @Valid
    private ResumeDataDto resumeData;
    
    private String jobDescription;

    // Constructors
    public AtsScoreRequestDto() {}

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
}
