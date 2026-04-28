package com.example.demo.service.impl;

import com.example.demo.model.entity.User;
import com.example.demo.model.enums.Status;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.interfaces.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Override
public User login(String email, String password) {

    Optional<User> userOpt = userRepository.findByEmail(email);

    if (userOpt.isEmpty()) {
        throw new RuntimeException("User not found");
    }

    User user = userOpt.get();

    if (user.getStatus() == Status.DISABLED) {
        throw new RuntimeException("User disabled");
    }

    if (user.getPassword() == null || !user.getPassword().equals(password)) {
        throw new RuntimeException("Invalid credentials");
    }

    return user;
}
}