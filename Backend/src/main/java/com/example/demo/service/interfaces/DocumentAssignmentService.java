package com.example.demo.service.interfaces;

import com.example.demo.model.entity.Document;

public interface DocumentAssignmentService {

    void assignUsers(Document document);

    void assignUsersByCriteria(Document document, Long banqueId, Long domaineId, Long etatId);

    void reassignDocument(Document document);
}