package com.gestionflotte.backend.controller;

import com.gestionflotte.backend.entity.Fournisseur;
import com.gestionflotte.backend.entity.Piece;
import com.gestionflotte.backend.service.FournisseurService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fournisseurs")
@CrossOrigin("*")
public class FournisseurController {

    private final FournisseurService service;

    public FournisseurController(FournisseurService service) {
        this.service = service;
    }

    @PostMapping
    public Fournisseur create(@RequestBody Fournisseur f) {
        return service.create(f);
    }

    @GetMapping
    public List<Fournisseur> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Fournisseur getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public Fournisseur update(@PathVariable Long id, @RequestBody Fournisseur f) {
        return service.update(id, f);
    }
    @GetMapping("/{id}/pieces")
    public List<Piece> getPiecesByFournisseur(@PathVariable Long id) {
    return service.getById(id).getPieces();
}

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}