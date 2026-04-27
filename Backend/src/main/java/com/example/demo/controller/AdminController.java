package com.example.demo.controller;

import com.example.demo.model.entity.User;
import com.example.demo.security.CurrentUserService;
import com.example.demo.service.interfaces.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.UserRequest;



import java.util.List;
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private CurrentUserService currentUserService;

    @GetMapping("/users")
    public List<User> getAllUsers() {

        if (!currentUserService.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        return userService.getAllUsers();
    }

    @PostMapping("/users")
    public User createUser(@RequestBody UserRequest request) {

        if (!currentUserService.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        return userService.createUser(request);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id,
                           @RequestBody UserRequest request) {

        if (!currentUserService.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        return userService.updateUser(id, request);
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {

        if (!currentUserService.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        userService.deleteUser(id);

        return "User deleted";
    }
}