package com.example.demo.dto;

import java.util.Set;

public class BanqueRequest {

    private String name;

    private Set<Long> domaineIds;

    // ✅ AJOUT : nécessaire pour stocker les états dans la banque
    private Set<Long> etatIds;

    // getters setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Long> getDomaineIds() {
        return domaineIds;
    }

    public void setDomaineIds(Set<Long> domaineIds) {
        this.domaineIds = domaineIds;
    }

    public Set<Long> getEtatIds() {
        return etatIds;
    }

    public void setEtatIds(Set<Long> etatIds) {
        this.etatIds = etatIds;
    }
}