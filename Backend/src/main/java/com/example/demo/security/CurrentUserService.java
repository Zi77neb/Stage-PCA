package com.example.demo.security;

import org.springframework.stereotype.Service;

import com.example.demo.model.entity.User;

import jakarta.servlet.http.HttpSession;

@Service
public class CurrentUserService {

    private static final String USER_SESSION_KEY = "CONNECTED_USER";

    // 🔥 SAVE USER IN SESSION
    public void setUser(HttpSession session, User user) {
        session.setAttribute(USER_SESSION_KEY, user);
    }

    // 🔥 GET CURRENT USER
    public User getCurrentUser(HttpSession session) {

        User user = (User) session.getAttribute(USER_SESSION_KEY);

        if (user == null) {
            throw new RuntimeException("No user connected");
        }

        return user;
    }

    public Long getCurrentUserId(HttpSession session) {
        return getCurrentUser(session).getId();
    }

    public boolean isAdmin(HttpSession session) {
        return getCurrentUser(session)
                .getRole()
                .name()
                .equals("ADMIN");
    }

    // 🔥 LOGOUT
    public void logout(HttpSession session) {
        session.invalidate();
    }
}