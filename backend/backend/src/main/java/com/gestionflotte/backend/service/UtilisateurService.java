package com.gestionflotte.backend.service;

import com.gestionflotte.backend.entity.Utilisateur;
import com.gestionflotte.backend.repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UtilisateurService {

    private final UtilisateurRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Utilisateur> getAll() {
        return repo.findAll();
    }

    public Utilisateur getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    public List<Utilisateur> getByRole(String role) {
        return repo.findByRole(role);
    }

    public List<Utilisateur> getTechniciens() {
        return repo.findByRole("TECHNICIEN");
    }

    public Utilisateur save(Utilisateur u) {

        if (repo.findByEmail(u.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        if (u.getMotDePasse() != null && !u.getMotDePasse().isBlank()) {
            if (!u.getMotDePasse().startsWith("$2a$")
                    && !u.getMotDePasse().startsWith("$2b$")
                    && !u.getMotDePasse().startsWith("$2y$")) {
                u.setMotDePasse(passwordEncoder.encode(u.getMotDePasse()));
            }
        }

        return repo.save(u);
    }

    public Utilisateur update(Long id, Utilisateur newU) {
        Utilisateur u = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        repo.findByEmail(newU.getEmail()).ifPresent(existingUser -> {
            if (!existingUser.getId().equals(id)) {
                throw new RuntimeException("Email déjà utilisé par un autre utilisateur");
            }
        });

        u.setNom(newU.getNom());
        u.setPrenom(newU.getPrenom());
        u.setEmail(newU.getEmail());
        u.setRole(newU.getRole());
        u.setSpecialite(newU.getSpecialite());
        u.setTelephone(newU.getTelephone());

        if (newU.getMotDePasse() != null && !newU.getMotDePasse().isBlank()) {
            if (!newU.getMotDePasse().startsWith("$2a$")
                    && !newU.getMotDePasse().startsWith("$2b$")
                    && !newU.getMotDePasse().startsWith("$2y$")) {
                u.setMotDePasse(passwordEncoder.encode(newU.getMotDePasse()));
            } else {
                u.setMotDePasse(newU.getMotDePasse());
            }
        }

        return repo.save(u);
    }

    public Utilisateur updateProfile(Long id, Utilisateur newU) {
        Utilisateur u = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        repo.findByEmail(newU.getEmail()).ifPresent(existingUser -> {
            if (!existingUser.getId().equals(id)) {
                throw new RuntimeException("Email déjà utilisé par un autre utilisateur");
            }
        });

        u.setNom(newU.getNom());
        u.setPrenom(newU.getPrenom());
        u.setEmail(newU.getEmail());
        u.setTelephone(newU.getTelephone());

        return repo.save(u);
    }

    public void updatePassword(Long id, String ancienMotDePasse, String nouveauMotDePasse) {
        Utilisateur u = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (ancienMotDePasse == null || ancienMotDePasse.isBlank()) {
            throw new RuntimeException("Ancien mot de passe obligatoire");
        }

        if (nouveauMotDePasse == null || nouveauMotDePasse.isBlank()) {
            throw new RuntimeException("Nouveau mot de passe obligatoire");
        }

        if (nouveauMotDePasse.length() < 6) {
            throw new RuntimeException("Le nouveau mot de passe doit contenir au moins 6 caractères");
        }

        if (!passwordEncoder.matches(ancienMotDePasse, u.getMotDePasse())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }

        u.setMotDePasse(passwordEncoder.encode(nouveauMotDePasse));

        repo.save(u);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}