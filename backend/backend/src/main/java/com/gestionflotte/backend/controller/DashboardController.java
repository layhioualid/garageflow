package com.gestionflotte.backend.controller;

import com.gestionflotte.backend.entity.Facture;
import com.gestionflotte.backend.entity.Intervention;
import com.gestionflotte.backend.entity.Piece;
import com.gestionflotte.backend.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
@RequiredArgsConstructor
public class DashboardController {

    private final VehiculeRepository vehiculeRepo;
    private final InterventionRepository interventionRepo;
    private final UtilisateurRepository utilisateurRepo;
    private final FactureRepository factureRepo;
    private final PieceRepository pieceRepo;

    // =========================
    // GLOBAL STATS
    // =========================
    @GetMapping("/stats")
    public Map<String, Object> getStats() {

        Map<String, Object> data = new HashMap<>();

        // VEHICULES
        data.put("totalVehicules", vehiculeRepo.count());
        data.put("vehiculesActifs", vehiculeRepo.countByStatut("ACTIVE"));
        data.put("vehiculesMaintenance", vehiculeRepo.countByStatut("MAINTENANCE"));

        // INTERVENTIONS
        data.put("totalInterventions", interventionRepo.count());

        long doneInterventions = interventionRepo.findAll()
                .stream()
                .filter(i -> "DONE".equals(i.getStatut()))
                .count();

        data.put("doneInterventions", doneInterventions);

        // USERS
        data.put("totalUsers", utilisateurRepo.count());

        // FACTURES
        List<Facture> factures = factureRepo.findAll();

        double totalRevenue = factures.stream()
                .mapToDouble(f -> f.getMontantTtc())
                .sum();

        double unpaidRevenue = factures.stream()
                .filter(f -> "UNPAID".equals(f.getStatut()))
                .mapToDouble(f -> f.getMontantTtc())
                .sum();

        long unpaidFactures = factures.stream()
                .filter(f -> "UNPAID".equals(f.getStatut()))
                .count();

        data.put("totalRevenue", totalRevenue);
        data.put("unpaidRevenue", unpaidRevenue);
        data.put("unpaidFactures", unpaidFactures);

        // STOCK FAIBLE
        long lowStock = pieceRepo.findAll()
                .stream()
                .filter(p -> p.getQuantiteStock() <= 3)
                .count();

        data.put("lowStock", lowStock);

        return data;
    }

    // =========================
    // REVENUS MENSUELS
    // =========================
    @GetMapping("/monthly-revenue")
    public List<Map<String, Object>> monthlyRevenue() {

        List<Map<String, Object>> result = new ArrayList<>();

        Map<Integer, Double> grouped = factureRepo.findAll()
                .stream()
                .filter(f -> f.getDateFacture() != null)
                .collect(Collectors.groupingBy(
                        f -> f.getDateFacture().getMonthValue(),
                        Collectors.summingDouble(Facture::getMontantTtc)
                ));

        for (int i = 1; i <= 12; i++) {

            Map<String, Object> row = new HashMap<>();

            row.put("month", Month.of(i).name().substring(0, 3));

            row.put("revenue", grouped.getOrDefault(i, 0.0));

            result.add(row);
        }

        return result;
    }

    // =========================
    // FACTURES PIE CHART
    // =========================
    @GetMapping("/factures-chart")
    public List<Map<String, Object>> facturesChart() {

        long paid = factureRepo.findAll()
                .stream()
                .filter(f -> "PAID".equals(f.getStatut()))
                .count();

        long unpaid = factureRepo.findAll()
                .stream()
                .filter(f -> "UNPAID".equals(f.getStatut()))
                .count();

        List<Map<String, Object>> result = new ArrayList<>();

        Map<String, Object> paidMap = new HashMap<>();
        paidMap.put("name", "Payées");
        paidMap.put("value", paid);

        Map<String, Object> unpaidMap = new HashMap<>();
        unpaidMap.put("name", "Impayées");
        unpaidMap.put("value", unpaid);

        result.add(paidMap);
        result.add(unpaidMap);

        return result;
    }

    // =========================
    // LOW STOCK PIECES
    // =========================
    @GetMapping("/low-stock")
    public List<Map<String, Object>> lowStockPieces() {

        return pieceRepo.findAll()
                .stream()
                .filter(p -> p.getQuantiteStock() <= 5)
                .map(p -> {

                    Map<String, Object> map = new HashMap<>();

                    map.put("name", p.getNom());
                    map.put("stock", p.getQuantiteStock());

                    return map;
                })
                .collect(Collectors.toList());
    }

    // =========================
    // TOP COSTLY VEHICLES
    // =========================
    @GetMapping("/top-vehicules")
    public List<Map<String, Object>> topVehicules() {

        Map<String, Double> vehiculeCosts = new HashMap<>();

        for (Intervention i : interventionRepo.findAll()) {

            if (i.getVehicule() == null)
                continue;

            String key = i.getVehicule().getImmatriculation();

            vehiculeCosts.put(
                    key,
                    vehiculeCosts.getOrDefault(key, 0.0) + i.getCout()
            );
        }

        return vehiculeCosts.entrySet()
                .stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .limit(5)
                .map(e -> {

                    Map<String, Object> map = new HashMap<>();

                    map.put("vehicule", e.getKey());
                    map.put("cost", e.getValue());

                    return map;

                }).collect(Collectors.toList());
    }
}