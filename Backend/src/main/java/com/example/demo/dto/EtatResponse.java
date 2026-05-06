package com.example.demo.dto;

public class EtatResponse {

    private Long id;
    private String code;
    private String nom;
    private String description;
    private String frequence;
    private String uploadPath;
    private String domaineName;

    public EtatResponse(Long id, String code, String nom, String description,
                        String frequence, String uploadPath, String domaineName) {
        this.id = id;
        this.code = code;
        this.nom = nom;
        this.description = description;
        this.frequence = frequence;
        this.uploadPath = uploadPath;
        this.domaineName = domaineName;
    }

    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getNom() { return nom; }
    public String getDescription() { return description; }
    public String getFrequence() { return frequence; }
    public String getUploadPath() { return uploadPath; }
    public String getDomaineName() { return domaineName; }
}