    package com.example.demo.repository;
import com.example.demo.model.entity.Code;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface CodeRepository extends JpaRepository<Code, Long> {

    Optional<Code> findByCode(String code);
}