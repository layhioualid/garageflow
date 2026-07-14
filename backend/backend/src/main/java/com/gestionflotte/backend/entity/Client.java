package com.gestionflotte.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String prenom;

    @Column(nullable = false)
    private String email;

    private String telephone;

    private String adresse;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "client")
    @JsonIgnore
    private List<Vehicule> vehicules;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}