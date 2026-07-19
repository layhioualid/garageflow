package com.gestionflotte.backend.service;

import com.gestionflotte.backend.entity.VehicleData;
import com.gestionflotte.backend.entity.PredictionPanne;
import com.gestionflotte.backend.repository.VehicleDataRepository;
import com.gestionflotte.backend.repository.PredictionPanneRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class PredictionService {

    private final VehicleDataRepository vehicleDataRepository;
    private final PredictionPanneRepository predictionPanneRepository;
    private final RestTemplate restTemplate;

    private static final String FLASK_URL = "http://127.0.0.1:5000/predict-maintenance";

    public PredictionService(
            VehicleDataRepository vehicleDataRepository,
            PredictionPanneRepository predictionPanneRepository,
            RestTemplate restTemplate
    ) {
        this.vehicleDataRepository = vehicleDataRepository;
        this.predictionPanneRepository = predictionPanneRepository;
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> predictAndSave(VehicleData vehicleData) {

        // 1. Enregistrer les données reçues
        VehicleData savedVehicleData = vehicleDataRepository.save(vehicleData);

        // 2. Préparer les données pour Flask
        Map<String, Object> flaskRequest = buildFlaskRequest(savedVehicleData);

        // 3. Appeler Flask
        Map<String, Object> flaskResponse = callFlaskApi(flaskRequest);

        // 4. Lire les résultats de Flask
        Integer needMaintenance = getInteger(flaskResponse.get("needMaintenance"), 0);
        Double probability = getDouble(flaskResponse.get("probability"), 0.0);
        Double probabilityPercent = getDouble(flaskResponse.get("probabilityPercent"), probability * 100);

        String modelUsed = String.valueOf(flaskResponse.getOrDefault("modelUsed", "vehicle_maintenance_model.pkl"));
        String riskLevel = String.valueOf(flaskResponse.getOrDefault("riskLevel", calculerNiveauRisque(probability)));
        String recommendation = String.valueOf(flaskResponse.getOrDefault("recommendation", ""));

        // 5. Mettre à jour vehicle_data
        savedVehicleData.setNeedMaintenance(needMaintenance);
        vehicleDataRepository.save(savedVehicleData);

        // 6. Enregistrer prediction_panne
        PredictionPanne predictionPanne = new PredictionPanne();

        predictionPanne.setVehicleDataId(savedVehicleData.getId());
        predictionPanne.setProbabilite(probability);
        predictionPanne.setNiveauRisque(riskLevel);
        predictionPanne.setRecommendation(recommendation);
        predictionPanne.setDatePrediction(LocalDateTime.now());

        PredictionPanne savedPrediction = predictionPanneRepository.save(predictionPanne);

        // 7. Retourner une réponse propre à React
        Map<String, Object> response = new HashMap<>();

        response.put("vehicleDataId", savedVehicleData.getId());
        response.put("predictionId", savedPrediction.getId());

        response.put("needMaintenance", needMaintenance);
        response.put("probability", probability);
        response.put("probabilityPercent", probabilityPercent);

        response.put("niveauRisque", riskLevel);
        response.put("riskLevel", riskLevel);

        response.put("recommendation", recommendation);
        response.put("modelUsed", modelUsed);
        response.put("modelVersion", flaskResponse.get("modelVersion"));
        response.put("threshold", flaskResponse.get("threshold"));
        response.put("metrics", flaskResponse.get("metrics"));

        response.put("inputUsed", flaskResponse.get("inputUsed"));
        response.put("removedColumns", flaskResponse.get("removedColumns"));

        return response;
    }

    private Map<String, Object> buildFlaskRequest(VehicleData vehicleData) {
        Map<String, Object> request = new HashMap<>();

        request.put("vehicleModel", vehicleData.getVehicleModel());
        request.put("mileage", vehicleData.getMileage());
        request.put("maintenanceHistory", vehicleData.getMaintenanceHistory());
        request.put("reportedIssues", vehicleData.getReportedIssues());
        request.put("vehicleAge", vehicleData.getVehicleAge());
        request.put("fuelType", vehicleData.getFuelType());
        request.put("transmissionType", vehicleData.getTransmissionType());
        request.put("engineSize", vehicleData.getEngineSize());
        request.put("odometerReading", vehicleData.getOdometerReading());
        request.put("lastServiceMileage", vehicleData.getLastServiceMileage());

        if (vehicleData.getLastServiceDate() != null) {
            request.put("lastServiceDate", vehicleData.getLastServiceDate().toString());
        } else {
            request.put("lastServiceDate", "2023-01-01");
        }

        if (vehicleData.getWarrantyExpiryDate() != null) {
            request.put("warrantyExpiryDate", vehicleData.getWarrantyExpiryDate().toString());
        } else {
            request.put("warrantyExpiryDate", "2025-01-01");
        }

        request.put("ownerType", vehicleData.getOwnerType());
        request.put("insurancePremium", vehicleData.getInsurancePremium());
        request.put("serviceHistory", vehicleData.getServiceHistory());
        request.put("accidentHistory", vehicleData.getAccidentHistory());
        request.put("fuelEfficiency", vehicleData.getFuelEfficiency());
        request.put("tireCondition", vehicleData.getTireCondition());
        request.put("brakeCondition", vehicleData.getBrakeCondition());
        request.put("batteryStatus", vehicleData.getBatteryStatus());

        return request;
    }

    private Map<String, Object> callFlaskApi(Map<String, Object> flaskRequest) {
        try {
            Map<String, Object> flaskResponse = restTemplate.postForObject(
                    FLASK_URL,
                    flaskRequest,
                    Map.class
            );

            if (flaskResponse == null) {
                throw new RuntimeException("Flask n'a retourné aucune réponse.");
            }

            if (flaskResponse.containsKey("error")) {
                throw new RuntimeException("Erreur Flask : " + flaskResponse.get("error"));
            }

            return flaskResponse;

        } catch (ResourceAccessException e) {
            throw new RuntimeException("Impossible de contacter Flask. Vérifiez que Flask est lancé sur le port 5000.");

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            throw new RuntimeException("Erreur API Flask : " + e.getResponseBodyAsString());

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'appel Flask : " + e.getMessage());
        }
    }

    private Integer getInteger(Object value, Integer defaultValue) {
        try {
            if (value == null) return defaultValue;
            return ((Number) value).intValue();
        } catch (Exception e) {
            return defaultValue;
        }
    }

    private Double getDouble(Object value, Double defaultValue) {
        try {
            if (value == null) return defaultValue;
            return ((Number) value).doubleValue();
        } catch (Exception e) {
            return defaultValue;
        }
    }

    private String calculerNiveauRisque(Double probability) {
        if (probability == null) {
            return "Inconnu";
        }

        if (probability >= 0.80) {
            return "Risque critique";
        } else if (probability >= 0.60) {
            return "Risque élevé";
        } else if (probability >= 0.40) {
            return "Risque moyen";
        } else {
            return "Risque faible";
        }
    }
}
