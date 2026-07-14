package com.gestionflotte.backend.service;

import com.gestionflotte.backend.entity.Achat;
import com.gestionflotte.backend.entity.Fournisseur;
import com.gestionflotte.backend.entity.Piece;
import com.gestionflotte.backend.repository.AchatRepository;
import com.gestionflotte.backend.repository.PieceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.gestionflotte.backend.repository.FournisseurRepository;

import java.util.List;

@Service
public class AchatService {

    @Autowired
    private AchatRepository achatRepo;

    @Autowired
    private PieceRepository pieceRepo;
    @Autowired
    private FournisseurRepository fournisseurRepo;

public Achat create(Achat a) {

    // 🔥 récupérer pièce réelle
    Piece p = pieceRepo.findById(a.getPiece().getId())
            .orElseThrow(() -> new RuntimeException("Piece introuvable"));

    // 🔥 récupérer fournisseur réel
    Fournisseur f = fournisseurRepo.findById(a.getFournisseur().getId())
            .orElseThrow(() -> new RuntimeException("Fournisseur introuvable"));

    // 🔥 IMPORTANT : remplacer objets incomplets
    a.setPiece(p);
    a.setFournisseur(f);

    // 🔥 calcul
    double total = p.getPrix() * a.getQuantite();
    a.setMontantTotal(total);

    // 🔥 update stock
    p.setQuantiteStock(p.getQuantiteStock() + a.getQuantite());
    pieceRepo.save(p);

    return achatRepo.save(a);
}
    // 📄 GET ALL
    public List<Achat> getAll() {
        return achatRepo.findAll();
    }

    // 🔍 GET BY ID
    public Achat getById(Long id) {
        return achatRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Achat introuvable"));
    }

    // ❌ DELETE
    public void delete(Long id) {
        Achat a = getById(id);

        // 🔥 OPTION PRO : rollback stock si suppression achat
        Piece p = a.getPiece();
        p.setQuantiteStock(p.getQuantiteStock() - a.getQuantite());
        pieceRepo.save(p);

        achatRepo.delete(a);
    }
}