package com.example.demo.dto;


import java.util.List;

public class UserRequest {
    private String username;
    private String fullName;
    private String email;
    private String role;
    private String password;

    // Nouvelles propriétés pour l'affectation multiple
    private List<Long> banqueIds;
    private List<Long> domaineIds;
    private List<Long> etatIds;

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<Long> getBanqueIds() { return banqueIds; }
    public void setBanqueIds(List<Long> banqueIds) { this.banqueIds = banqueIds; }
    public List<Long> getDomaineIds() { return domaineIds; }
    public void setDomaineIds(List<Long> domaineIds) { this.domaineIds = domaineIds; }
    public List<Long> getEtatIds() { return etatIds; }
    public void setEtatIds(List<Long> etatIds) { this.etatIds = etatIds; }
}