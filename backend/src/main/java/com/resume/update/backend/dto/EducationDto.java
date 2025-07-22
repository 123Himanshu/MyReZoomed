package com.resumeupdater.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class EducationDto {

    @JsonProperty("id")
    private String id;

    @NotBlank(message = "Institution name is required")
    @JsonProperty("institution")
    private String institution;

    @NotBlank(message = "Degree is required")
    @JsonProperty("degree")
    private String degree;

    @JsonProperty("field")
    private String field;

    @JsonProperty("startDate")
    private String startDate;

    @JsonProperty("endDate")
    private String endDate;

    @JsonProperty("year")
    private String year;

    @JsonProperty("gpa")
    private String gpa;

    // Constructors
    public EducationDto() {}

    public EducationDto(String institution, String degree, String field, String endDate) {
        this.institution = institution;
        this.degree = degree;
        this.field = field;
        this.endDate = endDate;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
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

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getGpa() {
        return gpa;
    }

    public void setGpa(String gpa) {
        this.gpa = gpa;
    }

    @Override
    public String toString() {
        return "EducationDto{" +
                "id='" + id + '\'' +
                ", institution='" + institution + '\'' +
                ", degree='" + degree + '\'' +
                ", field='" + field + '\'' +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", year='" + year + '\'' +
                ", gpa='" + gpa + '\'' +
                '}';
    }
}
