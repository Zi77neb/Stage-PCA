package com.example.demo.model.entity;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;


@Entity
@Table(name = "domaines")
public class Domaine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // FINANCE, RH, IT
      @ManyToOne
    private Banque banque;

    // getters setters
    public Long getId() {
        return id;
    }
    public Banque getBanque() {
    return banque;
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
    public Domaine() {
    }
    public Domaine(String name) {
        this.name = name;
    }
    public Domaine(Long id, String name) {
        this.id = id;
        this.name = name;
    }
    public Domaine(String name, Domaine domaine) {
        this.name = name;
    }
    public Domaine(Long id, String name, Domaine domaine) {
        this.id = id;
        this.name = name;
    }
     public void setBanque(Banque banque) { 
        this.banque = banque;
    }

}