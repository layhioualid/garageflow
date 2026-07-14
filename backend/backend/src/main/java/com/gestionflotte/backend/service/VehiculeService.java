package com.gestionflotte.backend.service;

import com.gestionflotte.backend.entity.Vehicule;
import com.gestionflotte.backend.repository.VehiculeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehiculeService {

    private final VehiculeRepository repo;

    public VehiculeService(VehiculeRepository repo) {
        this.repo = repo;
    }

    public Vehicule save(Vehicule v) {
        return repo.save(v);
    }

    public List<Vehicule> getAll() {
        return repo.findAll();
    }

    public Vehicule getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule introuvable avec ID : " + id));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}