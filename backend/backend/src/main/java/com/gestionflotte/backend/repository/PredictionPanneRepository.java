package com.gestionflotte.backend.repository;

import com.gestionflotte.backend.entity.PredictionPanne;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PredictionPanneRepository extends JpaRepository<PredictionPanne, Long> {
}