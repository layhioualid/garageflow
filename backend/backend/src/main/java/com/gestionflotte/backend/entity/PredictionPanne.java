package com.gestionflotte.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prediction_panne")
public class PredictionPanne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_data_id")
    private Long vehicleDataId;

    private Double probabilite;

    @Column(name = "niveau_risque")
    private String niveauRisque;

    @Column(name = "date_prediction")
    private LocalDateTime datePrediction;

    @Column(name = "recommendation", length = 2000)
    private String recommendation;

    public Long getId() {
        return id;
    }

    public Long getVehicleDataId() {
        return vehicleDataId;
    }

    public void setVehicleDataId(Long vehicleDataId) {
        this.vehicleDataId = vehicleDataId;
    }

    public Double getProbabilite() {
        return probabilite;
    }

    public void setProbabilite(Double probabilite) {
        this.probabilite = probabilite;
    }

    public String getNiveauRisque() {
        return niveauRisque;
    }

    public void setNiveauRisque(String niveauRisque) {
        this.niveauRisque = niveauRisque;
    }

    public LocalDateTime getDatePrediction() {
        return datePrediction;
    }

    public void setDatePrediction(LocalDateTime datePrediction) {
        this.datePrediction = datePrediction;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}