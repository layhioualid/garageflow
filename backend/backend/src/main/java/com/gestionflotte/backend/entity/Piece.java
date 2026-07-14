package com.gestionflotte.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Piece {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String reference;

    private double prix;

    private int quantiteStock;
    private int seuilAlerte;

    @ManyToOne
    private Fournisseur fournisseur;
}