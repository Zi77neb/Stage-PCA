package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class UserResponse {

    private final Long id;
    private final String username;
    private final String fullName;
    private final String email;
    private final String role;
    private final String status;
    private final LocalDateTime createdAt;

    private final List<String> banques;
    private final List<String> domaines;
    private final List<String> etats;

    public UserResponse(
            Long id,
            String username,
            String fullName,
            String email,
            String role,
            String status,
            LocalDateTime createdAt,
            List<String> banques,
            List<String> domaines,
            List<String> etats
    ) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
        this.banques = banques;
        this.domaines = domaines;
        this.etats = etats;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<String> getBanques() {
        return banques;
    }

    public List<String> getDomaines() {
        return domaines;
    }

    public List<String> getEtats() {
        return etats;
    }
}