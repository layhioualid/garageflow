package com.gestionflotte.backend.repository;

import com.gestionflotte.backend.entity.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterventionRepository extends JpaRepository<Intervention, Long> {

    List<Intervention> findByVehiculeId(Long vehiculeId);
}