from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
import json
from pathlib import Path

app = Flask(__name__)
CORS(app)

# =====================================================
# 1. CHARGEMENT DU MODÈLE
# =====================================================

BASE_DIR = Path(__file__).resolve().parent
BUNDLE_PATH = BASE_DIR / "vehicle_maintenance_model_bundle.joblib"
METADATA_PATH = BASE_DIR / "vehicle_maintenance_model_bundle.metadata.json"

model_bundle = joblib.load(BUNDLE_PATH)
model = model_bundle["pipeline"]
model_threshold = float(model_bundle.get("threshold", 0.5))
model_schema = model_bundle.get("schema", {})
feature_order = model_bundle.get("feature_order", list(model_schema.keys()))
model_version = model_bundle.get("version", "2.0.0")
model_metrics = model_bundle.get("metrics", {})
removed_columns = []

bundle_metadata = {}
if METADATA_PATH.exists():
    with METADATA_PATH.open("r", encoding="utf-8") as metadata_file:
        bundle_metadata = json.load(metadata_file)

print("===== MODÈLE CHARGÉ AVEC SUCCÈS =====")
print("Colonnes supprimées :", removed_columns)


# =====================================================
# 2. MAPPING SPRING BOOT -> COLONNES IA
# =====================================================

column_mapping = {
    "vehicleModel": "Vehicle_Model",
    "mileage": "Mileage",
    "maintenanceHistory": "Maintenance_History",
    "reportedIssues": "Reported_Issues",
    "vehicleAge": "Vehicle_Age",
    "fuelType": "Fuel_Type",
    "transmissionType": "Transmission_Type",
    "engineSize": "Engine_Size",
    "odometerReading": "Odometer_Reading",
    "lastServiceMileage": "Last_Service_Mileage",
    "lastServiceDate": "Last_Service_Date",
    "warrantyExpiryDate": "Warranty_Expiry_Date",
    "ownerType": "Owner_Type",
    "insurancePremium": "Insurance_Premium",
    "serviceHistory": "Service_History",
    "accidentHistory": "Accident_History",
    "fuelEfficiency": "Fuel_Efficiency",
    "tireCondition": "Tire_Condition",
    "brakeCondition": "Brake_Condition",
    "batteryStatus": "Battery_Status",

    "vehicle_model": "Vehicle_Model",
    "maintenance_history": "Maintenance_History",
    "reported_issues": "Reported_Issues",
    "vehicle_age": "Vehicle_Age",
    "fuel_type": "Fuel_Type",
    "transmission_type": "Transmission_Type",
    "engine_size": "Engine_Size",
    "odometer_reading": "Odometer_Reading",
    "last_service_mileage": "Last_Service_Mileage",
    "last_service_date": "Last_Service_Date",
    "warranty_expiry_date": "Warranty_Expiry_Date",
    "owner_type": "Owner_Type",
    "insurance_premium": "Insurance_Premium",
    "service_history": "Service_History",
    "accident_history": "Accident_History",
    "fuel_efficiency": "Fuel_Efficiency",
    "tire_condition": "Tire_Condition",
    "brake_condition": "Brake_Condition",
    "battery_status": "Battery_Status",

    # noms possibles de ton application
    "modele": "Vehicle_Model",
    "kilometrage": "Mileage",
    "age": "Vehicle_Age",
    "carburant": "Fuel_Type",
    "transmission": "Transmission_Type",
}


# =====================================================
# 3. VALEURS PAR DÉFAUT
# =====================================================

default_values = {
    "Vehicle_Model": "Car",
    "Mileage": 100000,
    "Maintenance_History": "Good",
    "Reported_Issues": 0,
    "Vehicle_Age": 5,
    "Fuel_Type": "Petrol",
    "Transmission_Type": "Manual",
    "Engine_Size": 1.6,
    "Odometer_Reading": 100000,
    "Last_Service_Mileage": 90000,
    "Last_Service_Date": "2023-01-01",
    "Warranty_Expiry_Date": "2025-01-01",
    "Owner_Type": "First",
    "Insurance_Premium": 1000,
    "Service_History": 1,
    "Accident_History": 0,
    "Fuel_Efficiency": 15,
    "Tire_Condition": "Good",
    "Brake_Condition": "Good",
    "Battery_Status": "Good",
}

required_columns = list(default_values.keys())
model_default_values = {
    **default_values,
    "Days_Since_Last_Service_Date": 365,
    "Issues_Per_Service": 0,
    "Mileage_Per_Year": 20000,
}


# =====================================================
# 4. FONCTIONS OUTILS
# =====================================================

def to_number(value, default=0):
    try:
        if value is None or value == "":
            return default
        return float(value)
    except Exception:
        return default


def yes_no_to_int(value):
    if value is None:
        return 0

    if isinstance(value, (int, float)):
        return int(value)

    value = str(value).strip().lower()

    if value in ["yes", "oui", "true", "vrai", "1"]:
        return 1

    if value in ["no", "non", "false", "faux", "0"]:
        return 0

    return 0


