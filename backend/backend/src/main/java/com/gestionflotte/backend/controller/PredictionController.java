package com.gestionflotte.backend.controller;

import com.gestionflotte.backend.entity.PredictionPanne;
import com.gestionflotte.backend.entity.VehicleData;
import com.gestionflotte.backend.entity.Vehicule;
import com.gestionflotte.backend.repository.PredictionPanneRepository;
import com.gestionflotte.backend.repository.VehicleDataRepository;
import com.gestionflotte.backend.repository.VehiculeRepository;
import com.gestionflotte.backend.service.PredictionService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.*;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "http://localhost:5173")
public class PredictionController {

    private final PredictionService predictionService;
    private final PredictionPanneRepository predictionPanneRepository;
    private final VehicleDataRepository vehicleDataRepository;
    private final VehiculeRepository vehiculeRepository;

    public PredictionController(
            PredictionService predictionService,
            PredictionPanneRepository predictionPanneRepository,
            VehicleDataRepository vehicleDataRepository,
            VehiculeRepository vehiculeRepository
    ) {
        this.predictionService = predictionService;
        this.predictionPanneRepository = predictionPanneRepository;
        this.vehicleDataRepository = vehicleDataRepository;
        this.vehiculeRepository = vehiculeRepository;
    }

    @GetMapping
public List<Map<String, Object>> getAllPredictions() {
    List<PredictionPanne> predictions = predictionPanneRepository.findAll();
    
    // Trier les prédictions du plus récent au plus ancien
    predictions.sort((p1, p2) -> p2.getId().compareTo(p1.getId()));

    List<Map<String, Object>> result = new ArrayList<>();

    for (PredictionPanne prediction : predictions) {
        Map<String, Object> row = new HashMap<>();

        row.put("id", prediction.getId());
        row.put("vehicleDataId", prediction.getVehicleDataId());
        row.put("probabilite", prediction.getProbabilite());
        row.put("niveauRisque", prediction.getNiveauRisque());
        row.put("datePrediction", prediction.getDatePrediction());

        // IMPORTANT : ajouter la recommandation
        row.put("recommendation", prediction.getRecommendation());

        Optional<VehicleData> vehicleDataOpt =
                vehicleDataRepository.findById(prediction.getVehicleDataId());

        if (vehicleDataOpt.isPresent()) {
            VehicleData vehicleData = vehicleDataOpt.get();

            row.put("vehiculeId", vehicleData.getVehiculeId());
            row.put("vehicleModel", vehicleData.getVehicleModel());
            row.put("mileage", vehicleData.getMileage());
            row.put("fuelType", vehicleData.getFuelType());
            row.put("needMaintenance", vehicleData.getNeedMaintenance());

            Optional<Vehicule> vehiculeOpt =
                    vehiculeRepository.findById(vehicleData.getVehiculeId());

            if (vehiculeOpt.isPresent()) {
                Vehicule vehicule = vehiculeOpt.get();

                row.put("immatriculation", vehicule.getImmatriculation());
                row.put("marque", vehicule.getMarque());
                row.put("modele", vehicule.getModele());
                row.put("kilometrage", vehicule.getKilometrage());
                row.put("statut", vehicule.getStatut());
            }
        }

        result.add(row);
    }

    return result;
}

    @GetMapping("/test")
    public String test() {
        return "Prediction controller marche";
    }

    @PostMapping("/maintenance")
public ResponseEntity<?> predictMaintenance(@RequestBody VehicleData vehicleData) {
    try {
        Map<String, Object> result = predictionService.predictAndSave(vehicleData);
        return ResponseEntity.ok(result);
    } catch (Exception e) {
        e.printStackTrace();

        Map<String, Object> error = new HashMap<>();
        error.put("error", e.getMessage());
        error.put("type", e.getClass().getSimpleName());

        return ResponseEntity.status(500).body(error);
    }
}
}