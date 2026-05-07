package com.example.demo.dto;

import java.time.LocalDateTime;

public class UserDocumentDTO {


    private Long id;
    private final String title;
    private LocalDateTime date;
    private boolean viewed;
    private LocalDateTime viewedAt;
    private boolean old;

    public UserDocumentDTO(Long id, String title, LocalDateTime date, boolean viewed) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.viewed = viewed;
    }

    // getters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public boolean isViewed() {
        return viewed;
    }
    // setters
    public void setId(Long id) {        
        this.id = id;
    }
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    public void setViewed(boolean viewed) {
        this.viewed = viewed;
    }
    public void markAsViewed() {
        this.viewed = true;
        this.date = LocalDateTime.now();
    }
    public void markAsUnviewed() {
        this.viewed = false;
        this.date = null;
    }
    public void toggleViewed() {
        if (this.viewed) {
            markAsUnviewed();
        } else {
            markAsViewed();
        }
    }
    // 🔥 CONSTRUCTEUR COMPLET
    public UserDocumentDTO(Long id, String title, LocalDateTime date,
                           boolean viewed, LocalDateTime viewedAt, boolean old) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.viewed = viewed;
        this.viewedAt = viewedAt;
        this.old = old;
    }

}