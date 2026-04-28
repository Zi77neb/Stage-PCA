package com.example.demo.controller;

import com.example.demo.dto.DomaineRequest;

import com.example.demo.model.entity.Domaine;
import com.example.demo.service.interfaces.DomaineService;
import com.example.demo.dto.DomaineResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/admin/domaines")
public class DomaineController {

    @Autowired
    private DomaineService domaineService;

    // ➕ CREATE
    @PostMapping
    public Domaine create(@RequestBody DomaineRequest request) {
        return domaineService.create(request);
    }

    // 📄 GET ALL
    @GetMapping
    public List<Domaine> getAll() {
        return domaineService.getAll();
    }

 @GetMapping("/with-banque")
public List<DomaineResponse> getAllWithBanque() {
    return domaineService.getAllWithBanque();
}
    // 🔄 UPDATE
@PutMapping("/{id}")
public Domaine update(@PathVariable Long id, @RequestBody DomaineRequest request) {
    return domaineService.update(id, request); // ✅ correct
}

    // ❌ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        domaineService.delete(id);
    }
}