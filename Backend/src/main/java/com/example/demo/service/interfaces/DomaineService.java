package com.example.demo.service.interfaces;

import com.example.demo.dto.DomaineRequest;
import com.example.demo.model.entity.Domaine;

import java.util.List;

public interface DomaineService {

    Domaine create(DomaineRequest request);

    List<Domaine> getAll();

    Domaine getById(Long id);

    void delete(Long id);
}