package com.gestionflotte.backend.repository;

import com.gestionflotte.backend.entity.LigneInterventionPiece;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LigneInterventionPieceRepository extends JpaRepository<LigneInterventionPiece, Long> {

    List<LigneInterventionPiece> findByInterventionId(Long interventionId);

    Optional<LigneInterventionPiece> findByInterventionIdAndPieceId(Long interventionId, Long pieceId);

    @Modifying
    @Query("DELETE FROM LigneInterventionPiece l WHERE l.intervention.id = :interventionId")
    void deleteByInterventionId(@Param("interventionId") Long interventionId);
}