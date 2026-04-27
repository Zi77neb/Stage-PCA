package com.example.demo.service.interfaces;

import java.util.List;

import com.example.demo.dto.UserRequest;
import com.example.demo.model.entity.User;

public interface UserService {

    List<User> getAllUsers();

    User createUser(UserRequest request);

    // 🔥 AJOUTER CES DEUX LIGNES
    User updateUser(Long id, UserRequest request);
    void deleteUser(Long id);
}