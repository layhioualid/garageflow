import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/auth.service";
import {
  createIntervention,
  updateIntervention,
  getInterventions,
} from "../services/intervention.service";

import {
  generateFacture,
  sendFactureToClient,
} from "../services/facture.service";

import { generateDevis } from "../services/devis.service";
import { getVehicules } from "../services/vehicule.service";
import { getTechniciens } from "../services/user.service";
import { getPieces } from "../services/piece.service";

import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaSave,
  FaFileInvoice,
  FaCar,
  FaUserCog,
  FaTools,
  FaClipboardList,
  FaCamera,
  FaImage,
  FaMoneyBillWave,
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaEdit,
} from "react-icons/fa";

export default function InterventionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const vehiculeFromState = location.state?.vehicule || null;
  const vehiculeIdFromState =
    location.state?.vehiculeId || vehiculeFromState?.id || "";

  const [vehicules, setVehicules] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [pieces, setPieces] = useState([]);

  const [piecesList, setPiecesList] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState("");
  const [quantite, setQuantite] = useState(1);

  const [beforeFiles, setBeforeFiles] = useState([]);
  const [afterFiles, setAfterFiles] = useState([]);
  const [initialFiles, setInitialFiles] = useState([]);
  const [beforePhotos, setBeforePhotos] = useState([]);
  const [afterPhotos, setAfterPhotos] = useState([]);
  const [initialPhotos, setInitialPhotos] = useState([]);
  const [initialFilePreviews, setInitialFilePreviews] = useState([]);
  const currentUser = getCurrentUser();
