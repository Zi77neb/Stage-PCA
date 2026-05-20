
package com.example.demo.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
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

    // ✅ DOSSIER DOCUMENTS

    private final String folderPath =
            System.getProperty("user.dir")
                    + "/uploads/documents/";

    // ✅ DOSSIER REJETS

    private final String rejectedFolderPath =
            System.getProperty("user.dir")
                    + "/uploads/rejets/";

    // =========================
    // WATCH FOLDER
    // =========================

    @Scheduled(fixedRate = 5000)
    public void watchFolder() {

        File folder = new File(folderPath);

        if (!folder.exists()) {

            folder.mkdirs();

            return;
        }

        // ✅ CREATE REJECT FOLDER

        File rejectedFolder =
                new File(rejectedFolderPath);

        if (!rejectedFolder.exists()) {

            rejectedFolder.mkdirs();
        }

        File[] files = folder.listFiles();

        if (files == null) return;

        for (File file : files) {

            if (file.isDirectory()) continue;

            try {

                processFile(file);

            } catch (Exception e) {

                System.out.println(
                        "❌ erreur fichier: "
                                + file.getName()
                );

                // ✅ MOVE TO REJECTS

                moveToRejected(file);
            }
        }
    }

    // =========================
    // PROCESS FILE
    // =========================

    private void processFile(File file) {

        String fileName = file.getName();

        // ✅ AVOID DUPLICATE

        if (documentService
                .findByFileName(fileName)
                .isPresent()) {

            System.out.println(
                    "⚠️ fichier déjà traité: "
                            + fileName
            );

            return;
        }

        try {

            // ✅ REMOVE EXTENSION

            String nameWithoutExt =
                    fileName.contains(".")
                            ? fileName.substring(
                                    0,
                                    fileName.lastIndexOf(".")
                            )
                            : fileName;

            // ✅ SPLIT NAME

            String[] parts =
                    nameWithoutExt.split("-");

            // ✅ FORMAT VALIDATION

            if (parts.length < 4) {

                System.out.println(
                        "❌ mauvais format: "
                                + fileName
                );

                moveToRejected(file);

                return;
            }

            // ✅ CODE + DATE

            String code = parts[0];

            String dateStr =
                    parts[1]
                            + "-"
                            + parts[2]
                            + "-"
                            + parts[3];

            // ✅ PARSE DATE

            LocalDate date =
                    LocalDate.parse(
                            dateStr,
                            DateTimeFormatter.ofPattern(
                                    "dd-MM-yyyy"
                            )
                    );

            // ✅ FIND ETAT

            Etat etat =
                    etatService.getByCode(code);

            // ✅ CREATE DOCUMENT

            Document doc = new Document();

            doc.setFileName(fileName);

            doc.setFilePath(
                    file.getAbsolutePath()
            );

            doc.setEtat(etat);

            doc.setDateDocument(date);

            doc.setUploadedAt(
                    LocalDateTime.now()
            );

            // ✅ SAVE DOCUMENT

            Document saved =
                    documentService.save(doc);

            // ✅ ASSIGN USERS

            documentAssignmentService
                    .assignUsers(saved);

            System.out.println(
                    "✅ traité + assigné: "
                            + fileName
            );

        } catch (Exception e) {

            System.out.println(
                    "❌ erreur parsing: "
                            + fileName
                            + " -> "
                            + e.getMessage()
            );

            // ✅ MOVE TO REJECTS

            moveToRejected(file);
        }
    }

    // =========================
    // MOVE FILE TO REJECTS
    // =========================

    private void moveToRejected(File file) {

        try {

            File rejectedFolder =
                    new File(rejectedFolderPath);

            if (!rejectedFolder.exists()) {

                rejectedFolder.mkdirs();
            }

            File destination =
                    new File(
                            rejectedFolder,
                            file.getName()
                    );

            Files.move(
                    file.toPath(),
                    destination.toPath(),
                    StandardCopyOption.REPLACE_EXISTING
            );

            System.out.println(
                    "📁 déplacé vers rejets: "
                            + file.getName()
            );

        } catch (IOException e) {

            System.out.println(
                    "❌ impossible déplacer fichier rejeté: "
                            + file.getName()
            );
        }
    }
}

