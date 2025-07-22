package com.resumeupdater.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class PersonalInfoDto {

    @NotBlank(message = "Full name is required")
    @JsonProperty("fullName")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @JsonProperty("email")
    private String email;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("address")
    private String address;

    @JsonProperty("linkedIn")
    private String linkedIn;

    @JsonProperty("website")
    private String website;

    @JsonProperty("github")
    private String github;

    @JsonProperty("naukri")
    private String naukri;

    @JsonProperty("portfolio")
    private String portfolio;

    // Constructors
    public PersonalInfoDto() {}

    public PersonalInfoDto(String fullName, String email) {
        this.fullName = fullName;
        this.email = email;
    }

    // Getters and Setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLinkedIn() {
        return linkedIn;
    }

    public void setLinkedIn(String linkedIn) {
        this.linkedIn = linkedIn;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getGithub() {
        return github;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public String getNaukri() {
        return naukri;
    }

    public void setNaukri(String naukri) {
        this.naukri = naukri;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    @Override
    public String toString() {
        return "PersonalInfoDto{" +
                "fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", address='" + address + '\'' +
                ", linkedIn='" + linkedIn + '\'' +
                ", website='" + website + '\'' +
                ", github='" + github + '\'' +
                ", naukri='" + naukri + '\'' +
                ", portfolio='" + portfolio + '\'' +
                '}';
    }
}
