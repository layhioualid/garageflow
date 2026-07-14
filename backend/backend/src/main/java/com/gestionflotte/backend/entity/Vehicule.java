package com.gestionflotte.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Data
public class Vehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String immatriculation;
    private String marque;
    private String modele;

    private Integer annee;
    private Double kilometrage;

    private String carburant;
    private String transmission;
    private Double engineSize;

    private String statut;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date dateMiseService = new Date();

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
}
