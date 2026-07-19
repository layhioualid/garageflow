import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPredictions, predictVehicle } from "../services/ml.service";

import {
  FaArrowLeft,
  FaArrowRight,
  FaCar,
  FaTools,
  FaFileAlt,
  FaFileInvoice,
  FaImage,
  FaDownload,
  FaEye,
  FaTrash,
  FaGasPump,
  FaCogs,
  FaTachometerAlt,
  FaClipboardList,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFolderOpen,
  FaPlus,
  FaSyncAlt,
  FaRobot,
  FaBrain,
  FaBolt,
  FaShieldAlt,
  FaWrench,
  FaChartLine,
  FaRoute,
  FaInfoCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaWhatsapp,
} from "react-icons/fa";

const API_URL = "http://localhost:8080";

const AI_DEFAULTS = {
  vehicleModel: "Car",
  mileage: 100000,
  maintenanceHistory: "Good",
  reportedIssues: 0,
  vehicleAge: 5,
  fuelType: "Petrol",
  transmissionType: "Manual",
  engineSize: 1.6,
  odometerReading: 100000,
  lastServiceMileage: 90000,
  lastServiceDate: "2023-01-01",
  warrantyExpiryDate: "2025-01-01",
  ownerType: "First",
  insurancePremium: 1000,
  serviceHistory: 1,
  accidentHistory: 0,
  fuelEfficiency: 15,
  tireCondition: "Good",
  brakeCondition: "Good",
  batteryStatus: "Good",
};

const AI_FIELD_GROUPS = [
  {
    title: "Donnees vehicule",
    fields: [
      { name: "vehicleModel", label: "Modele IA", type: "select", options: ["Car", "Truck", "Van", "Bus", "SUV", "Motorcycle"] },
      { name: "mileage", label: "Kilometrage", type: "number" },
      { name: "vehicleAge", label: "Age vehicule", type: "number" },
      { name: "fuelType", label: "Carburant", type: "select", options: ["Petrol", "Diesel", "Electric"] },
      { name: "transmissionType", label: "Transmission", type: "select", options: ["Manual", "Automatic"] },
      { name: "engineSize", label: "Cylindree / moteur", type: "number", step: "0.1" },
    ],
  },
  {
    title: "Historique maintenance",
    fields: [
      { name: "maintenanceHistory", label: "Historique maintenance", type: "select", options: ["Good", "Average", "Poor"] },
      {
        name: "reportedIssues",
        label: "Interventions precedentes",
        type: "number",
        readOnly: true,
        hint: "Calcule automatiquement depuis l'historique du vehicule",
      },
      { name: "odometerReading", label: "Odometer reading", type: "number" },
      { name: "lastServiceMileage", label: "Dernier km service", type: "number" },
      { name: "lastServiceDate", label: "Date dernier service", type: "date" },
      { name: "serviceHistory", label: "Nombre services", type: "number" },
    ],
  },
  {
    title: "Etat et risque",
    fields: [
      { name: "warrantyExpiryDate", label: "Expiration garantie", type: "date" },
      { name: "ownerType", label: "Type proprietaire", type: "select", options: ["First", "Second", "Company"] },
      { name: "insurancePremium", label: "Prime assurance", type: "number" },
      { name: "accidentHistory", label: "Accident history", type: "select", options: [0, 1] },
      { name: "fuelEfficiency", label: "Fuel efficiency", type: "number", step: "0.1" },
      { name: "tireCondition", label: "Etat pneus", type: "select", options: ["Good", "Average", "Worn Out"] },
      { name: "brakeCondition", label: "Etat freins", type: "select", options: ["Good", "Average", "Worn Out"] },
      { name: "batteryStatus", label: "Etat batterie", type: "select", options: ["Good", "Weak", "Dead"] },
    ],
  },
];

const AI_NUMERIC_FIELDS = [
  "mileage",
  "reportedIssues",
  "vehicleAge",
  "engineSize",
  "odometerReading",
  "lastServiceMileage",
  "insurancePremium",
  "serviceHistory",
  "accidentHistory",
  "fuelEfficiency",
];

const AI_MANUAL_FIELDS = new Set([
  "warrantyExpiryDate",
  "ownerType",
  "insurancePremium",
  "accidentHistory",
  "fuelEfficiency",
  "tireCondition",
  "brakeCondition",
  "batteryStatus",
]);