def normalize_text(value, default):
    if value is None or str(value).strip() == "":
        return default
    return str(value).strip()


# =====================================================
# 5. PRÉPARATION DES FEATURES
# =====================================================

def prepare_features(df):
    df = df.copy()

    df["Last_Service_Date"] = pd.to_datetime(
        df["Last_Service_Date"],
        errors="coerce"
    )

    df["Warranty_Expiry_Date"] = pd.to_datetime(
        df["Warranty_Expiry_Date"],
        errors="coerce"
    )

    reference_date = pd.Timestamp(datetime.now().date())

    df["Days_Since_Last_Service_Date"] = (
        reference_date - df["Last_Service_Date"]
    ).dt.days

    df["Mileage_Per_Year"] = (
        df["Mileage"] / df["Vehicle_Age"].replace(0, 1)
    )

    df["Issues_Per_Service"] = (
        df["Reported_Issues"] / (df["Service_History"] + 1)
    )

    df["Warranty_Expiry_Date"] = df["Warranty_Expiry_Date"].dt.strftime("%Y-%m-%d")

    df = df.replace([np.inf, -np.inf], 0)
    df = df.fillna(0)

    for column in feature_order:
        if column not in df.columns:
            df[column] = model_default_values.get(column, 0)

    df = df[feature_order]

    return df

# =====================================================
# 6. CONSTRUIRE DATAFRAME DEPUIS JSON
# =====================================================

def build_dataframe(data):
    df = pd.DataFrame([data])

    df = df.rename(columns=column_mapping)

    for col in required_columns:
        if col not in df.columns:
            df[col] = default_values[col]

    df = df[required_columns]

    text_cols = [
        "Vehicle_Model",
        "Maintenance_History",
        "Fuel_Type",
        "Transmission_Type",
        "Owner_Type",
        "Tire_Condition",
        "Brake_Condition",
        "Battery_Status",
    ]

    for col in text_cols:
        df[col] = df[col].apply(
            lambda value: normalize_text(value, default_values[col])
        )

    numeric_cols = [
        "Mileage",
        "Reported_Issues",
        "Vehicle_Age",
        "Engine_Size",
        "Odometer_Reading",
        "Last_Service_Mileage",
        "Insurance_Premium",
        "Service_History",
        "Fuel_Efficiency",
    ]

    for col in numeric_cols:
        df[col] = df[col].apply(
            lambda value: to_number(value, default_values[col])
        )

    df["Accident_History"] = df["Accident_History"].apply(yes_no_to_int)

    return df


# =====================================================
# 7. RISQUE + RECOMMANDATION
# =====================================================

def get_risk_level(probability):
    if probability >= 0.80:
        return "Risque critique"
    elif probability >= 0.60:
        return "Risque élevé"
    elif probability >= 0.40:
        return "Risque moyen"
    else:
        return "Risque faible"