const isTechnicien = currentUser?.role === "TECHNICIEN";

  const [form, setForm] = useState({
    typePanne: "",
    description: "",
    numeroOrdreReparation: "",
    besoinsClient: [""],
    statut: "PENDING",
    vehicule: { id: vehiculeIdFromState || "" },
    technicien: { id: "" },
  });

  useEffect(() => {
    const previews = initialFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setInitialFilePreviews(previews);

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [initialFiles]);

  const removeInitialFile = (indexToRemove) => {
    setInitialFiles((current) =>
      current.filter((_, index) => index !== indexToRemove)
    );
  };

  const updateBesoinClient = (index, value) => {
    setForm((current) => {
      const besoinsClient = [...current.besoinsClient];
      besoinsClient[index] = value;
      return { ...current, besoinsClient };
    });
  };

  const addBesoinClient = () => {
    setForm((current) => ({
      ...current,
      besoinsClient: [...current.besoinsClient, ""],
    }));
  };

  const removeBesoinClient = (indexToRemove) => {
    setForm((current) => {
      const besoinsClient = current.besoinsClient.filter(
        (_, index) => index !== indexToRemove
      );

      return {
        ...current,
        besoinsClient: besoinsClient.length > 0 ? besoinsClient : [""],
      };
    });
  };

  useEffect(() => {
    const load = async () => {
      const [v, t, p] = await Promise.all([
        getVehicules(),
        getTechniciens(),
        getPieces(),
      ]);

      setVehicules(v.data || []);
      setTechniciens(t.data || []);
      setPieces(p.data || []);

      if (id) {
        const res = await getInterventions();
        const current = res.data.find((x) => x.id == id);

        if (current) {
          setForm({
            typePanne: current.typePanne || "",
            description: current.description || "",
            numeroOrdreReparation: current.numeroOrdreReparation || "",
            besoinsClient:
              current.besoinsClient?.length > 0 ? current.besoinsClient : [""],
            statut: current.statut || "PENDING",
            vehicule: { id: current.vehicule?.id || "" },
            technicien: { id: current.technicien?.id || "" },
          });

          setPiecesList(current.pieces || []);
        }
        if (
        isTechnicien &&
        Number(current?.technicien?.id) !== Number(currentUser?.id)
      ) {
        alert("Accès refusé : cette intervention ne vous est pas affectée.");
        navigate("/technicien/interventions");
        return;
      }

        loadPhotos();
      } else if (vehiculeIdFromState) {
        setForm((prev) => ({
          ...prev,
          vehicule: { id: vehiculeIdFromState },
        }));
      }
    };

    load();
  }, [id, vehiculeIdFromState]);

  const buildImageUrl = (url) => {
    return `http://localhost:8080${url.startsWith("/") ? url : "/" + url}`;
  };

  const total = piecesList.reduce((sum, item) => {
    const piece = pieces.find((x) => x.id == item.piece.id);
    return sum + Number(piece?.prix || 0) * Number(item.quantite || 0);
  }, 0);

  const selectedVehicule =
    vehicules.find((v) => String(v.id) === String(form.vehicule.id)) ||
    vehiculeFromState;

  const selectedTechnicien = techniciens.find(
    (t) => String(t.id) === String(form.technicien.id)
  );

  const addPiece = () => {
    if (!selectedPiece) return;

    setPiecesList([
      ...piecesList,
      {
        piece: { id: Number(selectedPiece) },
        quantite: Number(quantite),
      },
    ]);

    setSelectedPiece("");
    setQuantite(1);
  };

  const removePiece = (index) => {
    const copy = [...piecesList];
    copy.splice(index, 1);
    setPiecesList(copy);
  };

  const loadPhotos = async () => {
    if (!id) return;

    const res = await fetch("http://localhost:8080/api/photos");
    const data = await res.json();

    const filtered = data.filter((p) => p.intervention?.id === Number(id));

    setInitialPhotos(filtered.filter((p) => p.type === "INITIAL"));
    setBeforePhotos(filtered.filter((p) => p.type === "BEFORE"));
    setAfterPhotos(filtered.filter((p) => p.type === "AFTER"));
  };

  const uploadAllPhotos = async (interventionId) => {
    const upload = async (file, type) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("interventionId", interventionId);

      await fetch("http://localhost:8080/api/photos/upload", {
        method: "POST",
        body: formData,
      });
    };

    for (let file of initialFiles) {
      await upload(file, "INITIAL");
    }

    for (let file of beforeFiles) {
      await upload(file, "BEFORE");
    }

    for (let file of afterFiles) {
      await upload(file, "AFTER");
    }
  };

  const deletePhoto = async (photoId) => {
    if (!window.confirm("Supprimer cette photo ?")) return;

    await fetch(`http://localhost:8080/api/photos/${photoId}`, {
      method: "DELETE",
    });

    loadPhotos();
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

const openWhatsAppFactureMessage = (facture) => {
  const vehicule = facture?.intervention?.vehicule;
  const client = vehicule?.client;

  if (!client?.telephone) {
    alert("Facture générée, mais le client n'a pas de numéro WhatsApp.");
    return;
  }

  const phone = normalizePhoneForWhatsApp(client.telephone);

  const clientName =
    `${client.nom || ""} ${client.prenom || ""}`.trim() || "client";

  const vehicleLabel =
    `${vehicule?.marque || ""} ${vehicule?.modele || ""} - ${
      vehicule?.immatriculation || ""
    }`.trim();

  const factureLink = `http://localhost:8080/api/factures/${facture.id}/print`;

  const text =
    `Bonjour ${clientName},\n\n` +
    `Votre véhicule est prêt à être récupéré.\n\n` +
    `Véhicule : ${vehicleLabel}\n` +
    `Intervention : ${facture?.intervention?.typePanne || "-"}\n` +
    `Montant TTC : ${Number(facture?.montantTtc || 0).toFixed(2)} DH\n\n` +
    `Vous pouvez consulter votre facture ici :\n` +
    `${factureLink}\n\n` +
    `Cordialement,\nGarageFlow+`;

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
    "_blank"
  );
};

