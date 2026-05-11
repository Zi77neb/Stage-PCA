package com.example.demo.dto;

import java.time.LocalDateTime;

public class UserDocumentDTO {

    private final Long id;
    private final String fileName;
    private final String etat;
    private final String domaine;
    private final LocalDateTime date;
    private final boolean viewed;
    private final LocalDateTime viewedAt;
    private final boolean old;

    public UserDocumentDTO(Long id, String fileName, String etat, String domaine,
                           LocalDateTime date, boolean viewed,
                           LocalDateTime viewedAt, boolean old) {
        this.id = id;
        this.fileName = fileName;
        this.etat = etat;
        this.domaine = domaine;
        this.date = date;
        this.viewed = viewed;
        this.viewedAt = viewedAt;
        this.old = old;
    }

    public Long getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public String getEtat() {
        return etat;
    }

    public String getDomaine() {
        return domaine;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public boolean isViewed() {
        return viewed;
    }

    public LocalDateTime getViewedAt() {
        return viewedAt;
    }

    public boolean isOld() {
        return old;
    }
}