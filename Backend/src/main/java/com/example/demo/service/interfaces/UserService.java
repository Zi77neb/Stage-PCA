package com.example.demo.service.interfaces;

import java.util.List;
import java.util.Optional;

import com.example.demo.dto.UserRequest;
import com.example.demo.model.entity.User;

public interface UserService {

    List<User> getAllUsers();

    User getById(Long id);
    User save(User user);
    Optional<User> findByEmail(String email);

    User createUser(UserRequest request);

    User updateUser(Long id, UserRequest request);

    void deleteUser(Long id);

    List<User> searchByUsername(String username);

    List<User> findByBanqueId(Long banqueId);

    List<User> findByDomaineId(Long domaineId);

    List<User> findByEtatId(Long etatId);
}