package com.gestionflotte.backend.service;

import com.gestionflotte.backend.dto.AuthResponse;
import com.gestionflotte.backend.dto.LoginRequest;
import com.gestionflotte.backend.dto.RegisterRequest;
import com.gestionflotte.backend.entity.Utilisateur;
import com.gestionflotte.backend.repository.UtilisateurRepository;
import com.gestionflotte.backend.Security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        Utilisateur utilisateur = new Utilisateur();

        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setEmail(request.getEmail());
        utilisateur.setTelephone(request.getTelephone());
        utilisateur.setSpecialite(request.getSpecialite());

        utilisateur.setRole(
                request.getRole() != null && !request.getRole().isBlank()
                        ? request.getRole()
                        : "TECHNICIEN"
        );

        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));

        Utilisateur saved = utilisateurRepository.save(utilisateur);

        String token = jwtService.generateToken(saved);

        return new AuthResponse(
                token,
                saved.getId(),
                saved.getNom(),
                saved.getPrenom(),
                saved.getEmail(),
                saved.getRole(),
                saved.getTelephone(),
                saved.getSpecialite()
        );
    }

    public AuthResponse login(LoginRequest request) {

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(request.getMotDePasse(), utilisateur.getMotDePasse())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        String token = jwtService.generateToken(utilisateur);

        return new AuthResponse(
                token,
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.getRole(),
                utilisateur.getTelephone(),
                utilisateur.getSpecialite()
        );
    }
}