const notifyClientWhenDone = async (interventionId) => {
  try {
    const factureRes = await generateFacture(interventionId);
    const facture = factureRes.data;

    if (!facture?.id) {
      alert("Intervention terminée, mais la facture n'a pas été générée.");
      return;
    }

    try {
      await sendFactureToClient(facture.id);
      alert("Intervention terminée. Facture générée et email envoyé au client.");
    } catch (emailError) {
      console.error("Erreur email facture :", emailError);
      alert("Facture générée, mais l'email n'a pas pu être envoyé.");
    }

    openWhatsAppFactureMessage(facture);
  } catch (error) {
    console.error("Erreur génération facture automatique :", error);
    alert(
      "Intervention terminée, mais erreur lors de la génération automatique de la facture."
    );
  }
};

  const save = async () => {
    if (isTechnicien && !id) {
      alert("Accès refusé : un technicien ne peut pas créer une intervention.");
      return;
}
    if (!form.typePanne || !form.vehicule.id || !form.technicien.id) {
      alert("Veuillez remplir le type de panne, le véhicule et le technicien.");
      return;
    }

    if (!id && initialPhotos.length + initialFiles.length === 0) {
      alert("Ajoutez au moins une photo de l'etat initial du vehicule a son entree.");
      return;
    }

    const besoinsClient = form.besoinsClient
      .map((besoin) => besoin.trim())
      .filter(Boolean);

    if (besoinsClient.length === 0) {
      alert("Ajoutez au moins un besoin du client dans l'ordre de reparation.");
      return;
    }

    const payload = {
      ...form,
      besoinsClient,
      vehicule: { id: Number(form.vehicule.id) },
      technicien: { id: Number(form.technicien.id) },
      pieces: piecesList.map((p) => ({
        piece: { id: Number(p.piece.id) },
        quantite: Number(p.quantite),
      })),
    };

    let response;

    if (id) {
      response = await updateIntervention(id, payload);
    } else {
      response = await createIntervention(payload);
    }

    const interventionId = id || response.data.id;

    if (!interventionId) {
      alert("Erreur : interventionId null");
      return;
    }

    await uploadAllPhotos(interventionId);

    if (form.statut === "DONE") {
  await notifyClientWhenDone(interventionId);
    }

    navigate("/interventions");
  };

  const handleGenerateDevis = async () => {
    try {
      if (!id) {
        alert("Enregistrez d’abord l’intervention avant de générer un devis.");
        return;
      }

      await generateDevis(id);

      alert("Devis généré avec succès");
      navigate("/devis");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération du devis");
    }
  };

  const inputClass =
    "w-full p-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition";

  const cardClass =
    "bg-white border border-slate-200 rounded-3xl p-6 shadow-sm";

  return (
    <div className="bg-[#f6f8fb] text-slate-900 p-6 space-y-6">
      {/* HEADER PREMIUM */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-6 shadow-sm">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-purple-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition shadow-sm"
            >
              <FaArrowLeft />
            </button>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <FaTools />
                Centre de maintenance
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3 text-slate-950">
                {id ? "Modifier intervention" : "Nouvelle intervention"}
              </h1>

              <p className="text-slate-500 text-sm md:text-base mt-2 max-w-2xl">
                Gérez les informations de panne, le véhicule concerné, le technicien,
                les pièces utilisées, les photos et la génération du devis.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div
              className={`px-5 py-3 rounded-2xl border flex items-center gap-3 font-semibold ${
                id
                  ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              {id ? <FaEdit /> : <FaCheckCircle />}
              {id ? "Mode modification" : "Création intervention"}
            </div>
          </div>
        </div>

        {/* MINI STATUS BAR */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="group bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-3xl p-5 transition shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Véhicule
              </p>

              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <FaCar />
              </div>
            </div>

            <h3 className="font-black text-xl text-slate-950">
              {selectedVehicule?.immatriculation || "Non sélectionné"}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {selectedVehicule
                ? `${selectedVehicule.marque || "-"} ${selectedVehicule.modele || ""}`
                : "Aucun véhicule associé"}
            </p>
          </div>

          <div className="group bg-white hover:bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-3xl p-5 transition shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Technicien
              </p>

              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                <FaUserCog />
              </div>
            </div>

            <h3 className="font-black text-xl text-slate-950">
              {selectedTechnicien?.nom || "Non sélectionné"}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {selectedTechnicien?.email || "Aucun technicien affecté"}
            </p>
          </div>

          <div
            className={`group rounded-3xl p-5 border transition shadow-sm ${
              form.statut === "DONE"
                ? "bg-green-50 border-green-200 hover:border-green-300"
                : form.statut === "IN_PROGRESS"
                ? "bg-yellow-50 border-yellow-200 hover:border-yellow-300"
                : "bg-blue-50 border-blue-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Statut
              </p>

              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                  form.statut === "DONE"
                    ? "bg-green-100 border-green-200 text-green-700"
                    : form.statut === "IN_PROGRESS"
                    ? "bg-yellow-100 border-yellow-200 text-yellow-700"
                    : "bg-blue-100 border-blue-200 text-blue-700"
                }`}
              >
                {form.statut === "DONE" ? <FaCheckCircle /> : <FaClock />}
              </div>
            </div>

            <h3
              className={`font-black text-xl ${
                form.statut === "DONE"
                  ? "text-green-700"
                  : form.statut === "IN_PROGRESS"
                  ? "text-yellow-700"
                  : "text-blue-700"
              }`}
            >
              {form.statut === "DONE"
                ? "Terminée"
                : form.statut === "IN_PROGRESS"
                ? "En cours"
                : "En attente"}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              État actuel de l’intervention
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">
          {/* ETAT INITIAL DU VEHICULE */}
          <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <FaCamera />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      Etat initial du vehicule
                    </h2>
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-black uppercase">
                      Etape 1
                    </span>
                    {!id && (
                      <span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-[11px] font-black uppercase">
                        Obligatoire
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Photographiez le vehicule tel qu'il arrive au garage, avant tout diagnostic ou travail.
                  </p>
                </div>
              </div>

              <div className="text-sm text-slate-500 md:text-right">
                <p className="font-bold text-slate-900">
                  {selectedVehicule?.immatriculation || "Vehicule a selectionner"}
                </p>
                <p>{initialPhotos.length + initialFiles.length} photo(s)</p>
              </div>
            </div>

            <label className="group block border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/60 hover:bg-blue-50 rounded-3xl p-6 text-center cursor-pointer transition">
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  const selectedFiles = [...e.target.files];
                  setInitialFiles((current) => [...current, ...selectedFiles]);
                  e.target.value = "";
                }}
              />
              <FaCamera className="mx-auto text-3xl text-blue-600" />
              <p className="font-black text-slate-900 mt-3">
                Ajouter les photos d'entree du vehicule
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Cliquez ici pour choisir plusieurs photos depuis le telephone ou l'ordinateur.
              </p>
            </label>

            {(initialPhotos.length > 0 || initialFilePreviews.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
                {initialPhotos.map((photo) => (
                  <div key={photo.id} className="relative group aspect-[4/3]">
                    <img
                      src={buildImageUrl(photo.url)}
                      alt="Etat initial du vehicule"
                      className="w-full h-full object-cover rounded-2xl border border-slate-200"
                    />
                    <span className="absolute left-2 bottom-2 px-2 py-1 rounded-lg bg-slate-950/75 text-white text-[10px] font-bold">
                      Enregistree
                    </span>
                    <button
                      type="button"
                      onClick={() => deletePhoto(photo.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      title="Supprimer la photo"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}

                {initialFilePreviews.map((preview, index) => (
                  <div key={`${preview.name}-${index}`} className="relative group aspect-[4/3]">
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="w-full h-full object-cover rounded-2xl border-2 border-blue-300"
                    />
                    <span className="absolute left-2 bottom-2 px-2 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold">
                      A enregistrer
                    </span>
                    <button
                      type="button"
                      onClick={() => removeInitialFile(index)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      title="Retirer la photo"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ORDRE DE REPARATION */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <FaClipboardList />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      Ordre de reparation
                    </h2>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-black uppercase">
                      Besoins client
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Notez chaque demande exprimee par le client avant le diagnostic.
                  </p>
                </div>
              </div>

              <div className="md:text-right">
                <p className="text-xs uppercase font-bold text-slate-400">
                  Numero d'ordre
                </p>
                <p className="font-black text-indigo-700 mt-1">
                  {form.numeroOrdreReparation || "Genere automatiquement"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {form.besoinsClient.map((besoin, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[42px_1fr_42px] gap-3 items-start"
                >
                  <span className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black">
                    {index + 1}
                  </span>

                  <textarea
                    rows="2"
                    value={besoin}
                    onChange={(e) => updateBesoinClient(index, e.target.value)}
                    placeholder="Ex: Le client signale un bruit au freinage avant..."
                    className={`${inputClass} resize-none`}
                  />

                  <button
                    type="button"
                    onClick={() => removeBesoinClient(index)}
                    className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 flex items-center justify-center transition"
                    title="Supprimer ce besoin"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addBesoinClient}
              className="mt-4 px-4 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold flex items-center gap-2 transition"
            >
              <FaPlus />
              Ajouter un besoin client
            </button>
          </div>

          {/* INFORMATIONS */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <FaClipboardList />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Informations intervention
                </h2>
                <p className="text-sm text-slate-500">
                  Définissez la panne, le véhicule et le technicien.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="text-sm text-slate-500">Type de panne</label>
                <input
                  placeholder="Ex: Problème moteur, freinage, batterie..."
                  className={`${inputClass} mt-1`}
                  value={form.typePanne}
                  onChange={(e) =>
                    setForm({ ...form, typePanne: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-slate-500">Description</label>
                <textarea
                  placeholder="Décrivez le diagnostic ou les remarques..."
                  rows="4"
                  className={`${inputClass} mt-1 resize-none`}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Véhicule</label>
                  <select
                    className={`${inputClass} mt-1`}
                    value={form.vehicule.id}
                    onChange={(e) =>
                      setForm({ ...form, vehicule: { id: e.target.value } })
                    }
                  >
                    <option value="">Choisir un véhicule</option>
                    {vehicules.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.immatriculation} - {v.marque} {v.modele}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-500">Technicien</label>
                  <select
                    className={`${inputClass} mt-1`}
                    value={form.technicien.id}
                    onChange={(e) =>
                      setForm({ ...form, technicien: { id: e.target.value } })
                    }
                  >
                    <option value="">Choisir un technicien</option>
                    {techniciens.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500">Statut</label>
                <select
                  className={`${inputClass} mt-1`}
                  value={form.statut}
                  onChange={(e) =>
                    setForm({ ...form, statut: e.target.value })
                  }
                >
                  <option value="PENDING">En attente</option>
                  <option value="DONE">Terminée</option>
                </select>
              </div>
            </div>
          </div>

          {/* PIECES */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                <FaBoxOpen />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Pièces utilisées
                </h2>
                <p className="text-sm text-slate-500">
                  Ajoutez les pièces nécessaires à cette intervention.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_56px] gap-3 mb-5">
              <select
                className={inputClass}
                value={selectedPiece}
                onChange={(e) => setSelectedPiece(e.target.value)}
              >
                <option value="">Choisir une pièce</option>
                {pieces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom} - {p.prix} DH - Stock: {p.quantiteStock}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                className={inputClass}
              />

              <button
                onClick={addPiece}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition"
              >
                <FaPlus />
              </button>
            </div>

            <div className="space-y-3">
              {piecesList.length === 0 ? (
                <div className="text-slate-500 text-sm bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  Aucune pièce ajoutée.
                </div>
              ) : (
                piecesList.map((p, index) => {
                  const piece = pieces.find((x) => x.id == p.piece.id);

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-2xl"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {piece?.nom || "Pièce inconnue"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {p.quantite} × {piece?.prix || 0} DH ={" "}
                          <span className="text-green-600 font-semibold">
                            {Number(p.quantite || 0) *
                              Number(piece?.prix || 0)}{" "}
                            DH
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() => removePiece(index)}
                        className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 flex items-center justify-center transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* PHOTOS */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100">
                <FaCamera />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Photos intervention
                </h2>
                <p className="text-sm text-slate-500">
                  Ajoutez les photos avant et après l’intervention.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">
                <h3 className="font-semibold flex items-center gap-2 mb-3 text-slate-900">
                  <FaImage className="text-blue-600" />
                  Photos avant
                </h3>

                <input
                  type="file"
                  multiple
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  onChange={(e) => setBeforeFiles([...e.target.files])}
                />

                <div className="grid grid-cols-3 gap-3 mt-4">
                  {beforePhotos.map((p) => (
                    <div key={p.id} className="relative group">
                      <img
                        src={buildImageUrl(p.url)}
                        className="w-full h-24 object-cover rounded-2xl border border-slate-200"
                      />

                      <button
                        onClick={() => deletePhoto(p.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">
                <h3 className="font-semibold flex items-center gap-2 mb-3 text-slate-900">
                  <FaImage className="text-green-600" />
                  Photos après
                </h3>

                <input
                  type="file"
                  multiple
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
                  onChange={(e) => setAfterFiles([...e.target.files])}
                />

                <div className="grid grid-cols-3 gap-3 mt-4">
                  {afterPhotos.map((p) => (
                    <div key={p.id} className="relative group">
                      <img
                        src={buildImageUrl(p.url)}
                        className="w-full h-24 object-cover rounded-2xl border border-slate-200"
                      />

                      <button
                        onClick={() => deletePhoto(p.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-5 text-slate-900">
                <FaMoneyBillWave className="text-green-600" />
                Résumé
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Photos etat initial</span>
                  <span className="text-blue-600 font-semibold">
                    {initialPhotos.length + initialFiles.length}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Nombre de pièces</span>
                  <span className="text-slate-900 font-semibold">
                    {piecesList.length}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Photos avant</span>
                  <span className="text-slate-900 font-semibold">
                    {beforePhotos.length + beforeFiles.length}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Photos après</span>
                  <span className="text-slate-900 font-semibold">
                    {afterPhotos.length + afterFiles.length}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200">
                <p className="text-slate-500 text-sm">Total estimé</p>
                <p className="text-4xl font-black text-green-600 mt-2">
                  {total.toFixed(2)} DH
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-sm">
              <button
                onClick={save}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
              >
                <FaSave />
                Enregistrer intervention
              </button>

              <button
                onClick={handleGenerateDevis}
                disabled={!id}
                className={`w-full py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2 ${
                  !id
                    ? "bg-slate-200 cursor-not-allowed text-slate-400"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <FaFileInvoice />
                Générer devis
              </button>

              <button
                onClick={() => navigate("/interventions")}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-2xl font-semibold transition"
              >
                Retour aux interventions
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5">
              <h3 className="font-bold text-blue-700 mb-2">Conseil</h3>

              <p className="text-sm text-slate-600">
                Pour générer un devis, enregistrez d’abord l’intervention.
                Ensuite, ajoutez les pièces après diagnostic puis cliquez sur
                “Générer devis”.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
