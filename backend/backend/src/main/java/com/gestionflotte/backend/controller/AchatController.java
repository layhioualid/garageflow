package com.gestionflotte.backend.controller;

import com.gestionflotte.backend.entity.Achat;
import com.gestionflotte.backend.service.AchatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achats")
@CrossOrigin("*")
public class AchatController {

    @Autowired
    private AchatService service;

    // 📦 1. CREATE ACHAT + STOCK AUTO
    @PostMapping
    public Achat create(@RequestBody Achat a) {
        return service.create(a);
    }

    // 📄 2. GET ALL ACHATS
    @GetMapping
    public List<Achat> getAll() {
        return service.getAll();
    }

    @GetMapping("/stats/total")
    public double totalAchats() {
    return service.getAll()
            .stream()
            .mapToDouble(Achat::getMontantTotal)
            .sum();
}

    // 🔍 3. GET BY ID
    @GetMapping("/{id}")
    public Achat getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // ❌ 4. DELETE ACHAT
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}