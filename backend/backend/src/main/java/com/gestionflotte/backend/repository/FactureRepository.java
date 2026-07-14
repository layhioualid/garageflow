package com.gestionflotte.backend.repository;

import com.gestionflotte.backend.entity.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface FactureRepository extends JpaRepository<Facture, Long> {
    boolean existsByInterventionId(Long interventionId);
    Optional<Facture> findByInterventionId(Long interventionId);
}