package com.example.demo.dto;

public class DomaineRequest {

    private String name;
    private Long banqueId;

    // getters setters
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Long getBanqueId() {
        return banqueId;
    }
    public void setBanqueId(Long banqueId) {
        this.banqueId = banqueId;
    }
    
}