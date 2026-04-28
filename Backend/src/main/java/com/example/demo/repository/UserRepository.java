package com.example.demo.repository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    

Optional<User> findByEmail(String email);
      List<User> findByDomaineId(Long domaineId);
}