package com.example.demo.service.interfaces;

import com.example.demo.dto.DomaineRequest;
import com.example.demo.model.entity.Domaine;
import com.example.demo.dto.DomaineResponse;
import java.util.List;

public interface DomaineService {

    Domaine create(DomaineRequest request);
     // ✅ AJOUTER ÇA
    Domaine update(Long id, DomaineRequest request);
    List<Domaine> getAll();
    List<DomaineResponse> getAllWithBanque();
    Domaine getById(Long id);

    void delete(Long id);
}