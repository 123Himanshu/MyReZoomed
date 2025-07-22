package com.resumeupdater.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class ResumeTemplateDto {

    @NotBlank(message = "Template ID is required")
    @JsonProperty("id")
    private String id;

    @NotBlank(message = "Template name is required")
    @JsonProperty("name")
    private String name;

    @JsonProperty("description")
    private String description;

    @JsonProperty("preview")
    private String preview;

    // Constructors
    public ResumeTemplateDto() {}

    public ResumeTemplateDto(String id, String name, String description, String preview) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.preview = preview;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPreview() {
        return preview;
    }

    public void setPreview(String preview) {
        this.preview = preview;
    }

    @Override
    public String toString() {
        return "ResumeTemplateDto{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", preview='" + preview + '\'' +
                '}';
    }
}
