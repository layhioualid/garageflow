package com.gestionflotte.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.UUID;

@Entity
@Data
public class Intervention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "date_debut")
    private LocalDateTime dateDebut;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "date_fin")
    private LocalDateTime dateFin;

    @Column(name = "type_panne")
    private String typePanne;
    private String description;

    @Column(name = "numero_ordre_reparation", unique = true, updatable = false)
    private String numeroOrdreReparation;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "ordre_reparation_besoins",
            joinColumns = @JoinColumn(name = "intervention_id")
    )
    @Column(name = "besoin_client", columnDefinition = "TEXT", nullable = false)
    private List<String> besoinsClient = new ArrayList<>();

    private double cout;
    private double duree;

    private String statut;

    @ManyToOne
    private Vehicule vehicule;
    
    
    @ManyToOne
    private Utilisateur technicien;

    @OneToMany(mappedBy = "intervention", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<LigneInterventionPiece> pieces;
    
    @PrePersist
    @PreUpdate
    public void preparerIntervention() {
        if (numeroOrdreReparation == null || numeroOrdreReparation.isBlank()) {
            String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String suffixe = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            numeroOrdreReparation = "OR-" + date + "-" + suffixe;
        }

        if (dateDebut != null && dateFin != null) {
            this.duree = java.time.Duration.between(dateDebut, dateFin).toHours();
        }
    }
}
