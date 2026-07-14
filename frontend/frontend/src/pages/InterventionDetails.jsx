import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaTools,
  FaCar,
  FaUserCog,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaCubes,
  FaImages,
  FaFileInvoice,
  FaFileAlt,
  FaMoneyBillWave,
  FaClock,
  FaEdit,
  FaTrash,
  FaDownload,
  FaPrint,
  FaEye,
  FaSyncAlt,
  FaPlus,
  FaTimes,
  FaInfoCircle,
  FaClipboardList,
} from "react-icons/fa";

const API_URL = "http://localhost:8080";

export default function InterventionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [intervention, setIntervention] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [devis, setDevis] = useState([]);
  const [factures, setFactures] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [previewPhoto, setPreviewPhoto] = useState(null);

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
        return "bg-green-50 text-green-700 border-green-200";
      case "IN_PROGRESS":
      case "PENDING":
      case "UNPAID":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "REJECTED":
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
      default:
        return status || "-";
    }
  };

  const load = async () => {
    try {
      setLoading(true);

      const [interventionsRes, photosRes, devisRes, facturesRes] =
        await Promise.all([
          fetch(`${API_URL}/api/interventions`),
          fetch(`${API_URL}/api/photos`),
          fetch(`${API_URL}/api/devis`),
          fetch(`${API_URL}/api/factures`),
        ]);

      const allInterventions = interventionsRes.ok
        ? await interventionsRes.json()
        : [];

      const allPhotos = photosRes.ok ? await photosRes.json() : [];
      const allDevis = devisRes.ok ? await devisRes.json() : [];
      const allFactures = facturesRes.ok ? await facturesRes.json() : [];

      const selectedIntervention = allInterventions.find(
        (i) => Number(i.id) === Number(id)
      );

      const interventionPhotos = allPhotos.filter(
        (p) => Number(p.intervention?.id) === Number(id)
      );

      const interventionDevis = allDevis.filter(
        (d) => Number(d.intervention?.id) === Number(id)
      );

      const interventionFactures = allFactures.filter(
        (f) => Number(f.intervention?.id) === Number(id)
      );

      setIntervention(selectedIntervention || null);
      setPhotos(interventionPhotos || []);
      setDevis(interventionDevis || []);
      setFactures(interventionFactures || []);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement du dossier intervention.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const piecesTotal = useMemo(() => {
    const pieces = intervention?.pieces || [];

    return pieces.reduce((sum, ligne) => {
      const piece = ligne.piece || {};
      const prix = Number(piece.prix || 0);
      const quantite = Number(ligne.quantite || 0);

      return sum + prix * quantite;
    }, 0);
  }, [intervention]);

  const photosBefore = photos.filter((p) =>
    String(p.type || "").toUpperCase().includes("BEFORE")
  );

  const photosAfter = photos.filter((p) =>
    String(p.type || "").toUpperCase().includes("AFTER")
  );

  const photosInitial = photos.filter(
    (p) => String(p.type || "").toUpperCase() === "INITIAL"
  );

  const client = intervention?.vehicule?.client || null;

  const clientFullName = client
    ? `${client.nom || ""} ${client.prenom || ""}`.trim()
    : "";

  const clientLabel = clientFullName || "Client non défini";

  const tabs = [
    { id: "overview", label: "Vue globale", icon: <FaInfoCircle /> },
    { id: "pieces", label: "Pièces", icon: <FaCubes /> },
    { id: "photos", label: "Photos", icon: <FaImages /> },
    { id: "finance", label: "Devis & Factures", icon: <FaFileInvoice /> },
  ];

  const deleteIntervention = async () => {
    if (!window.confirm("Supprimer cette intervention ?")) return;

    try {
      await fetch(`${API_URL}/api/interventions/${id}`, {
        method: "DELETE",
      });

      navigate("/interventions");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression de l’intervention.");
    }
  };

  const generateDevis = async () => {
    try {
      await fetch(`${API_URL}/api/devis/generate/${id}`, {
        method: "POST",
      });

      await load();
      setActiveTab("finance");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération du devis.");
    }
  };

  const generateFacture = async () => {
    try {
      await fetch(`${API_URL}/api/factures/generate/${id}`, {
        method: "POST",
      });

      await load();
      setActiveTab("finance");
    } catch (error) {
      console.error(error);
      alert("Facture déjà générée ou erreur lors de la génération.");
    }
  };

  const printFacture = (factureId) => {
    window.open(`${API_URL}/api/factures/${factureId}/print`, "_blank");
  };

  const downloadFacture = (factureId) => {
    window.open(`${API_URL}/api/factures/${factureId}/pdf`, "_blank");
  };

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

  if (loading) {
    return (
      <div className="p-6 bg-[#f6f8fb] text-slate-900">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Chargement du dossier intervention...
        </div>
      </div>
    );
  }

  if (!intervention) {
    return (
      <div className="p-6 bg-[#f6f8fb] text-slate-900">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Intervention introuvable.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-6 shadow-sm">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-purple-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate("/interventions")}
              className="w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition shadow-sm"
            >
              <FaArrowLeft />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaTools className="text-3xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <FaClipboardList />
                Dossier intervention complet
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                  Intervention #{intervention.id}
                </h1>

                <span
                  className={`text-xs px-3 py-1 rounded-full border font-semibold ${statusColor(
                    intervention.statut
                  )}`}
                >
                  {statusLabel(intervention.statut)}
                </span>
              </div>

              <p className="text-slate-500 mt-3 max-w-3xl">
                {intervention.typePanne || "Type de panne non défini"} •{" "}
                {intervention.vehicule?.immatriculation || "Véhicule -"} •{" "}
                {client ? clientLabel : "Client non défini"} •{" "}
                {intervention.technicien?.nom || "Technicien -"}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
                  Véhicule #{intervention.vehicule?.id || "-"}
                </span>

                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
                  Client {client?.id ? `#${client.id}` : "-"}
                </span>

                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
                  Technicien #{intervention.technicien?.id || "-"}
                </span>

                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
                  {formatDate(intervention.dateDebut)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-start xl:justify-end">
            <button
              onClick={load}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-sm"
            >
              <FaSyncAlt />
              Actualiser
            </button>

            <button
              onClick={() => navigate(`/interventions/${intervention.id}`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-sm"
            >
              <FaEdit />
              Modifier
            </button>

            <button
              onClick={deleteIntervention}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-sm"
            >
              <FaTrash />
              Supprimer
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 mt-6">
          <StatCard
            label="Coût intervention"
            value={money(intervention.cout)}
            icon={<FaMoneyBillWave />}
            color="text-emerald-600"
          />

          <StatCard
            label="Client"
            value={client ? clientLabel : "Absent"}
            icon={<FaUser />}
            color={client ? "text-blue-600" : "text-red-600"}
          />

          <StatCard
            label="Durée"
            value={`${intervention.duree || 0} h`}
            icon={<FaClock />}
            color="text-blue-600"
          />

          <StatCard
            label="Pièces"
            value={intervention.pieces?.length || 0}
            icon={<FaCubes />}
            color="text-purple-600"
          />

          <StatCard
            label="Photos"
            value={photos.length}
            icon={<FaImages />}
            color="text-pink-600"
          />

          <StatCard
            label="Total pièces"
            value={money(piecesTotal)}
            icon={<FaTools />}
            color="text-yellow-600"
          />
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="sticky top-24 z-20 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-3 flex flex-wrap gap-3 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl font-semibold transition flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-sm"
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
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <InfoBlock
            title="Informations intervention"
            icon={<FaTools />}
            color="text-blue-600"
          >
            <DetailLine label="ID" value={`#${intervention.id}`} />
            <DetailLine label="Type de panne" value={intervention.typePanne} />
            <DetailLine label="Statut" value={statusLabel(intervention.statut)} />
            <DetailLine label="Date début" value={formatDate(intervention.dateDebut)} />
            <DetailLine label="Date fin" value={formatDate(intervention.dateFin)} />
            <DetailLine label="Durée" value={`${intervention.duree || 0} h`} />
            <DetailLine label="Coût" value={money(intervention.cout)} />
          </InfoBlock>

          <InfoBlock
            title="Véhicule concerné"
            icon={<FaCar />}
            color="text-cyan-600"
          >
            <DetailLine
              label="ID véhicule"
              value={intervention.vehicule?.id ? `#${intervention.vehicule.id}` : "-"}
            />
            <DetailLine
              label="Immatriculation"
              value={intervention.vehicule?.immatriculation}
            />
            <DetailLine label="Marque" value={intervention.vehicule?.marque} />
            <DetailLine label="Modèle" value={intervention.vehicule?.modele} />
            <DetailLine label="Année" value={intervention.vehicule?.annee} />
            <DetailLine
              label="Kilométrage"
              value={
                intervention.vehicule?.kilometrage !== undefined
                  ? `${intervention.vehicule.kilometrage} km`
                  : "-"
              }
            />

            {intervention.vehicule?.id && (
              <button
                onClick={() => navigate(`/vehicules/${intervention.vehicule.id}`)}
                className="w-full mt-5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
              >
                <FaEye />
                Voir dossier véhicule
              </button>
            )}
          </InfoBlock>

          <InfoBlock
            title="Client propriétaire"
            icon={<FaUser />}
            color="text-blue-600"
          >
            <DetailLine
              label="ID client"
              value={client?.id ? `#${client.id}` : "-"}
            />

            <DetailLine
              label="Nom complet"
              value={client ? clientLabel : "Non défini"}
            />

            <DetailLine
              label="Email"
              value={client?.email || "-"}
            />

            <DetailLine
              label="Téléphone"
              value={client?.telephone || "-"}
            />

            <DetailLine
              label="Adresse"
              value={client?.adresse || "-"}
            />

            <div className="grid grid-cols-1 gap-3 mt-5">
              {client?.id && (
                <button
                  onClick={() => navigate(`/clients/${client.id}`)}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <FaEye />
                  Voir dossier client
                </button>
              )}

              {client?.email && (
                <a
                  href={`mailto:${client.email}`}
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <FaEnvelope />
                  Envoyer email
                </a>
              )}

              {client?.telephone && (
                <a
                  href={`tel:${client.telephone}`}
                  className="w-full bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <FaPhone />
                  Appeler client
                </a>
              )}
            </div>
          </InfoBlock>

          <InfoBlock
            title="Technicien affecté"
            icon={<FaUserCog />}
            color="text-purple-600"
          >
            <DetailLine
              label="ID technicien"
              value={intervention.technicien?.id ? `#${intervention.technicien.id}` : "-"}
            />
            <DetailLine label="Nom" value={intervention.technicien?.nom} />
            <DetailLine label="Prénom" value={intervention.technicien?.prenom} />
            <DetailLine label="Email" value={intervention.technicien?.email} />
            <DetailLine label="Téléphone" value={intervention.technicien?.telephone} />
            <DetailLine label="Spécialité" value={intervention.technicien?.specialite} />
          </InfoBlock>

          <div className="xl:col-span-4 bg-white border border-indigo-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <FaClipboardList />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Ordre de reparation
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Demandes declarees par le client a la reception du vehicule.
                  </p>
                </div>
              </div>

              <div className="md:text-right">
                <p className="text-xs uppercase font-bold text-slate-400">
                  Numero d'ordre
                </p>
                <p className="text-lg font-black text-indigo-700 mt-1">
                  {intervention.numeroOrdreReparation || "Non attribue"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-xs text-slate-500">Client</p>
                <p className="font-bold text-slate-900 mt-1">{clientLabel}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-xs text-slate-500">Vehicule</p>
                <p className="font-bold text-slate-900 mt-1">
                  {intervention.vehicule?.immatriculation || "-"}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-xs text-slate-500">Date de reception</p>
                <p className="font-bold text-slate-900 mt-1">
                  {formatDate(intervention.dateDebut)}
                </p>
              </div>
            </div>

            {intervention.besoinsClient?.length > 0 ? (
              <div className="space-y-3">
                {intervention.besoinsClient.map((besoin, index) => (
                  <div
                    key={`${index}-${besoin}`}
                    className="flex items-start gap-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4"
                  >
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-slate-800 leading-relaxed pt-1">
                      {besoin}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Aucun besoin client renseigne dans l'ordre de reparation." />
            )}
          </div>

          <div className="xl:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-600">
              <FaInfoCircle />
              Description
            </h2>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-700 leading-relaxed">
              {intervention.description || "Aucune description disponible."}
            </div>
          </div>
        </div>
      )}

      {/* PIECES */}
      {activeTab === "pieces" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <h2 className="text-xl font-bold flex items-center gap-2 text-purple-600">
              <FaCubes />
              Pièces utilisées
            </h2>

            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-2xl font-black">
              Total : {money(piecesTotal)}
            </div>
          </div>

          {!intervention.pieces || intervention.pieces.length === 0 ? (
            <EmptyState text="Aucune pièce utilisée dans cette intervention." />
          ) : (
            <div className="space-y-3">
              {intervention.pieces.map((ligne, index) => {
                const piece = ligne.piece || {};
                const prix = Number(piece.prix || 0);
                const quantite = Number(ligne.quantite || 0);
                const total = prix * quantite;

                return (
                  <div
                    key={ligne.id || index}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-purple-300 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-black text-lg text-slate-900">
                          {piece.nom || "Pièce"}
                        </h3>

                        <p className="text-slate-500 text-sm mt-1">
                          Référence : {piece.reference || "-"}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-6 text-right">
                        <div>
                          <p className="text-xs text-slate-500">Prix</p>
                          <p className="font-bold text-slate-900">{money(prix)}</p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">Quantité</p>
                          <p className="font-bold text-slate-900">{quantite}</p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">Total</p>
                          <p className="font-black text-emerald-600">
                            {money(total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PHOTOS */}
      {activeTab === "photos" && (
        <div className="space-y-6">
          <PhotoSection
            title="Etat initial du vehicule a son entree"
            photos={photosInitial}
            buildUrl={buildUrl}
            setPreviewPhoto={setPreviewPhoto}
            color="text-cyan-600"
          />

          <PhotoSection
            title="Photos avant réparation"
            photos={photosBefore}
            buildUrl={buildUrl}
            setPreviewPhoto={setPreviewPhoto}
            color="text-blue-600"
          />

          <PhotoSection
            title="Photos après réparation"
            photos={photosAfter}
            buildUrl={buildUrl}
            setPreviewPhoto={setPreviewPhoto}
            color="text-green-600"
          />

          <PhotoSection
            title="Toutes les photos"
            photos={photos}
            buildUrl={buildUrl}
            setPreviewPhoto={setPreviewPhoto}
            color="text-pink-600"
          />
        </div>
      )}

      {/* FINANCE */}
      {activeTab === "finance" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FinanceBlock
            title="Devis liés"
            icon={<FaFileAlt />}
            color="text-yellow-600"
            action={generateDevis}
            actionLabel="Générer devis"
            actionColor="yellow"
          >
            {devis.length === 0 ? (
              <EmptyState text="Aucun devis lié à cette intervention." />
            ) : (
              <div className="space-y-3">
                {devis.map((d) => (
                  <div
                    key={d.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900">Devis #{d.id}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDate(d.dateCreation)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-emerald-600">
                          {money(d.montant)}
                        </p>

                        <span
                          className={`inline-flex mt-2 text-[10px] px-2 py-1 rounded-full border ${statusColor(
                            d.statut
                          )}`}
                        >
                          {statusLabel(d.statut)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </FinanceBlock>

          <FinanceBlock
            title="Factures liées"
            icon={<FaFileInvoice />}
            color="text-green-600"
            action={generateFacture}
            actionLabel="Générer facture"
            actionColor="green"
          >
            {factures.length === 0 ? (
              <EmptyState text="Aucune facture liée à cette intervention." />
            ) : (
              <div className="space-y-3">
                {factures.map((f) => (
                  <div
                    key={f.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {f.numero || `Facture #${f.id}`}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDate(f.dateFacture)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-emerald-600">
                          {money(f.montantTtc)}
                        </p>

                        <span
                          className={`inline-flex mt-2 text-[10px] px-2 py-1 rounded-full border ${statusColor(
                            f.statut
                          )}`}
                        >
                          {statusLabel(f.statut)}
                        </span>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => downloadFacture(f.id)}
                          className="text-blue-600 hover:bg-blue-50 p-3 rounded-xl transition"
                        >
                          <FaDownload />
                        </button>

                        <button
                          onClick={() => printFacture(f.id)}
                          className="text-green-600 hover:bg-green-50 p-3 rounded-xl transition"
                        >
                          <FaPrint />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </FinanceBlock>
        </div>
      )}

      {/* PHOTO PREVIEW MODAL */}
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
                <FaTimes />
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

function InfoBlock({ title, icon, color, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h2 className={`text-xl font-bold mb-5 flex items-center gap-2 ${color}`}>
        {icon}
        {title}
      </h2>

      <div className="space-y-3">{children}</div>
    </div>
  );
}

function FinanceBlock({
  title,
  icon,
  color,
  action,
  actionLabel,
  actionColor,
  children,
}) {
  const actionClass =
    actionColor === "green"
      ? "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
      : "bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200";

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <h2 className={`text-xl font-bold flex items-center gap-2 ${color}`}>
          {icon}
          {title}
        </h2>

        <button
          onClick={action}
          className={`${actionClass} border px-4 py-3 rounded-2xl font-semibold flex items-center gap-2 transition`}
        >
          <FaPlus />
          {actionLabel}
        </button>
      </div>

      {children}
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

function PhotoSection({ title, photos, buildUrl, setPreviewPhoto, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h2 className={`text-xl font-bold mb-5 flex items-center gap-2 ${color}`}>
        <FaImages />
        {title}
      </h2>

      {photos.length === 0 ? (
        <EmptyState text="Aucune photo disponible." />
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
                <p className="font-semibold text-slate-900">Photo #{p.id}</p>

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
  );
}
