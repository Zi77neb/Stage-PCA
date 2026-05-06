package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.entity.Etat;

public interface EtatRepository extends JpaRepository<Etat, Long> {
    Optional<Etat> findByCode(String code);
    List<Etat> findByNomContainingIgnoreCase(String nom);
    // Ajoutez d'autres méthodes si besoin
    List<Etat> findByCodeContainingIgnoreCase(String code);
}
