package com.example.demo.dto;

import java.time.LocalDateTime;

public class UserDocumentDTO {

    private Long id;
    private final String title;
    private LocalDateTime date;
    private boolean viewed;
    private LocalDateTime viewedAt;
    private boolean isOld;

    public UserDocumentDTO(Long id,
                           String title,
                           LocalDateTime date,
                           boolean viewed,
                           LocalDateTime viewedAt,
                           boolean isOld) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.viewed = viewed;
        this.viewedAt = viewedAt;
        this.isOld = isOld;
    }

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

    public LocalDateTime getViewedAt() {
        return viewedAt;
    }

    public boolean isOld() {
        return isOld;
    }
}