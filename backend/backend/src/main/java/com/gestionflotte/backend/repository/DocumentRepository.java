package com.gestionflotte.backend.repository;

import com.gestionflotte.backend.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByVehiculeId(Long vehiculeId);
}