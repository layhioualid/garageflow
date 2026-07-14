package com.gestionflotte.backend.controller;

import com.gestionflotte.backend.entity.Vehicule;
import com.gestionflotte.backend.service.VehiculeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicules")
@CrossOrigin("*")
public class VehiculeController {

    private final VehiculeService service;

    public VehiculeController(VehiculeService service) {
        this.service = service;
    }

    @PostMapping
    public Vehicule create(@RequestBody Vehicule v) {
        return service.save(v);
    }

    @GetMapping
    public List<Vehicule> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Vehicule getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/disponibles")
    public List<Vehicule> disponibles() {
        return service.getAll();
    }

    @PutMapping("/{id}")
    public Vehicule update(@PathVariable Long id, @RequestBody Vehicule v) {
        v.setId(id);
        return service.save(v);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
