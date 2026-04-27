package com.example.demo.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String filePath;

    @ManyToOne
    @JoinColumn(name = "banque_id")
    private Banque banque;

    @ManyToOne
    @JoinColumn(name = "domaine_id")
    private Domaine domaine;

    @ManyToOne
    @JoinColumn(name = "code_id")
    private Code code;

    private LocalDateTime dateDocument;
    private LocalDateTime uploadedAt;

    // GETTERS / SETTERS CORRECTS

    public Long getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Banque getBanque() {
        return banque;
    }

    public void setBanque(Banque banque) {
        this.banque = banque;
    }

    public Domaine getDomaine() {
        return domaine;
    }

    public void setDomaine(Domaine domaine) {
        this.domaine = domaine;
    }

    public Code getCode() {
        return code;
    }

    public void setCode(Code code) {
        this.code = code;
    }

    public LocalDateTime getDateDocument() {
        return dateDocument;
    }

    public void setDateDocument(LocalDateTime dateDocument) {
        this.dateDocument = dateDocument;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}