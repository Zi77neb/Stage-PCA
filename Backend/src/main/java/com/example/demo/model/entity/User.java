package com.example.demo.model.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.example.demo.model.enums.Role;
import com.example.demo.model.enums.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(nullable = false)
    private boolean firstLogin = true;

    private LocalDateTime createdAt;

    // =========================
    // RELATIONS
    // =========================

    @ManyToMany
    @JoinTable(
        name = "user_banque",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "banque_id")
    )
    @JsonIgnore
    private Set<Banque> banques = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "user_domaine",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "domaine_id")
    )
    @JsonIgnore
    private Set<Domaine> domaines = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "user_etat",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "etat_id")
    )
    @JsonIgnore
    private Set<Etat> etats = new HashSet<>();

    // =========================
    // AUTO CREATED DATE
    // =========================

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public boolean isFirstLogin() {
        return firstLogin;
    }

    public void setFirstLogin(boolean firstLogin) {
        this.firstLogin = firstLogin;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Set<Banque> getBanques() {
        return banques;
    }

    public void setBanques(Set<Banque> banques) {
        this.banques = banques;
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
}