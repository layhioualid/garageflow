package com.gestionflotte.backend.controller;

import com.gestionflotte.backend.entity.Piece;
import com.gestionflotte.backend.service.PieceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pieces")
@CrossOrigin("*")
public class PieceController {

    private final PieceService service;

    public PieceController(PieceService service) {
        this.service = service;
    }

    @PostMapping
    public Piece create(@RequestBody Piece p) {
        return service.save(p);
    }

    @GetMapping
    public List<Piece> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Piece getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public Piece update(@PathVariable Long id, @RequestBody Piece p) {
        p.setId(id);
        return service.save(p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // 🔥 UPDATE STOCK
    @PutMapping("/{id}/stock")
    public Piece updateStock(@PathVariable Long id, @RequestParam int qte) {
        return service.updateStock(id, qte);
    }

    // 🔥 LOW STOCK ALERT
    @GetMapping("/low-stock")
    public List<Piece> lowStock() {
        return service.getLowStock();
    }
}