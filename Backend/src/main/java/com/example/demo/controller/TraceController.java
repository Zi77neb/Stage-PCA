package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.entity.Trace;
import com.example.demo.repository.TraceRepository;
import com.example.demo.security.CurrentUserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/admin/traces")
public class TraceController {

    @Autowired
    private TraceRepository traceRepository;

    @Autowired
    private CurrentUserService currentUserService;

    private void checkAdmin(HttpSession session) {
        if (!currentUserService.isAdmin(session)) {
            throw new UnauthorizedException("Access denied");
        }
    }

    @GetMapping
    public List<Trace> getAll(HttpSession session) {

        checkAdmin(session);

        return traceRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Trace> getByUser(@PathVariable Long userId,
                                 HttpSession session) {

        checkAdmin(session);

        return traceRepository.findByUser_Id(userId);
    }

    @GetMapping("/document/{documentId}")
    public List<Trace> getByDocument(@PathVariable Long documentId,
                                     HttpSession session) {

        checkAdmin(session);

        return traceRepository.findByDocument_Id(documentId);
    }
}