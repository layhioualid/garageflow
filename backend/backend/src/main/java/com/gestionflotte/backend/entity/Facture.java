package com.gestionflotte.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numero;

    private LocalDateTime dateFacture;

    private Double montantHt;

    private Double tva;

    private Double montantTtc;

    private String statut; // PAID, UNPAID

    @OneToOne
    @JoinColumn(name = "intervention_id")
    private Intervention intervention;
}