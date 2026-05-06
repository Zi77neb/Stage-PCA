package com.example.demo.service.interfaces;

import java.util.List;

import com.example.demo.dto.EtatRequest;
import com.example.demo.dto.EtatResponse;
import com.example.demo.model.entity.Etat;
public interface EtatService {

    Etat create(EtatRequest request);

    Etat update(Long id, EtatRequest request);


    Etat getById(Long id);

    Etat getByCode(String code);

    void delete(Long id);
    List<EtatResponse> getAll();
    List<Etat> searchByNom(String nom);

    List<Etat> findByDomaineId(Long domaineId);
    List<Etat> searchByCode(String code);
}