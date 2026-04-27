package com.example.demo.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;



@Entity
@Table(name = "banques")
public class Banque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String name; // BMCE, ATTIJARI
    @ManyToOne
    private Domaine domaine;
    private LocalDateTime createdAt;
    // getters setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Domaine getDomaine() {
        return domaine;
    }
    public void setDomaine(Domaine domaine) {
        this.domaine = domaine;
    }

}