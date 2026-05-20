package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.UserRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.entity.User;
import com.example.demo.security.CurrentUserService;
import com.example.demo.service.interfaces.AuthService;
import com.example.demo.service.interfaces.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CurrentUserService currentUserService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    // =========================
    // MAP USER RESPONSE
    // =========================

    private UserResponse mapUser(User user) {

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.getStatus().name(),

                // ✅ FIRST LOGIN
                user.isFirstLogin(),

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

    // =========================
    // LOGIN
    // =========================

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

    // =========================
    // CHANGE FIRST PASSWORD
    // =========================

  @PostMapping("/change-first-password")
public String changeFirstPassword(
        @RequestBody ChangePasswordRequest request,
        HttpSession session
) {

    User user =
            currentUserService.getCurrentUser(session);

    if (user == null) {

        throw new UnauthorizedException(
                "User not connected"
        );
    }

    // ✅ HASH PASSWORD
    user.setPassword(
            new org.springframework.security.crypto.bcrypt
                    .BCryptPasswordEncoder()
                    .encode(request.getPassword())
    );

    // ✅ IMPORTANT
    user.setFirstLogin(false);

    // ✅ SAVE DIRECTLY
    userService.save(user);

    return "Password changed successfully";
}

    // =========================
    // LOGOUT
    // =========================

    @GetMapping("/logout")
    public String logout(HttpSession session) {

        currentUserService.logout(session);

        return "Logged out";
    }

    // =========================
    // CURRENT USER
    // =========================

    @GetMapping("/me")
    public UserResponse me(HttpSession session) {

        User user =
                currentUserService.getCurrentUser(session);

        return mapUser(user);
    }

    // =========================
    // HELPER METHOD
    // =========================

    private UserRequest convertUserToRequest(
            User user
    ) {

        UserRequest request =
                new UserRequest();

        request.setUsername(
                user.getUsername()
        );

        request.setFullName(
                user.getFullName()
        );

        request.setEmail(
                user.getEmail()
        );

        request.setRole(
                user.getRole().name()
        );

        // ✅ PASSWORD SIMPLE
        request.setPassword(
                user.getPassword()
        );

        request.setBanqueIds(
                user.getBanques()
                        .stream()
                        .map(b -> b.getId())
                        .toList()
        );

        request.setDomaineIds(
                user.getDomaines()
                        .stream()
                        .map(d -> d.getId())
                        .toList()
        );

        request.setEtatIds(
                user.getEtats()
                        .stream()
                        .map(e -> e.getId())
                        .toList()
        );

        return request;
    }
}