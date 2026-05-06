package com.example.demo.service.interfaces;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Document;
import com.example.demo.model.entity.Trace;
import com.example.demo.model.entity.User;
import com.example.demo.repository.TraceRepository;

@Service
public class TraceService {

    @Autowired
    private TraceRepository traceRepository;

    public void log(User user, Document document, String action) {
        Trace trace = new Trace();
        trace.setUser(user);
        trace.setDocument(document);
        trace.setAction(action);
        trace.setActionDate(LocalDateTime.now());

        traceRepository.save(trace);
    }
}