package com.example.demo.repository;
import com.example.demo.model.entity.Banque;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BanqueRepository extends JpaRepository<Banque, Long> {
}