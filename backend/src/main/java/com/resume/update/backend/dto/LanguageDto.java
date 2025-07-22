package com.resumeupdater.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class LanguageDto {

    @NotBlank(message = "Language name is required")
    @JsonProperty("name")
    private String name;

    @NotBlank(message = "Proficiency level is required")
    @JsonProperty("proficiency")
    private String proficiency;

    // Constructors
    public LanguageDto() {}

    public LanguageDto(String name, String proficiency) {
        this.name = name;
        this.proficiency = proficiency;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProficiency() {
        return proficiency;
    }

    public void setProficiency(String proficiency) {
        this.proficiency = proficiency;
    }

    @Override
    public String toString() {
        return "LanguageDto{" +
                "name='" + name + '\'' +
                ", proficiency='" + proficiency + '\'' +
                '}';
    }
}
