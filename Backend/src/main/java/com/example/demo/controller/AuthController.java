package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.entity.User;
import com.example.demo.security.CurrentUserService;
import com.example.demo.service.interfaces.AuthService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CurrentUserService currentUserService;

    @Autowired
    private AuthService authService;

    private UserResponse mapUser(User user) {

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.getStatus().name(),
                user.getCreatedAt(),

                user.getBanques()
                        .stream()
                        .map(b -> b.getName())
                        .toList(),

                user.getDomaines()
                        .stream()
                        .map(d -> d.getName())
                        .toList(),

                user.getEtats()
                        .stream()
                        .map(e -> e.getNom())
                        .toList()
        );
    }

    @PostMapping("/login")
    public UserResponse login(
            @RequestBody LoginRequest request,
            HttpSession session
    ) {

        if (request.getEmail() == null ||
                request.getPassword() == null) {

            throw new UnauthorizedException(
                    "Email and password are required"
            );
        }

        User user = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        currentUserService.setUser(session, user);

        return mapUser(user);
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {

        currentUserService.logout(session);

        return "Logged out";
    }
    @GetMapping("/me")
public UserResponse me(HttpSession session) {

    User user = currentUserService.getCurrentUser(session);

    return mapUser(user);
}
}