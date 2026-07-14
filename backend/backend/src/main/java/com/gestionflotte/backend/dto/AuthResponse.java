package com.gestionflotte.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String role;
    private String telephone;
    private String specialite;
}