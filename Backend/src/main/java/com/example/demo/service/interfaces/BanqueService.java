package com.example.demo.service.interfaces;

import com.example.demo.model.entity.Banque;
import java.util.List;
public interface BanqueService {
    Banque create(Banque b);

    List<Banque> getAll();

    Banque getById(Long id);

    void delete(Long id);
}