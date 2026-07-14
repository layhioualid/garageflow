package com.gestionflotte.backend.Security;

import com.gestionflotte.backend.entity.Utilisateur;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    /*
     * La clé doit être assez longue pour HS256.
     * Ne mets pas de clé courte.
     */
    private static final String SECRET_KEY =
            "garageflow_secret_key_2026_secure_very_long_key_for_jwt_authentication";

    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;
    // 24 heures

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Utilisateur utilisateur) {
        return Jwts.builder()
                .setSubject(utilisateur.getEmail())
                .claim("id", utilisateur.getId())
                .claim("nom", utilisateur.getNom())
                .claim("prenom", utilisateur.getPrenom())
                .claim("role", utilisateur.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, Utilisateur utilisateur) {
        String email = extractEmail(token);
        return email.equals(utilisateur.getEmail()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token)
                .getExpiration()
                .before(new Date());
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}