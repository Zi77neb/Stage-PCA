package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.entity.Trace;
import com.example.demo.repository.TraceRepository;

@RestController
@RequestMapping("/api/admin/traces")
public class TraceController {

    @Autowired
    private TraceRepository traceRepository;

    @GetMapping
    public List<Trace> getAll() {
        return traceRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Trace> getByUser(@PathVariable Long userId) {
        return traceRepository.findByUser_Id(userId);
    }

    @GetMapping("/document/{documentId}")
    public List<Trace> getByDocument(@PathVariable Long documentId) {
        return traceRepository.findByDocument_Id(documentId);
    }
}