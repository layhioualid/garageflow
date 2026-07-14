package com.gestionflotte.backend.repository;

import com.gestionflotte.backend.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    List<Utilisateur> findByRole(String role);

    Optional<Utilisateur> findByEmail(String email);
}