package com.example.demo.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.UserDocumentDTO;
import com.example.demo.exception.NotFoundException;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.entity.DocumentUser;
import com.example.demo.repository.DocumentUserRepository;
import com.example.demo.security.CurrentUserService;
import com.example.demo.service.interfaces.TraceService;

@RestController
@RequestMapping("/api/user")
public class UserDocumentController {

    @Autowired
    private DocumentUserRepository documentUserRepository;

    @Autowired
    private CurrentUserService currentUserService;

    @Autowired
    private TraceService traceService;

    @GetMapping("/documents")
    public List<UserDocumentDTO> getMyDocuments() {

        Long userId = currentUserService.getCurrentUser().getId();

        List<DocumentUser> list = documentUserRepository.findByUser_Id(userId);

        return list.stream()
                .sorted(Comparator.comparing(
                        (DocumentUser du) -> du.getDocument().getDateDocument()
                ).reversed())
                .map(du -> {

                    String fileName = du.getDocument().getFileName();
                    String etat = du.getDocument().getEtat().getNom();
                    String domaine = du.getDocument().getEtat().getDomaine().getName();

                    boolean isOld = du.getDocument().getDateDocument()
                            .isBefore(LocalDate.now().minusDays(30));

                    return new UserDocumentDTO(
                            du.getId(),
                            fileName,
                            etat,
                            domaine,
                            du.getDocument().getDateDocument().atStartOfDay(),
                            du.isViewed(),
                            du.getViewedAt(),
                            isOld
                    );

                }).toList();
    }

    @GetMapping("/documents/{id}/view")
    public ResponseEntity<Resource> viewDocument(@PathVariable Long id) throws IOException {

        DocumentUser du = documentUserRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Document not found"));

        Long userId = currentUserService.getCurrentUser().getId();

        if (!du.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied");
        }

        File file = new File(du.getDocument().getFilePath());

        if (!file.exists()) {
            throw new NotFoundException("File not found");
        }

        du.setViewed(true);
        du.setViewedAt(LocalDateTime.now());
        documentUserRepository.save(du);

        traceService.log(du.getUser(), du.getDocument(), "VIEW");

        Path path = file.toPath();
        String contentType = Files.probeContentType(path);

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        Resource resource = new UrlResource(file.toURI());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + file.getName() + "\"")
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .body(resource);
    }

    @GetMapping("/documents/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) throws IOException {

        DocumentUser du = documentUserRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Document not found"));

        Long userId = currentUserService.getCurrentUser().getId();

        if (!du.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied");
        }

        File file = new File(du.getDocument().getFilePath());

        if (!file.exists()) {
            throw new NotFoundException("File not found");
        }

        traceService.log(du.getUser(), du.getDocument(), "DOWNLOAD");

        Path path = file.toPath();
        String contentType = Files.probeContentType(path);

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        Resource resource = new UrlResource(file.toURI());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getName() + "\"")
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .body(resource);
    }
}