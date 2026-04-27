package com.example.demo.repository;

import com.example.demo.model.entity.Trace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TraceRepository extends JpaRepository<Trace, Long> {

    List<Trace> findByUserId(Long userId);

    List<Trace> findByDocumentId(Long documentId);
}