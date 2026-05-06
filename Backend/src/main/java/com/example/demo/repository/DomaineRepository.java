package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.entity.Domaine;

public interface DomaineRepository extends JpaRepository<Domaine, Long> {

    List<Domaine> findByBanques_Id(Long banqueId);
}