package com.gestionflotte.backend.service;

import com.gestionflotte.backend.entity.Piece;
import com.gestionflotte.backend.repository.PieceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StockService {

    @Autowired
    private PieceRepository pieceRepo;

    // 📦 AJOUT STOCK (ACHAT)
    public void ajouterStock(Long pieceId, int quantite) {

        Piece p = pieceRepo.findById(pieceId)
                .orElseThrow(() -> new RuntimeException("Piece introuvable"));

        p.setQuantiteStock(p.getQuantiteStock() + quantite);

        pieceRepo.save(p);
    }

    // 🔧 RETRAIT STOCK (INTERVENTION)
    public void retirerStock(Long pieceId, int quantite) {

        Piece p = pieceRepo.findById(pieceId)
                .orElseThrow(() -> new RuntimeException("Piece introuvable"));

        if (p.getQuantiteStock() < quantite) {
            throw new RuntimeException("Stock insuffisant pour : " + p.getNom());
        }

        p.setQuantiteStock(p.getQuantiteStock() - quantite);

        pieceRepo.save(p);
    }

    // ⚠️ CHECK STOCK BAS
    public boolean stockFaible(Piece p) {
        return p.getQuantiteStock() <= p.getSeuilAlerte();
    }
}