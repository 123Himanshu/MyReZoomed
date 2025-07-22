package com.resumeupdater.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PdfGenerationRequestDto {

    @NotNull
    @Valid
    @JsonProperty("resumeData")
    private ResumeDataDto resumeData;

    @NotBlank(message = "Template ID is required")
    @JsonProperty("templateId")
    private String templateId;

    // Constructors
    public PdfGenerationRequestDto() {}

    public PdfGenerationRequestDto(ResumeDataDto resumeData, String templateId) {
        this.resumeData = resumeData;
        this.templateId = templateId;
    }

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

    @Override
    public String toString() {
        return "PdfGenerationRequestDto{" +
                "resumeData=" + resumeData +
                ", templateId='" + templateId + '\'' +
                '}';
    }
}
