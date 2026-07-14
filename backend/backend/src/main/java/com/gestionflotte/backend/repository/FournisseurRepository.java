package com.gestionflotte.backend.repository;

import com.gestionflotte.backend.entity.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {
}