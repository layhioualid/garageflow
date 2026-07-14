package com.gestionflotte.backend.repository;

import com.gestionflotte.backend.entity.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    long countByStatut(String statut);
}
