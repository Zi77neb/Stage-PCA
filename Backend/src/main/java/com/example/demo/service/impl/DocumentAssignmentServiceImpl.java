package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.entity.Document;
import com.example.demo.model.entity.DocumentUser;
import com.example.demo.model.entity.User;
import com.example.demo.repository.DocumentUserRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.interfaces.DocumentAssignmentService;

@Service
public class DocumentAssignmentServiceImpl implements DocumentAssignmentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentUserRepository documentUserRepository;

    @Override
    @Transactional
    public void assignUsers(Document document) {

        if (document.getEtat() == null) {
            throw new IllegalArgumentException("Document must have etat");
        }

        Long domaineId = document.getEtat().getDomaine().getId();
        Long etatId = document.getEtat().getId();

        List<User> users = userRepository.findAll().stream()
        .filter(u -> u.getDomaines().stream().anyMatch(d -> d.getId().equals(domaineId)))
        .filter(u -> u.getEtats().stream().anyMatch(e -> e.getId().equals(etatId)))
        .toList();

        for (User user : users) {

            DocumentUser du = new DocumentUser();
            du.setUser(user);
            du.setDocument(document);
            du.setAssignedAt(LocalDateTime.now());
            du.setViewed(false);

            documentUserRepository.save(du);
        }
    }

    @Override
    @Transactional
    public void assignUsersByCriteria(Document document, Long banqueId, Long domaineId, Long etatId) {

        List<User> users = userRepository
                .findByBanques_IdAndDomaines_IdAndEtats_Id(banqueId, domaineId, etatId);

        for (User user : users) {

            DocumentUser du = new DocumentUser();
            du.setUser(user);
            du.setDocument(document);
            du.setAssignedAt(LocalDateTime.now());
            du.setViewed(false);

            documentUserRepository.save(du);
        }
    }

    @Override
    @Transactional
    public void reassignDocument(Document document) {

        List<DocumentUser> existing = documentUserRepository.findByDocumentId(document.getId());
        documentUserRepository.deleteAll(existing);

        assignUsers(document);
    }
}