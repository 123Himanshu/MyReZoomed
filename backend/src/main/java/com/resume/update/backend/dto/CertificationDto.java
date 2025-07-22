package com.resumeupdater.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class CertificationDto {

    @JsonProperty("id")
    private String id;

    @NotBlank(message = "Certification name is required")
    @JsonProperty("name")
    private String name;

    @NotBlank(message = "Issuer is required")
    @JsonProperty("issuer")
    private String issuer;

    @JsonProperty("date")
    private String date;

    @JsonProperty("url")
    private String url;

    // Constructors
    public CertificationDto() {}

    public CertificationDto(String name, String issuer) {
        this.name = name;
        this.issuer = issuer;
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

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public String toString() {
        return "CertificationDto{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", issuer='" + issuer + '\'' +
                ", date='" + date + '\'' +
                ", url='" + url + '\'' +
                '}';
    }
}
