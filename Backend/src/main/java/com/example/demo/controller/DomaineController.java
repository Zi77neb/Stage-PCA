package com.example.demo.controller;

import com.example.demo.dto.DomaineRequest;

import com.example.demo.model.entity.Domaine;
import com.example.demo.service.interfaces.DomaineService;

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

    // 🔄 UPDATE
    @PutMapping("/{id}")
    public Domaine update(@PathVariable Long id, @RequestBody DomaineRequest request) {

        Domaine d = domaineService.getById(id);

        d.setName(request.getName());

        // ⚠️ tu dois aussi gérer banque
        // (comme dans service)
        return domaineService.create(request); // ou mieux: méthode update()
    }

    // ❌ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        domaineService.delete(id);
    }
}