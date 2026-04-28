package com.example.demo.service.interfaces;

import com.example.demo.dto.CodeRequest;
import com.example.demo.model.entity.Code;

import java.util.List;

public interface CodeService {

    Code create(CodeRequest request);

    List<Code> getAll();

    Code getById(Long id);

    Code getByCode(String code);

    void delete(Long id);

    // ✅ AJOUT
    Code update(Long id, CodeRequest request);
}