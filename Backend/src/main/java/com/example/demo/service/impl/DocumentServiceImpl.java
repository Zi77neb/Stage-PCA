package com.example.demo.service.impl;
import com.example.demo.model.entity.Document;
import com.example.demo.repository.DocumentRepository;
import com.example.demo.service.interfaces.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Override
    public Document save(Document document) {
        return documentRepository.save(document);
    }
}