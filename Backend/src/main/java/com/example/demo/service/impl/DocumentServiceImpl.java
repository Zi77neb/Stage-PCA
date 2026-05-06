package com.example.demo.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exception.NotFoundException;
import com.example.demo.model.entity.Document;
import com.example.demo.repository.DocumentRepository;
import com.example.demo.service.interfaces.DocumentService;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Override
    public Document save(Document document) {
        return documentRepository.save(document);
    }

    @Override
    public Document update(Long id, Document document) {
        Document existing = documentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Document not found"));

        existing.setFileName(document.getFileName());
        existing.setFilePath(document.getFilePath());
        existing.setEtat(document.getEtat());
        existing.setDateDocument(document.getDateDocument());

        return documentRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Document not found"));
        documentRepository.delete(document);
    }

    @Override
    public Document getById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Document not found"));
    }

    @Override
    public List<Document> getAll() {
        return documentRepository.findAll();
    }

    @Override
    public Optional<Document> findByFileName(String fileName) {
        return documentRepository.findAll().stream()
                .filter(d -> d.getFileName() != null && d.getFileName().equalsIgnoreCase(fileName))
                .findFirst();
    }

    @Override
    public List<Document> findByDateBetween(LocalDate start, LocalDate end) {
        return documentRepository.findAll().stream()
                .filter(d -> d.getDateDocument() != null &&
                        !d.getDateDocument().isBefore(start) &&
                        !d.getDateDocument().isAfter(end))
                .toList();
    }

    @Override
    public List<Document> findByEtatId(Long etatId) {
        return documentRepository.findAll().stream()
                .filter(d -> d.getEtat() != null && d.getEtat().getId().equals(etatId))
                .toList();
    }

    @Override
    public List<Document> searchByFileName(String keyword) {
        return documentRepository.findAll().stream()
                .filter(d -> d.getFileName() != null &&
                        d.getFileName().toLowerCase().contains(keyword.toLowerCase()))
                .toList();
    }
}