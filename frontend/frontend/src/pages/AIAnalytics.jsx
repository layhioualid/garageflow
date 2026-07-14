import { useEffect, useMemo, useState } from "react";
import { getPredictions } from "../services/ml.service";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  FaBrain,
  FaCar,
  FaCarSide,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaDatabase,
  FaExclamationTriangle,
  FaFireAlt,
  FaHistory,
  FaRobot,
  FaServer,
  FaShieldAlt,
  FaSyncAlt,
  FaTimes,
  FaTools,
  FaWrench,
} from "react-icons/fa";

const COLORS = {
  critique: "#dc2626",
  eleve: "#ef4444",
  moyen: "#f59e0b",
  faible: "#10b981",
};

export default function AIAnalytics() {
  const [predictions, setPredictions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    load();

    const interval = setInterval(() => {
      load(false);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const load = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError("");

      const res = await getPredictions();
      const data = Array.isArray(res.data) ? res.data : [];

      setPredictions(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les prédictions IA.");
    } finally {
      setLoading(false);
    }
  };

  const getVehicleKey = (item) => {
    return (
      item.vehiculeId ||
      item.vehicleDataId ||
      item.immatriculation ||
      item.id
    );
  };

  const getRisk = (item) => {
    const risk = item.riskLevel || item.niveauRisque || "Risque faible";

    const normalized = String(risk).toLowerCase();

    if (normalized.includes("critique")) return "critique";
    if (normalized.includes("élevé") || normalized.includes("eleve")) return "eleve";
    if (normalized.includes("moyen")) return "moyen";
    return "faible";
  };

  const getRiskLabel = (item) => {
    const risk = getRisk(item);

    if (risk === "critique") return "Risque critique";
    if (risk === "eleve") return "Risque élevé";
    if (risk === "moyen") return "Risque moyen";
    return "Risque faible";
  };

  const getProbability = (item) => {
    if (item.probabilityPercent !== undefined && item.probabilityPercent !== null) {
      return Number(item.probabilityPercent);
    }

    if (item.probabilite !== undefined && item.probabilite !== null) {
      return Number(item.probabilite) * 100;
    }

    if (item.probability !== undefined && item.probability !== null) {
      return Number(item.probability) * 100;
    }

    return 0;
  };

  const latestByVehicle = useMemo(() => {
    const map = new Map();

    [...predictions]
      .sort(
        (a, b) =>
          new Date(b.datePrediction || 0) - new Date(a.datePrediction || 0)
      )
      .forEach((item) => {
        const key = getVehicleKey(item);
        if (!map.has(key)) map.set(key, item);
      });

    return Array.from(map.values());
  }, [predictions]);

  const stats = useMemo(() => {
    const totalVehicles = latestByVehicle.length;
    const totalPredictions = predictions.length;

    const critical = latestByVehicle.filter((p) => getRisk(p) === "critique").length;
    const high = latestByVehicle.filter((p) => getRisk(p) === "eleve").length;
    const medium = latestByVehicle.filter((p) => getRisk(p) === "moyen").length;
    const low = latestByVehicle.filter((p) => getRisk(p) === "faible").length;

    const avg =
      totalVehicles > 0
        ? latestByVehicle.reduce((sum, p) => sum + getProbability(p), 0) /
          totalVehicles
        : 0;

    const health = Math.max(0, 100 - avg).toFixed(1);

    return {
      totalVehicles,
      totalPredictions,
      critical,
      high,
      medium,
      low,
      avg,
      health,
    };
  }, [latestByVehicle, predictions]);

  const urgentVehicles = useMemo(() => {
    return latestByVehicle
      .filter((item) => {
        const risk = getRisk(item);
        const probability = getProbability(item);

        return risk === "critique" || risk === "eleve" || probability >= 70;
      })
      .sort((a, b) => getProbability(b) - getProbability(a))
      .slice(0, 6);
  }, [latestByVehicle]);

  const topRisk = useMemo(() => {
    return [...latestByVehicle]
      .sort((a, b) => getProbability(b) - getProbability(a))
      .slice(0, 8);
  }, [latestByVehicle]);

  const chartRiskData = [
    { name: "Critique", value: stats.critical, color: COLORS.critique },
    { name: "Élevé", value: stats.high, color: COLORS.eleve },
    { name: "Moyen", value: stats.medium, color: COLORS.moyen },
    { name: "Faible", value: stats.low, color: COLORS.faible },
  ];

  const barData = topRisk.map((item) => ({
    name: item.immatriculation || `V-${getVehicleKey(item)}`,
    probability: Number(getProbability(item).toFixed(1)),
    fullName: getVehicleTitle(item),
  }));

  const trendData = [...predictions]
    .sort(
      (a, b) =>
        new Date(a.datePrediction || 0) - new Date(b.datePrediction || 0)
    )
    .slice(-25)
    .map((item, index) => ({
      label: item.datePrediction
        ? new Date(item.datePrediction).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : `P${index + 1}`,
      probability: Number(getProbability(item).toFixed(1)),
      vehicle: getVehicleTitle(item),
    }));

  const history = [...predictions]
    .sort(
      (a, b) =>
        new Date(b.datePrediction || 0) - new Date(a.datePrediction || 0)
    )
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-6 text-slate-900 space-y-6">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-[34px] bg-slate-950 p-7 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.35),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(34,211,238,0.25),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:70px_70px]" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
              <FaRobot className="text-cyan-300" />
              Maintenance prédictive intelligente
            </div>

            <h1 className="mt-5 text-4xl xl:text-5xl font-black tracking-tight text-white">
              Centre IA de maintenance
            </h1>

            <p className="mt-3 max-w-3xl text-slate-300">
              Analyse automatique des véhicules, détection des risques,
              recommandations intelligentes et historique des prédictions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs text-slate-300">Statut IA</p>
              <p className="mt-1 flex items-center gap-2 font-black text-emerald-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </p>
            </div>

            <button
              onClick={() => load(true)}
              disabled={loading}
              className="rounded-2xl bg-white px-5 py-4 font-bold text-slate-900 shadow-lg transition hover:bg-slate-100 disabled:opacity-60 flex items-center gap-2"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              {loading ? "Actualisation..." : "Actualiser"}
            </button>
          </div>
        </div>

        {error && (
          <div className="relative z-10 mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-100">
            {error}
          </div>
        )}
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <KpiCard
          title="Véhicules analysés"
          value={stats.totalVehicles}
          subtitle="Dernière analyse par véhicule"
          icon={FaCar}
          tone="blue"
        />

        <KpiCard
          title="Prédictions"
          value={stats.totalPredictions}
          subtitle="Historique total IA"
          icon={FaDatabase}
          tone="cyan"
        />

        <KpiCard
          title="Risque élevé"
          value={stats.high + stats.critical}
          subtitle="Priorité intervention"
          icon={FaExclamationTriangle}
          tone="red"
        />

        <KpiCard
          title="Risque moyen"
          value={stats.medium}
          subtitle="À surveiller"
          icon={FaChartLine}
          tone="yellow"
        />

        <KpiCard
          title="Santé flotte"
          value={`${stats.health}%`}
          subtitle="Indice opérationnel"
          icon={FaShieldAlt}
          tone="green"
        />
      </div>

      {/* URGENT + SYSTEM */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Panel
          className="xl:col-span-2"
          title="Priorités maintenance"
          subtitle="Véhicules nécessitant une attention rapide"
          icon={FaFireAlt}
        >
          {urgentVehicles.length === 0 ? (
            <EmptyState
              icon={FaCheckCircle}
              title="Aucune urgence actuellement"
              text="La flotte ne contient aucun véhicule à risque élevé."
            />
          ) : (
            <div className="space-y-3">
              {urgentVehicles.map((item) => (
                <PriorityCard
                  key={getVehicleKey(item)}
                  item={item}
                  getRisk={getRisk}
                  getRiskLabel={getRiskLabel}
                  getProbability={getProbability}
                  onClick={() => setSelected(item)}
                />
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="État système"
          subtitle="Connexion entre React, Spring Boot et Flask"
          icon={FaServer}
        >
          <div className="space-y-3">
            <SystemRow label="API IA Flask" value="Connectée" status="OK" />
            <SystemRow label="Spring Boot" value="Synchronisé" status="OK" />
            <SystemRow label="Base MySQL" value="Active" status="OK" />
            <SystemRow
              label="Dernière mise à jour"
              value={lastUpdate ? lastUpdate.toLocaleTimeString("fr-FR") : "-"}
              status="LIVE"
            />
          </div>
        </Panel>
      </div>

      {/* TOP CARDS */}
      <Panel
        title="Classement des véhicules"
        subtitle="Top véhicules selon la probabilité de maintenance"
        icon={FaCarSide}
      >
        {topRisk.length === 0 ? (
          <EmptyState
            icon={FaBrain}
            title="Aucune prédiction"
            text="Lance une première analyse IA pour afficher les résultats."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {topRisk.map((item) => (
              <VehicleCard
                key={getVehicleKey(item)}
                item={item}
                getRisk={getRisk}
                getRiskLabel={getRiskLabel}
                getProbability={getProbability}
                onClick={() => setSelected(item)}
              />
            ))}
          </div>
        )}
      </Panel>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Panel
          title="Répartition des risques"
          subtitle="Répartition actuelle par dernier résultat véhicule"
          icon={FaChartLine}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartRiskData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                innerRadius={68}
                paddingAngle={5}
              >
                {chartRiskData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-3 flex flex-wrap justify-center gap-4">
            {chartRiskData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600">
                  {item.name} : {item.value}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Top risques"
          subtitle="Probabilité IA par véhicule"
          icon={FaCar}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis domain={[0, 100]} stroke="#64748b" />
              <Tooltip content={<ChartTooltip percent />} />
              <Bar dataKey="probability" fill="#2563eb" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* TREND */}
      <Panel
        title="Tendance historique"
        subtitle="Évolution des 25 dernières prédictions"
        icon={FaClock}
      >
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="aiTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" stroke="#64748b" />
            <YAxis domain={[0, 100]} stroke="#64748b" />
            <Tooltip content={<ChartTooltip percent />} />
            <Area
              type="monotone"
              dataKey="probability"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#aiTrend)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      {/* TABLE */}
      <Panel
        title="Dernière prédiction par véhicule"
        subtitle="Clique sur une ligne pour afficher le détail IA"
        icon={FaTools}
      >
        {latestByVehicle.length === 0 ? (
          <EmptyState
            icon={FaBrain}
            title="Aucune donnée"
            text="Aucune prédiction IA n’est encore enregistrée."
          />
        ) : (
          <PredictionTable
            data={latestByVehicle}
            getRisk={getRisk}
            getRiskLabel={getRiskLabel}
            getProbability={getProbability}
            onSelect={setSelected}
          />
        )}
      </Panel>

      {/* HISTORY */}
      <Panel
        title="Historique récent"
        subtitle="Les 10 dernières analyses IA enregistrées"
        icon={FaHistory}
      >
        {history.length === 0 ? (
          <EmptyState
            icon={FaHistory}
            title="Historique vide"
            text="Les analyses récentes vont s’afficher ici."
          />
        ) : (
          <PredictionTable
            data={history}
            getRisk={getRisk}
            getRiskLabel={getRiskLabel}
            getProbability={getProbability}
            onSelect={setSelected}
          />
        )}
      </Panel>

      {selected && (
        <DetailsModal
          item={selected}
          onClose={() => setSelected(null)}
          getRisk={getRisk}
          getRiskLabel={getRiskLabel}
          getProbability={getProbability}
        />
      )}
    </div>
  );
}

function getVehicleTitle(item) {
  const immat = item.immatriculation || "Sans matricule";
  const marque = item.marque || "Marque inconnue";
  const modele = item.modele || item.vehicleModel || "";

  return `${immat} • ${marque} ${modele}`;
}

function getRiskStyle(risk) {
  if (risk === "critique") {
    return {
      badge: "bg-red-100 text-red-800 border-red-200",
      text: "text-red-700",
      bg: "bg-red-50 border-red-200",
      bar: "bg-red-600",
    };
  }

  if (risk === "eleve") {
    return {
      badge: "bg-red-50 text-red-700 border-red-200",
      text: "text-red-600",
      bg: "bg-red-50 border-red-200",
      bar: "bg-red-500",
    };
  }

  if (risk === "moyen") {
    return {
      badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
      text: "text-yellow-600",
      bg: "bg-yellow-50 border-yellow-200",
      bar: "bg-yellow-500",
    };
  }

  return {
    badge: "bg-green-50 text-green-700 border-green-200",
    text: "text-green-600",
    bg: "bg-green-50 border-green-200",
    bar: "bg-green-500",
  };
}

function decisionText(item, getProbability, getRisk) {
  const risk = getRisk(item);
  const probability = getProbability(item);

  if (risk === "critique" || risk === "eleve" || probability >= 70) {
    return "Intervention recommandée";
  }

  if (risk === "moyen" || probability >= 40) {
    return "Contrôle préventif";
  }

  return "Surveillance normale";
}

function KpiCard({ title, value, subtitle, icon: Icon, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-200",
    red: "bg-red-50 text-red-600 border-red-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">{value}</h2>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${tones[tone]}`}
        >
          <Icon />
        </div>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, icon: Icon, children, className = "" }) {
  return (
    <div
      className={`rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
            <Icon className="text-blue-600" />
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      {children}
    </div>
  );
}

function PriorityCard({
  item,
  getRisk,
  getRiskLabel,
  getProbability,
  onClick,
}) {
  const risk = getRisk(item);
  const style = getRiskStyle(risk);
  const probability = getProbability(item);

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-3xl border p-4 transition hover:shadow-md ${style.bg}`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-blue-600 border border-white">
            <FaCarSide />
          </div>

          <div>
            <p className="font-black text-slate-900">{getVehicleTitle(item)}</p>
            <p className="mt-1 text-sm text-slate-500">
              Prédiction #{item.id || "-"} • VehicleData #
              {item.vehicleDataId || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-2xl font-black ${style.text}`}>
            {probability.toFixed(1)}%
          </span>

          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${style.badge}`}>
            {getRiskLabel(item)}
          </span>
        </div>
      </div>

      {item.recommendation && (
        <p className="mt-3 rounded-2xl bg-white/70 p-3 text-sm font-medium text-slate-700">
          {item.recommendation}
        </p>
      )}
    </div>
  );
}

function VehicleCard({
  item,
  getRisk,
  getRiskLabel,
  getProbability,
  onClick,
}) {
  const risk = getRisk(item);
  const style = getRiskStyle(risk);
  const probability = getProbability(item);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-300 hover:bg-white hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600">
          <FaCar />
        </div>

        <span className={`text-xl font-black ${style.text}`}>
          {probability.toFixed(1)}%
        </span>
      </div>

      <div className="mt-4">
        <p className="font-black text-slate-950">
          {item.immatriculation || "Sans matricule"}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {item.marque || "Marque inconnue"} {item.modele || item.vehicleModel || ""}
        </p>

        <span
          className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${style.badge}`}
        >
          {getRiskLabel(item)}
        </span>
      </div>
    </div>
  );
}

function PredictionTable({
  data,
  getRisk,
  getRiskLabel,
  getProbability,
  onSelect,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-3 py-4 text-left">Véhicule</th>
            <th className="px-3 py-4 text-left">Probabilité</th>
            <th className="px-3 py-4 text-left">Niveau</th>
            <th className="px-3 py-4 text-left">Décision</th>
            <th className="px-3 py-4 text-left">Recommandation</th>
            <th className="px-3 py-4 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => {
            const risk = getRisk(item);
            const style = getRiskStyle(risk);
            const probability = getProbability(item);

            return (
              <tr
                key={`${item.id}-${item.vehicleDataId || item.vehiculeId}`}
                onClick={() => onSelect(item)}
                className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-3 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600">
                      <FaCar />
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">
                        {item.immatriculation || "Sans matricule"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.marque || "Marque inconnue"}{" "}
                        {item.modele || item.vehicleModel || ""}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${style.bar}`}
                        style={{ width: `${Math.min(probability, 100)}%` }}
                      />
                    </div>

                    <span className={`font-black ${style.text}`}>
                      {probability.toFixed(1)}%
                    </span>
                  </div>
                </td>

                <td className="px-3 py-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${style.badge}`}
                  >
                    {getRiskLabel(item)}
                  </span>
                </td>

                <td className="px-3 py-4 font-bold text-slate-700">
                  {decisionText(item, getProbability, getRisk)}
                </td>

                <td className="px-3 py-4 text-slate-500 max-w-[320px] truncate">
                  {item.recommendation || "-"}
                </td>

                <td className="px-3 py-4 text-slate-500">
                  {item.datePrediction
                    ? new Date(item.datePrediction).toLocaleString("fr-FR")
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DetailsModal({
  item,
  onClose,
  getRisk,
  getRiskLabel,
  getProbability,
}) {
  const risk = getRisk(item);
  const style = getRiskStyle(risk);
  const probability = getProbability(item);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 p-4 backdrop-blur-xl">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600">
              <FaCar />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-950">
                {getVehicleTitle(item)}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Détail complet de la prédiction IA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
          >
            <FaTimes />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          <div className={`rounded-[30px] border p-6 ${style.bg}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <h3 className="flex items-center gap-2 text-xl font-black text-slate-950">
                  <FaBrain />
                  Résultat IA
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Résultat généré par le modèle de maintenance prédictive.
                </p>
              </div>

              <div className="text-left md:text-right">
                <p className="text-sm text-slate-500">Probabilité</p>
                <p className={`text-5xl font-black ${style.text}`}>
                  {probability.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ModalInfo label="Niveau" value={getRiskLabel(item)} color={style.text} />
            <ModalInfo
              label="Décision"
              value={decisionText(item, getProbability, getRisk)}
              color={style.text}
            />
            <ModalInfo
              label="Maintenance"
              value={item.needMaintenance === 1 ? "Oui" : "Non"}
              color={item.needMaintenance === 1 ? "text-red-600" : "text-green-600"}
            />
            <ModalInfo
              label="Prédiction"
              value={`#${item.id || "-"}`}
              color="text-blue-600"
            />
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-black text-slate-950">
              <FaWrench className="text-blue-600" />
              Recommandation IA
            </h3>

            <p className="rounded-2xl bg-white p-4 text-slate-700 border border-slate-200 leading-relaxed">
              {item.recommendation ||
                "Aucune recommandation détaillée disponible pour cette prédiction."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoBox title="Informations véhicule" icon={FaCar}>
              <DetailRow label="Matricule" value={item.immatriculation} />
              <DetailRow label="Marque" value={item.marque} />
              <DetailRow label="Modèle" value={item.modele || item.vehicleModel} />
              <DetailRow label="Kilométrage" value={item.kilometrage ? `${item.kilometrage} km` : "-"} />
              <DetailRow label="Vehicle Data ID" value={`#${item.vehicleDataId || "-"}`} />
            </InfoBox>

            <InfoBox title="Informations IA" icon={FaRobot}>
              <DetailRow label="Probabilité" value={`${probability.toFixed(1)}%`} />
              <DetailRow label="Niveau" value={getRiskLabel(item)} />
              <DetailRow label="Model" value={item.modelUsed || "vehicle_maintenance_model.pkl"} />
              <DetailRow
                label="Date"
                value={
                  item.datePrediction
                    ? new Date(item.datePrediction).toLocaleString("fr-FR")
                    : "-"
                }
              />
              <DetailRow label="Besoin maintenance" value={item.needMaintenance === 1 ? "Oui" : "Non"} />
            </InfoBox>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-2xl bg-slate-100 px-6 py-3 font-bold text-slate-800 transition hover:bg-slate-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ title, icon: Icon, children }) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-6">
      <h3 className="mb-4 flex items-center gap-2 font-black text-blue-600">
        <Icon />
        {title}
      </h3>

      {children}
    </div>
  );
}

function ModalInfo({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-2 font-black ${color}`}>{value || "-"}</p>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-200 py-3 text-sm last:border-b-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-900">
        {value || "-"}
      </span>
    </div>
  );
}

function SystemRow({ label, value, status }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 font-bold text-slate-900">{value}</p>
      </div>

      <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
        {status}
      </span>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600">
        <Icon className="text-xl" />
      </div>

      <h3 className="mt-4 font-black text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}

function ChartTooltip({ active, payload, label, percent }) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0]?.payload;
  const value = payload[0]?.value;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
      <p className="mb-1 text-xs text-slate-500">
        {item?.fullName || item?.vehicle || label || item?.name}
      </p>
      <p className="font-black text-slate-950">
        {percent ? `${value}%` : value}
      </p>
    </div>
  );
}