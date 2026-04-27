package com.example.demo.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.entity.Banque;
import com.example.demo.repository.BanqueRepository;
import com.example.demo.service.interfaces.BanqueService;

import java.util.List;
@Service
public class BanqueServiceImpl implements BanqueService {

    @Autowired
    private BanqueRepository banqueRepository;

    @Override
    public Banque create(Banque b) {
        return banqueRepository.save(b);
    }

    @Override
    public List<Banque> getAll() {
        return banqueRepository.findAll();
    }

    // 🔥 AJOUT
    @Override
    public Banque getById(Long id) {
        return banqueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banque not found"));
    }

    // 🔥 AJOUT
    @Override
    public void delete(Long id) {
        banqueRepository.deleteById(id);
    }
}