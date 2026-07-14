package com.gestionflotte.backend.service;

import com.gestionflotte.backend.entity.Fournisseur;
import com.gestionflotte.backend.repository.FournisseurRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FournisseurService {

    private final FournisseurRepository repo;

    public FournisseurService(FournisseurRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public Fournisseur create(Fournisseur f) {
        return repo.save(f);
    }

    // GET ALL
    public List<Fournisseur> getAll() {
        return repo.findAll();
    }

    // GET BY ID
    public Fournisseur getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur introuvable"));
    }

    // UPDATE
    public Fournisseur update(Long id, Fournisseur f) {
        Fournisseur existing = getById(id);

        existing.setNom(f.getNom());
        existing.setEmail(f.getEmail());
        existing.setTelephone(f.getTelephone());
        existing.setAdresse(f.getAdresse());
        return repo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        repo.deleteById(id);
    }
}