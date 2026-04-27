package com.example.demo.repository;
import com.example.demo.model.entity.Domaine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DomaineRepository extends JpaRepository<Domaine, Long> {

    List<Domaine> findByBanqueId(Long banqueId);
}