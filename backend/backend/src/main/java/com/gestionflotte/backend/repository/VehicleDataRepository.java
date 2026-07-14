package com.gestionflotte.backend.repository;

import com.gestionflotte.backend.entity.PredictionPanne;
import com.gestionflotte.backend.entity.VehicleData;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleDataRepository extends JpaRepository<VehicleData, Long> {
}