package com.gestionflotte.backend.entity;
import jakarta.persistence.*;
import lombok.Data;


import java.util.Date;

@Entity
@Data
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private String fichier; // URL ou path

    private Date dateCreation = new Date();

    @ManyToOne
    private Vehicule vehicule;
}
