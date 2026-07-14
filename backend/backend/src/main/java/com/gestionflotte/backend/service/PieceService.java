package com.gestionflotte.backend.service;

import com.gestionflotte.backend.entity.Piece;
import com.gestionflotte.backend.repository.PieceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PieceService {

    private final PieceRepository repo;

    public PieceService(PieceRepository repo) {
        this.repo = repo;
    }

    public Piece save(Piece p) {
        return repo.save(p);
    }

    public List<Piece> getAll() {
        return repo.findAll();
    }

    public Piece getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    // 🔥 STOCK MANAGEMENT
    public Piece updateStock(Long id, int quantite) {
        Piece p = getById(id);
        if (p != null) {
            p.setQuantiteStock(p.getQuantiteStock() + quantite);
            return repo.save(p);
        }
        return null;
    }

    // 🔥 ALERT STOCK
    public List<Piece> getLowStock() {
        return repo.findByQuantiteStockLessThan(5);
    }
}