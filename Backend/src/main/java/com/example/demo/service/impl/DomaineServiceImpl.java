package com.example.demo.service.impl;

import com.example.demo.dto.DomaineRequest;
import com.example.demo.model.entity.Banque;
import com.example.demo.model.entity.Domaine;
import com.example.demo.repository.BanqueRepository;
import com.example.demo.repository.DomaineRepository;
import com.example.demo.service.interfaces.DomaineService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class DomaineServiceImpl implements DomaineService {

    @Autowired
    private DomaineRepository domaineRepository;

    @Autowired
    private BanqueRepository banqueRepository;

    @Override
    public Domaine create(DomaineRequest request) {

        Banque banque = banqueRepository.findById(request.getBanqueId())
                .orElseThrow(() -> new RuntimeException("Banque not found"));

        Domaine d = new Domaine();
        d.setName(request.getName());
        d.setBanque(banque);

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
    public void delete(Long id) {
        domaineRepository.deleteById(id);
    }
}