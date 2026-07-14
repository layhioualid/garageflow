import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getVehicules } from "../services/vehicule.service";
import { getInterventions } from "../services/intervention.service";
import { getUsers } from "../services/user.service";
import { getFactures } from "../services/facture.service";
import { getPieces } from "../services/piece.service";
import { getDevis } from "../services/devis.service";
import { getAchats } from "../services/achat.service";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

import {
  FaCar,
  FaTools,
  FaFileInvoice,
  FaBoxes,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaArrowRight,
  FaPlus,
  FaRobot,
  FaShoppingCart,
  FaClipboardList,
  FaChartLine,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaWarehouse,
  FaBell,
  FaSyncAlt,
  FaShieldAlt,
  FaWrench,
  FaBolt,
  FaEye,
  FaPercent,
  FaRoute,
  FaLayerGroup,
  FaCalendarAlt,
  FaUserTie,
  FaFileAlt,
} from "react-icons/fa";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Dashboard() {
  const navigate = useNavigate();

  const [vehicules, setVehicules] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [users, setUsers] = useState([]);
  const [factures, setFactures] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [devis, setDevis] = useState([]);
  const [achats, setAchats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  const money = (v) => `${Number(v || 0).toFixed(2)} DH`;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("fr-FR");
  };

  const load = async () => {
    try {
      setLoading(true);

      const [v, i, u, f, p, d, a] = await Promise.all([
        getVehicules(),
        getInterventions(),
        getUsers(),
        getFactures(),
        getPieces(),
        getDevis(),
        getAchats(),
      ]);

      setVehicules(v.data || []);
      setInterventions(i.data || []);
      setUsers(u.data || []);
      setFactures(f.data || []);
      setPieces(p.data || []);
      setDevis(d.data || []);
      setAchats(a.data || []);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du chargement du dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredByPeriod = (items, dateFieldCandidates) => {
    if (period === "all") return items;

    const now = new Date();
    const limit = new Date();

    if (period === "month") {
      limit.setMonth(now.getMonth() - 1);
    } else if (period === "quarter") {
      limit.setMonth(now.getMonth() - 3);
    } else if (period === "year") {
      limit.setFullYear(now.getFullYear() - 1);
    }

    return items.filter((item) => {
      const dateValue = dateFieldCandidates
        .map((field) => item[field])
        .find(Boolean);

      if (!dateValue) return true;

      return new Date(dateValue) >= limit;
    });
  };

  const scopedInterventions = useMemo(
    () => filteredByPeriod(interventions, ["dateDebut", "dateFin", "createdAt"]),
    [interventions, period]
  );

  const scopedFactures = useMemo(
    () => filteredByPeriod(factures, ["dateFacture", "createdAt"]),
    [factures, period]
  );

  const scopedDevis = useMemo(
    () => filteredByPeriod(devis, ["dateCreation", "dateValidation", "createdAt"]),
    [devis, period]
  );

  const scopedAchats = useMemo(
    () => filteredByPeriod(achats, ["dateAchat", "date", "createdAt"]),
    [achats, period]
  );

  const analytics = useMemo(() => {
    const totalRevenue = scopedFactures.reduce(
      (sum, f) => sum + Number(f.montantTtc || 0),
      0
    );

    const paidRevenue = scopedFactures
      .filter((f) => f.statut === "PAID")
      .reduce((sum, f) => sum + Number(f.montantTtc || 0), 0);

    const unpaidAmount = scopedFactures
      .filter((f) => f.statut === "UNPAID")
      .reduce((sum, f) => sum + Number(f.montantTtc || 0), 0);

    const unpaidFactures = scopedFactures.filter((f) => f.statut === "UNPAID");
    const paidFactures = scopedFactures.filter((f) => f.statut === "PAID");

    const approvedDevis = scopedDevis.filter((d) => d.statut === "APPROVED");
    const pendingDevis = scopedDevis.filter((d) => d.statut === "PENDING");
    const rejectedDevis = scopedDevis.filter((d) => d.statut === "REJECTED");

    const doneInterventions = scopedInterventions.filter(
      (i) => i.statut === "DONE"
    );

    const inProgressInterventions = scopedInterventions.filter(
      (i) => i.statut === "IN_PROGRESS"
    );

    const pendingInterventions = scopedInterventions.filter(
      (i) => i.statut === "PENDING"
    );

    const activeInterventions = scopedInterventions.filter(
      (i) => i.statut !== "DONE"
    );

    const vehiculesActive = vehicules.filter((v) => v.statut === "ACTIVE");
    const vehiculesMaintenance = vehicules.filter(
      (v) => v.statut === "MAINTENANCE"
    );
    const vehiculesInactive = vehicules.filter((v) => v.statut === "INACTIVE");

    const lowStock = pieces.filter((p) => Number(p.quantiteStock || 0) <= 5);
    const ruptureStock = pieces.filter((p) => Number(p.quantiteStock || 0) <= 0);

    const totalAchats = scopedAchats.reduce(
      (sum, a) => sum + Number(a.montantTotal || a.total || a.prixTotal || 0),
      0
    );

    const totalMaintenanceCost = scopedInterventions.reduce(
      (sum, i) => sum + Number(i.cout || 0),
      0
    );

    const profitEstimate = paidRevenue - totalAchats;

    const conversionRate =
      scopedDevis.length > 0
        ? Math.round((approvedDevis.length / scopedDevis.length) * 100)
        : 0;

    const paymentRate =
      scopedFactures.length > 0
        ? Math.round((paidFactures.length / scopedFactures.length) * 100)
        : 0;

    const operationalScore = Math.max(
      0,
      Math.min(
        100,
        100 -
          unpaidFactures.length * 5 -
          lowStock.length * 4 -
          activeInterventions.length * 3 -
          pendingDevis.length * 2 -
          vehiculesMaintenance.length * 3 -
          ruptureStock.length * 8
      )
    );

    return {
      totalRevenue,
      paidRevenue,
      unpaidAmount,
      unpaidFactures,
      paidFactures,
      approvedDevis,
      pendingDevis,
      rejectedDevis,
      doneInterventions,
      inProgressInterventions,
      pendingInterventions,
      activeInterventions,
      vehiculesActive,
      vehiculesMaintenance,
      vehiculesInactive,
      lowStock,
      ruptureStock,
      totalAchats,
      totalMaintenanceCost,
      profitEstimate,
      conversionRate,
      paymentRate,
      operationalScore,
    };
  }, [
    vehicules,
    pieces,
    scopedFactures,
    scopedDevis,
    scopedInterventions,
    scopedAchats,
  ]);

  const revenueData = useMemo(() => {
    const months = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];

    const result = months.map((month) => ({
      month,
      revenue: 0,
      achats: 0,
      profit: 0,
    }));

    scopedFactures.forEach((f) => {
      if (!f.dateFacture) return;
      const index = new Date(f.dateFacture).getMonth();
      result[index].revenue += Number(f.montantTtc || 0);
    });

    scopedAchats.forEach((a) => {
      const date = a.dateAchat || a.date || a.createdAt;
      if (!date) return;
      const index = new Date(date).getMonth();
      result[index].achats += Number(a.montantTotal || a.total || a.prixTotal || 0);
    });

    return result.map((row) => ({
      ...row,
      profit: row.revenue - row.achats,
    }));
  }, [scopedFactures, scopedAchats]);

  const interventionStatusData = useMemo(
    () => [
      { name: "En attente", value: analytics.pendingInterventions.length },
      { name: "En cours", value: analytics.inProgressInterventions.length },
      { name: "Terminées", value: analytics.doneInterventions.length },
    ],
    [analytics]
  );

  const vehicleStatusData = useMemo(
    () => [
      { name: "Actifs", value: analytics.vehiculesActive.length },
      { name: "Maintenance", value: analytics.vehiculesMaintenance.length },
      { name: "Inactifs", value: analytics.vehiculesInactive.length },
    ],
    [analytics]
  );

  const financeData = useMemo(
    () => [
      { name: "Payées", value: analytics.paidFactures.length },
      { name: "Impayées", value: analytics.unpaidFactures.length },
    ],
    [analytics]
  );

  const workflowData = useMemo(
    () => [
      { name: "Devis", value: scopedDevis.length },
      { name: "Approuvés", value: analytics.approvedDevis.length },
      { name: "Factures", value: scopedFactures.length },
      { name: "Payées", value: analytics.paidFactures.length },
    ],
    [scopedDevis, scopedFactures, analytics]
  );

  const topVehicules = useMemo(() => {
    const map = {};

    scopedInterventions.forEach((i) => {
      const label = i.vehicule?.immatriculation || `Véhicule #${i.vehicule?.id || "-"}`;

      if (!map[label]) {
        map[label] = {
          vehicule: label,
          cost: 0,
          count: 0,
          id: i.vehicule?.id,
        };
      }

      map[label].cost += Number(i.cout || 0);
      map[label].count += 1;
    });

    return Object.values(map)
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 6);
  }, [scopedInterventions]);

  const technicianPerformance = useMemo(() => {
    const map = {};

    scopedInterventions.forEach((i) => {
      const name = i.technicien?.nom || "Non affecté";

      if (!map[name]) {
        map[name] = {
          technicien: name,
          total: 0,
          done: 0,
          cost: 0,
        };
      }

      map[name].total += 1;
      if (i.statut === "DONE") map[name].done += 1;
      map[name].cost += Number(i.cout || 0);
    });

    return Object.values(map)
      .sort((a, b) => b.done - a.done || b.total - a.total)
      .slice(0, 5);
  }, [scopedInterventions]);

  const recentActivity = useMemo(() => {
    const events = [];

    scopedInterventions.forEach((i) => {
      events.push({
        type: "Intervention",
        title: i.typePanne || `Intervention #${i.id}`,
        desc: `${i.vehicule?.immatriculation || "-"} • ${i.statut || "-"}`,
        date: i.dateDebut,
        amount: i.cout,
        path: `/interventions/details/${i.id}`,
        icon: FaTools,
      });
    });

    scopedDevis.forEach((d) => {
      events.push({
        type: "Devis",
        title: `Devis #${d.id}`,
        desc: `${d.statutClient || "EN_ATTENTE"} • ${
          d.intervention?.vehicule?.immatriculation || "-"
        }`,
        date: d.dateCreation,
        amount: d.montant,
        path: "/devis",
        icon: FaClipboardList,
      });
    });

    scopedFactures.forEach((f) => {
      events.push({
        type: "Facture",
        title: f.numero || `Facture #${f.id}`,
        desc: `${f.statut || "-"} • ${
          f.intervention?.vehicule?.immatriculation || "-"
        }`,
        date: f.dateFacture,
        amount: f.montantTtc,
        path: "/factures",
        icon: FaFileInvoice,
      });
    });

    return events
      .filter((e) => e.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);
  }, [scopedInterventions, scopedDevis, scopedFactures]);

  const recommendation = useMemo(() => {
    if (analytics.ruptureStock.length > 0) {
      return {
        title: "Rupture de stock détectée",
        desc: "Certaines pièces sont à zéro. Créez un achat fournisseur rapidement.",
        path: "/pieces",
        color: "red",
      };
    }

    if (analytics.lowStock.length > 0) {
      return {
        title: "Réapprovisionnement recommandé",
        desc: "Des pièces sont en stock critique. Planifiez un achat.",
        path: "/pieces",
        color: "orange",
      };
    }

    if (analytics.unpaidFactures.length > 0) {
      return {
        title: "Relancer les factures impayées",
        desc: "Certaines factures ne sont pas encore réglées.",
        path: "/factures",
        color: "yellow",
      };
    }

    if (analytics.pendingDevis.length > 0) {
      return {
        title: "Traiter les devis en attente",
        desc: "Des devis attendent encore une réponse ou une relance client.",
        path: "/devis",
        color: "purple",
      };
    }

    if (analytics.activeInterventions.length > 0) {
      return {
        title: "Finaliser les interventions ouvertes",
        desc: "Des interventions sont encore en cours ou en attente.",
        path: "/interventions",
        color: "blue",
      };
    }

    return {
      title: "Planifier une maintenance préventive",
      desc: "Le système est stable. Vous pouvez anticiper les prochaines maintenances.",
      path: "/vehicules",
      color: "green",
    };
  }, [analytics]);

  const kpis = [
    {
      title: "Chiffre d’affaires",
      value: money(analytics.totalRevenue),
      detail: `Payé : ${money(analytics.paidRevenue)}`,
      icon: FaMoneyBillWave,
      color: "from-emerald-500 to-green-700",
      path: "/factures",
    },
    {
      title: "Bénéfice estimé",
      value: money(analytics.profitEstimate),
      detail: `Achats : ${money(analytics.totalAchats)}`,
      icon: FaChartLine,
      color:
        analytics.profitEstimate >= 0
          ? "from-blue-500 to-indigo-700"
          : "from-red-500 to-orange-700",
      path: "/achats",
    },
    {
      title: "Interventions actives",
      value: analytics.activeInterventions.length,
      detail: `${analytics.doneInterventions.length} terminées`,
      icon: FaTools,
      color: "from-purple-500 to-violet-700",
      path: "/interventions",
    },
    {
      title: "Stock critique",
      value: analytics.lowStock.length,
      detail: `${analytics.ruptureStock.length} rupture(s)`,
      icon: FaExclamationTriangle,
      color: "from-red-500 to-orange-700",
      path: "/pieces",
    },
  ];

  const modules = [
    {
      title: "Véhicules",
      desc: `${vehicules.length} véhicules`,
      icon: FaCar,
      path: "/vehicules",
      color: "text-blue-600",
    },
    {
      title: "Clients",
      desc: `${users.length} utilisateurs`,
      icon: FaUsers,
      path: "/clients",
      color: "text-purple-600",
    },
    {
      title: "Interventions",
      desc: `${scopedInterventions.length} interventions`,
      icon: FaTools,
      path: "/interventions",
      color: "text-cyan-600",
    },
    {
      title: "Devis",
      desc: `${analytics.pendingDevis.length} en attente`,
      icon: FaClipboardList,
      path: "/devis",
      color: "text-yellow-600",
    },
    {
      title: "Factures",
      desc: `${analytics.unpaidFactures.length} impayées`,
      icon: FaFileInvoice,
      path: "/factures",
      color: "text-green-600",
    },
    {
      title: "Stock",
      desc: `${pieces.length} pièces`,
      icon: FaBoxes,
      path: "/pieces",
      color: "text-red-600",
    },
  ];

  const alerts = [
    analytics.ruptureStock.length > 0 && {
      title: `${analytics.ruptureStock.length} pièce(s) en rupture`,
      desc: "Stock à zéro. Action immédiate recommandée.",
      color: "red",
      path: "/pieces",
    },
    analytics.lowStock.length > 0 && {
      title: `${analytics.lowStock.length} pièce(s) en stock critique`,
      desc: "Créer un achat fournisseur pour éviter les ruptures.",
      color: "orange",
      path: "/pieces",
    },
    analytics.unpaidFactures.length > 0 && {
      title: `${analytics.unpaidFactures.length} facture(s) impayée(s)`,
      desc: `Montant à récupérer : ${money(analytics.unpaidAmount)}.`,
      color: "yellow",
      path: "/factures",
    },
    analytics.pendingDevis.length > 0 && {
      title: `${analytics.pendingDevis.length} devis en attente`,
      desc: "Relancer ou envoyer le lien de validation au client.",
      color: "purple",
      path: "/devis",
    },
    analytics.activeInterventions.length > 0 && {
      title: `${analytics.activeInterventions.length} intervention(s) à finaliser`,
      desc: "Suivre les travaux et clôturer les interventions terminées.",
      color: "blue",
      path: "/interventions",
    },
  ].filter(Boolean);

  const getScoreLabel = () => {
    if (analytics.operationalScore >= 80) return "Système stable";
    if (analytics.operationalScore >= 55) return "Surveillance recommandée";
    return "Action urgente recommandée";
  };

  const getScoreColor = () => {
    if (analytics.operationalScore >= 80) return "bg-green-500";
    if (analytics.operationalScore >= 55) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fb] text-slate-900">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-pulse">
          Chargement du dashboard intelligent...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900 p-6 space-y-7">
{/* HERO */}
<div
  className="dashboard-hero relative overflow-hidden rounded-[34px] border border-slate-200/70 p-8 xl:p-10 shadow-[0_25px_80px_rgba(15,23,42,0.14)] min-h-[470px]"
  style={{
    backgroundImage:
      "linear-gradient(90deg, rgba(248,250,252,0.98) 0%, rgba(248,250,252,0.94) 34%, rgba(248,250,252,0.72) 52%, rgba(15,23,42,0.15) 72%, rgba(15,23,42,0.08) 100%), url('/images/login-maintenance-truck.png')",
    backgroundSize: "cover",
    backgroundPosition: "center right",
    backgroundRepeat: "no-repeat",
  }}
>
  {/* SOFT LIGHT EFFECTS */}
  <div className="dashboard-hero-soft absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/10 to-transparent" />
  <div className="dashboard-hero-glow absolute -top-32 -left-32 w-[420px] h-[420px] bg-blue-200/40 rounded-full blur-3xl" />
  <div className="dashboard-hero-glow absolute -bottom-40 left-1/4 w-[520px] h-[520px] bg-emerald-200/30 rounded-full blur-3xl" />
  <div className="dashboard-hero-side absolute top-0 right-0 w-[520px] h-full bg-gradient-to-l from-blue-950/20 via-blue-600/5 to-transparent" />

  {/* GRID PATTERN LIGHT */}
  <div
    className="dashboard-hero-grid absolute inset-0 opacity-[0.18]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(37,99,235,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.12) 1px, transparent 1px)",
      backgroundSize: "42px 42px",
    }}
  />

  <div className="relative z-10 flex flex-col xl:flex-row justify-between gap-8">
    {/* LEFT CONTENT */}
    <div className="max-w-4xl">
      <div className="dashboard-hero-badge inline-flex items-center gap-3 text-blue-700 bg-white/80 backdrop-blur-xl border border-blue-200 px-4 py-2 rounded-full font-black mb-5 shadow-sm">
        <FaRobot />
        GarageFlow+ Command Center
      </div>

      <h1 className="dashboard-hero-title text-4xl md:text-5xl xl:text-7xl font-black leading-[0.95] tracking-tight text-slate-950 max-w-4xl">
        Pilotage intelligent de votre garage en temps réel
      </h1>

      <p className="dashboard-hero-copy text-slate-600 mt-6 max-w-3xl text-lg leading-relaxed font-medium">
        Suivez véhicules, clients, interventions, devis, factures, achats,
        stock, alertes et performance depuis un seul tableau de bord.
      </p>

      <div className="flex flex-wrap gap-3 mt-8">
        <button
          onClick={() => navigate("/interventions/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 transition shadow-[0_14px_35px_rgba(37,99,235,0.28)] hover:-translate-y-0.5"
        >
          <FaPlus />
          Nouvelle intervention
        </button>

        <button
          onClick={() => navigate("/devis")}
          className="dashboard-hero-secondary bg-white/85 hover:bg-white text-slate-900 px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 transition border border-slate-200 shadow-sm hover:-translate-y-0.5"
        >
          Traiter les devis
          <FaArrowRight />
        </button>

        <button
          onClick={() => navigate("/achats")}
          className="dashboard-hero-secondary bg-white/85 hover:bg-white text-slate-900 px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 transition border border-slate-200 shadow-sm hover:-translate-y-0.5"
        >
          Gérer les achats
          <FaArrowRight />
        </button>

        <button
          onClick={load}
          className="dashboard-hero-secondary bg-white/85 hover:bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 transition shadow-sm hover:-translate-y-0.5"
        >
          <FaSyncAlt />
          Actualiser
        </button>
      </div>
    </div>

    {/* RIGHT SCORE CARD */}
    <div className="xl:ml-auto w-full xl:w-[360px]">
      <div className="dashboard-score-card bg-white/90 backdrop-blur-2xl border border-white/80 rounded-[30px] p-6 shadow-[0_25px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-semibold">
              Score opérationnel
            </p>
            <p className="text-xs text-slate-400 mt-1">
              État global du garage
            </p>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <FaShieldAlt />
          </div>
        </div>

        <div className="flex items-end gap-2 mt-5">
          <h2 className="text-7xl font-black text-slate-950 tracking-tight">
            {analytics.operationalScore}
          </h2>
          <span className="text-slate-400 text-2xl mb-2 font-semibold">
            /100
          </span>
        </div>

        <div className="w-full bg-slate-200 h-3 rounded-full mt-5 overflow-hidden">
          <div
            className={`h-full rounded-full ${getScoreColor()}`}
            style={{ width: `${analytics.operationalScore}%` }}
          />
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-700">
            {getScoreLabel()}
          </p>

          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Le score est calculé selon les factures, devis, interventions,
            véhicules et niveaux de stock.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <MiniMetric label="Paiement" value={`${analytics.paymentRate}%`} />
          <MiniMetric label="Devis" value={`${analytics.conversionRate}%`} />
          <MiniMetric label="Alertes" value={alerts.length} />
        </div>
      </div>
    </div>
  </div>
</div>

      {/* PERIOD FILTER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-black text-slate-950 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-600" />
            Période d’analyse
          </h2>
          <p className="text-sm text-slate-500">
            Filtre les graphiques et statistiques selon la période sélectionnée.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "Tout" },
            { value: "month", label: "30 jours" },
            { value: "quarter", label: "3 mois" },
            { value: "year", label: "1 an" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-2xl font-semibold transition ${
                period === p.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((k, index) => {
          const Icon = k.icon;

          return (
            <button
              key={index}
              onClick={() => navigate(k.path)}
              className={`text-left rounded-3xl p-6 bg-gradient-to-br ${k.color} shadow-md hover:scale-[1.02] transition-all text-white`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm">{k.title}</p>
                  <h2 className="text-4xl font-black mt-3">{k.value}</h2>
                  <p className="text-white/80 text-sm mt-2">{k.detail}</p>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Icon className="text-2xl" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        {modules.map((m, index) => {
          const Icon = m.icon;

          return (
            <button
              key={index}
              onClick={() => navigate(m.path)}
              className="bg-white border border-slate-200 rounded-3xl p-5 text-left hover:border-blue-300 hover:shadow-md transition group"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-slate-50 ${m.color} flex items-center justify-center mb-4 border border-slate-200`}
              >
                <Icon />
              </div>

              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                {m.title}
              </h3>

              <p className="text-slate-500 text-sm mt-1">{m.desc}</p>
            </button>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Panel
          className="xl:col-span-2"
          title="Revenus, achats et bénéfice estimé"
          icon={<FaChartLine className="text-blue-600" />}
        >
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="buy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip formatter={(value) => money(value)} />
              <Legend />

              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenus"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#rev)"
              />

              <Area
                type="monotone"
                dataKey="achats"
                name="Achats"
                stroke="#f59e0b"
                strokeWidth={3}
                fill="url(#buy)"
              />

              <Area
                type="monotone"
                dataKey="profit"
                name="Bénéfice"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#profit)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel
          title="Recommandation intelligente"
          icon={<FaRobot className="text-purple-600" />}
          border="border-purple-200"
        >
          <div
            className={`rounded-3xl p-5 border ${
              recommendation.color === "red"
                ? "bg-red-50 border-red-200"
                : recommendation.color === "orange"
                ? "bg-orange-50 border-orange-200"
                : recommendation.color === "yellow"
                ? "bg-yellow-50 border-yellow-200"
                : recommendation.color === "purple"
                ? "bg-purple-50 border-purple-200"
                : recommendation.color === "blue"
                ? "bg-blue-50 border-blue-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <p className="text-sm font-semibold text-slate-600">
              Priorité automatique
            </p>

            <h2 className="text-2xl font-black mt-2 text-slate-950">
              {recommendation.title}
            </h2>

            <p className="text-slate-600 text-sm mt-3">
              {recommendation.desc}
            </p>

            <button
              onClick={() => navigate(recommendation.path)}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
            >
              Ouvrir la priorité
              <FaArrowRight />
            </button>
          </div>

          <div className="mt-5 space-y-3 text-sm">
            <MetricLine label="Devis en attente" value={analytics.pendingDevis.length} />
            <MetricLine label="Factures impayées" value={analytics.unpaidFactures.length} />
            <MetricLine label="Stock critique" value={analytics.lowStock.length} />
            <MetricLine label="Interventions ouvertes" value={analytics.activeInterventions.length} />
          </div>
        </Panel>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <Panel title="Cycle commercial" icon={<FaRoute className="text-purple-600" />}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={workflowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="État des factures" icon={<FaFileInvoice className="text-green-600" />}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={financeData} dataKey="value" outerRadius={85} label>
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="État véhicules" icon={<FaCar className="text-blue-600" />}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={vehicleStatusData} dataKey="value" outerRadius={85} label>
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="État interventions" icon={<FaTools className="text-cyan-600" />}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={interventionStatusData} dataKey="value" outerRadius={85} label>
                <Cell fill="#f59e0b" />
                <Cell fill="#3b82f6" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* ALERTS + TABLES */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Panel
          title="Alertes prioritaires"
          icon={<FaBell className="text-red-600" />}
          border="border-red-200"
        >
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
                <p className="font-semibold text-green-700">
                  Aucun problème critique
                </p>
                <p className="text-sm text-slate-500">
                  Votre garage est stable.
                </p>
              </div>
            ) : (
              alerts.map((a, index) => <AlertCard key={index} alert={a} navigate={navigate} />)
            )}
          </div>
        </Panel>

        <Panel
          className="xl:col-span-2"
          title="Top véhicules les plus coûteux"
          icon={<FaCar className="text-blue-600" />}
        >
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={topVehicules}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="vehicule" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip formatter={(value) => money(value)} />
              <Bar dataKey="cost" name="Coût" fill="#3b82f6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* TECH + STOCK + ACTIVITY */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Panel title="Performance techniciens" icon={<FaUserTie className="text-purple-600" />}>
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {technicianPerformance.length === 0 ? (
              <EmptyText text="Aucune donnée technicien disponible." />
            ) : (
              technicianPerformance.map((t, index) => (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900">{t.technicien}</p>
                      <p className="text-sm text-slate-500">
                        {t.done}/{t.total} interventions terminées
                      </p>
                    </div>
                    <p className="font-black text-emerald-600">{money(t.cost)}</p>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{
                        width: `${t.total > 0 ? (t.done / t.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel title="Stock critique" icon={<FaWarehouse className="text-red-600" />}>
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {analytics.lowStock.length === 0 ? (
              <EmptyText text="Aucune pièce en stock critique." />
            ) : (
              analytics.lowStock.slice(0, 8).map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate("/pieces")}
                  className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-red-200 rounded-2xl p-4 cursor-pointer transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">{p.nom}</p>
                      <p className="text-sm text-slate-500">
                        Réf : {p.reference || "-"}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        Number(p.quantiteStock || 0) <= 0
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      Stock : {p.quantiteStock || 0}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel title="Activité récente" icon={<FaLayerGroup className="text-blue-600" />}>
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {recentActivity.length === 0 ? (
              <EmptyText text="Aucune activité récente." />
            ) : (
              recentActivity.map((e, index) => {
                const Icon = e.icon;

                return (
                  <div
                    key={index}
                    onClick={() => navigate(e.path)}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-white cursor-pointer transition flex justify-between items-center border border-slate-200 hover:border-blue-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <Icon />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">{e.title}</p>
                        <p className="text-sm text-slate-500">{e.desc}</p>
                        <p className="text-xs text-slate-400">
                          {formatDate(e.date)}
                        </p>
                      </div>
                    </div>

                    <p className="text-blue-600 font-bold">{money(e.amount)}</p>
                  </div>
                );
              })
            )}
          </div>
        </Panel>
      </div>

      {/* ACTION CENTER */}
      <Panel title="Centre d’actions rapides" icon={<FaBolt className="text-yellow-600" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          <ActionButton
            icon={<FaPlus />}
            label="Nouvelle intervention"
            onClick={() => navigate("/interventions/new")}
            color="bg-blue-600 hover:bg-blue-700 text-white"
          />

          <ActionButton
            icon={<FaCar />}
            label="Ajouter véhicule"
            onClick={() => navigate("/vehicules")}
            color="bg-slate-100 hover:bg-slate-200 text-slate-800"
          />

          <ActionButton
            icon={<FaClipboardList />}
            label="Devis en attente"
            onClick={() => navigate("/devis")}
            color="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
          />

          <ActionButton
            icon={<FaFileInvoice />}
            label="Factures impayées"
            onClick={() => navigate("/factures")}
            color="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200"
          />

          <ActionButton
            icon={<FaBoxes />}
            label="Stock critique"
            onClick={() => navigate("/pieces")}
            color="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
          />

          <ActionButton
            icon={<FaRobot />}
            label="Analyse IA"
            onClick={() => navigate("/ai")}
            color="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200"
          />
        </div>
      </Panel>
    </div>
  );
}

function Panel({ title, icon, children, className = "", border = "border-slate-200" }) {
  return (
    <div className={`bg-white border ${border} rounded-3xl p-6 shadow-sm ${className}`}>
      <h2 className="font-bold mb-5 flex items-center gap-2 text-slate-900">
        {icon}
        {title}
      </h2>

      {children}
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function MetricLine({ label, value }) {
  return (
    <div className="flex justify-between text-slate-500">
      <span>{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function AlertCard({ alert, navigate }) {
  return (
    <div
      onClick={() => navigate(alert.path)}
      className={`p-4 rounded-2xl border cursor-pointer transition ${
        alert.color === "red"
          ? "bg-red-50 border-red-200 hover:bg-red-100"
          : alert.color === "orange"
          ? "bg-orange-50 border-orange-200 hover:bg-orange-100"
          : alert.color === "yellow"
          ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
          : alert.color === "purple"
          ? "bg-purple-50 border-purple-200 hover:bg-purple-100"
          : "bg-blue-50 border-blue-200 hover:bg-blue-100"
      }`}
    >
      <p className="font-semibold text-slate-900">{alert.title}</p>
      <p className="text-sm text-slate-500 mt-1">{alert.desc}</p>
    </div>
  );
}

function ActionButton({ icon, label, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`${color} px-4 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition`}
    >
      {icon}
      {label}
    </button>
  );
}

function EmptyText({ text }) {
  return (
    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-500">
      {text}
    </div>
  );
}
