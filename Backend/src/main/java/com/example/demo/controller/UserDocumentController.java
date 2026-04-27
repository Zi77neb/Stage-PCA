package com.example.demo.controller;

import com.example.demo.model.entity.DocumentUser;
import com.example.demo.repository.DocumentUserRepository;
import com.example.demo.security.CurrentUserService;
import com.example.demo.dto.UserDocumentDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Comparator;

@RestController
@RequestMapping("/api/user")
public class UserDocumentController {

    @Autowired
    private DocumentUserRepository documentUserRepository;

    @Autowired
    private CurrentUserService currentUserService;

    // 📄 Voir mes documents (DTO + TRI 🔥)
    @GetMapping("/documents")
    public List<UserDocumentDTO> getMyDocuments() {

        Long userId = currentUserService.getCurrentUser().getId();

        List<DocumentUser> list = documentUserRepository.findByUserId(userId);

return list.stream()

        .sorted(Comparator.comparing(
                (DocumentUser du) -> du.getDocument().getDateDocument()
        ).reversed())

        .map((DocumentUser du) -> {

                    String label = du.getDocument().getCode().getLabel();
                    String banque = du.getDocument().getBanque().getName();

                    String title = label + " - " + banque;

                    return new UserDocumentDTO(
                            du.getId(),
                            title,
                            du.getDocument().getDateDocument(),
                            du.isViewed()
                    );

                }).toList();
    }

    // 👁️ Voir PDF (marque comme consulté)
    @GetMapping("/documents/{id}/view")
    public ResponseEntity<Resource> viewDocument(@PathVariable Long id) throws IOException {

        DocumentUser du = documentUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DocumentUser not found"));

        // 🔐 sécurité
        Long userId = currentUserService.getCurrentUser().getId();
        if (!du.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        // 🔍 vérifications
        if (du.getDocument() == null) {
            throw new RuntimeException("Document is NULL");
        }

        String filePath = du.getDocument().getFilePath();
        if (filePath == null) {
            throw new RuntimeException("File path is NULL");
        }

        File file = new File(filePath);
        if (!file.exists()) {
            throw new RuntimeException("File not found: " + filePath);
        }

        // 🔥 marquer comme vu
        du.setViewed(true);
        du.setViewedAt(LocalDateTime.now());
        documentUserRepository.save(du);

        Resource resource = new UrlResource(file.toURI());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + file.getName() + "\"")
                .body(resource);
    }

    // ⬇️ Télécharger PDF
    @GetMapping("/documents/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) throws IOException {

        DocumentUser du = documentUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // 🔐 sécurité
        Long userId = currentUserService.getCurrentUser().getId();
        if (!du.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        File file = new File(du.getDocument().getFilePath());
        Resource resource = new UrlResource(file.toURI());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
    }
}