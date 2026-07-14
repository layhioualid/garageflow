package com.gestionflotte.backend.controller;

import com.gestionflotte.backend.entity.Utilisateur;
import com.gestionflotte.backend.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UtilisateurController {

    private final UtilisateurService service;

    public UtilisateurController(UtilisateurService service) {
        this.service = service;
    }

    @GetMapping
    public List<Utilisateur> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @GetMapping("/role/{role}")
    public List<Utilisateur> getByRole(@PathVariable String role) {
        return service.getByRole(role);
    }

    @GetMapping("/techniciens")
    public List<Utilisateur> getTechniciens() {
        return service.getTechniciens();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Utilisateur u) {
        try {
            return ResponseEntity.ok(service.save(u));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Utilisateur u) {
        try {
            return ResponseEntity.ok(service.update(id, u));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody Utilisateur u
    ) {
        try {
            return ResponseEntity.ok(service.updateProfile(id, u));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> updatePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        try {
            String ancienMotDePasse = body.get("ancienMotDePasse");
            String nouveauMotDePasse = body.get("nouveauMotDePasse");

            service.updatePassword(id, ancienMotDePasse, nouveauMotDePasse);

            return ResponseEntity.ok(
                    Map.of("message", "Mot de passe modifié avec succès")
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}