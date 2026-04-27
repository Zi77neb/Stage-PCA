package com.example.demo.controller;

import com.example.demo.dto.BanqueRequest;
import com.example.demo.model.entity.Banque;
import com.example.demo.service.interfaces.BanqueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banques")
public class BanqueController {

    @Autowired
    private BanqueService banqueService;

    // ➕ CREATE
    @PostMapping
    public Banque create(@RequestBody BanqueRequest request) {
        Banque b = new Banque();
        b.setName(request.getName());
        return banqueService.create(b);
    }

    // 📄 GET ALL
    @GetMapping
    public List<Banque> getAll() {
        return banqueService.getAll();
    }

    // 🔄 UPDATE
    @PutMapping("/{id}")
    public Banque update(@PathVariable Long id, @RequestBody BanqueRequest request) {
        Banque b = banqueService.getById(id);
        b.setName(request.getName());
        return banqueService.create(b); // save = update
    }

    // ❌ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        banqueService.delete(id);
    }
}