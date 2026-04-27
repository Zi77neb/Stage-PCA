package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequest;
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

    User user = authService.login(
        request.getUsername(),
        request.getPassword()
    );

    currentUserService.setUser(user); // 🔥 ICI

    return user;
}
}