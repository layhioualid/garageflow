package com.gestionflotte.backend.service;

import com.gestionflotte.backend.entity.Intervention;
import com.gestionflotte.backend.entity.LigneInterventionPiece;
import com.gestionflotte.backend.entity.Piece;
import com.gestionflotte.backend.entity.Vehicule;
import com.gestionflotte.backend.repository.InterventionRepository;
import com.gestionflotte.backend.repository.LigneInterventionPieceRepository;
import com.gestionflotte.backend.repository.PieceRepository;
import com.gestionflotte.backend.repository.VehiculeRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class InterventionService {

    private final InterventionRepository repo;
    private final PieceRepository pieceRepo;
    private final VehiculeRepository vehiculeRepo;
    private final LigneInterventionPieceRepository ligneRepo;

    public InterventionService(
            InterventionRepository repo,
            PieceRepository pieceRepo,
            VehiculeRepository vehiculeRepo,
            LigneInterventionPieceRepository ligneRepo
    ) {
        this.repo = repo;
        this.pieceRepo = pieceRepo;
        this.vehiculeRepo = vehiculeRepo;
        this.ligneRepo = ligneRepo;
    }

    @Transactional
    public Intervention save(Intervention i) {

        i.setBesoinsClient(nettoyerBesoins(i.getBesoinsClient()));

        if (i.getDateDebut() == null) {
            i.setDateDebut(LocalDateTime.now());
        }

        if (i.getStatut() == null) {
            i.setStatut("PENDING");
        }

        String statut = i.getStatut().trim().toUpperCase();
        i.setStatut(statut);

        if (i.getVehicule() != null && i.getVehicule().getId() != null) {
            Vehicule v = vehiculeRepo.findById(i.getVehicule().getId())
                    .orElseThrow(() -> new RuntimeException("Véhicule introuvable"));

            if ("DONE".equals(statut)) {
                v.setStatut("ACTIVE");
                i.setDateFin(LocalDateTime.now());
            } else {
                v.setStatut("MAINTENANCE");
            }

            vehiculeRepo.save(v);
            i.setVehicule(v);
        }

        double total = 0;
        List<LigneInterventionPiece> lignes = new ArrayList<>();

        if (i.getPieces() != null) {
            for (LigneInterventionPiece l : i.getPieces()) {

                if (l.getPiece() == null || l.getPiece().getId() == null) {
                    continue;
                }

                Piece p = pieceRepo.findById(l.getPiece().getId())
                        .orElseThrow(() -> new RuntimeException("Pièce introuvable"));

                int quantite = l.getQuantite();

                if (quantite <= 0) {
                    continue;
                }

                if (p.getQuantiteStock() < quantite) {
                    throw new RuntimeException("Stock insuffisant pour la pièce : " + p.getNom());
                }

                total += p.getPrix() * quantite;

                p.setQuantiteStock(p.getQuantiteStock() - quantite);
                pieceRepo.save(p);

                LigneInterventionPiece ligne = new LigneInterventionPiece();
                ligne.setIntervention(i);
                ligne.setPiece(p);
                ligne.setQuantite(quantite);

                lignes.add(ligne);
            }
        }

        i.setPieces(lignes);
        i.setCout(total);

        return repo.save(i);
    }

    @Transactional
    public Intervention update(Long id, Intervention newI) {

        Intervention i = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention introuvable"));

        String newStatut = newI.getStatut() != null
                ? newI.getStatut().trim().toUpperCase()
                : "PENDING";

        i.setTypePanne(newI.getTypePanne());
        i.setDescription(newI.getDescription());
        i.setTechnicien(newI.getTechnicien());
        i.setStatut(newStatut);

        if (newI.getBesoinsClient() != null) {
            i.setBesoinsClient(nettoyerBesoins(newI.getBesoinsClient()));
        }

        if (newI.getVehicule() != null && newI.getVehicule().getId() != null) {
            Vehicule v = vehiculeRepo.findById(newI.getVehicule().getId())
                    .orElseThrow(() -> new RuntimeException("Véhicule introuvable"));

            if ("DONE".equals(newStatut)) {
                v.setStatut("ACTIVE");

                if (i.getDateFin() == null) {
                    i.setDateFin(LocalDateTime.now());
                }
            } else {
                v.setStatut("MAINTENANCE");
                i.setDateFin(null);
            }

            vehiculeRepo.save(v);
            i.setVehicule(v);
        }

        /*
         * IMPORTANT :
         * Si le frontend n'envoie pas pieces, on ne touche pas aux pièces.
         * Comme ça, tu peux juste changer le statut en DONE sans erreur.
         */
        if (newI.getPieces() != null) {

            List<LigneInterventionPiece> anciennesLignes =
                    ligneRepo.findByInterventionId(id);

            /*
             * 1. Restaurer le stock des anciennes pièces.
             */
            for (LigneInterventionPiece oldLine : anciennesLignes) {
                if (oldLine.getPiece() != null && oldLine.getPiece().getId() != null) {
                    Piece oldPiece = pieceRepo.findById(oldLine.getPiece().getId())
                            .orElse(null);

                    if (oldPiece != null) {
                        oldPiece.setQuantiteStock(
                                oldPiece.getQuantiteStock() + oldLine.getQuantite()
                        );
                        pieceRepo.save(oldPiece);
                    }
                }
            }

            /*
             * 2. Supprimer réellement les anciennes lignes en base.
             */
            ligneRepo.deleteByInterventionId(id);
            repo.flush();

            /*
             * 3. Recréer les nouvelles lignes proprement.
             */
            double total = 0;
            List<LigneInterventionPiece> nouvellesLignes = new ArrayList<>();

            for (LigneInterventionPiece l : newI.getPieces()) {

                if (l.getPiece() == null || l.getPiece().getId() == null) {
                    continue;
                }

                Piece p = pieceRepo.findById(l.getPiece().getId())
                        .orElseThrow(() -> new RuntimeException("Pièce introuvable"));

                int quantite = l.getQuantite();

                if (quantite <= 0) {
                    continue;
                }

                if (p.getQuantiteStock() < quantite) {
                    throw new RuntimeException("Stock insuffisant pour la pièce : " + p.getNom());
                }

                total += p.getPrix() * quantite;

                p.setQuantiteStock(p.getQuantiteStock() - quantite);
                pieceRepo.save(p);

                LigneInterventionPiece nouvelleLigne = new LigneInterventionPiece();
                nouvelleLigne.setIntervention(i);
                nouvelleLigne.setPiece(p);
                nouvelleLigne.setQuantite(quantite);

                nouvellesLignes.add(nouvelleLigne);
            }

            i.setPieces(nouvellesLignes);
            i.setCout(total);
        }

        return repo.save(i);
    }

    public List<Intervention> getByVehicule(Long id) {
        return repo.findByVehiculeId(id);
    }

    public List<Intervention> getAll() {
        return repo.findAll();
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    private List<String> nettoyerBesoins(List<String> besoins) {
        List<String> resultat = new ArrayList<>();

        if (besoins == null) {
            return resultat;
        }

        for (String besoin : besoins) {
            if (besoin != null && !besoin.isBlank()) {
                resultat.add(besoin.trim());
            }
        }

        return resultat;
    }
}
