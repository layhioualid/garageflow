package com.gestionflotte.backend.entity;
import jakarta.persistence.*;
import lombok.Data;


import java.util.Date;
@Entity
@Data
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    private String type;

    private Date dateAjout = new Date();

    @ManyToOne
    @JoinColumn(name = "intervention_id")
    private Intervention intervention;
    @PrePersist
    public void initDate() {
    this.dateAjout = new Date();
}
}
