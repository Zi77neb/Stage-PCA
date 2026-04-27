package com.example.demo.security;

import org.springframework.stereotype.Service;

import com.example.demo.model.entity.User;

@Service
public class CurrentUserService {

    private User currentUser;

    public void setUser(User user) {
        this.currentUser = user;
    }

    public User getCurrentUser() {
        if (currentUser == null) {
            throw new RuntimeException("No user connected");
        }
        return currentUser;
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public boolean isAdmin() {
        return getCurrentUser().getRole().name().equals("ADMIN");
    }
}