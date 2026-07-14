package com.gestionflotte.backend.controller;

import com.gestionflotte.backend.entity.Facture;
import com.gestionflotte.backend.repository.FactureRepository;
import com.gestionflotte.backend.service.FactureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/factures")
@CrossOrigin("*")
@RequiredArgsConstructor
public class FactureController {

    private final FactureService factureService;
    private final FactureRepository factureRepository;

    @PostMapping("/generate/{interventionId}")
    public Facture generate(@PathVariable Long interventionId) {
        return factureService.generateFacture(interventionId);
    }

    @GetMapping
    public List<Facture> all() {
        return factureRepository.findAll();
    }

    @PutMapping("/pay/{id}")
    public Facture pay(@PathVariable Long id) {
        Facture f = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        f.setStatut("PAID");

        return factureRepository.save(f);
    }

    /*
     * ============================================================
     * ENVOI AUTOMATIQUE DE LA FACTURE AU CLIENT
     * ============================================================
     */
    @PostMapping("/{id}/send-client")
    public Facture sendFactureToClient(@PathVariable Long id) {
        return factureService.sendFactureToClient(id);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) throws Exception {

        byte[] pdf = factureService.generatePdf(id);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=facture-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/{id}/print")
    public ResponseEntity<byte[]> printPdf(@PathVariable Long id) throws Exception {

        byte[] pdf = factureService.generatePdf(id);

        return ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=facture-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PutMapping("/{id}")
    public Facture update(@PathVariable Long id, @RequestBody Facture facture) {
        return factureService.update(id, facture);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        factureRepository.deleteById(id);
    }
}