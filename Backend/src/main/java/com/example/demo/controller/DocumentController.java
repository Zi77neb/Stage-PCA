package com.example.demo.controller;

import com.example.demo.model.entity.*;
import com.example.demo.service.interfaces.DocumentService;
import com.example.demo.service.interfaces.CodeService;
import com.example.demo.service.interfaces.DocumentAssignmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;


@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private CodeService codeService;

    @Autowired
    private DocumentAssignmentService documentAssignmentService;

    @PostMapping("/upload")
public Document upload(@RequestParam("file") MultipartFile file) throws IOException {

    // ✅ 1. vérifier fichier
    if (file.isEmpty()) {
        throw new RuntimeException("Fichier vide");
    }

    // 📁 2. chemin ABSOLU
    String uploadDir = System.getProperty("user.dir") + "/uploads/";
    File dir = new File(uploadDir);

    if (!dir.exists()) {
        dir.mkdirs();
    }

    // 📄 3. nom fichier
    String fileName = file.getOriginalFilename();
    String filePath = uploadDir + fileName;

    // 💾 4. sauvegarde
    file.transferTo(new File(filePath));

    // 🔥 5. parsing
    String nameWithoutExt = fileName.replace(".pdf", "");
    String[] parts = nameWithoutExt.split("-");

    if (parts.length < 3) {
        throw new RuntimeException("Nom de fichier invalide (format attendu: CODE-BANQUE-DATE)");
    }

    String codeValue = parts[0];
    String dateStr = parts[2];

    // 🔥 6. conversion date
    LocalDateTime dateDocument = LocalDate
            .parse(dateStr, DateTimeFormatter.ofPattern("yyyyMMdd"))
            .atStartOfDay();

    // 🔥 7. récupérer code
    Code code = codeService.getByCode(codeValue);

    if (code == null) {
        throw new RuntimeException("Code non trouvé: " + codeValue);
    }

    Domaine domaine = code.getDomaine();
    if (domaine == null) {
        throw new RuntimeException("Domaine non trouvé pour code");
    }

    Banque banque = domaine.getBanque();
    if (banque == null) {
        throw new RuntimeException("Banque non trouvée pour domaine");
    }

    // 📦 8. créer document
    Document doc = new Document();
    doc.setFileName(fileName);
    doc.setFilePath(filePath);
    doc.setCode(code);
    doc.setDomaine(domaine);
    doc.setBanque(banque);
    doc.setDateDocument(dateDocument); // 🔥 IMPORTANT
    doc.setUploadedAt(LocalDateTime.now());

    // 💾 9. save DB
    Document saved = documentService.save(doc);

    // 🔗 10. assignation
    documentAssignmentService.assignUsers(saved);

    return saved;
}
}