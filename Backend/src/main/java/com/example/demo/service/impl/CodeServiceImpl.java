package com.example.demo.service.impl;

import com.example.demo.dto.CodeRequest;
import com.example.demo.model.entity.Code;
import com.example.demo.model.entity.Domaine;
import com.example.demo.repository.CodeRepository;
import com.example.demo.repository.DomaineRepository;
import com.example.demo.service.interfaces.CodeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CodeServiceImpl implements CodeService {

    @Autowired
    private CodeRepository codeRepository;

    @Autowired
    private DomaineRepository domaineRepository;

    @Override
    public Code create(CodeRequest request) {

        Domaine domaine = domaineRepository.findById(request.getDomaineId())
                .orElseThrow(() -> new RuntimeException("Domaine not found"));

        Code c = new Code();
        c.setCode(request.getCode());
        c.setDomaine(domaine);

        return codeRepository.save(c);
    }

    @Override
    public List<Code> getAll() {
        return codeRepository.findAll();
    }

    @Override
    public Code getById(Long id) {
        return codeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Code not found"));
    }

    @Override
    public Code getByCode(String code) {
        return codeRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Code not found"));
    }

    @Override
    public void delete(Long id) {
        codeRepository.deleteById(id);
    }
    @Override
public Code update(Long id, CodeRequest request) {

    Code c = codeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Code not found"));

    Domaine domaine = domaineRepository.findById(request.getDomaineId())
            .orElseThrow(() -> new RuntimeException("Domaine not found"));

    c.setCode(request.getCode());
    c.setDomaine(domaine);

    return codeRepository.save(c); // ✅ UPDATE
}
}