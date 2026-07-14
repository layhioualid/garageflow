import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getClientById } from "../services/client.service";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaCar,
  FaFileInvoice,
  FaTools,
  FaSyncAlt,
  FaIdCard,
  FaClipboardList,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaChartLine,
  FaFolderOpen,
  FaRoute,
} from "react-icons/fa";

const API_URL = "http://localhost:8080";

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [vehicules, setVehicules] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [devis, setDevis] = useState([]);
  const [factures, setFactures] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const load = async () => {
    try {
      setLoading(true);

      const [clientRes, vehiculesRes, interventionsRes, devisRes, facturesRes] =
        await Promise.all([
          getClientById(id),
          fetch(`${API_URL}/api/vehicules`),
          fetch(`${API_URL}/api/interventions`),
          fetch(`${API_URL}/api/devis`),
          fetch(`${API_URL}/api/factures`),
        ]);

      const clientData = clientRes.data;
      const allVehicules = vehiculesRes.ok ? await vehiculesRes.json() : [];
      const allInterventions = interventionsRes.ok
        ? await interventionsRes.json()
        : [];
      const allDevis = devisRes.ok ? await devisRes.json() : [];
      const allFactures = facturesRes.ok ? await facturesRes.json() : [];

      const clientVehicules = allVehicules.filter(
        (v) => Number(v.client?.id) === Number(id)
      );

      const clientVehicleIds = clientVehicules.map((v) => Number(v.id));

      const clientInterventions = allInterventions.filter((i) =>
        clientVehicleIds.includes(Number(i.vehicule?.id))
      );

      const clientInterventionIds = clientInterventions.map((i) =>
        Number(i.id)
      );

      const clientDevis = allDevis.filter((d) =>
        clientInterventionIds.includes(Number(d.intervention?.id))
      );

      const clientFactures = allFactures.filter((f) =>
        clientInterventionIds.includes(Number(f.intervention?.id))
      );

      setClient(clientData || null);
      setVehicules(clientVehicules);
      setInterventions(clientInterventions);
      setDevis(clientDevis);
      setFactures(clientFactures);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement du dossier client.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const money = (value) => `${Number(value || 0).toFixed(2)} DH`;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("fr-FR");
  };

  const getClientFullName = () => {
    return `${client?.nom || ""} ${client?.prenom || ""}`.trim() || "Client";
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

  const openWhatsApp = () => {
    if (!client?.telephone) {
      alert("Ce client n'a pas de numéro de téléphone.");
      return;
    }

    const phone = normalizePhoneForWhatsApp(client.telephone);

    const message =
      `Bonjour ${getClientFullName()},\n\n` +
      `Nous vous contactons depuis GarageFlow+ concernant le suivi de votre dossier véhicule.\n\n` +
      `Cordialement,\nGarageFlow+`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const openGmail = () => {
    if (!client?.email) {
      alert("Ce client n'a pas d'adresse email.");
      return;
    }

    const subject = "Suivi de votre dossier véhicule - GarageFlow+";

    const body =
      `Bonjour ${getClientFullName()},\n\n` +
      `Nous vous contactons depuis GarageFlow+ concernant le suivi de votre dossier véhicule.\n\n` +
      `Vous pouvez répondre à cet email pour toute précision.\n\n` +
      `Cordialement,\nGarageFlow+`;

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(client.email)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.open(
      gmailUrl,
      "gmail-compose",
      "width=950,height=720,noopener,noreferrer"
    );
  };

  const statusStyle = (status) => {
    switch (status) {
      case "DONE":
      case "APPROVED":
      case "PAID":
      case "ACTIVE":
        return "bg-green-50 text-green-700 border-green-200";
      case "PENDING":
      case "IN_PROGRESS":
      case "UNPAID":
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
      case "APPROVED":
        return "Approuvé";
      case "REJECTED":
        return "Refusé";
      case "PAID":
        return "Payée";
      case "UNPAID":
        return "Non payée";
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

  const stats = useMemo(() => {
    const totalFactures = factures.reduce(
      (sum, f) => sum + Number(f.montantTtc || 0),
      0
    );

    const totalDevis = devis.reduce(
      (sum, d) => sum + Number(d.montant || 0),
      0
    );

    const paid = factures
      .filter((f) => f.statut === "PAID")
      .reduce((sum, f) => sum + Number(f.montantTtc || 0), 0);

    const unpaid = factures
      .filter((f) => f.statut === "UNPAID")
      .reduce((sum, f) => sum + Number(f.montantTtc || 0), 0);

    return {
      vehicules: vehicules.length,
      interventions: interventions.length,
      devis: devis.length,
      factures: factures.length,
      totalFactures,
      totalDevis,
      paid,
      unpaid,
    };
  }, [vehicules, interventions, devis, factures]);

  const tabs = [
    { id: "overview", label: "Vue globale", icon: <FaFolderOpen /> },
    { id: "vehicules", label: "Véhicules", icon: <FaCar /> },
    { id: "interventions", label: "Interventions", icon: <FaTools /> },
    { id: "devis", label: "Devis", icon: <FaFileInvoice /> },
    { id: "factures", label: "Factures", icon: <FaMoneyBillWave /> },
  ];

  if (loading) {
    return (
      <div className="p-6 bg-[#f6f8fb] text-slate-900">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Chargement du dossier client...
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6 bg-[#f6f8fb] text-slate-900">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Client introuvable.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-purple-50 p-6 shadow-sm">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-purple-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate("/clients")}
              className="w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition shadow-sm"
            >
              <FaArrowLeft />
            </button>

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-4xl font-black shadow-sm">
              {(client.nom || "C").charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <FaIdCard />
                Dossier client professionnel
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                {getClientFullName()}
              </h1>

              <p className="text-slate-500 mt-3 max-w-3xl">
                {client.email || "Email non défini"} •{" "}
                {client.telephone || "Téléphone non défini"} •{" "}
                {client.adresse || "Adresse non définie"}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
                  ID #{client.id}
                </span>

                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
                  {stats.vehicules} véhicule(s)
                </span>

                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
                  {stats.interventions} intervention(s)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={load}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-sm"
            >
              <FaSyncAlt />
              Actualiser
            </button>

            <button
              onClick={openGmail}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-sm"
            >
              <FaEnvelope />
              Gmail
            </button>

            <button
              onClick={openWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-sm"
            >
              <FaWhatsapp />
              WhatsApp
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <StatCard
            label="Véhicules"
            value={stats.vehicules}
            icon={<FaCar />}
            color="text-blue-600"
          />

          <StatCard
            label="Interventions"
            value={stats.interventions}
            icon={<FaTools />}
            color="text-purple-600"
          />

          <StatCard
            label="Montant devis"
            value={money(stats.totalDevis)}
            icon={<FaFileInvoice />}
            color="text-yellow-600"
          />

          <StatCard
            label="Impayé"
            value={money(stats.unpaid)}
            icon={<FaExclamationTriangle />}
            color="text-red-600"
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <InfoPanel
            title="Informations client"
            icon={<FaUser />}
            color="text-blue-600"
          >
            <div className="space-y-3">
              <DetailLine label="ID" value={`#${client.id}`} />
              <DetailLine label="Nom" value={client.nom} />
              <DetailLine label="Prénom" value={client.prenom} />
              <DetailLine label="Email" value={client.email} />
              <DetailLine label="Téléphone" value={client.telephone} />
              <DetailLine label="Adresse" value={client.adresse} />
            </div>
          </InfoPanel>

          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                label="Devis"
                value={stats.devis}
                icon={<FaFileInvoice />}
                color="text-yellow-600"
              />

              <StatCard
                label="Factures"
                value={stats.factures}
                icon={<FaMoneyBillWave />}
                color="text-emerald-600"
              />

              <StatCard
                label="Payé"
                value={money(stats.paid)}
                icon={<FaCheckCircle />}
                color="text-green-600"
              />

              <StatCard
                label="Impayé"
                value={money(stats.unpaid)}
                icon={<FaExclamationTriangle />}
                color="text-red-600"
              />
            </div>

            <InfoPanel
              title="Derniers véhicules"
              icon={<FaCar />}
              color="text-blue-600"
            >
              {vehicules.length === 0 ? (
                <EmptyState text="Aucun véhicule associé à ce client." />
              ) : (
                <div className="space-y-3">
                  {vehicules.slice(0, 4).map((v) => (
                    <VehicleRow
                      key={v.id}
                      vehicule={v}
                      navigate={navigate}
                      statusStyle={statusStyle}
                      statusLabel={statusLabel}
                    />
                  ))}
                </div>
              )}
            </InfoPanel>
          </div>
        </div>
      )}

      {/* VEHICULES */}
      {activeTab === "vehicules" && (
        <InfoPanel title="Véhicules du client" icon={<FaCar />} color="text-blue-600">
          {vehicules.length === 0 ? (
            <EmptyState text="Aucun véhicule associé à ce client." />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {vehicules.map((v) => (
                <VehicleRow
                  key={v.id}
                  vehicule={v}
                  navigate={navigate}
                  statusStyle={statusStyle}
                  statusLabel={statusLabel}
                />
              ))}
            </div>
          )}
        </InfoPanel>
      )}

      {/* INTERVENTIONS */}
      {activeTab === "interventions" && (
        <InfoPanel
          title="Interventions du client"
          icon={<FaTools />}
          color="text-purple-600"
        >
          {interventions.length === 0 ? (
            <EmptyState text="Aucune intervention associée à ce client." />
          ) : (
            <div className="space-y-3">
              {interventions.map((i) => (
                <InterventionRow
                  key={i.id}
                  intervention={i}
                  navigate={navigate}
                  statusStyle={statusStyle}
                  statusLabel={statusLabel}
                  formatDate={formatDate}
                  money={money}
                />
              ))}
            </div>
          )}
        </InfoPanel>
      )}

      {/* DEVIS */}
      {activeTab === "devis" && (
        <InfoPanel title="Devis du client" icon={<FaFileInvoice />} color="text-yellow-600">
          {devis.length === 0 ? (
            <EmptyState text="Aucun devis associé à ce client." />
          ) : (
            <div className="space-y-3">
              {devis.map((d) => (
                <FinanceRow
                  key={d.id}
                  title={`Devis #${d.id}`}
                  amount={money(d.montant)}
                  status={d.statut}
                  date={formatDate(d.dateCreation)}
                  statusStyle={statusStyle}
                  statusLabel={statusLabel}
                />
              ))}
            </div>
          )}
        </InfoPanel>
      )}

      {/* FACTURES */}
      {activeTab === "factures" && (
        <InfoPanel title="Factures du client" icon={<FaMoneyBillWave />} color="text-emerald-600">
          {factures.length === 0 ? (
            <EmptyState text="Aucune facture associée à ce client." />
          ) : (
            <div className="space-y-3">
              {factures.map((f) => (
                <FinanceRow
                  key={f.id}
                  title={f.numero || `Facture #${f.id}`}
                  amount={money(f.montantTtc)}
                  status={f.statut}
                  date={formatDate(f.dateFacture)}
                  statusStyle={statusStyle}
                  statusLabel={statusLabel}
                />
              ))}
            </div>
          )}
        </InfoPanel>
      )}
    </div>
  );
}

function DetailLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="text-slate-900 font-semibold text-sm text-right">
        {value || "-"}
      </span>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{label}</p>
        <span className={color}>{icon}</span>
      </div>

      <h2 className={`text-2xl font-black mt-2 ${color}`}>{value}</h2>
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

function EmptyState({ text }) {
  return (
    <div className="text-center py-12 text-slate-500 bg-slate-50 border border-slate-200 rounded-2xl">
      {text}
    </div>
  );
}

function VehicleRow({ vehicule, navigate, statusStyle, statusLabel }) {
  return (
    <div
      onClick={() => navigate(`/vehicules/${vehicule.id}`)}
      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-white hover:border-blue-300 transition cursor-pointer"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-slate-950">
            {vehicule.marque || "-"} {vehicule.modele || ""}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {vehicule.immatriculation || "-"} • {vehicule.kilometrage || 0} km
          </p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full border font-semibold ${statusStyle(
            vehicule.statut
          )}`}
        >
          {statusLabel(vehicule.statut)}
        </span>
      </div>
    </div>
  );
}

function InterventionRow({
  intervention,
  navigate,
  statusStyle,
  statusLabel,
  formatDate,
  money,
}) {
  return (
    <div
      onClick={() => navigate(`/interventions/details/${intervention.id}`)}
      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-white hover:border-purple-300 transition cursor-pointer"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-black text-slate-950">
            Intervention #{intervention.id}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {intervention.typePanne || "-"} •{" "}
            {intervention.vehicule?.immatriculation || "-"}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {formatDate(intervention.dateDebut)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-xs px-3 py-1 rounded-full border font-semibold ${statusStyle(
              intervention.statut
            )}`}
          >
            {statusLabel(intervention.statut)}
          </span>

          <span className="font-black text-emerald-600">
            {money(intervention.cout)}
          </span>
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
  statusStyle,
  statusLabel,
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-white transition">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-slate-950">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">{date}</p>
        </div>

        <div className="text-right">
          <p className="font-black text-emerald-600">{amount}</p>

          <span
            className={`inline-flex mt-2 text-[10px] px-2 py-1 rounded-full border ${statusStyle(
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