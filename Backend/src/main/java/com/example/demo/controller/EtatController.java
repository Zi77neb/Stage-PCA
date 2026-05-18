package com.example.demo.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.EtatResponse;
import com.example.demo.exception.NotFoundException;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.entity.Domaine;
import com.example.demo.model.entity.Etat;
import com.example.demo.repository.DomaineRepository;
import com.example.demo.repository.EtatRepository;
import com.example.demo.security.CurrentUserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/admin/etats")
@CrossOrigin(origins = "http://localhost:5173")
public class EtatController {

    @Autowired
    private EtatRepository etatRepository;

    @Autowired
    private DomaineRepository domaineRepository;

    @Autowired
    private CurrentUserService currentUserService;

    private void checkAdmin(HttpSession session) {
        if (!currentUserService.isAdmin(session)) {
            throw new UnauthorizedException("Access denied");
        }
    }

    // 🔥 CREATE AVEC UPLOAD
    @PostMapping("/upload")
    public Etat createWithFile(
            @RequestParam String code,
            @RequestParam String nom,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String frequence,
            @RequestParam Long domaineId,
            @RequestParam(required = false) MultipartFile file,
            HttpSession session
    ) throws IOException {

        checkAdmin(session);

        Domaine domaine = domaineRepository.findById(domaineId)
                .orElseThrow(() -> new NotFoundException("Domaine not found"));

        Etat etat = new Etat();
        etat.setCode(code);
        etat.setNom(nom);
        etat.setDescription(description);
        etat.setFrequence(frequence);
        etat.setDomaine(domaine);

        etat.setUploadPath(null);

        if (file != null && !file.isEmpty()) {

            String uploadDir = System.getProperty("user.dir") + "/etatsFile/";
            File dir = new File(uploadDir);

            if (!dir.exists()) {
                dir.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = uploadDir + fileName;

            file.transferTo(new File(filePath));

            etat.setUploadPath("http://localhost:8080/etatsFile/" + fileName);
        }

        return etatRepository.save(etat);
    }

    // 🔥 UPDATE AVEC UPLOAD
    @PutMapping("/upload/{id}")
    public Etat updateWithFile(
            @PathVariable Long id,
            @RequestParam String code,
            @RequestParam String nom,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String frequence,
            @RequestParam Long domaineId,
            @RequestParam(required = false) MultipartFile file,
            HttpSession session
    ) throws IOException {

        checkAdmin(session);

        Etat etat = etatRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Etat not found"));

        Domaine domaine = domaineRepository.findById(domaineId)
                .orElseThrow(() -> new NotFoundException("Domaine not found"));

        etat.setCode(code);
        etat.setNom(nom);
        etat.setDescription(description);
        etat.setFrequence(frequence);
        etat.setDomaine(domaine);

        if (file != null && !file.isEmpty()) {

            String uploadDir = System.getProperty("user.dir") + "/etatsFile/";
            File dir = new File(uploadDir);

            if (!dir.exists()) {
                dir.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = uploadDir + fileName;

            file.transferTo(new File(filePath));

            etat.setUploadPath("http://localhost:8080/etatsFile/" + fileName);
        }

        return etatRepository.save(etat);
    }

    // 🔥 GET ALL
    @GetMapping
    public List<EtatResponse> getAll(HttpSession session) {

        checkAdmin(session);

        return etatRepository.findAll()
                .stream()
                .map(e -> new EtatResponse(
                        e.getId(),
                        e.getCode(),
                        e.getNom(),
                        e.getDescription(),
                        e.getFrequence(),
                        e.getUploadPath(),
                        e.getDomaine().getName()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public Etat getById(@PathVariable Long id,
                        HttpSession session) {

        checkAdmin(session);

        return etatRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Etat not found"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id,
                       HttpSession session) {

        checkAdmin(session);

        etatRepository.deleteById(id);
    }

    @GetMapping("/search")
    public List<Etat> searchByCode(@RequestParam String code,
                                   HttpSession session) {

        checkAdmin(session);

        return etatRepository.findByCodeContainingIgnoreCase(code);
    }
}