export default function VehiculeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicules, setVehicules] = useState([]);
  const [vehicule, setVehicule] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [factures, setFactures] = useState([]);
  const [devis, setDevis] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [predictionsLoading, setPredictionsLoading] = useState(false);
  const [lastPredictionUpdate, setLastPredictionUpdate] = useState(null);
  const [showAiForm, setShowAiForm] = useState(false);
  const [aiFormData, setAiFormData] = useState(AI_DEFAULTS);

  const buildUrl = (path) => {
    if (!path) return "";
    return `${API_URL}/${String(path).replace(/^\/+/, "")}`;
  };

  const money = (value) => `${Number(value || 0).toFixed(2)} DH`;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("fr-FR");
  };

  const statusColor = (status) => {
    switch (status) {
      case "DONE":
      case "PAID":
      case "APPROVED":
      case "ACTIVE":
        return "bg-green-50 text-green-700 border-green-200";
      case "IN_PROGRESS":
      case "UNPAID":
      case "PENDING":
      case "MAINTENANCE":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "REJECTED":
      case "INACTIVE":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case "DONE":
        return "Terminée";
      case "IN_PROGRESS":
        return "En cours";
      case "PENDING":
        return "En attente";
      case "PAID":
        return "Payée";
      case "UNPAID":
        return "Non payée";
      case "APPROVED":
        return "Approuvé";
      case "REJECTED":
        return "Refusé";
      case "ACTIVE":
        return "Actif";
      case "MAINTENANCE":
        return "Maintenance";
      case "INACTIVE":
        return "Inactif";
      default:
        return status || "-";
    }
  };

  const riskColor = (risk) => {
    if (risk === "Élevé" || risk === "High") {
      return "text-red-700 bg-red-50 border-red-200";
    }

    if (risk === "Moyen" || risk === "Medium") {
      return "text-yellow-700 bg-yellow-50 border-yellow-200";
    }

    return "text-green-700 bg-green-50 border-green-200";
  };

  const getRisk = (item) => {
    const risk = item?.riskLevel || item?.niveauRisque || "Risque faible";
    const normalized = String(risk).toLowerCase();

    if (normalized.includes("critique")) return "critique";
    if (
      normalized.includes("Ã©levÃ©") ||
      normalized.includes("eleve") ||
      normalized.includes("elev")
    ) {
      return "eleve";
    }
    if (normalized.includes("moyen")) return "moyen";
    return "faible";
  };

  const getRiskLabel = (item) => {
    const risk = getRisk(item);

    if (risk === "critique") return "Risque critique";
    if (risk === "eleve") return "Risque eleve";
    if (risk === "moyen") return "Risque moyen";
    return "Risque faible";
  };

  const getProbability = (item) => {
    if (item?.probabilityPercent !== undefined && item?.probabilityPercent !== null) {
      return Number(item.probabilityPercent);
    }

    if (item?.probabilite !== undefined && item?.probabilite !== null) {
      return Number(item.probabilite) * 100;
    }

    if (item?.probability !== undefined && item?.probability !== null) {
      return Number(item.probability) * 100;
    }

    return 0;
  };

  const loadPredictions = async (showLoader = false) => {
    try {
      if (showLoader) setPredictionsLoading(true);
      setAiError("");

      const res = await getPredictions();
      const data = Array.isArray(res.data) ? res.data : [];

      setPredictions(data);
      setLastPredictionUpdate(new Date());
    } catch (error) {
      console.error(error);
      setAiError("Impossible de charger les predictions IA reelles.");
    } finally {
      setPredictionsLoading(false);
    }
  };

  const load = async () => {
    try {
      setLoading(true);

      const [
        vehiculeRes,
        vehiculesRes,
        interventionsRes,
        documentsRes,
        photosRes,
        facturesRes,
        devisRes,
      ] = await Promise.all([
        fetch(`${API_URL}/api/vehicules/${id}`),
        fetch(`${API_URL}/api/vehicules`),
        fetch(`${API_URL}/api/interventions`),
        fetch(`${API_URL}/api/documents/vehicule/${id}`),
        fetch(`${API_URL}/api/photos`),
        fetch(`${API_URL}/api/factures`),
        fetch(`${API_URL}/api/devis`),
      ]);

      const allVehicules = vehiculesRes.ok ? await vehiculesRes.json() : [];

      let vehiculeData = null;

      if (vehiculeRes.ok) {
        vehiculeData = await vehiculeRes.json();
      } else {
        vehiculeData = allVehicules.find((v) => Number(v.id) === Number(id));
      }

      const allInterventions = interventionsRes.ok
        ? await interventionsRes.json()
        : [];

      const docsData = documentsRes.ok ? await documentsRes.json() : [];
      const allPhotos = photosRes.ok ? await photosRes.json() : [];
      const allFactures = facturesRes.ok ? await facturesRes.json() : [];
      const allDevis = devisRes.ok ? await devisRes.json() : [];

      const vehiculeInterventions = allInterventions.filter(
        (i) => Number(i.vehicule?.id) === Number(id)
      );

      const interventionIds = vehiculeInterventions.map((i) => Number(i.id));

      const vehiculePhotos = allPhotos.filter((p) =>
        interventionIds.includes(Number(p.intervention?.id))
      );

      const vehiculeFactures = allFactures.filter(
        (f) => Number(f.intervention?.vehicule?.id) === Number(id)
      );

      const vehiculeDevis = allDevis.filter(
        (d) => Number(d.intervention?.vehicule?.id) === Number(id)
      );

      setVehicules(allVehicules || []);
      setVehicule(vehiculeData || null);
      setInterventions(vehiculeInterventions);
      setDocuments(docsData || []);
      setPhotos(vehiculePhotos);
      setFactures(vehiculeFactures);
      setDevis(vehiculeDevis);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement du dossier véhicule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    setAiResult(null);
    setAiError("");
    setActiveTab("overview");
    loadPredictions(true);
  }, [id]);

  const currentIndex = useMemo(() => {
    return vehicules.findIndex((v) => Number(v.id) === Number(id));
  }, [vehicules, id]);

  const previousVehicule =
    currentIndex > 0 ? vehicules[currentIndex - 1] : null;

  const nextVehicule =
    currentIndex >= 0 && currentIndex < vehicules.length - 1
      ? vehicules[currentIndex + 1]
      : null;

  const deleteDocument = async (documentId) => {
    if (!window.confirm("Supprimer ce document ?")) return;

    try {
      await fetch(`${API_URL}/api/documents/${documentId}`, {
        method: "DELETE",
      });

      load();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du document.");
    }
  };

  const normalizeVehicleModel = (modele) => {
    const value = String(modele || "").toLowerCase();

    if (
      value.includes("truck") ||
      value.includes("scania") ||
      value.includes("iveco")
    ) {
      return "Truck";
    }

    if (
      value.includes("van") ||
      value.includes("sprinter") ||
      value.includes("transit")
    ) {
      return "Van";
    }

    if (value.includes("bus") || value.includes("autocar")) {
      return "Bus";
    }

    if (
      value.includes("suv") ||
      value.includes("duster") ||
      value.includes("range")
    ) {
      return "SUV";
    }

    if (value.includes("moto") || value.includes("motorcycle")) {
      return "Motorcycle";
    }

    return ["Car", "Truck", "Van", "Bus", "SUV", "Motorcycle"].includes(modele)
      ? modele
      : "Car";
  };

  const normalizeFuelType = (carburant) => {
    const value = String(carburant || "").toLowerCase();

    if (value.includes("diesel")) return "Diesel";
    if (value.includes("electric") || value.includes("electrique"))
      return "Electric";

    return "Petrol";
  };

  const normalizeTransmission = (transmission) => {
    const value = String(transmission || "").toLowerCase();

    if (value.includes("manual") || value.includes("manuel")) return "Manual";

    return "Automatic";
  };

  const formatDateForApi = (dateValue) => {
    if (!dateValue) return "2024-01-01";

    try {
      return new Date(dateValue).toISOString().split("T")[0];
    } catch {
      return "2024-01-01";
    }
  };

  const getInterventionDateValue = (intervention) => {
    const value =
      intervention?.dateFin ||
      intervention?.dateDebut ||
      intervention?.dateCreation ||
      intervention?.createdAt;

    return value ? new Date(value).getTime() : 0;
  };

  const getLatestServiceIntervention = () => {
    const sorted = [...interventions].sort(
      (a, b) => getInterventionDateValue(b) - getInterventionDateValue(a)
    );

    return (
      sorted.find((item) => item.statut === "DONE") ||
      sorted.find((item) => item.statut === "IN_PROGRESS") ||
      sorted[0] ||
      null
    );
  };

  const buildMaintenanceProfile = () => {
    const interventionCount = interventions.length;
    const doneCount = interventions.filter((item) => item.statut === "DONE").length;
    const activeCount = interventions.filter((item) =>
      ["PENDING", "IN_PROGRESS"].includes(item.statut)
    ).length;
    const rejectedCount = interventions.filter((item) => item.statut === "REJECTED").length;
    const latestService = getLatestServiceIntervention();
    const latestServiceDate = latestService
      ? formatDateForApi(latestService.dateFin || latestService.dateDebut)
      : formatDateForApi(vehicule?.dateMiseService || vehicule?.date_mise_service);
    const hasMaintenanceStatus = vehicule?.statut === "MAINTENANCE";
    const hasManyProblems = interventionCount >= 3 || activeCount >= 2 || hasMaintenanceStatus;
    const hasAverageHistory = interventionCount > 0 || doneCount > 0;

    return {
      interventionCount,
      doneCount,
      activeCount,
      rejectedCount,
      latestService,
      latestServiceDate,
      maintenanceHistory: hasManyProblems ? "Poor" : hasAverageHistory ? "Average" : "Good",
      hasManyProblems,
    };
  };

  const aiSourceSummary = useMemo(() => {
    if (!vehicule) return [];

    const profile = buildMaintenanceProfile();

    return [
      {
        label: "Interventions precedentes",
        value: profile.interventionCount,
      },
      {
        label: "Services termines",
        value: profile.doneCount,
      },
      {
        label: "Dernier service",
        value: profile.latestServiceDate,
      },
      {
        label: "Historique deduit",
        value: profile.maintenanceHistory,
      },
    ];
  }, [vehicule, interventions]);

  const cleanPredictionPayload = (payload) => {
    const cleaned = { ...AI_DEFAULTS, ...payload };

    AI_NUMERIC_FIELDS.forEach((field) => {
      const fallback = AI_DEFAULTS[field] ?? 0;
      const value = Number(cleaned[field]);
      cleaned[field] = Number.isFinite(value) ? value : fallback;
    });

    cleaned.lastServiceDate =
      cleaned.lastServiceDate || AI_DEFAULTS.lastServiceDate;
    cleaned.warrantyExpiryDate =
      cleaned.warrantyExpiryDate || AI_DEFAULTS.warrantyExpiryDate;

    return cleaned;
  };

  const buildPredictionPayload = (overrides = {}) => {
    const currentYear = new Date().getFullYear();
    const kilometrage = Number(vehicule?.kilometrage || 0);
    const annee = Number(vehicule?.annee || currentYear);
    const profile = buildMaintenanceProfile();
    const fallbackLastServiceMileage =
      Math.max(kilometrage - Math.max(profile.interventionCount, 1) * 5000, 0) ||
      AI_DEFAULTS.lastServiceMileage;

    const autoVehicleData = {
      vehiculeId: vehicule.id,
      vehicleModel: normalizeVehicleModel(vehicule.modele),
      mileage: kilometrage,
      maintenanceHistory: profile.maintenanceHistory,
      reportedIssues: profile.interventionCount,
      vehicleAge: Math.max(currentYear - annee, 0),
      fuelType: normalizeFuelType(vehicule.carburant),
      transmissionType: normalizeTransmission(vehicule.transmission),
      engineSize: Number(vehicule.engineSize || vehicule.engine_size || AI_DEFAULTS.engineSize),
      odometerReading: kilometrage,
      lastServiceMileage: fallbackLastServiceMileage,
      lastServiceDate: profile.latestServiceDate,
      warrantyExpiryDate: "2027-01-01",
      ownerType: AI_DEFAULTS.ownerType,
      insurancePremium: 1200,
      serviceHistory: Math.max(profile.doneCount || profile.interventionCount, 1),
      accidentHistory: AI_DEFAULTS.accidentHistory,
      fuelEfficiency: 15.5,
      tireCondition: profile.hasManyProblems ? "Average" : "Good",
      brakeCondition: profile.hasManyProblems ? "Average" : "Good",
      batteryStatus: profile.hasManyProblems ? "Weak" : "Good",
    };

    return cleanPredictionPayload({
      ...AI_DEFAULTS,
      ...autoVehicleData,
      ...overrides,
      reportedIssues: profile.interventionCount,
      serviceHistory: Math.max(profile.doneCount || profile.interventionCount, 1),
      lastServiceDate: profile.latestServiceDate,
      maintenanceHistory: profile.maintenanceHistory,
    });
  };

  const openAiPredictionForm = () => {
    if (!vehicule?.id) return;

    setAiFormData(buildPredictionPayload(aiFormData));
    setAiError("");
    setShowAiForm(true);
    setActiveTab("ai");
  };

  const updateAiFormField = (name, value) => {
    setAiFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const runAiPrediction = async (formData = aiFormData) => {
    try {
      if (!vehicule?.id) return;

      setAiLoading(true);
      setAiError("");

      const payload = buildPredictionPayload(formData);

      const res = await predictVehicle(payload);
      const data = res.data;

      if (data?.error) {
        throw new Error(data?.error || "Erreur prédiction IA");
      }

      setAiResult(data);
      await loadPredictions(false);
      setShowAiForm(false);
      setActiveTab("ai");
    } catch (error) {
      console.error(error);
      setAiError(error.message || "Erreur lors de la prédiction IA.");
      setActiveTab("ai");
    } finally {
      setAiLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalCost = interventions.reduce(
      (sum, i) => sum + Number(i.cout || 0),
      0
    );

    const paidAmount = factures
      .filter((f) => f.statut === "PAID")
      .reduce((sum, f) => sum + Number(f.montantTtc || 0), 0);

    const unpaidAmount = factures
      .filter((f) => f.statut === "UNPAID")
      .reduce((sum, f) => sum + Number(f.montantTtc || 0), 0);

    const done = interventions.filter((i) => i.statut === "DONE").length;
    const inProgress = interventions.filter(
      (i) => i.statut === "IN_PROGRESS"
    ).length;

    const pending = interventions.filter((i) => i.statut === "PENDING").length;

    return {
      totalCost,
      paidAmount,
      unpaidAmount,
      done,
      inProgress,
      pending,
    };
  }, [interventions, factures]);

  const vehiclePredictions = useMemo(() => {
    return predictions
      .filter((item) => {
        const sameId = Number(item.vehiculeId) === Number(id);
        const samePlate =
          item.immatriculation &&
          vehicule?.immatriculation &&
          String(item.immatriculation).trim().toLowerCase() ===
            String(vehicule.immatriculation).trim().toLowerCase();

        return sameId || samePlate;
      })
      .sort(
        (a, b) =>
          new Date(b.datePrediction || 0) - new Date(a.datePrediction || 0)
      );
  }, [predictions, id, vehicule]);

  const latestVehiclePrediction = vehiclePredictions[0] || null;
  const displayedAiResult = aiResult || latestVehiclePrediction;

  const healthScore = useMemo(() => {
    let score = 100;

    if (vehicule?.statut === "MAINTENANCE") score -= 25;
    if (vehicule?.statut === "INACTIVE") score -= 35;

    score -= Math.min(interventions.length * 5, 30);
    score -= Math.min(Number(vehicule?.kilometrage || 0) / 10000, 25);

    if (
      displayedAiResult?.needMaintenance === 1 ||
      getProbability(displayedAiResult) >= 70
    ) {
      score -= 20;
    }

    return Math.max(Math.round(score), 0);
  }, [vehicule, interventions, displayedAiResult]);

  const healthColor =
    healthScore >= 70
      ? "text-green-600"
      : healthScore >= 40
      ? "text-yellow-600"
      : "text-red-600";

  const client = vehicule?.client || null;

  const getClientFullName = () => {
    if (!client) return "client";
    return `${client.nom || ""} ${client.prenom || ""}`.trim() || "client";
  };

  const getVehicleLabel = () => {
    return `${vehicule?.marque || ""} ${vehicule?.modele || ""} - ${
      vehicule?.immatriculation || ""
    }`.trim();
  };

  const normalizePhoneForWhatsApp = (phone) => {
    if (!phone) return "";

    let clean = String(phone).replace(/\D/g, "");

    if (clean.startsWith("00")) {
      clean = clean.slice(2);
    }

    if (clean.startsWith("0")) {
      clean = `212${clean.slice(1)}`;
    }

    if (!clean.startsWith("212") && clean.length === 9) {
      clean = `212${clean}`;
    }

    return clean;
  };

  const openWhatsAppMessage = () => {
    if (!client?.telephone) {
      alert("Ce client n'a pas de numéro de téléphone.");
      return;
    }

    const phone = normalizePhoneForWhatsApp(client.telephone);

    if (!phone) {
      alert("Numéro de téléphone invalide.");
      return;
    }

    const message =
      `Bonjour ${getClientFullName()},\n\n` +
      `Nous vous contactons concernant votre véhicule ${getVehicleLabel()}.\n\n` +
      `Merci de nous confirmer votre disponibilité pour le suivi de votre dossier.\n\n` +
      `Cordialement,\nGarageFlow+`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  const openGmailCompose = () => {
    if (!client?.email) {
      alert("Ce client n'a pas d'adresse email.");
      return;
    }

    const subject = `Suivi de votre véhicule ${vehicule?.immatriculation || ""}`;

    const body =
      `Bonjour ${getClientFullName()},\n\n` +
      `Nous vous contactons concernant votre véhicule ${getVehicleLabel()}.\n\n` +
      `Informations du véhicule :\n` +
      `- Immatriculation : ${vehicule?.immatriculation || "-"}\n` +
      `- Marque : ${vehicule?.marque || "-"}\n` +
      `- Modèle : ${vehicule?.modele || "-"}\n` +
      `- Kilométrage : ${vehicule?.kilometrage || 0} km\n\n` +
      `Vous pouvez répondre à cet email pour toute précision concernant votre dossier.\n\n` +
      `Cordialement,\n` +
      `GarageFlow+`;

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(client.email)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.open(
      gmailUrl,
      "gmail-compose",
      "width=900,height=700,noopener,noreferrer"
    );
  };

  const timelineEvents = useMemo(() => {
    const events = [];

    const sortedInterventions = [...interventions].sort((a, b) => {
      return new Date(a.dateDebut || 0) - new Date(b.dateDebut || 0);
    });

    sortedInterventions.forEach((intervention) => {
      const interventionId = Number(intervention.id);

      const relatedDevis = devis.filter(
        (d) => Number(d.intervention?.id) === interventionId
      );

      const relatedFactures = factures.filter(
        (f) => Number(f.intervention?.id) === interventionId
      );

      events.push({
        type: "intervention_created",
        title: "Intervention créée",
        date: intervention.dateDebut,
        icon: <FaTools />,
        color: "blue",
        description: intervention.typePanne || "Intervention véhicule",
        details: [
          `Intervention #${intervention.id}`,
          `Statut : ${statusLabel(intervention.statut)}`,
          `Technicien : ${intervention.technicien?.nom || "-"}`,
          `Coût : ${money(intervention.cout)}`,
        ],
        action: () => navigate(`/interventions/details/${intervention.id}`),
      });

      relatedDevis.forEach((d) => {
        events.push({
          type: "devis_created",
          title: "Devis généré",
          date: d.dateCreation,
          icon: <FaFileInvoice />,
          color: "yellow",
          description: `Devis #${d.id}`,
          details: [
            `Montant : ${money(d.montant)}`,
            `Statut interne : ${statusLabel(d.statut)}`,
            `Statut client : ${d.statutClient || "EN_ATTENTE"}`,
          ],
        });

        if (d.dateValidation) {
          events.push({
            type: "devis_validation",
            title:
              d.statutClient === "REFUSE"
                ? "Devis refusé par le client"
                : "Devis accepté par le client",
            date: d.dateValidation,
            icon:
              d.statutClient === "REFUSE" ? (
                <FaExclamationTriangle />
              ) : (
                <FaCheckCircle />
              ),
            color: d.statutClient === "REFUSE" ? "red" : "green",
            description: `Réponse client : ${d.statutClient || "-"}`,
            details: [
              `Statut : ${statusLabel(d.statut)}`,
              `Commentaire : ${d.commentaireClient || "-"}`,
            ],
          });
        }
      });

      if (intervention.statut === "IN_PROGRESS") {
        events.push({
          type: "intervention_progress",
          title: "Intervention en cours",
          date: intervention.dateDebut,
          icon: <FaClock />,
          color: "orange",
          description: intervention.typePanne || "Travaux en cours",
          details: [
            `Intervention #${intervention.id}`,
            `Technicien : ${intervention.technicien?.nom || "-"}`,
          ],
          action: () => navigate(`/interventions/details/${intervention.id}`),
        });
      }

      if (intervention.statut === "DONE") {
        events.push({
          type: "intervention_done",
          title: "Intervention terminée",
          date: intervention.dateFin || intervention.dateDebut,
          icon: <FaCheckCircle />,
          color: "green",
          description: intervention.typePanne || "Intervention terminée",
          details: [
            `Intervention #${intervention.id}`,
            `Coût final : ${money(intervention.cout)}`,
            `Date fin : ${formatDate(intervention.dateFin)}`,
          ],
          action: () => navigate(`/interventions/details/${intervention.id}`),
        });
      }

      relatedFactures.forEach((f) => {
        events.push({
          type: "facture_created",
          title: "Facture générée",
          date: f.dateFacture,
          icon: <FaMoneyBillWave />,
          color: "emerald",
          description: f.numero || `Facture #${f.id}`,
          details: [
            `Montant TTC : ${money(f.montantTtc)}`,
            `Statut : ${statusLabel(f.statut)}`,
            `Numéro : ${f.numero || "-"}`,
          ],
        });

        if (f.statut === "PAID") {
          events.push({
            type: "facture_paid",
            title: "Facture payée",
            date: f.dateFacture,
            icon: <FaCheckCircle />,
            color: "green",
            description: f.numero || `Facture #${f.id}`,
            details: [`Montant payé : ${money(f.montantTtc)}`],
          });
        }
      });
    });

    return events.sort((a, b) => {
      return new Date(b.date || 0) - new Date(a.date || 0);
    });
  }, [interventions, devis, factures, navigate]);

  const tabs = [
    { id: "overview", label: "Vue globale", icon: <FaFolderOpen /> },
    { id: "client", label: "Client", icon: <FaUser /> },
    { id: "history", label: "Historique", icon: <FaClock /> },
    { id: "ai", label: "IA", icon: <FaRobot /> },
    { id: "interventions", label: "Interventions", icon: <FaTools /> },
    { id: "documents", label: "Documents", icon: <FaFileAlt /> },
    { id: "photos", label: "Photos", icon: <FaImage /> },
    { id: "finance", label: "Devis & Factures", icon: <FaFileInvoice /> },
  ];

  const DetailLine = ({ label, value }) => (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="text-slate-900 font-semibold text-sm text-right">
        {value || "-"}
      </span>
    </div>
  );

  const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{label}</p>
        <span className={color}>{icon}</span>
      </div>

      <h2 className={`text-2xl md:text-3xl font-black mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );

  const QuickAction = ({ icon, label, color, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition border disabled:opacity-50 disabled:cursor-not-allowed ${color}`}
    >
      {icon}
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="p-6 bg-[#f6f8fb] text-slate-900">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Chargement du dossier véhicule...
        </div>
      </div>
    );
  }

  if (!vehicule) {
    return (
      <div className="p-6 bg-[#f6f8fb] text-slate-900">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Véhicule introuvable.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-6 shadow-sm">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-cyan-100 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate("/vehicules")}
              className="w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition shadow-sm"
              title="Retour véhicules"
            >
              <FaArrowLeft />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaCar className="text-3xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <FaFolderOpen />
                Dossier véhicule intelligent
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                  {vehicule.immatriculation || `Véhicule #${vehicule.id}`}
                </h1>

                <span
                  className={`text-xs px-3 py-1 rounded-full border font-semibold ${statusColor(
                    vehicule.statut
                  )}`}
                >
                  {statusLabel(vehicule.statut)}
                </span>
              </div>

              <p className="text-slate-500 mt-3 max-w-3xl">
                {vehicule.marque || "-"} {vehicule.modele || ""} •{" "}
                {vehicule.kilometrage || 0} km • {vehicule.carburant || "-"} •{" "}
                {vehicule.transmission || "-"}
                {client
                  ? ` • Client : ${client.nom || ""} ${client.prenom || ""}`
                  : " • Client non défini"}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
                  ID #{vehicule.id}
                </span>

                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
                  Année {vehicule.annee || "-"}
                </span>

                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
                  Moteur {vehicule.engineSize || "-"}
                </span>

                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  {client
                    ? `${client.nom || ""} ${client.prenom || ""}`
                    : "Client non défini"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-full xl:min-w-[420px]">
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={!previousVehicule}
                onClick={() =>
                  previousVehicule &&
                  navigate(`/vehicules/${previousVehicule.id}`)
                }
                className="bg-white hover:bg-slate-50 disabled:opacity-40 border border-slate-200 text-slate-700 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold transition shadow-sm"
              >
                <FaArrowLeft />
                Précédent
              </button>

              <button
                disabled={!nextVehicule}
                onClick={() =>
                  nextVehicule && navigate(`/vehicules/${nextVehicule.id}`)
                }
                className="bg-white hover:bg-slate-50 disabled:opacity-40 border border-slate-200 text-slate-700 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold transition shadow-sm"
              >
                Suivant
                <FaArrowRight />
              </button>
            </div>

            <div className="flex flex-wrap gap-3 justify-start xl:justify-end">
              <QuickAction
                icon={<FaSyncAlt />}
                label="Actualiser"
                onClick={load}
                color="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm"
              />

              <QuickAction
                icon={<FaRobot />}
                label={aiLoading ? "Analyse..." : "Analyser IA"}
                onClick={openAiPredictionForm}
                disabled={aiLoading}
                color="bg-purple-600 hover:bg-purple-700 border-purple-600 text-white shadow-sm"
              />

              <QuickAction
                icon={<FaPlus />}
                label="Intervention"
                onClick={() =>
                  navigate("/interventions/new", {
                    state: { vehicule, vehiculeId: vehicule.id },
                  })
                }
                color="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 mt-6">
          <StatCard
            label="Santé véhicule"
            value={`${healthScore}%`}
            icon={<FaShieldAlt />}
            color={healthColor}
          />

          <StatCard
            label="Client"
            value={
              client
                ? `${client.nom || ""} ${client.prenom || ""}`.trim()
                : "Absent"
            }
            icon={<FaUser />}
            color={client ? "text-blue-600" : "text-red-600"}
          />

          <StatCard
            label="Interventions"
            value={interventions.length}
            icon={<FaTools />}
            color="text-blue-600"
          />

          <StatCard
            label="Documents"
            value={documents.length}
            icon={<FaFileAlt />}
            color="text-purple-600"
          />

          <StatCard
            label="Photos"
            value={photos.length}
            icon={<FaImage />}
            color="text-pink-600"
          />

          <StatCard
            label="Coût total"
            value={money(stats.totalCost)}
            icon={<FaMoneyBillWave />}
            color="text-emerald-600"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="sticky top-24 z-20 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-3 flex flex-wrap gap-3 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl font-semibold transition flex items-center gap-2 ${
              activeTab === tab.id
                ? tab.id === "ai"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-blue-600">
              <FaCar />
              Informations véhicule
            </h2>

            <div className="space-y-3">
              <DetailLine label="ID" value={`#${vehicule.id}`} />
              <DetailLine
                label="Client propriétaire"
                value={
                  client
                    ? `${client.nom || ""} ${client.prenom || ""}`
                    : "Non défini"
                }
              />
              <DetailLine
                label="Immatriculation"
                value={vehicule.immatriculation}
              />
              <DetailLine label="Marque" value={vehicule.marque} />
              <DetailLine label="Modèle" value={vehicule.modele} />
              <DetailLine label="Année" value={vehicule.annee} />
              <DetailLine
                label="Kilométrage"
                value={`${vehicule.kilometrage || 0} km`}
              />
              <DetailLine label="Carburant" value={vehicule.carburant} />
              <DetailLine label="Transmission" value={vehicule.transmission} />
              <DetailLine label="Motorisation" value={vehicule.engineSize} />
              <DetailLine
                label="Date mise en service"
                value={formatDate(vehicule.dateMiseService)}
              />
            </div>
          </div>

          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InfoPanel
                title="Client propriétaire"
                icon={<FaUser />}
                color="text-blue-600"
              >
                {client ? (
                  <div className="space-y-3">
                    <DetailLine
                      label="Nom"
                      value={`${client.nom || ""} ${client.prenom || ""}`}
                    />
                    <DetailLine label="Email" value={client.email} />
                    <DetailLine label="Téléphone" value={client.telephone} />
                    <DetailLine label="Adresse" value={client.adresse} />
                  </div>
                ) : (
                  <EmptyState text="Aucun client n'est associé à ce véhicule." />
                )}
              </InfoPanel>

              <InfoPanel
                title="Contact rapide"
                icon={<FaIdCard />}
                color="text-emerald-600"
              >
                {client ? (
                  <div className="space-y-3">
                    <button
                      onClick={openGmailCompose}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                    >
                      <FaEnvelope />
                      Ouvrir Gmail
                    </button>

                    <button
                      onClick={openWhatsAppMessage}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                    >
                      <FaWhatsapp />
                      Message WhatsApp
                    </button>

                    <a
                      href={client.telephone ? `tel:${client.telephone}` : undefined}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                    >
                      <FaPhone />
                      Appeler le client
                    </a>
                  </div>
                ) : (
                  <EmptyState text="Associez d'abord un client à ce véhicule depuis la page Véhicules." />
                )}
              </InfoPanel>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                label="Terminées"
                value={stats.done}
                icon={<FaCheckCircle />}
                color="text-green-600"
              />

              <StatCard
                label="En cours"
                value={stats.inProgress}
                icon={<FaClock />}
                color="text-yellow-600"
              />

              <StatCard
                label="En attente"
                value={stats.pending}
                icon={<FaWrench />}
                color="text-blue-600"
              />

              <StatCard
                label="Impayé"
                value={money(stats.unpaidAmount)}
                icon={<FaExclamationTriangle />}
                color="text-red-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InfoPanel
                title="Dernières interventions"
                icon={<FaClipboardList />}
                color="text-cyan-600"
              >
                {interventions.length === 0 ? (
                  <EmptyState text="Aucune intervention liée à ce véhicule." />
                ) : (
                  <div className="space-y-3">
                    {interventions.slice(0, 4).map((i) => (
                      <InterventionRow
                        key={i.id}
                        intervention={i}
                        money={money}
                        formatDate={formatDate}
                        statusColor={statusColor}
                        statusLabel={statusLabel}
                        navigate={navigate}
                      />
                    ))}
                  </div>
                )}
              </InfoPanel>

              <InfoPanel
                title="Aperçu IA"
                icon={<FaBrain />}
                color="text-purple-600"
              >
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm">
                        Score santé estimé
                      </p>
                      <h3 className={`text-5xl font-black mt-2 ${healthColor}`}>
                        {healthScore}%
                      </h3>
                    </div>

                    <div className="w-20 h-20 rounded-3xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                      <FaRobot className="text-3xl" />
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm mt-4">
                    Ce score est calculé à partir du statut, du kilométrage, du
                    nombre d’interventions et du résultat IA si une analyse a
                    été lancée.
                  </p>

                  <button
                    onClick={openAiPredictionForm}
                    disabled={aiLoading}
                    className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 px-5 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FaBolt />
                    {aiLoading
                      ? "Analyse IA en cours..."
                      : "Lancer analyse IA"}
                  </button>
                </div>
              </InfoPanel>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT */}
      {activeTab === "client" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-2xl font-black flex items-center gap-3 text-blue-600 mb-6">
              <FaUser />
              Client propriétaire du véhicule
            </h2>

            {client ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ClientInfoBox
                  icon={<FaUser />}
                  label="Nom complet"
                  value={`${client.nom || ""} ${client.prenom || ""}`}
                  color="text-blue-600"
                />
                <ClientInfoBox
                  icon={<FaEnvelope />}
                  label="Email"
                  value={client.email || "Non défini"}
                  color="text-purple-600"
                />
                <ClientInfoBox
                  icon={<FaPhone />}
                  label="Téléphone"
                  value={client.telephone || "Non défini"}
                  color="text-green-600"
                />
                <ClientInfoBox
                  icon={<FaMapMarkerAlt />}
                  label="Adresse"
                  value={client.adresse || "Non définie"}
                  color="text-yellow-600"
                />
              </div>
            ) : (
              <EmptyState text="Aucun client n'est associé à ce véhicule." />
            )}

            {client && (
              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FaClipboardList className="text-blue-600" />
                  Résumé de la relation client
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  Ce véhicule est associé au client
                  <span className="font-semibold text-slate-900">
                    {" "}
                    {client.nom || ""} {client.prenom || ""}
                  </span>
                  . Les devis générés pour les interventions de ce véhicule
                  peuvent être envoyés au client par email, WhatsApp ou via un
                  lien de validation public.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <InfoPanel
              title="Actions client"
              icon={<FaRoute />}
              color="text-emerald-600"
            >
              {client ? (
                <div className="space-y-3">
                  <button
                    onClick={openGmailCompose}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FaEnvelope />
                    Ouvrir Gmail
                  </button>

                  <button
                    onClick={openWhatsAppMessage}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FaWhatsapp />
                    Message WhatsApp
                  </button>

                  <a
                    href={client.telephone ? `tel:${client.telephone}` : undefined}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FaPhone />
                    Appeler
                  </a>

                  <button
                    onClick={() => setActiveTab("finance")}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FaFileInvoice />
                    Voir ses devis
                  </button>
                </div>
              ) : (
                <EmptyState text="Aucune action disponible sans client associé." />
              )}
            </InfoPanel>

            <InfoPanel
              title="Véhicule associé"
              icon={<FaCar />}
              color="text-blue-600"
            >
              <div className="space-y-3">
                <DetailLine
                  label="Immatriculation"
                  value={vehicule.immatriculation}
                />
                <DetailLine label="Marque" value={vehicule.marque} />
                <DetailLine label="Modèle" value={vehicule.modele} />
                <DetailLine
                  label="Kilométrage"
                  value={`${vehicule.kilometrage || 0} km`}
                />
              </div>
            </InfoPanel>
          </div>
        </div>
      )}

      {/* HISTORIQUE */}
      {activeTab === "history" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black flex items-center gap-3 text-blue-600">
                  <FaClock />
                  Historique complet du véhicule
                </h2>

                <p className="text-slate-500 text-sm mt-2">
                  Timeline des interventions, devis, validations client et
                  factures liées à ce véhicule.
                </p>
              </div>

              <button
                onClick={load}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-sm"
              >
                <FaSyncAlt />
                Actualiser
              </button>
            </div>

            {timelineEvents.length === 0 ? (
              <EmptyState text="Aucun historique disponible pour ce véhicule." />
            ) : (
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />

                <div className="space-y-5">
                  {timelineEvents.map((event, index) => (
                    <TimelineItem
                      key={`${event.type}-${index}`}
                      event={event}
                      formatDate={formatDate}
                    />
                  ))}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                    <DetailLine
                      label="Date prediction"
                      value={formatDate(displayedAiResult.datePrediction)}
                    />
                    <DetailLine
                      label="VehicleData"
                      value={`#${displayedAiResult.vehicleDataId || "-"}`}
                    />
                    <DetailLine
                      label="Derniere sync"
                      value={
                        lastPredictionUpdate
                          ? lastPredictionUpdate.toLocaleTimeString("fr-FR")
                          : "-"
                      }
                    />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-purple-600 mb-4">
                    <FaClock />
                    Historique IA du vehicule
                  </h3>

                  {vehiclePredictions.length === 0 ? (
                    <EmptyState text="Aucune prediction IA enregistree pour ce vehicule." />
                  ) : (
                    <div className="space-y-3">
                      {vehiclePredictions.slice(0, 6).map((prediction) => (
                        <PredictionRow
                          key={`${prediction.id}-${prediction.vehicleDataId || prediction.datePrediction}`}
                          prediction={prediction}
                          getProbability={getProbability}
                          getRiskLabel={getRiskLabel}
                          riskColor={riskColor}
                          formatDate={formatDate}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <InfoPanel
              title="Résumé historique"
              icon={<FaChartLine />}
              color="text-purple-600"
            >
              <div className="space-y-3">
                <DetailLine label="Événements" value={timelineEvents.length} />
                <DetailLine label="Interventions" value={interventions.length} />
                <DetailLine label="Devis" value={devis.length} />
                <DetailLine label="Factures" value={factures.length} />
                <DetailLine label="Photos" value={photos.length} />
                <DetailLine label="Coût total" value={money(stats.totalCost)} />
              </div>
            </InfoPanel>

            <InfoPanel
              title="Cycle métier"
              icon={<FaRoute />}
              color="text-emerald-600"
            >
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                    1
                  </span>
                  <span>Création intervention</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-yellow-50 text-yellow-600 border border-yellow-200 flex items-center justify-center">
                    2
                  </span>
                  <span>Génération devis</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-green-50 text-green-600 border border-green-200 flex items-center justify-center">
                    3
                  </span>
                  <span>Validation client</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
                    4
                  </span>
                  <span>Intervention terminée</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                    5
                  </span>
                  <span>Facture générée</span>
                </div>
              </div>
            </InfoPanel>

            <InfoPanel
              title="Actions rapides"
              icon={<FaRoute />}
              color="text-blue-600"
            >
              <div className="space-y-3">
                <button
                  onClick={() =>
                    navigate("/interventions/new", {
                      state: { vehicule, vehiculeId: vehicule.id },
                    })
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FaPlus />
                  Nouvelle intervention
                </button>

                <button
                  onClick={() => setActiveTab("finance")}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FaFileInvoice />
                  Voir devis & factures
                </button>

                <button
                  onClick={() => setActiveTab("photos")}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FaImage />
                  Voir photos
                </button>
              </div>
            </InfoPanel>
          </div>
        </div>
      )}

      {/* IA */}
      {activeTab === "ai" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black flex items-center gap-3 text-purple-600">
                  <FaRobot />
                  Analyse intelligente du véhicule
                </h2>

                <p className="text-slate-500 text-sm mt-2">
                  Prédiction de maintenance basée sur les données techniques, le
                  kilométrage, l’historique et l’état du véhicule.
                </p>
              </div>

              <button
                onClick={openAiPredictionForm}
                disabled={aiLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition"
              >
                <FaBrain />
                {aiLoading ? "Analyse..." : "Relancer IA"}
              </button>
            </div>

            {aiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-5">
                {aiError}
              </div>
            )}

            {!displayedAiResult ? (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 text-center">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                  <FaRobot className="text-4xl" />
                </div>

                <h3 className="text-2xl font-black mt-5 text-slate-950">
                  Aucune analyse IA lancée
                </h3>

                <p className="text-slate-500 mt-2 max-w-xl mx-auto">
                  Cliquez sur “Relancer IA” pour analyser ce véhicule et obtenir
                  le niveau de risque, la probabilité et la recommandation de
                  maintenance.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <AiBox
                    label="Maintenance"
                    value={displayedAiResult.needMaintenance === 1 ? "Oui" : "Non"}
                    color={
                      displayedAiResult.needMaintenance === 1
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  />

                  <AiBox
                    label="Probabilité"
                    value={`${getProbability(displayedAiResult).toFixed(1)}%`}
                    color="text-blue-600"
                  />

                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">
                    <p className="text-xs text-slate-500 mb-2">Risque</p>
                    <span
                      className={`inline-flex px-4 py-2 rounded-full border font-bold ${riskColor(
                        displayedAiResult.niveauRisque || getRiskLabel(displayedAiResult)
                      )}`}
                    >
                      {getRiskLabel(displayedAiResult)}
                    </span>
                  </div>

                  <AiBox
                    label="Modèle IA"
                    value={
                      displayedAiResult.modelVersion ||
                      displayedAiResult.modelUsed ||
                      `#${displayedAiResult.id || displayedAiResult.vehicleDataId || "-"}`
                    }
                    color="text-purple-600"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-cyan-600 mb-4">
                    <FaInfoCircle />
                    Recommandation
                  </h3>

                  {displayedAiResult.recommendation && (
                    <p className="text-slate-600 leading-relaxed">
                      {displayedAiResult.recommendation}
                    </p>
                  )}

                  {!displayedAiResult.recommendation && (displayedAiResult.needMaintenance === 1 ? (
                    <p className="text-slate-600 leading-relaxed">
                      Le modèle indique qu’une maintenance est recommandée pour
                      ce véhicule. Il est conseillé de planifier une
                      intervention, vérifier les pièces sensibles, contrôler les
                      freins, pneus, batterie et historique de maintenance.
                    </p>
                  ) : (
                    <p className="text-slate-600 leading-relaxed">
                      Le véhicule ne présente pas de besoin immédiat de
                      maintenance selon l’analyse. Continuez le suivi normal,
                      gardez les documents à jour et surveillez les prochaines
                      interventions.
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <InfoPanel
              title="Données envoyées"
              icon={<FaChartLine />}
              color="text-blue-600"
            >
              <div className="space-y-3">
                <DetailLine
                  label="Catégorie IA"
                  value={normalizeVehicleModel(vehicule.modele)}
                />
                <DetailLine
                  label="Carburant IA"
                  value={normalizeFuelType(vehicule.carburant)}
                />
                <DetailLine
                  label="Transmission IA"
                  value={normalizeTransmission(vehicule.transmission)}
                />
                <DetailLine
                  label="Kilométrage"
                  value={`${vehicule.kilometrage || 0} km`}
                />
                <DetailLine
                  label="Âge véhicule"
                  value={`${Math.max(
                    new Date().getFullYear() -
                      Number(vehicule.annee || new Date().getFullYear()),
                    0
                  )} ans`}
                />
                <DetailLine label="Interventions" value={interventions.length} />
              </div>
            </InfoPanel>

            <InfoPanel
              title="Actions rapides"
              icon={<FaRoute />}
              color="text-emerald-600"
            >
              <div className="space-y-3">
                <button
                  onClick={() =>
                    navigate("/interventions/new", {
                      state: { vehicule, vehiculeId: vehicule.id },
                    })
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FaPlus />
                  Créer intervention
                </button>

                <button
                  onClick={() => setActiveTab("documents")}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FaFileAlt />
                  Voir documents
                </button>

                <button
                  onClick={() => setActiveTab("finance")}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FaFileInvoice />
                  Voir finance
                </button>
              </div>
            </InfoPanel>
          </div>
        </div>
      )}

      {/* INTERVENTIONS */}
      {activeTab === "interventions" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <h2 className="text-xl font-bold flex items-center gap-2 text-blue-600">
              <FaTools />
              Interventions du véhicule
            </h2>

            <button
              onClick={() =>
                navigate("/interventions/new", {
                  state: { vehicule, vehiculeId: vehicule.id },
                })
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-2xl flex items-center gap-2 font-semibold transition"
            >
              <FaPlus />
              Ajouter intervention
            </button>
          </div>

          {interventions.length === 0 ? (
            <EmptyState text="Aucune intervention pour ce véhicule." />
          ) : (
            <div className="space-y-3">
              {interventions.map((i) => (
                <InterventionRow
                  key={i.id}
                  intervention={i}
                  money={money}
                  formatDate={formatDate}
                  statusColor={statusColor}
                  statusLabel={statusLabel}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* DOCUMENTS */}
      {activeTab === "documents" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-purple-600">
            <FaFileAlt />
            Documents du véhicule
          </h2>

          {documents.length === 0 ? (
            <EmptyState text="Aucun document lié à ce véhicule." />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {documents.map((d) => (
                <div
                  key={d.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-purple-300 transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
                      <FaFileAlt />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700">
                          {d.type || "DOCUMENT"}
                        </span>

                        <span className="text-xs text-slate-400">#{d.id}</span>
                      </div>

                      <p className="font-semibold text-slate-900 truncate">
                        {d.fichier}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(d.dateCreation)}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <a
                          href={buildUrl(d.fichier)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-xl transition flex items-center gap-2"
                        >
                          <FaEye />
                          Ouvrir
                        </a>

                        <a
                          href={buildUrl(d.fichier)}
                          download
                          className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl transition flex items-center gap-2"
                        >
                          <FaDownload />
                          Télécharger
                        </a>

                        <button
                          onClick={() => deleteDocument(d.id)}
                          className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition flex items-center gap-2"
                        >
                          <FaTrash />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PHOTOS */}
      {activeTab === "photos" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-pink-600">
            <FaImage />
            Photos liées aux interventions
          </h2>

          {photos.length === 0 ? (
            <EmptyState text="Aucune photo liée aux interventions de ce véhicule." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-pink-300 hover:shadow-md transition"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={buildUrl(p.url)}
                      onClick={() => setPreviewPhoto(p)}
                      className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition duration-300"
                      alt="photo"
                    />

                    <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700">
                      {p.type || "PHOTO"}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="font-semibold text-slate-900">
                      Photo #{p.id}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Intervention #{p.intervention?.id || "-"}
                    </p>

                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => setPreviewPhoto(p)}
                        className="text-pink-600 hover:bg-pink-50 px-3 py-2 rounded-xl transition flex items-center gap-2"
                      >
                        <FaEye />
                        Voir
                      </button>

                      <a
                        href={buildUrl(p.url)}
                        download
                        className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl transition flex items-center gap-2"
                      >
                        <FaDownload />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FINANCE */}
      {activeTab === "finance" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <InfoPanel
            title="Devis liés"
            icon={<FaFileInvoice />}
            color="text-yellow-600"
          >
            {devis.length === 0 ? (
              <EmptyState text="Aucun devis lié à ce véhicule." />
            ) : (
              <div className="space-y-3">
                {devis.map((d) => (
                  <FinanceRow
                    key={d.id}
                    title={`Devis #${d.id}`}
                    amount={money(d.montant)}
                    status={d.statut}
                    date={formatDate(d.dateCreation)}
                    statusColor={statusColor}
                    statusLabel={statusLabel}
                  />
                ))}
              </div>
            )}
          </InfoPanel>

          <InfoPanel
            title="Factures liées"
            icon={<FaMoneyBillWave />}
            color="text-green-600"
          >
            {factures.length === 0 ? (
              <EmptyState text="Aucune facture liée à ce véhicule." />
            ) : (
              <div className="space-y-3">
                {factures.map((f) => (
                  <FinanceRow
                    key={f.id}
                    title={f.numero || `Facture #${f.id}`}
                    amount={money(f.montantTtc)}
                    status={f.statut}
                    date={formatDate(f.dateFacture)}
                    statusColor={statusColor}
                    statusLabel={statusLabel}
                  />
                ))}
              </div>
            )}
          </InfoPanel>
        </div>
      )}

      {showAiForm && (
        <AiPredictionFormModal
          data={aiFormData}
          loading={aiLoading}
          sourceSummary={aiSourceSummary}
          vehicleLabel={getVehicleLabel()}
          onChange={updateAiFormField}
          onClose={() => setShowAiForm(false)}
          onSubmit={() => runAiPrediction(aiFormData)}
        />
      )}

      {/* PHOTO PREVIEW */}
      {previewPhoto && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden max-w-5xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-xl text-slate-900">
                  Aperçu photo
                </h2>
                <p className="text-slate-500 text-sm">
                  Intervention #{previewPhoto.intervention?.id || "-"}
                </p>
              </div>

              <button
                onClick={() => setPreviewPhoto(null)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="p-5 bg-slate-50">
              <img
                src={buildUrl(previewPhoto.url)}
                className="max-h-[70vh] w-full object-contain rounded-2xl"
                alt="preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineItem({ event, formatDate }) {
  const colorClasses = {
    blue: {
      icon: "bg-blue-50 text-blue-600 border-blue-200",
      badge: "bg-blue-50 text-blue-700 border-blue-200",
    },
    yellow: {
      icon: "bg-yellow-50 text-yellow-600 border-yellow-200",
      badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    orange: {
      icon: "bg-orange-50 text-orange-600 border-orange-200",
      badge: "bg-orange-50 text-orange-700 border-orange-200",
    },
    green: {
      icon: "bg-green-50 text-green-600 border-green-200",
      badge: "bg-green-50 text-green-700 border-green-200",
    },
    red: {
      icon: "bg-red-50 text-red-600 border-red-200",
      badge: "bg-red-50 text-red-700 border-red-200",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600 border-emerald-200",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  };

  const selected = colorClasses[event.color] || colorClasses.blue;

  return (
    <div className="relative flex gap-4 pl-16">
      <div
        className={`absolute left-0 top-1 w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm ${selected.icon}`}
      >
        {event.icon}
      </div>

      <div className="flex-1 bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-200 rounded-3xl p-5 transition shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-black text-slate-950 text-lg">
                {event.title}
              </h3>

              <span
                className={`text-xs px-3 py-1 rounded-full border font-semibold ${selected.badge}`}
              >
                {event.type}
              </span>
            </div>

            <p className="text-slate-500 text-sm mt-1">{event.description}</p>
          </div>

          <p className="text-xs text-slate-400 whitespace-nowrap">
            {formatDate(event.date)}
          </p>
        </div>

        {event.details && event.details.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            {event.details.map((detail, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-600"
              >
                {detail}
              </div>
            ))}
          </div>
        )}

        {event.action && (
          <button
            onClick={event.action}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2"
          >
            <FaEye />
            Voir détail
          </button>
        )}
      </div>
    </div>
  );
}

function ClientInfoBox({ icon, label, value, color }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="font-black text-slate-900 mt-2 break-words">
            {value || "-"}
          </p>
        </div>

        <div
          className={`w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoPanel({ title, icon, color, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h2 className={`text-xl font-bold mb-5 flex items-center gap-2 ${color}`}>
        {icon}
        {title}
      </h2>

      {children}
    </div>
  );
}

function AiBox({ label, value, color }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">
      <p className="text-xs text-slate-500 mb-2">{label}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function AiPredictionFormModal({
  data,
  loading,
  sourceSummary,
  vehicleLabel,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 p-4 backdrop-blur-xl">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-2xl">
        <div className="shrink-0 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1 text-xs font-bold text-purple-700">
                <FaBrain />
                Preparation prediction IA
              </div>

              <h2 className="mt-3 text-2xl font-black text-slate-950">
                Donnees envoyees au modele
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                {vehicleLabel || "Vehicule"} - les champs vides sont remplaces
                par les valeurs par defaut de app.py.
              </p>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Fermer
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="mb-5 rounded-3xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            GarageFlow pre-remplit les champs depuis le vehicule et ses
            interventions precedentes. Les champs metier restants peuvent etre
            completes manuellement, sinon app.py garde ses valeurs par defaut.
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
            {(sourceSummary || []).map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p className="text-xs font-bold uppercase text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-black text-slate-950">
                  {item.value ?? "-"}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {AI_FIELD_GROUPS.map((group) => (
              <div
                key={group.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="mb-4 flex items-center gap-2 font-black text-slate-950">
                  <FaClipboardList className="text-purple-600" />
                  {group.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {group.fields.map((field) => (
                    <AiField
                      key={field.name}
                      field={field}
                      value={data[field.name]}
                      isManual={AI_MANUAL_FIELDS.has(field.name)}
                      onChange={onChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-slate-500">
              Le payload final combine defaults + donnees vehicule + saisie.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-200 disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                onClick={onSubmit}
                disabled={loading}
                className="rounded-2xl bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                <FaRobot />
                {loading ? "Analyse en cours..." : "Lancer prediction"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiField({ field, value, isManual, onChange }) {
  const id = `ai-${field.name}`;
  const disabledClass = field.readOnly
    ? "bg-slate-100 text-slate-600 cursor-not-allowed"
    : "bg-white text-slate-900";

  return (
    <label htmlFor={id} className="block">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">
          {field.label}
        </span>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${
            isManual
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}
        >
          {isManual ? "A completer" : "Auto GarageFlow"}
        </span>
      </div>

      {field.type === "select" ? (
        <select
          id={id}
          value={value ?? ""}
          disabled={field.readOnly}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={`w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100 ${disabledClass}`}
        >
          {field.options.map((option) => (
            <option key={String(option)} value={option}>
              {field.name === "accidentHistory"
                ? Number(option) === 1
                  ? "Oui"
                  : "Non"
                : option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={field.type}
          step={field.step}
          value={value ?? ""}
          readOnly={field.readOnly}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={`w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100 ${disabledClass}`}
        />
      )}

      {field.hint && (
        <span className="mt-2 block text-xs font-medium text-blue-600">
          {field.hint}
        </span>
      )}
    </label>
  );
}

function PredictionRow({
  prediction,
  getProbability,
  getRiskLabel,
  riskColor,
  formatDate,
}) {
  const probability = getProbability(prediction);
  const riskLabel = getRiskLabel(prediction);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-white transition">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-black text-slate-900">
              Prediction #{prediction.id || "-"}
            </h4>

            <span
              className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${riskColor(
                prediction.niveauRisque || riskLabel
              )}`}
            >
              {riskLabel}
            </span>
          </div>

          <p className="text-sm text-slate-500 mt-2 line-clamp-2">
            {prediction.recommendation ||
              "Aucune recommandation detaillee disponible."}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {formatDate(prediction.datePrediction)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">Probabilite</p>
          <p className="text-2xl font-black text-blue-600">
            {probability.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-center py-12 text-slate-500 bg-slate-50 border border-slate-200 rounded-2xl">
      {text}
    </div>
  );
}

function InterventionRow({
  intervention,
  money,
  formatDate,
  statusColor,
  statusLabel,
  navigate,
}) {
  return (
    <div
      onClick={() => navigate(`/interventions/details/${intervention.id}`)}
      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:border-blue-300 hover:bg-white transition cursor-pointer"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-900">
              Intervention #{intervention.id}
            </h3>

            <span
              className={`text-[10px] px-2 py-1 rounded-full border ${statusColor(
                intervention.statut
              )}`}
            >
              {statusLabel(intervention.statut)}
            </span>
          </div>

          <p className="text-sm text-slate-500 mt-1">
            {intervention.typePanne || "Type non défini"} •{" "}
            {intervention.technicien?.nom || "Technicien -"}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {formatDate(intervention.dateDebut)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">Coût</p>
          <p className="font-black text-emerald-600">
            {money(intervention.cout)}
          </p>
        </div>
      </div>
    </div>
  );
}

function FinanceRow({
  title,
  amount,
  status,
  date,
  statusColor,
  statusLabel,
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-white transition">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">{date}</p>
        </div>

        <div className="text-right">
          <p className="font-black text-emerald-600">{amount}</p>

          <span
            className={`inline-flex mt-2 text-[10px] px-2 py-1 rounded-full border ${statusColor(
              status
            )}`}
          >
            {statusLabel(status)}
          </span>
        </div>
      </div>
    </div>
  );
}
