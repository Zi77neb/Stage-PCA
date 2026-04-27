package com.example.demo.service.impl;

import com.example.demo.model.entity.User;
import com.example.demo.model.entity.Document;
import com.example.demo.model.entity.DocumentUser;

import com.example.demo.repository.UserRepository;
import com.example.demo.repository.DocumentUserRepository;

import com.example.demo.service.interfaces.DocumentAssignmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentAssignmentServiceImpl implements DocumentAssignmentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentUserRepository documentUserRepository;

    @Override
    public void assignUsers(Document document) {

        // 🔥 récupérer domaine depuis document
        Long domaineId = document.getDomaine().getId();

        // 🔥 récupérer users liés à ce domaine
        List<User> users = userRepository.findByDomaineId(domaineId);

        for (User user : users) {

            DocumentUser du = new DocumentUser();

            // ✅ relations JPA
            du.setUser(user);
            du.setDocument(document);

            // ✅ traçabilité
            du.setAssignedAt(LocalDateTime.now());
            du.setViewed(false);

            documentUserRepository.save(du);
        }
    }
}