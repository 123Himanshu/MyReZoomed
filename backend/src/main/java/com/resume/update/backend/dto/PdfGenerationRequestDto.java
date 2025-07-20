package com.resumeupdater.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PdfGenerationRequestDto {
    
    @NotNull
    @Valid
    private ResumeDataDto resumeData;
    
    @NotBlank(message = "Template ID is required")
    private String templateId;

    // Constructors
    public PdfGenerationRequestDto() {}

    // Getters and Setters
    public ResumeDataDto getResumeData() {
        return resumeData;
    }

    public void setResumeData(ResumeDataDto resumeData) {
        this.resumeData = resumeData;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }
}