def get_recommendation(raw_row, probability):
    recommendations = []

    mileage = float(raw_row.get("Mileage", 0))
    vehicle_age = float(raw_row.get("Vehicle_Age", 0))
    reported_issues = int(float(raw_row.get("Reported_Issues", 0)))
    service_history = int(float(raw_row.get("Service_History", 0)))
    accident_history = int(float(raw_row.get("Accident_History", 0)))

    tire_condition = str(raw_row.get("Tire_Condition", "")).strip()
    brake_condition = str(raw_row.get("Brake_Condition", "")).strip()
    battery_status = str(raw_row.get("Battery_Status", "")).strip()
    fuel_type = str(raw_row.get("Fuel_Type", "")).strip()
    transmission_type = str(raw_row.get("Transmission_Type", "")).strip()

    last_service_mileage = float(raw_row.get("Last_Service_Mileage", 0))
    mileage_since_service = mileage - last_service_mileage

    # =====================================================
    # 1. Recommandation principale selon le risque IA
    # =====================================================
    if probability >= 0.80:
        recommendations.append(
            "Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet."
        )
    elif probability >= 0.60:
        recommendations.append(
            "Planifier une inspection technique prioritaire avant la prochaine utilisation intensive."
        )
    elif probability >= 0.40:
        recommendations.append(
            "Programmer un contrôle préventif pour éviter une panne future."
        )
    else:
        recommendations.append(
            "Aucune maintenance urgente. Continuer le suivi normal du véhicule."
        )

    # =====================================================
    # 2. Kilométrage et âge du véhicule
    # =====================================================
    if mileage >= 200000:
        recommendations.append(
            "Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement."
        )
    elif mileage >= 120000:
        recommendations.append(
            "Kilométrage élevé : prévoir un contrôle moteur, filtres, courroies et niveaux."
        )
    elif mileage >= 80000:
        recommendations.append(
            "Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure."
        )

    if vehicle_age >= 10:
        recommendations.append(
            "Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques."
        )
    elif vehicle_age >= 7:
        recommendations.append(
            "Âge du véhicule avancé : renforcer la surveillance des pièces d’usure."
        )

    # =====================================================
    # 3. Dernier service
    # =====================================================
    if mileage_since_service >= 20000:
        recommendations.append(
            "Dernier entretien trop ancien : effectuer vidange, filtres et contrôle complet."
        )
    elif mileage_since_service >= 10000:
        recommendations.append(
            "Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus."
        )

    if service_history <= 1:
        recommendations.append(
            "Historique d’entretien faible : créer un plan de maintenance régulier."
        )

    # =====================================================
    # 4. Problèmes signalés
    # =====================================================
    if reported_issues >= 5:
        recommendations.append(
            "Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité."
        )
    elif reported_issues >= 3:
        recommendations.append(
            "Plusieurs problèmes signalés : analyser les symptômes conducteur et vérifier les composants concernés."
        )
    elif reported_issues >= 1:
        recommendations.append(
            "Problème signalé : effectuer une vérification ciblée avant aggravation."
        )

    # =====================================================
    # 5. Pneus
    # =====================================================
    if tire_condition.lower() in ["worn out", "bad", "mauvais", "usé", "use"]:
        recommendations.append(
            "Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence."
        )
    elif tire_condition.lower() in ["average", "moyen"]:
        recommendations.append(
            "Pneus moyens : vérifier pression, usure et parallélisme."
        )

    # =====================================================
    # 6. Freins
    # =====================================================
    if brake_condition.lower() in ["worn out", "bad", "mauvais", "usé", "use"]:
        recommendations.append(
            "Freins usés : contrôler plaquettes, disques et liquide de frein en priorité."
        )
    elif brake_condition.lower() in ["average", "moyen"]:
        recommendations.append(
            "Freins à surveiller : prévoir un contrôle du système de freinage."
        )

    # =====================================================
    # 7. Batterie
    # =====================================================
    if battery_status.lower() in ["weak", "faible"]:
        recommendations.append(
            "Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire."
        )
    elif battery_status.lower() in ["dead", "hs", "bad"]:
        recommendations.append(
            "Batterie défectueuse : remplacement recommandé avant remise en service."
        )

    # =====================================================
    # 8. Accident
    # =====================================================
    if accident_history > 0:
        recommendations.append(
            "Historique d’accident détecté : vérifier châssis, direction, suspension et alignement."
        )

    # =====================================================
    # 9. Type carburant / transmission
    # =====================================================
    if fuel_type.lower() == "diesel" and mileage >= 100000:
        recommendations.append(
            "Moteur diesel avec kilométrage élevé : vérifier injecteurs, turbo, filtre à particules et système d’admission."
        )

    if transmission_type.lower() == "automatic" and mileage >= 100000:
        recommendations.append(
            "Transmission automatique : contrôler huile de boîte et comportement des passages de vitesse."
        )

    # Supprimer les doublons tout en gardant l’ordre
    unique_recommendations = []
    for rec in recommendations:
        if rec not in unique_recommendations:
            unique_recommendations.append(rec)

    return " | ".join(unique_recommendations[:6])

# =====================================================
# 8. ROUTES
# =====================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "OK",
        "service": "GarageFlow+ IA maintenance prédictive",
        "modelLoaded": True,
        "modelUsed": BUNDLE_PATH.name,
        "modelVersion": model_version,
        "threshold": model_threshold,
        "features": feature_order,
        "metrics": model_metrics,
        "metadata": bundle_metadata
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "UP",
        "model": BUNDLE_PATH.name,
        "version": model_version,
        "threshold": model_threshold
    })


@app.route("/predict-maintenance", methods=["POST"])
def predict_maintenance():
    try:
        data = request.get_json()

        if data is None:
            return jsonify({
                "error": "Aucune donnée JSON reçue"
            }), 400

        print("\n===== DATA REÇUE =====")
        print(data)

        raw_df = build_dataframe(data)

        print("===== DATA NORMALISÉE =====")
        print(raw_df.to_dict(orient="records")[0])

        raw_row = raw_df.iloc[0].to_dict()

        prepared_df = prepare_features(raw_df)

        model_input = prepared_df[feature_order]

        print("===== DATA ENVOYÉE AU MODÈLE =====")
        print(model_input.to_dict(orient="records")[0])

        if hasattr(model, "predict_proba"):
            probability = float(model.predict_proba(model_input)[0][1])
            prediction = int(probability >= model_threshold)
        else:
            prediction = int(model.predict(model_input)[0])
            probability = float(prediction)

        risk_level = get_risk_level(probability)
        recommendation = get_recommendation(raw_row, probability)

        return jsonify({
            "needMaintenance": prediction,
            "probability": probability,
            "probabilityPercent": round(probability * 100, 2),
            "riskLevel": risk_level,
            "niveauRisque": risk_level,
            "recommendation": recommendation,
            "modelUsed": BUNDLE_PATH.name,
            "modelVersion": model_version,
            "threshold": model_threshold,
            "metrics": model_metrics,
            "removedColumns": removed_columns,
            "inputUsed": model_input.to_dict(orient="records")[0]
        })

    except Exception as e:
        print("===== ERREUR FLASK =====")
        print(str(e))

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
