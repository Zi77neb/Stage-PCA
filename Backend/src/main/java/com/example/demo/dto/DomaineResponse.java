package com.example.demo.dto;

public class DomaineResponse {

    private Long id;
    private String name;
    private String banqueName;

    public DomaineResponse(Long id, String name, String banqueName) {
        this.id = id;
        this.name = name;
        this.banqueName = banqueName;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getBanqueName() { return banqueName; }
}