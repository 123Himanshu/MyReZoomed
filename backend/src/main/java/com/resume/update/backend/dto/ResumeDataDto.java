package com.resumeupdater.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class ResumeDataDto {
    
    @NotNull
    @Valid
    private PersonalInfoDto personalInfo;
    
    private String summary;
    private List<String> skills;
    private List<ExperienceDto> experience;
    private List<EducationDto> education;
    private String rawText;

    // Constructors
    public ResumeDataDto() {}

    // Getters and Setters
    public PersonalInfoDto getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfoDto personalInfo) {
        this.personalInfo = personalInfo;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<ExperienceDto> getExperience() {
        return experience;
    }

    public void setExperience(List<ExperienceDto> experience) {
        this.experience = experience;
    }

    public List<EducationDto> getEducation() {
        return education;
    }

    public void setEducation(List<EducationDto> education) {
        this.education = education;
    }

    public String getRawText() {
        return rawText;
    }

    public void setRawText(String rawText) {
        this.rawText = rawText;
    }
}
