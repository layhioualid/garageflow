package com.gestionflotte.backend.repository;

import com.gestionflotte.backend.entity.Devis;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DevisRepository extends JpaRepository<Devis, Long> {
    Optional<Devis> findByTokenValidation(String tokenValidation);
}