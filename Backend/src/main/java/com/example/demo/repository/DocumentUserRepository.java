package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.entity.DocumentUser;

public interface DocumentUserRepository extends JpaRepository<DocumentUser, Long> {

    List<DocumentUser> findByUser_Id(Long userId);

    List<DocumentUser> findByDocument_Id(Long documentId);
}