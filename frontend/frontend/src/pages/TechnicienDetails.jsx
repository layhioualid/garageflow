import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getTechniciens } from "../services/technicien.service";
import { getInterventions } from "../services/intervention.service";
import { getCurrentUser } from "../services/auth.service";

import {
  FaArrowLeft,
  FaArrowRight,
  FaUserCog,
  FaUserShield,
  FaTools,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
  FaChartLine,
  FaSyncAlt,
  FaFolderOpen,
  FaTachometerAlt,
  FaExclamationTriangle,
  FaCar,
  FaEye,
} from "react-icons/fa";

export default function TechnicienDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const isTechnicien = currentUser?.role === "TECHNICIEN";

  const effectiveId = isTechnicien ? currentUser?.id : id;

  const [techniciens, setTechniciens] = useState([]);
  const [technicien, setTechnicien] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const money = (value) => `${Number(value || 0).toFixed(2)} DH`;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("fr-FR");
  };

  const statusColor = (status) => {
    switch (status) {
      case "DONE":
        return "bg-green-50 text-green-700 border-green-200";
      case "IN_PROGRESS":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
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
      default:
        return "En attente";
    }
  };

  const load = async () => {
    try {
      setLoading(true);

      const [techRes, intRes] = await Promise.all([
        getTechniciens(),
        getInterventions(),
      ]);

      const allTechniciens = techRes.data || [];
      const allInterventions = intRes.data || [];

      const current = allTechniciens.find(
        (t) => Number(t.id) === Number(effectiveId)
      );

      const currentInterventions = allInterventions.filter(
        (i) => Number(i.technicien?.id) === Number(effectiveId)
      );

      setTechniciens(allTechniciens);
      setTechnicien(current || null);
      setInterventions(currentInterventions);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement du dossier technicien");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveId) {
      load();
      setActiveTab(isTechnicien ? "performance" : "overview");
    }
  }, [effectiveId]);

  const currentIndex = useMemo(() => {
    return techniciens.findIndex((t) => Number(t.id) === Number(effectiveId));
  }, [techniciens, effectiveId]);

  const previousTechnicien =
    currentIndex > 0 ? techniciens[currentIndex - 1] : null;

  const nextTechnicien =
    currentIndex >= 0 && currentIndex < techniciens.length - 1
      ? techniciens[currentIndex + 1]
      : null;

  const stats = useMemo(() => {
    const total = interventions.length;

    const done = interventions.filter((i) => i.statut === "DONE").length;

    const inProgress = interventions.filter(
      (i) => i.statut === "IN_PROGRESS"
    ).length;

    const pending = interventions.filter((i) => i.statut === "PENDING").length;

    const cost = interventions.reduce(
      (sum, i) => sum + Number(i.cout || 0),
      0
    );

    const performance = total === 0 ? 0 : Math.round((done / total) * 100);
    const avgCost = total === 0 ? 0 : cost / total;

    const vehiculeIds = [
      ...new Set(
        interventions
          .map((i) => i.vehicule?.id)
          .filter(Boolean)
          .map(Number)
      ),
    ];

    return {
      total,
      done,
      inProgress,
      pending,
      cost,
      performance,
      avgCost,
      vehicules: vehiculeIds.length,
    };
  }, [interventions]);

  const performanceColor =
    stats.performance >= 70
      ? "text-green-600"
      : stats.performance >= 40
      ? "text-yellow-600"
      : "text-red-600";

  const performanceBg =
    stats.performance >= 70
      ? "from-green-600 to-emerald-600"
      : stats.performance >= 40
      ? "from-yellow-500 to-orange-500"
      : "from-red-600 to-orange-600";

  const tabs = [
    { id: "overview", label: "Vue globale", icon: <FaFolderOpen /> },
    { id: "performance", label: "Performance", icon: <FaChartLine /> },
    { id: "interventions", label: "Interventions", icon: <FaTools /> },
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
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-purple-200 transition">
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
          Chargement du dossier technicien...
        </div>
      </div>
    );
  }

  if (!technicien) {
    return (
      <div className="p-6 bg-[#f6f8fb] text-slate-900">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Technicien introuvable.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-purple-50 to-slate-50 p-6 shadow-sm">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <button
              onClick={() =>
                navigate(isTechnicien ? "/technicien/dashboard" : "/techniciens")
              }
              className="w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition shadow-sm"
            >
              <FaArrowLeft />
            </button>

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center text-4xl font-black shadow-sm">
              {(technicien.nom || "T").charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-3">
                <FaUserShield />
                {isTechnicien
                  ? "Mon dossier technicien"
                  : "Dossier technicien professionnel"}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                  {technicien.nom || "-"} {technicien.prenom || ""}
                </h1>

                <span className="text-xs px-3 py-1 rounded-full border font-semibold bg-purple-50 text-purple-700 border-purple-200">
                  TECHNICIEN
                </span>
              </div>

              <p className="text-slate-500 mt-3 max-w-3xl">
                {technicien.specialite || "Technicien maintenance"} •{" "}
                {technicien.email || "email non défini"} •{" "}
                {technicien.telephone || "téléphone non défini"}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
                  ID #{technicien.id}
                </span>

                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
                  Créé le {formatDate(technicien.dateCreation)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-full xl:min-w-[420px]">
            {!isTechnicien && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={!previousTechnicien}
                  onClick={() =>
                    previousTechnicien &&
                    navigate(`/techniciens/${previousTechnicien.id}`)
                  }
                  className="bg-white hover:bg-slate-50 disabled:opacity-40 border border-slate-200 text-slate-700 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold transition shadow-sm"
                >
                  <FaArrowLeft />
                  Précédent
                </button>

                <button
                  disabled={!nextTechnicien}
                  onClick={() =>
                    nextTechnicien &&
                    navigate(`/techniciens/${nextTechnicien.id}`)
                  }
                  className="bg-white hover:bg-slate-50 disabled:opacity-40 border border-slate-200 text-slate-700 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold transition shadow-sm"
                >
                  Suivant
                  <FaArrowRight />
                </button>
              </div>
            )}

            <button
              onClick={load}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold transition shadow-sm"
            >
              <FaSyncAlt />
              Actualiser
            </button>
          </div>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 mt-6">
          <StatCard
            label="Interventions"
            value={stats.total}
            icon={<FaTools />}
            color="text-blue-600"
          />

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
            icon={<FaExclamationTriangle />}
            color="text-orange-600"
          />

          <StatCard
            label="Performance"
            value={`${stats.performance}%`}
            icon={<FaTachometerAlt />}
            color={performanceColor}
          />

          <StatCard
            label="Véhicules liés"
            value={stats.vehicules}
            icon={<FaCar />}
            color="text-purple-600"
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
                ? "bg-purple-600 text-white shadow-sm"
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
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-purple-600">
              <FaUserCog />
              Profil technicien
            </h2>

            <div className="space-y-3">
              <DetailLine label="ID" value={`#${technicien.id}`} />
              <DetailLine label="Nom" value={technicien.nom} />
              <DetailLine label="Prénom" value={technicien.prenom} />
              <DetailLine label="Email" value={technicien.email} />
              <DetailLine label="Téléphone" value={technicien.telephone} />
              <DetailLine label="Spécialité" value={technicien.specialite} />
              <DetailLine
                label="Date création"
                value={formatDate(technicien.dateCreation)}
              />
            </div>
          </div>

          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-blue-600">
              <FaTools />
              Dernières interventions
            </h2>

            {interventions.length === 0 ? (
              <EmptyState text="Aucune intervention affectée à ce technicien." />
            ) : (
              <div className="space-y-3">
                {interventions.slice(0, 5).map((i) => (
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
        </div>
      )}

      {/* PERFORMANCE */}
      {activeTab === "performance" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div
              className={`relative overflow-hidden rounded-[34px] bg-gradient-to-br ${performanceBg} p-7 text-white shadow-sm`}
            >
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/15 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

              <div className="relative">
                <div className="w-16 h-16 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center text-3xl">
                  <FaTachometerAlt />
                </div>

                <p className="mt-6 text-sm font-bold text-white/80">
                  Taux de réalisation
                </p>

                <h2 className="text-7xl font-black mt-2">
                  {stats.performance}%
                </h2>

                <p className="text-white/80 mt-4 leading-relaxed">
                  Calculé sur la base des interventions terminées par rapport au
                  total des interventions affectées.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-black flex items-center gap-3 text-purple-600 mb-6">
                <FaChartLine />
                Performance du technicien
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PerformanceBox
                  label="Taux de réalisation"
                  value={`${stats.performance}%`}
                  color={performanceColor}
                />

                <PerformanceBox
                  label="Coût moyen / intervention"
                  value={money(stats.avgCost)}
                  color="text-emerald-600"
                />

                <PerformanceBox
                  label="Interventions en attente"
                  value={stats.pending}
                  color="text-blue-600"
                />
              </div>

              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                <h3 className="font-bold text-lg mb-3 text-slate-900">
                  Analyse rapide
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {isTechnicien ? "Vous avez" : "Ce technicien a"} réalisé{" "}
                  {stats.done} intervention(s) terminée(s) sur un total de{" "}
                  {stats.total}. Le taux de réalisation est de{" "}
                  <span className={`font-black ${performanceColor}`}>
                    {stats.performance}%
                  </span>
                  . Le coût total géré est de{" "}
                  <span className="text-emerald-600 font-semibold">
                    {money(stats.cost)}
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-emerald-600">
              <FaMoneyBillWave />
              Résumé financier
            </h2>

            <div className="space-y-3">
              <DetailLine label="Coût total géré" value={money(stats.cost)} />
              <DetailLine label="Coût moyen" value={money(stats.avgCost)} />
              <DetailLine label="Interventions" value={stats.total} />
              <DetailLine label="Terminées" value={stats.done} />
              <DetailLine label="En cours" value={stats.inProgress} />
              <DetailLine label="En attente" value={stats.pending} />
              <DetailLine label="Véhicules liés" value={stats.vehicules} />
            </div>
          </div>
        </div>
      )}

      {/* INTERVENTIONS */}
      {activeTab === "interventions" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-blue-600">
            <FaTools />
            Toutes les interventions affectées
          </h2>

          {interventions.length === 0 ? (
            <EmptyState text="Aucune intervention affectée à ce technicien." />
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

function PerformanceBox({ label, value, color }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-4xl font-black mt-2 ${color}`}>{value}</p>
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
            {intervention.vehicule?.immatriculation || "Véhicule -"}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {formatDate(intervention.dateDebut)}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-500">Coût</p>
            <p className="font-black text-emerald-600">
              {money(intervention.cout)}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/interventions/details/${intervention.id}`);
            }}
            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center"
          >
            <FaEye />
          </button>
        </div>
      </div>
    </div>
  );
}