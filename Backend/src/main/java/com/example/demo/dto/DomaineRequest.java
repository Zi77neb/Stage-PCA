package com.example.demo.dto;

import java.util.Set;

public class DomaineRequest {

    private String name;

    private Set<Long> banqueIds;

    // getters setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Long> getBanqueIds() {
        return banqueIds;
    }

    public void setBanqueIds(Set<Long> banqueIds) {
        this.banqueIds = banqueIds;
    }
}