package com.gestionflotte.backend.repository;

import com.gestionflotte.backend.entity.Achat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AchatRepository extends JpaRepository<Achat, Long> {
}