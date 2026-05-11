package com.example.demo.dto;

import java.util.Set;

public class DomaineResponse {

    private final Long id;
    private final String name;
    private final Set<String> banqueNames;

    public DomaineResponse(Long id, String name, Set<String> banqueNames) {
        this.id = id;
        this.name = name;
        this.banqueNames = banqueNames;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Set<String> getBanqueNames() {
        return banqueNames;
    }
}