package com.example.demo.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.DomaineRequest;
import com.example.demo.dto.DomaineResponse;
import com.example.demo.model.entity.Banque;
import com.example.demo.model.entity.Domaine;
import com.example.demo.repository.BanqueRepository;
import com.example.demo.repository.DomaineRepository;
import com.example.demo.service.interfaces.DomaineService;

@Service
public class DomaineServiceImpl implements DomaineService {

    @Autowired
    private DomaineRepository domaineRepository;

    @Autowired
    private BanqueRepository banqueRepository;

    @Override
    public Domaine create(DomaineRequest request) {
        Domaine d = new Domaine();
        d.setName(request.getName());
        return domaineRepository.save(d);
    }

    @Override
    public List<Domaine> getAll() {
        return domaineRepository.findAll(); 
    }

    @Override
    public Domaine getById(Long id) {
        return domaineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Domaine not found"));
    }

    @Override
    public List<DomaineResponse> getAllWithBanque() {
        return domaineRepository.findAll()
                .stream()
                .map(d -> new DomaineResponse(
                        d.getId(),
                        d.getName(),
                        null // 🔥 pas de relation banque ici
                ))
                .toList();
    }

    @Override
    public List<Domaine> searchByName(String name) {
        return domaineRepository.findAll()
                .stream()
                .filter(d -> d.getName() != null &&
                        d.getName().toLowerCase().contains(name.toLowerCase()))
                .toList();
    }

    @Override
    public List<Domaine> findByBanqueId(Long banqueId) {
        // 🔥 TEMP (si relation pas définie)
        return domaineRepository.findAll();
    }

    @Override
    public Domaine update(Long id, DomaineRequest request) {

        Domaine d = domaineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Domaine not found"));

        d.setName(request.getName());

        return domaineRepository.save(d);
    }

    @Override
    public void delete(Long id) {
        domaineRepository.deleteById(id);
    }

    @Override
    public Domaine assignBanques(Long domaineId, Set<Long> banqueIds) {

        Domaine domaine = domaineRepository.findById(domaineId)
                .orElseThrow(() -> new RuntimeException("Domaine not found"));

        List<Banque> banques = banqueRepository.findAllById(banqueIds);

        // ⚠️ seulement si relation existe dans entity
        try {
            domaine.setBanques(new HashSet<>(banques));
        } catch (Exception e) {
            // si relation n'existe pas → ignore
        }

        return domaineRepository.save(domaine);
    }
}