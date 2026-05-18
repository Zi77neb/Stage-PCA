package com.example.demo.controller;

import java.util.HashSet;
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

import com.example.demo.dto.BanqueRequest;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.entity.Banque;
import com.example.demo.security.CurrentUserService;
import com.example.demo.service.interfaces.BanqueService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/admin/banques")
public class BanqueController {

    @Autowired
    private BanqueService banqueService;

    @Autowired
    private CurrentUserService currentUserService;

    private void checkAdmin(HttpSession session) {
        if (!currentUserService.isAdmin(session)) {
            throw new UnauthorizedException("Access denied");
        }
    }

    @PostMapping
    public Banque create(@RequestBody BanqueRequest request,
                          HttpSession session) {

        checkAdmin(session);

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
    public List<Banque> getAll(HttpSession session) {
        checkAdmin(session);
        return banqueService.getAll();
    }

    @GetMapping("/{id}")
    public Banque getById(@PathVariable Long id,
                          HttpSession session) {
        checkAdmin(session);
        return banqueService.getById(id);
    }

    @GetMapping("/search")
    public List<Banque> search(@RequestParam String name,
                               HttpSession session) {
        checkAdmin(session);
        return banqueService.searchByName(name);
    }

    @PutMapping("/{id}")
    public Banque update(@PathVariable Long id,
                         @RequestBody BanqueRequest request,
                         HttpSession session) {

        checkAdmin(session);

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
    public void delete(@PathVariable Long id,
                       HttpSession session) {
        checkAdmin(session);
        banqueService.delete(id);
    }
}