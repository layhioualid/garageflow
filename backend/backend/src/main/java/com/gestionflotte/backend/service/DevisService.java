package com.gestionflotte.backend.service;

import com.gestionflotte.backend.entity.Client;
import com.gestionflotte.backend.entity.Devis;
import com.gestionflotte.backend.entity.Intervention;
import com.gestionflotte.backend.entity.Vehicule;
import com.gestionflotte.backend.repository.DevisRepository;
import com.gestionflotte.backend.repository.InterventionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DevisService {

    private final DevisRepository devisRepository;
    private final InterventionRepository interventionRepository;
    private final JavaMailSender mailSender;

    public Devis generateDevis(Long interventionId) {

        Intervention i = interventionRepository.findById(interventionId)
                .orElseThrow(() -> new RuntimeException("Intervention introuvable"));

        Devis d = new Devis();

        d.setIntervention(i);
        d.setMontant(i.getCout());
        d.setDateCreation(new Date());
        d.setStatut("PENDING");

        d.setTokenValidation(UUID.randomUUID().toString());
        d.setStatutClient("EN_ATTENTE");

        return devisRepository.save(d);
    }

    public Devis sendDevisToClient(Long id) {

        Devis devis = devisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Devis introuvable"));

        if (devis.getTokenValidation() == null || devis.getTokenValidation().isEmpty()) {
            devis.setTokenValidation(UUID.randomUUID().toString());
            devis = devisRepository.save(devis);
        }

        Intervention intervention = devis.getIntervention();

        if (intervention == null) {
            throw new RuntimeException("Aucune intervention associée à ce devis");
        }

        Vehicule vehicule = intervention.getVehicule();

        if (vehicule == null) {
            throw new RuntimeException("Aucun véhicule associé à cette intervention");
        }

        Client client = vehicule.getClient();

        if (client == null) {
            throw new RuntimeException("Aucun client associé à ce véhicule");
        }

        if (client.getEmail() == null || client.getEmail().isBlank()) {
            throw new RuntimeException("Le client n'a pas d'adresse email");
        }

        String clientLink = "http://localhost:5173/client/devis/" + devis.getTokenValidation();

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(client.getEmail());
        message.setSubject("Validation de votre devis - GarageFlow+");

        message.setText(
                "Bonjour " + client.getNom() + ",\n\n" +
                "Votre devis concernant votre véhicule est prêt.\n\n" +
                "Véhicule : " + vehicule.getMarque() + " " + vehicule.getModele() + "\n" +
                "Immatriculation : " + vehicule.getImmatriculation() + "\n" +
                "Montant du devis : " + devis.getMontant() + " DH\n\n" +
                "Veuillez consulter et valider votre devis via ce lien :\n" +
                clientLink + "\n\n" +
                "Cordialement,\n" +
                "GarageFlow+"
        );

        mailSender.send(message);

        System.out.println("====================================");
        System.out.println("EMAIL ENVOYÉ AU CLIENT");
        System.out.println("Client : " + client.getEmail());
        System.out.println("Lien : " + clientLink);
        System.out.println("====================================");

        return devis;
    }
}