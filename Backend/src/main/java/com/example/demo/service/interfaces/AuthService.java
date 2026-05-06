package com.example.demo.service.interfaces;

import java.util.Optional;

import com.example.demo.model.entity.User;

public interface AuthService {

    User login(String email, String password);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}