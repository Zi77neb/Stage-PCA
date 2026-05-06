package com.example.demo.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exception.NotFoundException;
import com.example.demo.model.entity.Banque;
import com.example.demo.model.entity.Domaine;
import com.example.demo.model.entity.Etat;
import com.example.demo.repository.BanqueRepository;
import com.example.demo.repository.DomaineRepository;
import com.example.demo.repository.EtatRepository;
import com.example.demo.service.interfaces.BanqueService;

@Service
public class BanqueServiceImpl implements BanqueService {

    @Autowired
    private BanqueRepository banqueRepository;

    @Autowired
    private DomaineRepository domaineRepository;

    @Autowired
    private EtatRepository etatRepository;

    @Override
    public Banque create(Banque b) {
        return banqueRepository.save(b);
    }

    @Override
    public Banque update(Long id, Banque b) {
        Banque existing = banqueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Banque not found"));

        existing.setName(b.getName());
        return banqueRepository.save(existing);
    }

    @Override
    public List<Banque> getAll() {
        return banqueRepository.findAll();
    }

    @Override
    public Banque getById(Long id) {
        return banqueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Banque not found"));
    }

    @Override
    public void delete(Long id) {
        Banque banque = banqueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Banque not found"));
        banqueRepository.delete(banque);
    }

    @Override
    public List<Banque> searchByName(String name) {
        return banqueRepository.findAll().stream()
                .filter(b -> b.getName() != null && b.getName().toLowerCase().contains(name.toLowerCase()))
                .toList();
    }

    @Override
    public Banque assignDomaines(Long banqueId, Set<Long> domaineIds) {
        Banque banque = banqueRepository.findById(banqueId)
                .orElseThrow(() -> new NotFoundException("Banque not found"));

        Set<Domaine> domaines = new HashSet<>(domaineRepository.findAllById(domaineIds));
        banque.setDomaines(domaines);

        return banqueRepository.save(banque);
    }

    @Override
    public Banque assignEtats(Long banqueId, Set<Long> etatIds) {

        Banque banque = banqueRepository.findById(banqueId)
                .orElseThrow(() -> new NotFoundException("Banque not found"));

        Set<Etat> etats = new HashSet<>(etatRepository.findAllById(etatIds));

        for (Etat etat : etats) {
            if (etat.getDomaine() == null ||
                !banque.getDomaines().contains(etat.getDomaine())) {
                throw new IllegalArgumentException("Etat hors domaine de la banque");
            }
        }

        banque.setEtats(etats);

        return banqueRepository.save(banque);
    }
}