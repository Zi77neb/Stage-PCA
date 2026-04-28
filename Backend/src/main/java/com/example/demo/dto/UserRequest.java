package com.example.demo.dto;


public class UserRequest {

    private String username;
    private String fullName;
    private String email;
    private String role;
    private Long domaineId;
    private Long banqueId;
    private String password;

public String getPassword() {
    return password;
}

public void setPassword(String password) {
    this.password = password;
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
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
    public Long getDomaineId() {
        return domaineId;
    }
    public void setDomaineId(Long domaineId) {
        this.domaineId = domaineId;
    }
    public Long getBanqueId() {
        return banqueId;
    }
    public void setBanqueId(Long banqueId) {
        this.banqueId = banqueId;
    }
}