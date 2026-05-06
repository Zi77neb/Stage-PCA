package com.example.demo.model.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "domaines")
public class Domaine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // ✅ Banque ↔ Domaine (ManyToMany)
    @ManyToMany(mappedBy = "domaines")
    @JsonIgnore
    private Set<Banque> banques = new HashSet<>();

    // ✅ Domaine ↔ Etat (OneToMany indirect via Etat)
    @OneToMany(mappedBy = "domaine")
    @JsonIgnore
    private Set<Etat> etats = new HashSet<>();

    // ✅ Domaine ↔ User
    @ManyToMany(mappedBy = "domaines")
    @JsonIgnore
    private Set<User> users = new HashSet<>();

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

    public Set<Banque> getBanques() {
        return banques;
    }

    public void setBanques(Set<Banque> banques) {
        this.banques = banques;
    }

    public Set<Etat> getEtats() {
        return etats;
    }

    public void setEtats(Set<Etat> etats) {
        this.etats = etats;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }
}