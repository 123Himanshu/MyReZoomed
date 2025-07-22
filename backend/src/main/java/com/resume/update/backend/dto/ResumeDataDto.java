package com.resumeupdater.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ResumeDataDto {

    @NotNull
    @Valid
    @JsonProperty("personalInfo")
    private PersonalInfoDto personalInfo;

    @JsonProperty("summary")
    private String summary;

    @JsonProperty("skills")
    private List<String> skills;

    @JsonProperty("experience")
    private List<ExperienceDto> experience;

    @JsonProperty("education")
    private List<EducationDto> education;

    @JsonProperty("projects")
    private List<ProjectDto> projects;

    @JsonProperty("certifications")
    private List<CertificationDto> certifications;

    @JsonProperty("languages")
    private List<LanguageDto> languages;

    @JsonProperty("unexpectedFields")
    private Map<String, Object> unexpectedFields;

    @JsonProperty("rawText")
    private String rawText;

    @JsonProperty("jobDescription")
    private String jobDescription;

    // Constructors
    public ResumeDataDto() {}

    public ResumeDataDto(PersonalInfoDto personalInfo, String summary, List<String> skills,
                        List<ExperienceDto> experience, List<EducationDto> education) {
        this.personalInfo = personalInfo;
        this.summary = summary;
        this.skills = skills;
        this.experience = experience;
        this.education = education;
    }

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

    public List<ProjectDto> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectDto> projects) {
        this.projects = projects;
    }

    public List<CertificationDto> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<CertificationDto> certifications) {
        this.certifications = certifications;
    }

    public List<LanguageDto> getLanguages() {
        return languages;
    }

    public void setLanguages(List<LanguageDto> languages) {
        this.languages = languages;
    }

    public Map<String, Object> getUnexpectedFields() {
        return unexpectedFields;
    }

    public void setUnexpectedFields(Map<String, Object> unexpectedFields) {
        this.unexpectedFields = unexpectedFields;
    }

    public String getRawText() {
        return rawText;
    }

    public void setRawText(String rawText) {
        this.rawText = rawText;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    @Override
    public String toString() {
        return "ResumeDataDto{" +
                "personalInfo=" + personalInfo +
                ", summary='" + summary + '\'' +
                ", skills=" + skills +
                ", experience=" + experience +
                ", education=" + education +
                ", projects=" + projects +
                ", certifications=" + certifications +
                ", languages=" + languages +
                '}';
    }
}
