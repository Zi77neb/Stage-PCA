package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.entity.Trace;

public interface TraceRepository extends JpaRepository<Trace, Long> {

    List<Trace> findByUser_Id(Long userId);

    List<Trace> findByDocument_Id(Long documentId);
}