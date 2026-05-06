package com.example.demo.service;

import java.io.File;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Document;
import com.example.demo.model.entity.Etat;
import com.example.demo.service.interfaces.DocumentAssignmentService;
import com.example.demo.service.interfaces.DocumentService;
import com.example.demo.service.interfaces.EtatService;

@Service
public class FileWatcherService {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private EtatService etatService;

    @Autowired
    private DocumentAssignmentService documentAssignmentService;

    private final String folderPath = System.getProperty("user.dir") + "/uploads/documents/";

    @Scheduled(fixedRate = 5000)
    public void watchFolder() {

        File folder = new File(folderPath);

        if (!folder.exists()) {
            folder.mkdirs();
            return;
        }

        File[] files = folder.listFiles();

        if (files == null) return;

        for (File file : files) {

            if (file.isDirectory()) continue;

            try {
                processFile(file);
            } catch (Exception e) {
                System.out.println("Erreur fichier: " + file.getName());
            }
        }
    }

    private void processFile(File file) {

    String fileName = file.getName();

    if (documentService.findByFileName(fileName).isPresent()) {
        return;
    }

    try {
        String nameWithoutExt = fileName.replace(".pdf", "");
        String[] parts = nameWithoutExt.split("-");

        if (parts.length < 4) return;

        String code = parts[0];

        String dateStr = parts[1] + "-" + parts[2] + "-" + parts[3];

        LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("dd-MM-yyyy"));

        Etat etat = etatService.getByCode(code);

        Document doc = new Document();
        doc.setFileName(fileName);
        doc.setFilePath(file.getAbsolutePath());
        doc.setEtat(etat);
        doc.setDateDocument(date);
        doc.setUploadedAt(LocalDateTime.now());

        Document saved = documentService.save(doc);

        documentAssignmentService.assignUsers(saved);

        System.out.println("✅ traité: " + fileName);

    } catch (Exception e) {
        System.out.println("❌ erreur parsing: " + fileName + " -> " + e.getMessage());
    }
}
}