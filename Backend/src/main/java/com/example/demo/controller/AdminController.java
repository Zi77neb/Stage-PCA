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
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.entity.User;
import com.example.demo.security.CurrentUserService;
import com.example.demo.service.interfaces.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private CurrentUserService currentUserService;

    private void checkAdmin() {
        if (!currentUserService.isAdmin()) {
            throw new UnauthorizedException("Access denied");
        }
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        checkAdmin();
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        checkAdmin();
        return userService.getById(id);
    }

    @GetMapping("/users/search")
    public List<User> searchUsers(@RequestParam String username) {
        checkAdmin();
        return userService.searchByUsername(username);
    }

    @PostMapping("/users")
    public User createUser(@RequestBody UserRequest request) {
        checkAdmin();
        return userService.createUser(request);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id,
                           @RequestBody UserRequest request) {
        checkAdmin();
        return userService.updateUser(id, request);
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {
        checkAdmin();
        userService.deleteUser(id);
        return "User deleted";
    }
}