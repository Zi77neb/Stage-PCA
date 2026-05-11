package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByBanques_IdAndDomaines_IdAndEtats_Id(
            Long banqueId,
            Long domaineId,
            Long etatId
    );
     List<User> findByDomaines_IdAndEtats_Id(
            Long domaineId,
            Long etatId
    );
    
}