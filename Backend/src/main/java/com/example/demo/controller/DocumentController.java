package com.example.demo.controller;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.exception.NotFoundException;
import com.example.demo.model.entity.Document;
import com.example.demo.model.entity.Etat;
import com.example.demo.service.interfaces.DocumentAssignmentService;
import com.example.demo.service.interfaces.DocumentService;
import com.example.demo.service.interfaces.EtatService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private EtatService etatService;

    @Autowired
    private DocumentAssignmentService documentAssignmentService;

    @PostMapping("/upload")
    public Document upload(@RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            throw new RuntimeException("Fichier vide");
        }

        String uploadDir = System.getProperty("user.dir") + "/uploads/documents/";
        File dir = new File(uploadDir);

        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = file.getOriginalFilename();
        String filePath = uploadDir + fileName;

        file.transferTo(new File(filePath));

        String nameWithoutExt = fileName.replace(".pdf", "");
        String[] parts = nameWithoutExt.split("-");

        if (parts.length < 5) {
            throw new RuntimeException("Nom de fichier invalide");
        }

        String codeValue = parts[0];
        String dateStr = parts[2] + "-" + parts[3] + "-" + parts[4];

        LocalDate dateDocument = LocalDate
                .parse(dateStr, DateTimeFormatter.ofPattern("dd-MM-yyyy"));

        Etat etat = etatService.getByCode(codeValue);

        if (etat == null) {
            throw new NotFoundException("Etat non trouvé: " + codeValue);
        }

        Document doc = new Document();
        doc.setFileName(fileName);
        doc.setFilePath(filePath);
        doc.setEtat(etat);
        doc.setDateDocument(dateDocument);
        doc.setUploadedAt(LocalDateTime.now());

        Document saved = documentService.save(doc);

        documentAssignmentService.assignUsers(saved);

        return saved;
    }
}