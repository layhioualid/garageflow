package com.gestionflotte.backend.controller;

import com.gestionflotte.backend.entity.Devis;
import com.gestionflotte.backend.entity.Intervention;
import com.gestionflotte.backend.repository.DevisRepository;
import com.gestionflotte.backend.repository.InterventionRepository;
import com.gestionflotte.backend.service.DevisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/devis")
@CrossOrigin("*")
@RequiredArgsConstructor
public class DevisController {

    private final DevisService devisService;
    private final DevisRepository devisRepository;
    private final InterventionRepository interventionRepository;

    @PostMapping("/generate/{interventionId}")
    public Devis generate(@PathVariable Long interventionId) {
        return devisService.generateDevis(interventionId);
    }

    @GetMapping
    public List<Devis> all() {
        return devisRepository.findAll();
    }

    @GetMapping("/{id}")
    public Devis findById(@PathVariable Long id) {
        return devisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Devis introuvable"));
    }

    @PutMapping("/approve/{id}")
    public Devis approve(@PathVariable Long id) {

        Devis d = devisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Devis introuvable"));

        d.setStatut("APPROVED");

        Intervention intervention = d.getIntervention();

        if (intervention != null) {
            intervention.setStatut("IN_PROGRESS");
            interventionRepository.save(intervention);
        }

        return devisRepository.save(d);
    }

    @PutMapping("/reject/{id}")
    public Devis reject(@PathVariable Long id) {

        Devis d = devisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Devis introuvable"));

        d.setStatut("REJECTED");

        return devisRepository.save(d);
    }

    /*
     * ============================================================
     * ENVOI DU LIEN AU CLIENT PAR EMAIL
     * ============================================================
     */

    @PostMapping("/{id}/send-client")
    public ResponseEntity<?> sendToClient(@PathVariable Long id) {
        try {
            Devis devis = devisService.sendDevisToClient(id);
            return ResponseEntity.ok(devis);
        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(java.util.Map.of(
                            "message", e.getMessage()
                    ));
        }
    }

    /*
     * ============================================================
     * PARTIE PUBLIQUE : VALIDATION DU DEVIS PAR LE CLIENT
     * ============================================================
     */

    @GetMapping("/public/{token}")
    public Devis getDevisByToken(@PathVariable String token) {
        return devisRepository.findByTokenValidation(token)
                .orElseThrow(() -> new RuntimeException("Lien invalide ou devis introuvable"));
    }

    @PostMapping("/public/{token}/accept")
    public Devis acceptByClient(
            @PathVariable String token,
            @RequestBody(required = false) Map<String, String> body
    ) {
        Devis d = devisRepository.findByTokenValidation(token)
                .orElseThrow(() -> new RuntimeException("Lien invalide ou devis introuvable"));

        d.setStatutClient("ACCEPTE");
        d.setStatut("APPROVED");
        d.setDateValidation(LocalDateTime.now());

        if (body != null) {
            d.setCommentaireClient(body.get("commentaire"));
        }

        Intervention intervention = d.getIntervention();

        if (intervention != null) {
            intervention.setStatut("IN_PROGRESS");
            interventionRepository.save(intervention);
        }

        return devisRepository.save(d);
    }

    @PostMapping("/public/{token}/reject")
    public Devis rejectByClient(
            @PathVariable String token,
            @RequestBody(required = false) Map<String, String> body
    ) {
        Devis d = devisRepository.findByTokenValidation(token)
                .orElseThrow(() -> new RuntimeException("Lien invalide ou devis introuvable"));

        d.setStatutClient("REFUSE");
        d.setStatut("REJECTED");
        d.setDateValidation(LocalDateTime.now());

        if (body != null) {
            d.setCommentaireClient(body.get("commentaire"));
        }

        return devisRepository.save(d);
    }

    @GetMapping("/public/{token}/suivi")
    public Devis getSuiviClient(@PathVariable String token) {
    return devisRepository.findByTokenValidation(token)
            .orElseThrow(() -> new RuntimeException("Lien invalide ou devis introuvable"));
}
}