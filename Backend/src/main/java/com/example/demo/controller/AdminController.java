package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.UserRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.entity.User;
import com.example.demo.security.CurrentUserService;
import com.example.demo.service.interfaces.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private CurrentUserService currentUserService;

    private void checkAdmin(HttpSession session) {
        if (!currentUserService.isAdmin(session)) {
            throw new UnauthorizedException("Access denied");
        }
    }

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

    @GetMapping("/users")
    public List<UserResponse> getAllUsers(HttpSession session) {

        checkAdmin(session);

        return userService.getAllUsers()
                .stream()
                .map(this::mapUser)
                .toList();
    }

    @GetMapping("/users/{id}")
    public UserResponse getUserById(@PathVariable Long id,
                                    HttpSession session) {

        checkAdmin(session);

        return mapUser(
                userService.getById(id)
        );
    }

    @GetMapping("/users/search")
    public List<UserResponse> searchUsers(
            @RequestParam String username,
            HttpSession session
    ) {

        checkAdmin(session);

        return userService.searchByUsername(username)
                .stream()
                .map(this::mapUser)
                .toList();
    }

    @PostMapping("/users")
    public UserResponse createUser(
            @RequestBody UserRequest request,
            HttpSession session
    ) {

        checkAdmin(session);

        return mapUser(
                userService.createUser(request)
        );
    }

    @PutMapping("/users/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @RequestBody UserRequest request,
            HttpSession session
    ) {

        checkAdmin(session);

        return mapUser(
                userService.updateUser(id, request)
        );
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(
            @PathVariable Long id,
            HttpSession session
    ) {

        checkAdmin(session);

        userService.deleteUser(id);

        return "User deleted";
    }
}