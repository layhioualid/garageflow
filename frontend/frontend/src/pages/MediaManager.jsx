import { useEffect, useMemo, useState } from "react";
import {
  getPhotos,
  getDocuments,
  uploadPhoto,
  uploadDocument,
} from "../services/media.service";

import {
  FaImage,
  FaFilePdf,
  FaDownload,
  FaTrash,
  FaUpload,
  FaSearch,
  FaTimes,
  FaFileAlt,
  FaPhotoVideo,
  FaCar,
  FaTools,
  FaEye,
  FaCheckCircle,
  FaFolderOpen,
  FaCalendarAlt,
  FaFileInvoice,
  FaSyncAlt,
} from "react-icons/fa";

const API_URL = "http://localhost:8080";

export default function MediaManager() {
  const [photos, setPhotos] = useState([]);
  const [docs, setDocs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [interventions, setInterventions] = useState([]);

  const [tab, setTab] = useState("photos");
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [openUpload, setOpenUpload] = useState(false);
  const [uploadMode, setUploadMode] = useState("document");

  const [docForm, setDocForm] = useState({
    vehiculeId: "",
    type: "ASSURANCE",
    file: null,
  });

  const [photoForm, setPhotoForm] = useState({
    interventionId: "",
    type: "BEFORE",
    file: null,
  });

  const load = async () => {
    try {
      setLoading(true);

      const [photosRes, docsRes, vehiculesRes, interventionsRes] =
        await Promise.all([
          getPhotos(),
          getDocuments(),
          fetch(`${API_URL}/api/vehicules`).then((res) => res.json()),
          fetch(`${API_URL}/api/interventions`).then((res) => res.json()),
        ]);

      setPhotos(photosRes.data || []);
      setDocs(docsRes.data || []);
      setVehicules(vehiculesRes || []);
      setInterventions(interventionsRes || []);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement des médias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const buildUrl = (path) => {
    if (!path) return "";
    return `${API_URL}/${String(path).replace(/^\/+/, "")}`;
  };

  const formatDate = (date) => {
    if (!date) return "Date inconnue";
    return new Date(date).toLocaleString("fr-FR");
  };

  const getFileName = (path) => {
    if (!path) return "Fichier";
    return String(path).split("/").pop();
  };

  const isImageFile = (path) => {
    const value = String(path || "").toLowerCase();
    return (
      value.endsWith(".png") ||
      value.endsWith(".jpg") ||
      value.endsWith(".jpeg") ||
      value.endsWith(".webp")
    );
  };

  const getDocVehicle = (doc) => {
    if (doc.vehicule) return doc.vehicule;

    const vehiculeId = doc.vehiculeId || doc.vehicule_id;
    return vehicules.find((v) => Number(v.id) === Number(vehiculeId));
  };

  const getPhotoIntervention = (photo) => {
    if (photo.intervention) return photo.intervention;

    const interventionId = photo.interventionId || photo.intervention_id;
    return interventions.find((i) => Number(i.id) === Number(interventionId));
  };

  const openUploadModal = (mode) => {
    setUploadMode(mode);
    setOpenUpload(true);
  };

  const resetUploadForms = () => {
    setDocForm({
      vehiculeId: "",
      type: "ASSURANCE",
      file: null,
    });

    setPhotoForm({
      interventionId: "",
      type: "BEFORE",
      file: null,
    });
  };

  const closeUploadModal = () => {
    setOpenUpload(false);
    resetUploadForms();
  };

  const submitUpload = async () => {
    try {
      if (uploadMode === "document") {
        if (!docForm.vehiculeId) {
          alert("Veuillez sélectionner un véhicule.");
          return;
        }

        if (!docForm.file) {
          alert("Veuillez choisir un fichier.");
          return;
        }

        const form = new FormData();
        form.append("vehiculeId", docForm.vehiculeId);
        form.append("type", docForm.type);
        form.append("file", docForm.file);

        await uploadDocument(form);
      } else {
        if (!photoForm.interventionId) {
          alert("Veuillez sélectionner une intervention.");
          return;
        }

        if (!photoForm.file) {
          alert("Veuillez choisir une photo.");
          return;
        }

        const form = new FormData();
        form.append("interventionId", photoForm.interventionId);
        form.append("type", photoForm.type);
        form.append("file", photoForm.file);

        await uploadPhoto(form);
      }

      await load();
      closeUploadModal();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l’import du fichier");
    }
  };

  const deleteDocument = async (id) => {
    if (!window.confirm("Supprimer ce document ?")) return;

    try {
      await fetch(`${API_URL}/api/documents/${id}`, {
        method: "DELETE",
      });

      await load();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du document");
    }
  };

  const deletePhoto = async (id) => {
    if (!window.confirm("Supprimer cette photo ?")) return;

    try {
      await fetch(`${API_URL}/api/photos/${id}`, {
        method: "DELETE",
      });

      await load();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression de la photo");
    }
  };

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      const intervention = getPhotoIntervention(p);

      const text = `
        ${p.type || ""}
        ${p.url || ""}
        ${p.dateAjout || ""}
        ${intervention?.id || ""}
        ${intervention?.vehicule?.immatriculation || ""}
        ${intervention?.typePanne || ""}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [photos, search, interventions]);

  const filteredDocs = useMemo(() => {
    return docs.filter((d) => {
      const vehicule = getDocVehicle(d);

      const text = `
        ${d.type || ""}
        ${d.fichier || ""}
        ${d.dateCreation || ""}
        ${vehicule?.immatriculation || ""}
        ${vehicule?.marque || ""}
        ${vehicule?.modele || ""}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [docs, search, vehicules]);

  const activeCount = tab === "photos" ? filteredPhotos.length : filteredDocs.length;

  const docTypes = [
    { value: "CARTE_GRISE", label: "Carte grise" },
    { value: "ASSURANCE", label: "Assurance" },
    { value: "CONTROLE_TECHNIQUE", label: "Contrôle technique" },
    { value: "FACTURE", label: "Facture" },
    { value: "DEVIS", label: "Devis" },
    { value: "RAPPORT_INTERVENTION", label: "Rapport intervention" },
    { value: "AUTRE", label: "Autre" },
  ];

  return (
    <div className="p-6 text-white space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e3a8a] p-6 shadow-2xl">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg">
              <FaPhotoVideo className="text-2xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
                <FaFolderOpen />
                Centre documentaire
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Media Center
              </h1>

              <p className="text-gray-400 mt-2 max-w-2xl">
                Gérez les photos d’interventions, les documents véhicules, les
                assurances, cartes grises, contrôles techniques, devis et factures.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={load}
              className="bg-white/10 hover:bg-white/20 px-5 py-3 rounded-2xl flex items-center gap-2 border border-white/10 font-semibold transition"
            >
              <FaSyncAlt />
              Actualiser
            </button>

            <button
              onClick={() => openUploadModal("photo")}
              className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-lg"
            >
              <FaUpload />
              Importer photo
            </button>

            <button
              onClick={() => openUploadModal("document")}
              className="bg-purple-600 hover:bg-purple-500 px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-lg"
            >
              <FaUpload />
              Importer document
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <StatCard
            title="Photos"
            value={photos.length}
            icon={<FaImage />}
            color="text-blue-400"
          />

          <StatCard
            title="Documents"
            value={docs.length}
            icon={<FaFilePdf />}
            color="text-purple-400"
          />

          <StatCard
            title="Véhicules"
            value={vehicules.length}
            icon={<FaCar />}
            color="text-cyan-400"
          />

          <StatCard
            title="Affichés"
            value={activeCount}
            icon={<FaCheckCircle />}
            color="text-emerald-400"
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 shadow-xl">
        <div className="flex gap-3">
          <button
            onClick={() => setTab("photos")}
            className={`px-5 py-3 rounded-2xl font-semibold transition flex items-center gap-2 ${
              tab === "photos"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/10 hover:bg-white/20 text-gray-300"
            }`}
          >
            <FaImage />
            Photos
            <span className="text-xs bg-black/20 px-2 py-1 rounded-full">
              {photos.length}
            </span>
          </button>

          <button
            onClick={() => setTab("docs")}
            className={`px-5 py-3 rounded-2xl font-semibold transition flex items-center gap-2 ${
              tab === "docs"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white/10 hover:bg-white/20 text-gray-300"
            }`}
          >
            <FaFilePdf />
            Documents
            <span className="text-xs bg-black/20 px-2 py-1 rounded-full">
              {docs.length}
            </span>
          </button>
        </div>

        <div className="relative w-full xl:w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher média, véhicule, document..."
            className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="bg-card border border-border rounded-3xl p-10 text-center text-gray-400">
          Chargement des médias...
        </div>
      ) : tab === "photos" ? (
        filteredPhotos.length === 0 ? (
          <EmptyState
            icon={FaImage}
            title="Aucune photo trouvée"
            text="Importez une photo ou modifiez votre recherche."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {filteredPhotos.map((p) => {
              const intervention = getPhotoIntervention(p);

              return (
                <div
                  key={p.id}
                  className="group bg-card border border-border rounded-3xl overflow-hidden hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl"
                >
                  <div className="relative h-48 bg-black overflow-hidden">
                    <img
                      src={buildUrl(p.url)}
                      onClick={() => setPreview(p)}
                      className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition duration-300"
                      alt="media"
                    />

                    <div className="absolute top-3 left-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {p.type || "PHOTO"}
                      </span>
                    </div>

                    <button
                      onClick={() => setPreview(p)}
                      className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur flex items-center justify-center transition"
                    >
                      <FaEye />
                    </button>
                  </div>

                  <div className="p-4">
                    <p className="font-semibold truncate">Photo #{p.id}</p>

                    <p className="text-xs text-gray-400 mt-1 truncate">
                      Intervention #{intervention?.id || "-"} •{" "}
                      {intervention?.vehicule?.immatriculation || "Véhicule -"}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(p.dateAjout)}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <a
                        href={buildUrl(p.url)}
                        download
                        className="text-blue-400 hover:bg-blue-500/10 px-3 py-2 rounded-xl transition flex items-center gap-2"
                      >
                        <FaDownload />
                        Télécharger
                      </a>

                      <button
                        onClick={() => deletePhoto(p.id)}
                        className="text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : filteredDocs.length === 0 ? (
        <EmptyState
          icon={FaFileAlt}
          title="Aucun document trouvé"
          text="Importez un document ou modifiez votre recherche."
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredDocs.map((d) => {
            const vehicule = getDocVehicle(d);
            const isImage = isImageFile(d.fichier);

            return (
              <div
                key={d.id}
                className="bg-card border border-border rounded-3xl overflow-hidden hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl"
              >
                <div className="p-5 flex flex-col md:flex-row gap-5">
                  <div className="w-full md:w-24 h-24 rounded-2xl bg-black/30 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                    {isImage ? (
                      <img
                        src={buildUrl(d.fichier)}
                        alt="document"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaFilePdf className="text-4xl text-red-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                        {d.type || "DOCUMENT"}
                      </span>

                      <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                        Document #{d.id}
                      </span>
                    </div>

                    <h3 className="font-black text-lg truncate">
                      {getFileName(d.fichier)}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm text-gray-400">
                      <p className="flex items-center gap-2">
                        <FaCar className="text-cyan-400" />
                        {vehicule
                          ? `${vehicule.immatriculation || "-"} - ${
                              vehicule.marque || ""
                            } ${vehicule.modele || ""}`
                          : "Véhicule non défini"}
                      </p>

                      <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-purple-400" />
                        {formatDate(d.dateCreation)}
                      </p>
                    </div>

                    <p className="text-xs text-gray-500 mt-2 truncate">
                      {d.fichier}
                    </p>

                    <div className="flex flex-wrap justify-end gap-2 mt-4">
                      <a
                        href={buildUrl(d.fichier)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-400 hover:bg-purple-500/10 px-3 py-2 rounded-xl transition flex items-center gap-2"
                      >
                        <FaEye />
                        Ouvrir
                      </a>

                      <a
                        href={buildUrl(d.fichier)}
                        download
                        className="text-blue-400 hover:bg-blue-500/10 px-3 py-2 rounded-xl transition flex items-center gap-2"
                      >
                        <FaDownload />
                        Télécharger
                      </a>

                      <button
                        onClick={() => deleteDocument(d.id)}
                        className="text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-xl transition flex items-center gap-2"
                      >
                        <FaTrash />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {openUpload && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative overflow-hidden border-b border-white/10 p-6">
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black flex items-center gap-3">
                    <FaUpload
                      className={
                        uploadMode === "document"
                          ? "text-purple-400"
                          : "text-blue-400"
                      }
                    />
                    {uploadMode === "document"
                      ? "Importer un document"
                      : "Importer une photo"}
                  </h2>

                  <p className="text-gray-400 text-sm mt-1">
                    {uploadMode === "document"
                      ? "Associez un document à un véhicule."
                      : "Associez une photo à une intervention."}
                  </p>
                </div>

                <button
                  onClick={closeUploadModal}
                  className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setUploadMode("photo")}
                  className={`py-3 rounded-2xl border flex items-center justify-center gap-2 font-semibold transition ${
                    uploadMode === "photo"
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <FaImage />
                  Photo
                </button>

                <button
                  onClick={() => setUploadMode("document")}
                  className={`py-3 rounded-2xl border flex items-center justify-center gap-2 font-semibold transition ${
                    uploadMode === "document"
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <FaFilePdf />
                  Document
                </button>
              </div>

              {uploadMode === "document" ? (
                <>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Véhicule
                    </label>

                    <select
                      value={docForm.vehiculeId}
                      onChange={(e) =>
                        setDocForm({ ...docForm, vehiculeId: e.target.value })
                      }
                      className="w-full p-3 bg-black/30 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Sélectionner un véhicule</option>
                      {vehicules.map((v) => (
                        <option key={v.id} value={v.id}>
                          #{v.id} - {v.immatriculation} - {v.marque} {v.modele}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Type de document
                    </label>

                    <select
                      value={docForm.type}
                      onChange={(e) =>
                        setDocForm({ ...docForm, type: e.target.value })
                      }
                      className="w-full p-3 bg-black/30 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {docTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <FilePicker
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                    file={docForm.file}
                    onChange={(file) => setDocForm({ ...docForm, file })}
                  />
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Intervention
                    </label>

                    <select
                      value={photoForm.interventionId}
                      onChange={(e) =>
                        setPhotoForm({
                          ...photoForm,
                          interventionId: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-black/30 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner une intervention</option>
                      {interventions.map((i) => (
                        <option key={i.id} value={i.id}>
                          #{i.id} - {i.typePanne || "Intervention"} -{" "}
                          {i.vehicule?.immatriculation || "Véhicule"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Type de photo
                    </label>

                    <select
                      value={photoForm.type}
                      onChange={(e) =>
                        setPhotoForm({ ...photoForm, type: e.target.value })
                      }
                      className="w-full p-3 bg-black/30 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="BEFORE">Avant intervention</option>
                      <option value="AFTER">Après intervention</option>
                      <option value="GENERAL">Générale</option>
                    </select>
                  </div>

                  <FilePicker
                    accept="image/*"
                    file={photoForm.file}
                    onChange={(file) => setPhotoForm({ ...photoForm, file })}
                  />
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={closeUploadModal}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                Annuler
              </button>

              <button
                onClick={submitUpload}
                className={`px-5 py-3 rounded-xl transition font-semibold flex items-center gap-2 ${
                  uploadMode === "document"
                    ? "bg-purple-600 hover:bg-purple-500"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                <FaUpload />
                Importer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {preview && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold">Aperçu photo</h2>
                <p className="text-gray-400 text-sm">Photo #{preview.id}</p>
              </div>

              <button
                onClick={() => setPreview(null)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-5 bg-black/20">
              <img
                src={buildUrl(preview.url)}
                className="max-h-[70vh] w-full object-contain rounded-2xl"
                alt="preview"
              />
            </div>

            <div className="p-5 border-t border-white/10 flex justify-end">
              <a
                href={buildUrl(preview.url)}
                download
                className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition"
              >
                <FaDownload />
                Télécharger
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{title}</p>
        <span className={color}>{icon}</span>
      </div>

      <h2 className={`text-3xl font-black mt-2 ${color}`}>{value}</h2>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="bg-card border border-border rounded-3xl p-12 text-center">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-white/10 flex items-center justify-center text-gray-400">
        <Icon className="text-2xl" />
      </div>

      <h2 className="text-xl font-bold mt-4">{title}</h2>

      <p className="text-gray-400 text-sm mt-2">{text}</p>
    </div>
  );
}

function FilePicker({ accept, file, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">Fichier</label>

      <label className="block cursor-pointer border border-dashed border-white/20 hover:border-blue-500/40 bg-black/20 rounded-2xl p-6 transition">
        <input
          type="file"
          accept={accept}
          hidden
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400 mb-3">
            <FaUpload />
          </div>

          <p className="font-semibold">
            {file ? file.name : "Cliquer pour choisir un fichier"}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            PDF, image ou document selon le type sélectionné.
          </p>
        </div>
      </label>
    </div>
  );
}