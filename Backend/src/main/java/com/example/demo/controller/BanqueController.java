package com.example.demo.controller;

import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.BanqueRequest;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.entity.Banque;
import com.example.demo.security.CurrentUserService;
import com.example.demo.service.interfaces.BanqueService;

@RestController
@RequestMapping("/api/admin/banques")
public class BanqueController {

    @Autowired
    private BanqueService banqueService;

    @Autowired
    private CurrentUserService currentUserService;

    private void checkAdmin() {
        if (!currentUserService.isAdmin()) {
            throw new UnauthorizedException("Access denied");
        }
    }

    @PostMapping
    public Banque create(@RequestBody BanqueRequest request) {
        checkAdmin();

        Banque b = new Banque();
        b.setName(request.getName());

        Banque saved = banqueService.create(b);

        if (request.getDomaineIds() != null) {
            saved = banqueService.assignDomaines(saved.getId(), new HashSet<>(request.getDomaineIds()));
        }

        if (request.getEtatIds() != null) {
            saved = banqueService.assignEtats(saved.getId(), new HashSet<>(request.getEtatIds()));
        }

        return saved;
    }

    @GetMapping
    public List<Banque> getAll() {
        checkAdmin();
        return banqueService.getAll();
    }

    @GetMapping("/{id}")
    public Banque getById(@PathVariable Long id) {
        checkAdmin();
        return banqueService.getById(id);
    }

    @GetMapping("/search")
    public List<Banque> search(@RequestParam String name) {
        checkAdmin();
        return banqueService.searchByName(name);
    }

    @PutMapping("/{id}")
    public Banque update(@PathVariable Long id, @RequestBody BanqueRequest request) {
        checkAdmin();

        Banque b = new Banque();
        b.setName(request.getName());

        Banque updated = banqueService.update(id, b);

        if (request.getDomaineIds() != null) {
            updated = banqueService.assignDomaines(id, new HashSet<>(request.getDomaineIds()));
        }

        if (request.getEtatIds() != null) {
            updated = banqueService.assignEtats(id, new HashSet<>(request.getEtatIds()));
        }

        return updated;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        checkAdmin();
        banqueService.delete(id);
    }
}