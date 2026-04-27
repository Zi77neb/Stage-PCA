package com.example.demo.repository;

import com.example.demo.model.entity.DocumentUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentUserRepository extends JpaRepository<DocumentUser, Long> {

    List<DocumentUser> findByUserId(Long userId);
    
    List<DocumentUser> findByDocumentId(Long documentId);
   
    
}