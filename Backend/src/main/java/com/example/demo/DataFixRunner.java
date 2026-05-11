package com.example.demo;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.entity.Document;
import com.example.demo.service.interfaces.DocumentAssignmentService;
import com.example.demo.service.interfaces.DocumentService;

@Component
@Profile("fix") // 🔥 s'exécute seulement si profile = fix
public class DataFixRunner implements CommandLineRunner {

    private final DocumentService documentService;
    private final DocumentAssignmentService documentAssignmentService;

    public DataFixRunner(DocumentService documentService,
                         DocumentAssignmentService documentAssignmentService) {
        this.documentService = documentService;
        this.documentAssignmentService = documentAssignmentService;
    }

    @Override
    @Transactional
    public void run(String... args) {

        System.out.println("🔧 FIX: Reassignation des documents...");

        List<Document> docs = documentService.getAll();

        for (Document doc : docs) {
            try {
                documentAssignmentService.reassignDocument(doc);
                System.out.println("✔ Doc reassigned: " + doc.getFileName());
            } catch (Exception e) {
                System.out.println("❌ Erreur doc: " + doc.getFileName() + " -> " + e.getMessage());
            }
        }

        System.out.println("✅ FIX terminé !");
    }
}