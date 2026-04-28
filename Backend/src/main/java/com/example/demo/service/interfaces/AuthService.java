package com.example.demo.service.interfaces;

import com.example.demo.model.entity.User;

public interface AuthService {
    User login(String email, String password);
}