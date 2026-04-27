package com.example.demo.dto;

import java.time.LocalDateTime;

public class UserDocumentDTO {


    private Long id;
    private final String title;
    private LocalDateTime date;
    private boolean viewed;

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
}