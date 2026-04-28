package com.example.demo.controller;

import com.example.demo.dto.CodeRequest;
import com.example.demo.model.entity.Code;
import com.example.demo.service.interfaces.CodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/codes")
public class CodeController {

    @Autowired
    private CodeService codeService;

    // ➕ CREATE
    @PostMapping
    public Code create(@RequestBody CodeRequest request) {
        return codeService.create(request);
    }

    // 📄 GET ALL
    @GetMapping
    public List<Code> getAll() {
        return codeService.getAll();
    }

    // 🔄 UPDATE
    @PutMapping("/{id}")
public Code update(@PathVariable Long id, @RequestBody CodeRequest request) {
    return codeService.update(id, request); // ✅ correct
}

    // ❌ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        codeService.delete(id);
    }
}