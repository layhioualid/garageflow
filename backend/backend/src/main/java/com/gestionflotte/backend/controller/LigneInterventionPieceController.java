package com.gestionflotte.backend.controller;

import com.gestionflotte.backend.entity.LigneInterventionPiece;
import com.gestionflotte.backend.service.LigneInterventionPieceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/intervention-pieces")
@CrossOrigin("*")
public class LigneInterventionPieceController {

    private final LigneInterventionPieceService service;

    public LigneInterventionPieceController(LigneInterventionPieceService service) {
        this.service = service;
    }

    // 🔥 ADD PIECE TO INTERVENTION
    @PostMapping
    public LigneInterventionPiece add(
            @RequestParam Long interventionId,
            @RequestParam Long pieceId,
            @RequestParam int quantite
    ) {
        return service.addPiece(interventionId, pieceId, quantite);
    }

    // 🔥 GET PIECES OF INTERVENTION
    @GetMapping("/{id}")
    public List<LigneInterventionPiece> getByIntervention(@PathVariable Long id) {
        return service.getByIntervention(id);
    }
}