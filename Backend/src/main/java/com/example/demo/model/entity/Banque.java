package com.example.demo.model.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "banques")
public class Banque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // ✅ Banque ↔ Domaine
    @ManyToMany
    @JoinTable(
        name = "banque_domaine",
        joinColumns = @JoinColumn(name = "banque_id"),
        inverseJoinColumns = @JoinColumn(name = "domaine_id")
    )
    private Set<Domaine> domaines = new HashSet<>();

    // ✅ AJOUT : Banque ↔ Etat (nécessaire pour gestion fine)
    @ManyToMany
    @JoinTable(
        name = "banque_etat",
        joinColumns = @JoinColumn(name = "banque_id"),
        inverseJoinColumns = @JoinColumn(name = "etat_id")
    )
    private Set<Etat> etats = new HashSet<>();

    @ManyToMany(mappedBy = "banques")
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

    public Set<Domaine> getDomaines() {
        return domaines;
    }

    public void setDomaines(Set<Domaine> domaines) {
        this.domaines = domaines;
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