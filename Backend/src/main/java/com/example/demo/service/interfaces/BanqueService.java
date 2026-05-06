package com.example.demo.service.interfaces;

import java.util.List;
import java.util.Set;

import com.example.demo.model.entity.Banque;

public interface BanqueService {

    Banque create(Banque b);

    Banque update(Long id, Banque b);

    List<Banque> getAll();

    Banque getById(Long id);

    void delete(Long id);

    List<Banque> searchByName(String name);

    Banque assignDomaines(Long banqueId, Set<Long> domaineIds);
   // ✅ remettre ça
    Banque assignEtats(Long banqueId, Set<Long> etatIds);
    // ❌ SUPPRIMÉ : les états viennent des domaines
    // Banque assignEtats(Long banqueId, Set<Long> etatIds);
}