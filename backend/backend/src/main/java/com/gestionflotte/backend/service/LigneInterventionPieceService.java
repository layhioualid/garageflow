package com.gestionflotte.backend.service;

import com.gestionflotte.backend.entity.*;
import com.gestionflotte.backend.repository.*;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class LigneInterventionPieceService {

    private final LigneInterventionPieceRepository repo;
    private final PieceRepository pieceRepo;
    private final InterventionRepository interventionRepo;

    public LigneInterventionPieceService(
            LigneInterventionPieceRepository repo,
            PieceRepository pieceRepo,
            InterventionRepository interventionRepo) {

        this.repo = repo;
        this.pieceRepo = pieceRepo;
        this.interventionRepo = interventionRepo;
    }

   @Transactional
public LigneInterventionPiece addPiece(Long interventionId, Long pieceId, int quantite) {

    if (quantite <= 0) {
        throw new RuntimeException("Quantité invalide");
    }

    Piece piece = pieceRepo.findById(pieceId)
            .orElseThrow(() -> new RuntimeException("Pièce introuvable"));

    Intervention intervention = interventionRepo.findById(interventionId)
            .orElseThrow(() -> new RuntimeException("Intervention introuvable"));

    LigneInterventionPiece existing = repo
            .findByInterventionIdAndPieceId(interventionId, pieceId)
            .orElse(null);

    if (piece.getQuantiteStock() < quantite) {
        throw new RuntimeException("Stock insuffisant !");
    }

    piece.setQuantiteStock(piece.getQuantiteStock() - quantite);
    pieceRepo.save(piece);

    if (existing != null) {
        existing.setQuantite(existing.getQuantite() + quantite);
        return repo.save(existing);
    }

    LigneInterventionPiece ligne = new LigneInterventionPiece();
    ligne.setPiece(piece);
    ligne.setIntervention(intervention);
    ligne.setQuantite(quantite);

    return repo.save(ligne);
}

    public List<LigneInterventionPiece> getByIntervention(Long id) {
        return repo.findByInterventionId(id);
    }
}