package com.gestionflotte.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Achat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date dateAchat;

    private double montantTotal;

    private int quantite;

    @ManyToOne
    @JoinColumn(name = "piece_id")
    private Piece piece;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;
    
}