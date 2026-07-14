package com.gestionflotte.backend.repository;

import com.gestionflotte.backend.entity.Piece;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PieceRepository extends JpaRepository<Piece, Long> {

    List<Piece> findByQuantiteStockLessThan(int seuil);
}