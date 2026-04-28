package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.UserRequest;
import com.example.demo.model.entity.User;
import com.example.demo.model.entity.Domaine;
import com.example.demo.model.entity.Banque;
import com.example.demo.model.enums.Role;
import com.example.demo.model.enums.Status;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.DomaineRepository;
import com.example.demo.repository.BanqueRepository;
import com.example.demo.service.interfaces.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DomaineRepository domaineRepository;

    @Autowired
    private BanqueRepository banqueRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ➕ CREATE
    @Override
    public User createUser(UserRequest request) {

        Domaine domaine = domaineRepository.findById(request.getDomaineId())
                .orElseThrow(() -> new RuntimeException("Domaine not found"));

        Banque banque = banqueRepository.findById(request.getBanqueId())
                .orElseThrow(() -> new RuntimeException("Banque not found"));

        // 🔥 validation logique
        if (!domaine.getBanque().getId().equals(banque.getId())) {
            throw new RuntimeException("Domaine does not belong to this banque");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setRole(Role.valueOf(request.getRole()));
        user.setStatus(Status.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(request.getPassword());
        user.setDomaine(domaine);
        user.setBanque(banque);

        return userRepository.save(user);
    }

    // 🔄 UPDATE
    @Override
    public User updateUser(Long id, UserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Domaine domaine = domaineRepository.findById(request.getDomaineId())
                .orElseThrow(() -> new RuntimeException("Domaine not found"));

        Banque banque = banqueRepository.findById(request.getBanqueId())
                .orElseThrow(() -> new RuntimeException("Banque not found"));

        // 🔥 validation logique
        if (!domaine.getBanque().getId().equals(banque.getId())) {
            throw new RuntimeException("Domaine does not belong to this banque");
        }

        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setRole(Role.valueOf(request.getRole()));

        user.setDomaine(domaine);
        user.setBanque(banque);

        return userRepository.save(user);
    }

    // ❌ DELETE
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}