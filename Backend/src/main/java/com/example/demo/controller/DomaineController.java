package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.DomaineRequest;
import com.example.demo.dto.DomaineResponse;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.entity.Domaine;
import com.example.demo.security.CurrentUserService;
import com.example.demo.service.interfaces.DomaineService;

@RestController
@RequestMapping("/api/admin/domaines")
public class DomaineController {

    @Autowired
    private DomaineService domaineService;

    @Autowired
    private CurrentUserService currentUserService;

    private void checkAdmin() {
        if (!currentUserService.isAdmin()) {
            throw new UnauthorizedException("Access denied");
        }
    }

    @PostMapping
    public Domaine create(@RequestBody DomaineRequest request) {
        checkAdmin();
        return domaineService.create(request);
    }

    @GetMapping
    public List<Domaine> getAll() {
        checkAdmin();
        return domaineService.getAll();
    }

    @GetMapping("/{id}")
    public Domaine getById(@PathVariable Long id) {
        checkAdmin();
        return domaineService.getById(id);
    }

    @GetMapping("/with-banque")
    public List<DomaineResponse> getAllWithBanque() {
        checkAdmin();
        return domaineService.getAllWithBanque();
    }

    @GetMapping("/search")
    public List<Domaine> search(@RequestParam String name) {
        checkAdmin();
        return domaineService.searchByName(name);
    }

    @GetMapping("/by-banque/{banqueId}")
    public List<Domaine> getByBanque(@PathVariable Long banqueId) {
        checkAdmin();
        return domaineService.findByBanqueId(banqueId);
    }

    @PutMapping("/{id}")
    public Domaine update(@PathVariable Long id, @RequestBody DomaineRequest request) {
        checkAdmin();
        return domaineService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        checkAdmin();
        domaineService.delete(id);
    }
}