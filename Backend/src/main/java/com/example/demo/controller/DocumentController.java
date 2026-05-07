package com.example.demo.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
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

import com.example.demo.exception.NotFoundException;
import com.example.demo.model.entity.Document;
import com.example.demo.service.interfaces.DocumentService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    /**
     * GET /api/documents - Admin consultation de tous les documents
     */
    @GetMapping
    public List<Document> getAllDocuments() {
        return documentService.getAll();
    }

    /**
     * 🔥 ADMIN VIEW (sans restriction utilisateur)
     */
    @GetMapping("/admin/{id}/view")
    public ResponseEntity<Resource> viewDocumentAdmin(@PathVariable Long id) throws IOException {

        Document doc = documentService.getById(id);

        File file = new File(doc.getFilePath());
        if (!file.exists()) {
            throw new NotFoundException("File not found");
        }

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

    /**
     * 🔥 ADMIN DOWNLOAD
     */
    @GetMapping("/admin/{id}/download")
    public ResponseEntity<Resource> downloadDocumentAdmin(@PathVariable Long id) throws IOException {

        Document doc = documentService.getById(id);

        File file = new File(doc.getFilePath());
        if (!file.exists()) {
            throw new NotFoundException("File not found");
        }

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