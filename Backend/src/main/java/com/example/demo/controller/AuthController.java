package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequest;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.entity.User;
import com.example.demo.security.CurrentUserService;
import com.example.demo.service.interfaces.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CurrentUserService currentUserService;

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {

        if (request.getEmail() == null || request.getPassword() == null) {
            throw new UnauthorizedException("Email and password are required");
        }

        User user = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        currentUserService.setUser(user);

        return user;
    }
}