package com.gestionflotte.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
public class Devis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double montant;

    private String statut = "PENDING";

    private String fichier;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;

    @OneToOne
    @JoinColumn(name = "intervention_id")
    private Intervention intervention;

    @Column(name = "token_validation", unique = true)
    private String tokenValidation;

    @Column(name = "statut_client")
    private String statutClient = "EN_ATTENTE";

    @Column(name = "date_validation")
    private LocalDateTime dateValidation;

    @Column(name = "commentaire_client", columnDefinition = "TEXT")
    private String commentaireClient;

    @PrePersist
    public void prePersist() {
        if (dateCreation == null) {
            dateCreation = new Date();
        }

        if (statut == null) {
            statut = "PENDING";
        }

        if (statutClient == null) {
            statutClient = "EN_ATTENTE";
        }
    }
}