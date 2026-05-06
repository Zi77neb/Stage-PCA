package com.example.demo.service.interfaces;

import java.util.List;
import java.util.Set;

import com.example.demo.dto.DomaineRequest;
import com.example.demo.dto.DomaineResponse;
import com.example.demo.model.entity.Domaine;

public interface DomaineService {

    Domaine create(DomaineRequest request);

    Domaine update(Long id, DomaineRequest request);

    List<Domaine> getAll();

    List<DomaineResponse> getAllWithBanque();

    Domaine getById(Long id);

    void delete(Long id);

    List<Domaine> searchByName(String name);

    List<Domaine> findByBanqueId(Long banqueId);

    Domaine assignBanques(Long domaineId, Set<Long> banqueIds);
}