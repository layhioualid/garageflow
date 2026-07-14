package com.gestionflotte.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Data
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @Column(unique = true, nullable = false)
    private String email;

    private String motDePasse;

    private String role; // ADMIN, TECHNICIEN, GESTIONNAIRE

    private String specialite;
    private String telephone;

    private Date dateCreation = new Date();

    @OneToMany(mappedBy = "technicien")
    @JsonIgnore
    private List<Intervention> interventions;
}