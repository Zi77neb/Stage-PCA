package com.example.demo.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "document_user")
public class DocumentUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
@JoinColumn(name = "user_id")
private User user;

@ManyToOne
@JoinColumn(name = "document_id")
private Document document;

    private boolean viewed = false;
    private LocalDateTime viewedAt;

    private LocalDateTime assignedAt;

    public boolean isViewed() {
    return viewed;
}

public void setViewed(boolean viewed) {
    this.viewed = viewed;
}

public LocalDateTime getViewedAt() {
    return viewedAt;
}

public void setViewedAt(LocalDateTime viewedAt) {
    this.viewedAt = viewedAt;
}
    // getters setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }  public Document getDocument() { // 🔥 IMPORTANT
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }
    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
}