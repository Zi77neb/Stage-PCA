package com.example.demo.service.interfaces;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Document;

public interface DocumentService {

    Document save(Document document);

    Document update(Long id, Document document);

    void delete(Long id);

    Document getById(Long id);

    List<Document> getAll();

    Optional<Document> findByFileName(String fileName);

    List<Document> findByDateBetween(LocalDate start, LocalDate end);

    // ❌ supprimé : banque accessible via Etat → Domaine → Banque
    // List<Document> findByBanqueId(Long banqueId);

    List<Document> findByEtatId(Long etatId);

    List<Document> searchByFileName(String keyword);
}