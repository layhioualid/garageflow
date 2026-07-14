package com.gestionflotte.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String telephone;
    private String email;
    private String adresse ;
    @JsonIgnore
    @OneToMany(mappedBy = "fournisseur")
    private List<Piece> pieces;
}