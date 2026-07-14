import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  getVehicules,
  createVehicule,
  updateVehicule,
  deleteVehicule,
} from "../services/vehicule.service";

import { getInterventions } from "../services/intervention.service";
import { getClients } from "../services/client.service";
import { getCurrentUser } from "../services/auth.service";
import {
  extractVehicleDocument,
  normalizePersonName,
} from "../services/vehicle-document-ocr.service";

import {
  FaCar,
  FaGasPump,
  FaCogs,
  FaCalendarAlt,
  FaTools,
  FaTachometerAlt,
  FaSearch,
  FaPlus,
  FaTimes,
  FaTrash,
  FaEdit,
  FaExclamationTriangle,
  FaSave,
  FaArrowLeft,
  FaArrowRight,
  FaPlusCircle,
  FaUser,
  FaEye,
  FaLock,
  FaUpload,
  FaFilePdf,
  FaMagic,
  FaCheckCircle,
  FaIdCard,
} from "react-icons/fa";

export default function Vehicules() {
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const isTechnicien = currentUser?.role === "TECHNICIEN";

  const [list, setList] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [clients, setClients] = useState([]);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;

  const emptyForm = {
    immatriculation: "",
    marque: "",
    modele: "",
    annee: "",
    kilometrage: "",
    carburant: "Diesel",
    transmission: "Manual",
    engineSize: "",
    dateMiseService: "",
    statut: "ACTIVE",
    client: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [predictions, setPredictions] = useState({});
  const [loadingPredictionId, setLoadingPredictionId] = useState(null);
  const [carteGriseFile, setCarteGriseFile] = useState(null);
  const [carteGrisePreview, setCarteGrisePreview] = useState("");
  const [ocrState, setOcrState] = useState({
    status: "idle",
    progress: 0,
    message: "",
    result: null,
    error: "",
  });

  const [alertedVehicleIds, setAlertedVehicleIds] = useState(() => {
    return JSON.parse(localStorage.getItem("alertedVehicleIds") || "[]");
  });

  const load = async () => {
    try {
      const [v, i, c] = await Promise.all([
        getVehicules(),
        getInterventions(),
        getClients(),
      ]);

      const allVehicules = v?.data || [];
      const allInterventions = i?.data || [];

      if (isTechnicien) {
        const myInterventions = allInterventions.filter(
          (intervention) =>
            Number(intervention.technicien?.id) === Number(currentUser?.id)
        );

        const myVehiculeIds = [
          ...new Set(
            myInterventions
              .map((intervention) => intervention.vehicule?.id)
              .filter(Boolean)
              .map(Number)
          ),
        ];

        const myVehicules = allVehicules.filter((vehicule) =>
          myVehiculeIds.includes(Number(vehicule.id))
        );

        setList(myVehicules);
        setInterventions(myInterventions);
        setClients([]);
      } else {
        setList(allVehicules);
        setInterventions(allInterventions);
        setClients(c?.data || []);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement des véhicules.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const money = (v) => `${Number(v || 0).toFixed(2)} DH`;

  const reset = () => {
    if (carteGrisePreview) {
      URL.revokeObjectURL(carteGrisePreview);
    }

    setForm({ ...emptyForm });
    setCarteGriseFile(null);
    setCarteGrisePreview("");
    setOcrState({
      status: "idle",
      progress: 0,
      message: "",
      result: null,
      error: "",
    });
  };

  const findClientFromOwner = (ownerName) => {
    const normalizedOwner = normalizePersonName(ownerName);
    if (!normalizedOwner) return null;

    return clients.find((client) => {
      const normalizedClient = normalizePersonName(
        `${client.nom || ""} ${client.prenom || ""}`
      );

      if (!normalizedClient) return false;

      return (
        normalizedClient === normalizedOwner ||
        normalizedClient.includes(normalizedOwner) ||
        normalizedOwner.includes(normalizedClient)
      );
    });
  };

  const applyExtractedVehicleFields = (fields, ownerName) => {
    const matchedClient = findClientFromOwner(ownerName);

    setForm((current) => {
      const next = { ...current };

      Object.entries(fields).forEach(([key, value]) => {
        if (value !== "" && (next[key] === "" || next[key] == null)) {
          next[key] = value;
        }
      });

      if (!next.client && matchedClient?.id) {
        next.client = matchedClient.id;
      }

      return next;
    });
  };

  const analyzeCarteGrise = async (file) => {
    setOcrState({
      status: "processing",
      progress: 0,
      message: "Preparation du document...",
      result: null,
      error: "",
    });

    try {
      const result = await extractVehicleDocument(file, (progress) => {
        setOcrState((current) => ({
          ...current,
          status: "processing",
          progress: Math.round(Number(progress.progress || 0) * 100),
          message: progress.status || "Lecture du document...",
        }));
      });

      applyExtractedVehicleFields(result.fields, result.ownerName);
      setOcrState({
        status: "success",
        progress: 100,
        message: `${result.detectedCount} champ(s) detecte(s)`,
        result,
        error: "",
      });
    } catch (error) {
      console.error("Erreur OCR carte grise :", error);
      setOcrState({
        status: "error",
        progress: 0,
        message: "",
        result: null,
        error:
          error?.message ||
          "Impossible de lire ce document. Remplissez les champs manuellement.",
      });
    }
  };

  const handleCarteGriseSelection = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Format accepte : PDF, PNG, JPG, JPEG ou WEBP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Le document ne doit pas depasser 10 Mo.");
      return;
    }

    if (carteGrisePreview) {
      URL.revokeObjectURL(carteGrisePreview);
    }

    setCarteGriseFile(file);
    setCarteGrisePreview(
      file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
    );
    analyzeCarteGrise(file);
  };

  const getVehiculeInterventions = (id) => {
    return interventions.filter((i) => Number(i.vehicule?.id) === Number(id));
  };

  const getTotalCost = (id) => {
    return getVehiculeInterventions(id).reduce(
      (sum, i) => sum + Number(i.cout || 0),
      0
    );
  };

  const handleSave = async () => {
    if (isTechnicien) {
      alert("Accès refusé : un technicien ne peut pas modifier les véhicules.");
      return;
    }

    if (ocrState.status === "processing") {
      alert("Attendez la fin de l'analyse de la carte grise.");
      return;
    }

    if (!form.immatriculation || !form.marque || !form.modele) {
      alert("Veuillez remplir immatriculation, marque et modèle.");
      return;
    }

    const payload = {
      immatriculation: form.immatriculation,
      marque: form.marque,
      modele: form.modele,
      annee: Number(form.annee || 0),
      kilometrage: Number(form.kilometrage || 0),
      carburant: form.carburant,
      transmission: form.transmission,
      engineSize: Number(form.engineSize || 0),
      ...(form.dateMiseService
        ? { dateMiseService: `${form.dateMiseService} 00:00:00` }
        : {}),
      statut: form.statut,
      client: form.client ? { id: Number(form.client) } : null,
    };

    if (editId) {
      await updateVehicule(editId, payload);
    } else {
      await createVehicule(payload);
    }

    reset();
    setEditId(null);
    setOpen(false);
    await load();
  };

  const remove = async (id) => {
    if (isTechnicien) {
      alert("Accès refusé : un technicien ne peut pas supprimer un véhicule.");
      return;
    }

    if (!window.confirm("Supprimer ce véhicule ?")) return;

    await deleteVehicule(id);
    await load();
  };

  const edit = (v) => {
    if (isTechnicien) {
      alert("Accès refusé : un technicien ne peut pas modifier un véhicule.");
      return;
    }

    setEditId(v.id);

    if (carteGrisePreview) {
      URL.revokeObjectURL(carteGrisePreview);
    }
    setCarteGriseFile(null);
    setCarteGrisePreview("");
    setOcrState({
      status: "idle",
      progress: 0,
      message: "",
      result: null,
      error: "",
    });

    setForm({
      immatriculation: v.immatriculation || "",
      marque: v.marque || "",
      modele: v.modele || "",
      annee: v.annee || "",
      kilometrage: v.kilometrage || "",
      carburant: v.carburant || "Diesel",
      transmission: v.transmission || "Manual",
      engineSize: v.engineSize || v.engine_size || "",
      dateMiseService: v.dateMiseService
        ? String(v.dateMiseService).slice(0, 10)
        : "",
      statut: v.statut || "ACTIVE",
      client: v.client?.id || "",
    });

    setOpen(true);
  };

  const filtered = useMemo(() => {
    return list.filter((v) => {
      const text = `
        ${v.immatriculation || ""}
        ${v.marque || ""}
        ${v.modele || ""}
        ${v.carburant || ""}
        ${v.transmission || ""}
        ${v.client?.nom || ""}
        ${v.client?.prenom || ""}
        ${v.client?.email || ""}
      `.toLowerCase();

      const matchSearch = text.includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || v.statut === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [list, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const start = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  const stats = useMemo(() => {
    const active = list.filter((v) => v.statut === "ACTIVE").length;
    const inactive = list.filter((v) => v.statut !== "ACTIVE").length;
    const totalCost = list.reduce((sum, v) => sum + getTotalCost(v.id), 0);
    const withClient = list.filter((v) => v.client?.id).length;

    return {
      total: list.length,
      active,
      inactive,
      totalCost,
      withClient,
    };
  }, [list, interventions]);

  const statusBadge = (status) => {
    return status === "ACTIVE"
      ? "bg-green-50 text-green-700 border-green-200"
      : status === "MAINTENANCE"
      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
      : "bg-red-50 text-red-700 border-red-200";
  };

  const inputClass =
    "w-full p-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition";

  const normalizeFuelType = (carburant) => {
    const value = String(carburant || "").toLowerCase();

    if (
      value.includes("diesel") ||
      value.includes("disel") ||
      value.includes("dizel")
    ) {
      return "Diesel";
    }

    return "Petrol";
  };

  const normalizeTransmission = (transmission) => {
    const value = String(transmission || "").toLowerCase();

    if (
      value === "m" ||
      value.includes("manuel") ||
      value.includes("manual") ||
      value.includes("manuelle")
    ) {
      return "Manual";
    }

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

  const markAlerted = (id) => {
    setAlertedVehicleIds((prev) => {
      if (prev.includes(id)) return prev;

      const updated = [...prev, id];
      localStorage.setItem("alertedVehicleIds", JSON.stringify(updated));

      return updated;
    });
  };

  const buildPredictionPayload = (vehicule) => {
    const currentYear = new Date().getFullYear();
    const kilometrage = Number(vehicule.kilometrage || 0);
    const annee = Number(vehicule.annee || currentYear);
    const interventionCount = getVehiculeInterventions(vehicule.id).length;

    return {
      vehiculeId: vehicule.id,
      vehicleModel: vehicule.modele || "Car",
      mileage: kilometrage,
      maintenanceHistory: vehicule.statut === "MAINTENANCE" ? "Poor" : "Good",
      reportedIssues: interventionCount,
      vehicleAge: Math.max(currentYear - annee, 0),
      fuelType: normalizeFuelType(vehicule.carburant),
      transmissionType: normalizeTransmission(vehicule.transmission),
      engineSize: Number(vehicule.engineSize || vehicule.engine_size || 1.6),
      odometerReading: kilometrage,
      lastServiceMileage: Math.max(kilometrage - 10000, 0),
      lastServiceDate: formatDateForApi(
        vehicule.dateMiseService || vehicule.date_mise_service
      ),
      warrantyExpiryDate: "2027-01-01",
      ownerType: "First",
      insurancePremium: 1200,
      serviceHistory: interventionCount || 1,
      accidentHistory: "No",
      fuelEfficiency: 15.5,
      tireCondition: vehicule.statut === "MAINTENANCE" ? "Worn Out" : "Good",
      brakeCondition:
        vehicule.statut === "MAINTENANCE" ? "Needs Replacement" : "Good",
      batteryStatus: vehicule.statut === "MAINTENANCE" ? "Weak" : "Good",
    };
  };

  const handlePredictionResult = (vehicule, result) => {
    console.log("Réponse prédiction :", result);

    if (result?.error) {
      alert("Erreur backend : " + result.error);
      return false;
    }

    if (!result?.vehicleDataId || !result?.predictionId) {
      alert(
        "La prédiction a été retournée, mais elle n'a pas été enregistrée correctement dans la base."
      );
      return false;
    }

    setPredictions((prev) => ({
      ...prev,
      [vehicule.id]: result,
    }));

    if (
      result.niveauRisque === "Élevé" &&
      !alertedVehicleIds.includes(vehicule.id)
    ) {
      alert(
        `Alerte IA : risque élevé détecté pour le véhicule ${
          vehicule.marque || ""
        } ${vehicule.modele || ""} - ${vehicule.immatriculation || ""}`
      );

      markAlerted(vehicule.id);
    }

    return true;
  };

  const predictMaintenance = async (vehicule) => {
    if (isTechnicien) {
      alert("Accès refusé : un technicien ne peut pas relancer l'analyse IA.");
      return;
    }

    try {
      if (!vehicule?.id) {
        alert("Impossible de prédire : véhicule sans ID.");
        return;
      }

      setLoadingPredictionId(vehicule.id);

      const data = buildPredictionPayload(vehicule);

      const response = await axios.post(
        "http://localhost:8080/api/predictions/maintenance",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const saved = handlePredictionResult(vehicule, response.data);

      if (saved) {
        await load();
      }
    } catch (error) {
      console.error("Erreur complète :", error);

      if (error.response) {
        alert(
          "Erreur Spring Boot : " +
            error.response.status +
            "\n" +
            JSON.stringify(error.response.data)
        );
      } else if (error.request) {
        alert(
          "Aucune réponse du serveur. Vérifie que Spring Boot est lancé sur http://localhost:8080"
        );
      } else {
        alert("Erreur : " + error.message);
      }
    } finally {
      setLoadingPredictionId(null);
    }
  };

  const relancerIA = async () => {
    if (isTechnicien) {
      alert("Accès refusé : un technicien ne peut pas relancer l'analyse IA.");
      return;
    }

    if (!list || list.length === 0) {
      alert("Aucun véhicule à analyser.");
      return;
    }

    if (!window.confirm("Relancer l'analyse IA pour tous les véhicules ?")) {
      return;
    }

    localStorage.removeItem("alertedVehicleIds");
    setAlertedVehicleIds([]);
    setPredictions({});

    for (const vehicule of list) {
      try {
        setLoadingPredictionId(vehicule.id);

        const data = buildPredictionPayload(vehicule);

        const response = await axios.post(
          "http://localhost:8080/api/predictions/maintenance",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        handlePredictionResult(vehicule, response.data);
      } catch (error) {
        console.error("Erreur relance IA pour véhicule :", vehicule.id, error);
      }
    }

    setLoadingPredictionId(null);
    await load();
  };

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-6 shadow-sm mb-6">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-purple-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaCar className="text-2xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                {isTechnicien ? <FaLock /> : <FaTools />}
                {isTechnicien
                  ? "Espace technicien - lecture seule"
                  : "Gestion intelligente de flotte"}
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950">
                {isTechnicien
                  ? "Véhicules de mes interventions"
                  : "Gestion des véhicules"}
              </h1>

              <p className="text-slate-500 mt-2 max-w-2xl">
                {isTechnicien
                  ? "Consultez uniquement les véhicules liés aux interventions qui vous sont affectées."
                  : "Suivez vos véhicules, leurs clients propriétaires, leurs interventions, les coûts de maintenance et les prédictions IA."}
              </p>
            </div>
          </div>

          {!isTechnicien && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={relancerIA}
                disabled={loadingPredictionId !== null}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaExclamationTriangle />
                {loadingPredictionId !== null ? "Analyse IA..." : "Relancer IA"}
              </button>

              <button
                onClick={() => {
                  reset();
                  setEditId(null);
                  setOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-sm"
              >
                <FaPlus />
                Ajouter véhicule
              </button>
            </div>
          )}
        </div>

        {/* MINI STATS */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">
              {isTechnicien ? "Véhicules concernés" : "Total véhicules"}
            </p>
            <p className="text-2xl font-black text-blue-600 mt-1">
              {stats.total}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">Véhicules actifs</p>
            <p className="text-2xl font-black text-green-600 mt-1">
              {stats.active}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">Avec client</p>
            <p className="text-2xl font-black text-purple-600 mt-1">
              {stats.withClient}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">
              {isTechnicien
                ? "Coût de mes interventions"
                : "Coût total interventions"}
            </p>
            <p className="text-2xl font-black text-yellow-600 mt-1">
              {money(stats.totalCost)}
            </p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            placeholder="Rechercher véhicule, marque, modèle, client..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="ACTIVE">Actifs</option>
          <option value="MAINTENANCE">En maintenance</option>
          <option value="INACTIVE">Non actifs</option>
        </select>
      </div>

      {/* GRID */}
      {paginated.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          {isTechnicien
            ? "Aucun véhicule lié à vos interventions."
            : "Aucun véhicule trouvé."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginated.map((v) => {
            const vehiculeInterventions = getVehiculeInterventions(v.id);
            const totalCost = getTotalCost(v.id);

            return (
              <div
                key={v.id}
                onClick={() => navigate(`/vehicules/${v.id}`)}
                className="group bg-white border border-slate-200 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-300"
              >
                {/* TOP */}
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 group-hover:text-blue-600 transition">
                      <FaCar className="text-blue-600" />
                      {v.marque} {v.modele}
                    </h2>

                    <p className="text-slate-500 text-sm mt-1">
                      {v.immatriculation}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full border font-semibold ${statusBadge(
                      v.statut
                    )}`}
                  >
                    {v.statut}
                  </span>
                </div>

                {/* INFO */}
                <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2">
                      <FaGasPump />
                      Carburant
                    </span>
                    <span className="font-semibold text-slate-900">
                      {v.carburant || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2">
                      <FaCogs />
                      Transmission
                    </span>
                    <span className="font-semibold text-slate-900">
                      {v.transmission || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2">
                      <FaCalendarAlt />
                      Année
                    </span>
                    <span className="font-semibold text-slate-900">
                      {v.annee || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2">
                      <FaTachometerAlt />
                      Kilométrage
                    </span>
                    <span className="font-semibold text-slate-900">
                      {v.kilometrage || 0} km
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 flex items-center gap-2">
                      <FaUser />
                      Client
                    </span>
                    <span className="font-semibold text-slate-900 text-right">
                      {v.client
                        ? `${v.client.nom || ""} ${v.client.prenom || ""}`
                        : "Non défini"}
                    </span>
                  </div>
                </div>

                {/* MAINTENANCE */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                    <p className="text-xs text-slate-500">
                      {isTechnicien
                        ? "Mes interventions"
                        : "Interventions"}
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {vehiculeInterventions.length}
                    </p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
                    <p className="text-xs text-slate-500">Coût total</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {money(totalCost)}
                    </p>
                  </div>
                </div>

                {predictions[v.id] && !isTechnicien && (
                  <div className="mt-4 bg-purple-50 border border-purple-200 rounded-2xl p-4">
                    <p className="text-xs text-slate-500 mb-2">
                      Prédiction IA
                    </p>

                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Risque</span>
                      <span
                        className={
                          predictions[v.id].niveauRisque === "Élevé"
                            ? "text-red-600 font-bold"
                            : predictions[v.id].niveauRisque === "Moyen"
                            ? "text-yellow-600 font-bold"
                            : "text-green-600 font-bold"
                        }
                      >
                        {predictions[v.id].niveauRisque}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm mt-1 text-slate-600">
                      <span>Probabilité</span>
                      <span className="text-blue-600 font-bold">
                        {(
                          Number(predictions[v.id].probability || 0) * 100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>

                    <div className="flex justify-between text-sm mt-1 text-slate-600">
                      <span>Maintenance</span>
                      <span
                        className={
                          predictions[v.id].needMaintenance === 1
                            ? "text-red-600 font-bold"
                            : "text-green-600 font-bold"
                        }
                      >
                        {predictions[v.id].needMaintenance === 1
                          ? "Oui"
                          : "Non"}
                      </span>
                    </div>
                  </div>
                )}

                {/* ACTIONS */}
                <div
                  className={`grid gap-2 mt-5 pt-4 border-t border-slate-100 ${
                    isTechnicien ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {isTechnicien ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/vehicules/${v.id}`);
                      }}
                      className="text-blue-700 hover:bg-blue-50 px-3 py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm border border-blue-100"
                    >
                      <FaEye />
                      Voir véhicule
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          navigate("/interventions/new", {
                            state: {
                              vehicule: v,
                              vehiculeId: v.id,
                            },
                          });
                        }}
                        className="text-green-700 hover:bg-green-50 px-3 py-2 rounded-xl transition flex items-center justify-center gap-2 text-sm border border-green-100"
                      >
                        <FaPlusCircle />
                        Intervention
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          predictMaintenance(v);
                        }}
                        disabled={loadingPredictionId === v.id}
                        className="text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-xl transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 border border-purple-100"
                      >
                        <FaExclamationTriangle />
                        {loadingPredictionId === v.id ? "Analyse..." : "IA"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          edit(v);
                        }}
                        className="text-yellow-700 hover:bg-yellow-50 px-3 py-2 rounded-xl transition flex items-center justify-center gap-2 text-sm border border-yellow-100"
                      >
                        <FaEdit />
                        Modifier
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(v.id);
                        }}
                        className="text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition flex items-center justify-center gap-2 text-sm border border-red-100"
                      >
                        <FaTrash />
                        Supprimer
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition"
          >
            <FaArrowLeft />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-xl transition border ${
                page === i + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition"
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      {/* FORM MODAL ADMIN ONLY */}
      {open && !isTechnicien && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
            <div className="shrink-0 flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                  <FaCar className="text-blue-600" />
                  {editId ? "Modifier véhicule" : "Ajouter véhicule"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Informations techniques du véhicule et client propriétaire.
                </p>
              </div>

              <button
                onClick={() => {
                  reset();
                  setEditId(null);
                  setOpen(false);
                }}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
             

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Immatriculation">
                  <input
                    className={inputClass}
                    value={form.immatriculation}
                    onChange={(e) =>
                      setForm({ ...form, immatriculation: e.target.value })
                    }
                    placeholder="Ex: 123-A-45"
                  />
                </Field>

                <Field label="Statut">
                  <select
                    className={inputClass}
                    value={form.statut}
                    onChange={(e) =>
                      setForm({ ...form, statut: e.target.value })
                    }
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </Field>

                <Field label="Client propriétaire">
                  <select
                    className={inputClass}
                    value={form.client}
                    onChange={(e) =>
                      setForm({ ...form, client: e.target.value })
                    }
                  >
                    <option value="">Aucun client</option>

                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.nom} {client.prenom || ""} - {client.email}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Marque">
                  <input
                    className={inputClass}
                    value={form.marque}
                    onChange={(e) =>
                      setForm({ ...form, marque: e.target.value })
                    }
                    placeholder="Ex: Renault, Scania, Ford..."
                  />
                </Field>

                <Field label="Catégorie du véhicule">
                  <select
                    className={inputClass}
                    value={form.modele}
                    onChange={(e) =>
                      setForm({ ...form, modele: e.target.value })
                    }
                  >
                    <option value="">Choisir catégorie</option>
                    <option value="Car">Car</option>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                    <option value="Bus">Bus</option>
                    <option value="SUV">SUV</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                </Field>

                <Field label="Année">
                  <input
                    type="number"
                    className={inputClass}
                    value={form.annee}
                    onChange={(e) =>
                      setForm({ ...form, annee: e.target.value })
                    }
                    placeholder="Ex: 2022"
                  />
                </Field>

                <Field label="Kilométrage">
                  <input
                    type="number"
                    className={inputClass}
                    value={form.kilometrage}
                    onChange={(e) =>
                      setForm({ ...form, kilometrage: e.target.value })
                    }
                    placeholder="Ex: 85000"
                  />
                </Field>

                <Field label="Carburant">
                  <select
                    className={inputClass}
                    value={form.carburant}
                    onChange={(e) =>
                      setForm({ ...form, carburant: e.target.value })
                    }
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                  </select>
                </Field>

                <Field label="Transmission">
                  <select
                    className={inputClass}
                    value={form.transmission}
                    onChange={(e) =>
                      setForm({ ...form, transmission: e.target.value })
                    }
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </Field>

                <Field label="Motorisation">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className={inputClass}
                    value={form.engineSize}
                    onChange={(e) =>
                      setForm({ ...form, engineSize: e.target.value })
                    }
                    placeholder="Ex: 49, 1600, 2500"
                  />
                </Field>

                <Field label="Date mise en service">
                  <input
                    type="date"
                    className={inputClass}
                    value={form.dateMiseService}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dateMiseService: e.target.value,
                      })
                    }
                  />
                </Field>
              </div>
            </div>

            <div className="shrink-0 flex justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => {
                  reset();
                  setEditId(null);
                  setOpen(false);
                }}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
              >
                Annuler
              </button>

              <button
                onClick={handleSave}
                disabled={ocrState.status === "processing"}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {loadingPredictionId && !isTechnicien && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-semibold">
          Analyse IA en cours...
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm text-slate-500 block mb-2">{label}</label>
      {children}
    </div>
  );
}
