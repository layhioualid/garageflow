package com.gestionflotte.backend.controller;

import com.gestionflotte.backend.entity.Intervention;
import com.gestionflotte.backend.service.InterventionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interventions")
@CrossOrigin("*")
public class InterventionController {

    private final InterventionService service;

    public InterventionController(InterventionService service) {
        this.service = service;
    }

    @PostMapping
    public Intervention create(@RequestBody Intervention i) {
        return service.save(i);
    }

    @GetMapping
    public List<Intervention> getAll() {
        return service.getAll();
    }

    @GetMapping("/vehicule/{id}")
    public List<Intervention> getByVehicule(@PathVariable Long id) {
        return service.getByVehicule(id);
    }

    @PutMapping("/{id}")
    public Intervention update(@PathVariable Long id, @RequestBody Intervention i) {
    return service.update(id, i); // ✅ CORRECT
}

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}