package com.example.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.EtatRequest;
import com.example.demo.dto.EtatResponse;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.entity.Domaine;
import com.example.demo.model.entity.Etat;
import com.example.demo.repository.DomaineRepository;
import com.example.demo.repository.EtatRepository;
import com.example.demo.service.interfaces.EtatService;

@Service
public class EtatServiceImpl implements EtatService {

    @Autowired
    private EtatRepository etatRepository;

    @Autowired
    private DomaineRepository domaineRepository;

    @Override
    public Etat create(EtatRequest request) {

        Domaine domaine = domaineRepository.findById(request.getDomaineId())
                .orElseThrow(() -> new NotFoundException("Domaine not found"));

        Etat etat = new Etat();
        etat.setCode(request.getCode());
        etat.setNom(request.getNom());
        etat.setDescription(request.getDescription());
        etat.setFrequence(request.getFrequence());
        etat.setUploadPath(request.getUploadPath());
        etat.setDomaine(domaine);

        return etatRepository.save(etat);
    }
    
    @Override
    public Etat update(Long id, EtatRequest request) {

        Etat etat = etatRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Etat not found"));

        Domaine domaine = domaineRepository.findById(request.getDomaineId())
                .orElseThrow(() -> new NotFoundException("Domaine not found"));

        etat.setCode(request.getCode());
        etat.setNom(request.getNom());
        etat.setDescription(request.getDescription());
        etat.setFrequence(request.getFrequence());
        etat.setUploadPath(request.getUploadPath());
        etat.setDomaine(domaine);

        return etatRepository.save(etat);
    }

    @Override
    public Etat getById(Long id) {
        return etatRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Etat not found"));
    }

    @Override
    public Etat getByCode(String code) {
        return etatRepository.findByCode(code)
                .orElseThrow(() -> new NotFoundException("Etat not found"));
    }

    @Override
    public void delete(Long id) {
        Etat etat = etatRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Etat not found"));
        etatRepository.delete(etat);
    }

    @Override
    public List<EtatResponse> getAll() {
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

    @Override
    public List<Etat> searchByNom(String nom) {
        return etatRepository.findByNomContainingIgnoreCase(nom);
    }
    
    @Override
    public List<Etat> searchByCode(String code) {
    return etatRepository.findByCodeContainingIgnoreCase(code);
    }

    @Override
    public List<Etat> findByDomaineId(Long domaineId) {
        return etatRepository.findAll().stream()
                .filter(e -> e.getDomaine() != null && e.getDomaine().getId().equals(domaineId))
                .toList();
    }
    
    
}