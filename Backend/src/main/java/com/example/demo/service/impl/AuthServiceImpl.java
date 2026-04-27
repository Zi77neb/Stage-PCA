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
    public User login(String username, String password) {

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        if (user.getStatus() == Status.DISABLED) {
            throw new RuntimeException("User disabled");
        }

        return user;
    }
}