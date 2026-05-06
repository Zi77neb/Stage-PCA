package com.example.demo.model.entity;

import java.util.HashSet;
import java.util.Set;

import com.example.demo.model.enums.Role;
import com.example.demo.model.enums.Status;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String fullName;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private Status status;

    private java.time.LocalDateTime createdAt;

    @ManyToMany
    @JoinTable(
        name = "user_banque",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "banque_id")
    )
    private Set<Banque> banques = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "user_domaine",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "domaine_id")
    )
    private Set<Domaine> domaines = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "user_etat",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "etat_id")
    )
    private Set<Etat> etats = new HashSet<>();

    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Set<Banque> getBanques() { return banques; }
    public void setBanques(Set<Banque> banques) { this.banques = banques; }
    public Set<Domaine> getDomaines() { return domaines; }
    public void setDomaines(Set<Domaine> domaines) { this.domaines = domaines; }
    public Set<Etat> getEtats() { return etats; }
    public void setEtats(Set<Etat> etats) { this.etats = etats; }
}