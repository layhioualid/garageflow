import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getCurrentUser, logout } from "../services/auth.service";

import {
  FaBell,
  FaGlobe,
  FaUserCircle,
  FaChevronDown,
  FaRobot,
  FaCar,
  FaTools,
  FaChartPie,
  FaFileInvoice,
  FaCubes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClipboardList,
  FaChartLine,
  FaTimes,
  FaSyncAlt,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaUsers,
  FaHome,
  FaArrowRight,
  FaCircle,
  FaIdCard,
  FaUserCog,
  FaShoppingCart,
  FaIndustry,
  FaFolder,
  FaFileAlt,
} from "react-icons/fa";

const API_URL = "http://localhost:8080";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const currentUser = getCurrentUser();
  const role = currentUser?.role;
  const isTechnicien = role === "TECHNICIEN";

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [notificationClock, setNotificationClock] = useState(() => new Date());
  const [lastNotificationsRefresh, setLastNotificationsRefresh] = useState(null);

  const [vehicules, setVehicules] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [factures, setFactures] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [devis, setDevis] = useState([]);

  const pageConfig = {
    "/": {
      title: isTechnicien ? "Mes interventions" : "Dashboard",
      subtitle: isTechnicien
        ? "Interventions affectées à votre compte technicien"
        : "Vue globale de l’activité du garage",
      icon: isTechnicien ? FaTools : FaChartPie,
      accent: "from-slate-950 to-blue-700",
    },
    "/dashboard": {
      title: isTechnicien ? "Mes interventions" : "Dashboard",
      subtitle: isTechnicien
        ? "Interventions affectées à votre compte technicien"
        : "Vue globale de l’activité du garage",
      icon: isTechnicien ? FaTools : FaChartPie,
      accent: "from-slate-950 to-blue-700",
    },
    "/technicien/interventions": {
      title: "Mes interventions",
      subtitle: "Interventions qui vous sont affectées",
      icon: FaTools,
      accent: "from-blue-700 to-cyan-600",
    },
    "/ai": {
      title: "AI Analytics",
      subtitle: "Maintenance prédictive et analyse intelligente",
      icon: FaRobot,
      accent: "from-violet-700 to-indigo-700",
    },
    "/vehicules": {
      title: isTechnicien ? "Véhicules liés" : "Véhicules",
      subtitle: isTechnicien
        ? "Véhicules attachés à vos interventions"
        : "Gestion complète de la flotte",
      icon: FaCar,
      accent: "from-blue-700 to-cyan-600",
    },
    "/interventions": {
      title: isTechnicien ? "Mes interventions" : "Interventions",
      subtitle: isTechnicien
        ? "Suivi des interventions affectées"
        : "Suivi des réparations et maintenances",
      icon: FaTools,
      accent: "from-orange-600 to-red-600",
    },
    "/techniciens": {
      title: "Techniciens",
      subtitle: "Gestion des techniciens et affectations",
      icon: FaUserCog,
      accent: "from-purple-700 to-indigo-700",
    },
    "/clients": {
      title: "Clients",
      subtitle: "Gestion des clients et informations de contact",
      icon: FaIdCard,
      accent: "from-indigo-700 to-blue-700",
    },
    "/devis": {
      title: "Devis",
      subtitle: "Gestion des estimations et propositions",
      icon: FaFileAlt,
      accent: "from-amber-600 to-orange-600",
    },
    "/factures": {
      title: "Factures",
      subtitle: "Suivi financier et documents clients",
      icon: FaFileInvoice,
      accent: "from-sky-700 to-blue-700",
    },
    "/pieces": {
      title: "Pièces",
      subtitle: "Gestion du stock et des composants",
      icon: FaCubes,
      accent: "from-emerald-700 to-teal-600",
    },
    "/achats": {
      title: "Achats",
      subtitle: "Suivi des achats et commandes fournisseurs",
      icon: FaShoppingCart,
      accent: "from-green-700 to-emerald-600",
    },
    "/fournisseurs": {
      title: "Fournisseurs",
      subtitle: "Gestion des fournisseurs et partenaires",
      icon: FaIndustry,
      accent: "from-slate-800 to-slate-600",
    },
    "/users": {
      title: "Utilisateurs",
      subtitle: "Gestion des profils, rôles et accès",
      icon: FaUsers,
      accent: "from-indigo-700 to-blue-700",
    },
    "/rapports": {
      title: "Rapports",
      subtitle: "Analyse, performance et exports professionnels",
      icon: FaChartLine,
      accent: "from-slate-900 to-slate-700",
    },
    "/media": {
      title: "Média",
      subtitle: "Documents, fichiers et ressources",
      icon: FaFolder,
      accent: "from-cyan-700 to-blue-700",
    },
    "/settings": {
      title: "Paramètres",
      subtitle: "Configuration générale de l’application",
      icon: FaCog,
      accent: "from-slate-800 to-slate-600",
    },
    "/profile": {
      title: "Profil",
      subtitle: "Informations personnelles et sécurité du compte",
      icon: FaUser,
      accent: "from-blue-700 to-indigo-700",
    },
  };

  const formatPathTitle = (path) => {
    const cleanPath = path.split("?")[0].split("#")[0];

    if (cleanPath === "/") {
      return isTechnicien ? "Mes interventions" : "Dashboard";
    }

    const lastPart = cleanPath.split("/").filter(Boolean).pop();

    if (!lastPart) {
      return isTechnicien ? "Mes interventions" : "Dashboard";
    }

    return lastPart
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getCurrentPage = () => {
    const pathname = location.pathname;

    if (pageConfig[pathname]) {
      return pageConfig[pathname];
    }

    const matchedEntry = Object.entries(pageConfig)
      .filter(([path]) => path !== "/")
      .sort((a, b) => b[0].length - a[0].length)
      .find(([path]) => pathname.startsWith(path + "/"));

    if (matchedEntry) {
      return matchedEntry[1];
    }

    return {
      title: formatPathTitle(pathname),
      subtitle: isTechnicien
        ? "Espace technicien professionnel"
        : "Espace de gestion professionnel",
      icon: FaHome,
      accent: "from-slate-950 to-blue-700",
    };
  };

  const current = getCurrentPage();
  const Icon = current.icon;

  const fullName =
    `${currentUser?.nom || ""} ${currentUser?.prenom || ""}`.trim() ||
    "Utilisateur";

  const roleLabel = currentUser?.role || "USER";

  const changeLanguage = () => {
    const nextLang =
      i18n.language === "fr" ? "en" : i18n.language === "en" ? "ar" : "fr";

    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Voulez-vous vraiment vous déconnecter ?"
    );

    if (!confirmLogout) return;

    logout();
    setProfileOpen(false);
    setNotifOpen(false);
    navigate("/login", { replace: true });
  };

  const fetchJson = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  };

  const loadNotificationsData = async () => {
    try {
      setLoadingNotif(true);

      if (isTechnicien) {
        const [interventionsData, vehiculesData] = await Promise.all([
          fetchJson(`${API_URL}/api/interventions`),
          fetchJson(`${API_URL}/api/vehicules`),
        ]);

        const allInterventions = interventionsData || [];
        const myInterventions = allInterventions.filter(
          (i) => Number(i.technicien?.id) === Number(currentUser?.id)
        );

        const myVehiculeIds = [
          ...new Set(
            myInterventions
              .map((i) => i.vehicule?.id)
              .filter(Boolean)
              .map(Number)
          ),
        ];

        const myVehicules = (vehiculesData || []).filter((v) =>
          myVehiculeIds.includes(Number(v.id))
        );

        setInterventions(myInterventions);
        setVehicules(myVehicules);
        setPieces([]);
        setFactures([]);
        setDevis([]);

        return;
      }

      const [
        piecesData,
        facturesData,
        devisData,
        interventionsData,
        vehiculesData,
      ] = await Promise.all([
        fetchJson(`${API_URL}/api/pieces`),
        fetchJson(`${API_URL}/api/factures`),
        fetchJson(`${API_URL}/api/devis`),
        fetchJson(`${API_URL}/api/interventions`),
        fetchJson(`${API_URL}/api/vehicules`),
      ]);

      setPieces(piecesData || []);
      setFactures(facturesData || []);
      setDevis(devisData || []);
      setInterventions(interventionsData || []);
      setVehicules(vehiculesData || []);
    } catch (error) {
      console.error("Erreur notifications :", error);
    } finally {
      setLastNotificationsRefresh(new Date());
      setLoadingNotif(false);
    }
  };

  useEffect(() => {
    loadNotificationsData();

    const interval = setInterval(() => {
      loadNotificationsData();
    }, 30000);

    return () => clearInterval(interval);
  }, [isTechnicien, currentUser?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotificationClock(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const closeDropdowns = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeDropdowns);

    return () => document.removeEventListener("mousedown", closeDropdowns);
  }, []);

  const getNotificationDate = (items, fallbackOffsetMinutes = 1) => {
    const fields = [
      "updatedAt",
      "dateModification",
      "createdAt",
      "dateCreation",
      "dateIntervention",
      "dateFacture",
      "dateDevis",
      "dateAchat",
      "date",
    ];

    const dates = (items || [])
      .flatMap((item) => fields.map((field) => item?.[field]))
      .filter(Boolean)
      .map((value) => new Date(value))
      .filter((date) => !Number.isNaN(date.getTime()));

    if (dates.length === 0) {
      return new Date(Date.now() - fallbackOffsetMinutes * 60000).toISOString();
    }

    return new Date(Math.max(...dates.map((date) => date.getTime()))).toISOString();
  };

  const formatNotificationTime = (value) => {
    const date = value ? new Date(value) : new Date();

    if (Number.isNaN(date.getTime())) {
      return "Maintenant";
    }

    const diffMs = notificationClock.getTime() - date.getTime();
    const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

    if (diffMinutes < 1) return "A l'instant";
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Il y a ${diffDays} j`;

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatExactNotificationTime = (value) => {
    const date = value ? new Date(value) : new Date();

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const notifications = useMemo(() => {
    const result = [];

    if (isTechnicien) {
      const pending = interventions.filter((i) => i.statut === "PENDING");
      const inProgress = interventions.filter(
        (i) => i.statut === "IN_PROGRESS"
      );

      const maintenanceVehicules = vehicules.filter(
        (v) => v.statut === "MAINTENANCE"
      );

      if (pending.length > 0) {
        result.push({
          id: "tech-pending-interventions",
          type: "warning",
          icon: <FaClipboardList />,
          title: `${pending.length} intervention(s) en attente`,
          message: "Des interventions vous sont affectées et attendent le démarrage.",
          path: "/technicien/interventions",
        });
      }

      if (inProgress.length > 0) {
        result.push({
          id: "tech-in-progress-interventions",
          type: "info",
          icon: <FaTools />,
          title: `${inProgress.length} intervention(s) en cours`,
          message: "Des réparations sont actuellement en cours dans votre espace.",
          path: "/technicien/interventions",
        });
      }

      if (maintenanceVehicules.length > 0) {
        result.push({
          id: "tech-maintenance-vehicules",
          type: "warning",
          icon: <FaCar />,
          title: `${maintenanceVehicules.length} véhicule(s) en maintenance`,
          message: "Certains véhicules liés à vos interventions sont en maintenance.",
          path: "/vehicules",
        });
      }

      if (result.length === 0) {
        result.push({
          id: "all-good",
          type: "success",
          icon: <FaCheckCircle />,
          title: "Aucune intervention urgente",
          message: "Votre espace technicien est stable pour le moment.",
          path: "/technicien/interventions",
        });
      }

      return result;
    }

    const lowStock = pieces.filter((p) => Number(p.quantiteStock || 0) <= 5);
    const ruptureStock = pieces.filter((p) => Number(p.quantiteStock || 0) <= 0);

    const unpaidFactures = factures.filter((f) => f.statut === "UNPAID");

    const pendingDevis = devis.filter(
      (d) =>
        d.statut === "PENDING" ||
        d.statutClient === "EN_ATTENTE" ||
        !d.statutClient
    );

    const activeInterventions = interventions.filter(
      (i) => i.statut === "PENDING" || i.statut === "IN_PROGRESS"
    );

    const maintenanceVehicules = vehicules.filter(
      (v) => v.statut === "MAINTENANCE"
    );

    if (ruptureStock.length > 0) {
      result.push({
        id: "rupture-stock",
        type: "danger",
        icon: <FaExclamationTriangle />,
        title: `${ruptureStock.length} pièce(s) en rupture`,
        message: "Certaines pièces ont un stock égal à zéro.",
        path: "/pieces",
      });
    }

    if (lowStock.length > 0) {
      result.push({
        id: "low-stock",
        type: "warning",
        icon: <FaCubes />,
        title: `${lowStock.length} pièce(s) en stock critique`,
        message: "Un réapprovisionnement est recommandé.",
        path: "/pieces",
      });
    }

    if (unpaidFactures.length > 0) {
      const total = unpaidFactures.reduce(
        (sum, f) => sum + Number(f.montantTtc || 0),
        0
      );

      result.push({
        id: "unpaid-factures",
        type: "warning",
        icon: <FaFileInvoice />,
        title: `${unpaidFactures.length} facture(s) impayée(s)`,
        message: `Montant à récupérer : ${total.toFixed(2)} DH.`,
        path: "/factures",
      });
    }

    if (pendingDevis.length > 0) {
      result.push({
        id: "pending-devis",
        type: "info",
        icon: <FaClipboardList />,
        title: `${pendingDevis.length} devis en attente`,
        message: "Des devis attendent une validation client ou interne.",
        path: "/devis",
      });
    }

    if (activeInterventions.length > 0) {
      result.push({
        id: "active-interventions",
        type: "info",
        icon: <FaTools />,
        title: `${activeInterventions.length} intervention(s) ouvertes`,
        message: "Des interventions sont encore en attente ou en cours.",
        path: "/interventions",
      });
    }

    if (maintenanceVehicules.length > 0) {
      result.push({
        id: "maintenance-vehicules",
        type: "warning",
        icon: <FaCar />,
        title: `${maintenanceVehicules.length} véhicule(s) en maintenance`,
        message: "Des véhicules ne sont pas disponibles actuellement.",
        path: "/vehicules",
      });
    }

    if (result.length === 0) {
      result.push({
        id: "all-good",
        type: "success",
        icon: <FaCheckCircle />,
        title: "Aucune alerte critique",
        message: "Tout est stable pour le moment.",
        path: "/",
      });
    }

    return result;
  }, [pieces, factures, devis, interventions, vehicules, isTechnicien]);

  const realNotificationCount = notifications.filter(
    (n) => n.id !== "all-good"
  ).length;

  const getNotifStyle = (type) => {
    if (type === "danger") {
      return {
        icon: "bg-red-50 text-red-600 border-red-200",
        dot: "bg-red-500",
        label: "Critique",
      };
    }

    if (type === "warning") {
      return {
        icon: "bg-amber-50 text-amber-600 border-amber-200",
        dot: "bg-amber-500",
        label: "Attention",
      };
    }

    if (type === "success") {
      return {
        icon: "bg-emerald-50 text-emerald-600 border-emerald-200",
        dot: "bg-emerald-500",
        label: "Stable",
      };
    }

    return {
      icon: "bg-blue-50 text-blue-600 border-blue-200",
      dot: "bg-blue-500",
      label: "Info",
    };
  };

  const openNotification = (notif) => {
    setNotifOpen(false);
    navigate(notif.path);
  };

  return (
    <header className="fixed top-0 right-0 left-[var(--sidebar-width,280px)] z-40 px-5 pt-4 transition-all duration-300">
      <div className="relative h-[82px] rounded-[30px] border border-white/70 bg-white/90 backdrop-blur-2xl shadow-[0_18px_60px_rgba(15,23,42,0.10)] overflow-visible">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />

        <div className="h-full px-5 2xl:px-6 flex items-center justify-between gap-5">
          {/* LEFT */}
          <div className="flex items-center gap-4 min-w-0">
            <div
              className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${current.accent} flex items-center justify-center text-white shadow-[0_14px_35px_rgba(37,99,235,0.25)] shrink-0 overflow-hidden`}
            >
              <div className="absolute -top-7 -right-7 w-16 h-16 rounded-full bg-white/20 blur-2xl" />
              <div className="absolute -bottom-7 -left-7 w-16 h-16 rounded-full bg-blue-200/20 blur-2xl" />
              <Icon className="relative text-lg" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[21px] font-black text-slate-950 tracking-tight truncate">
                  {current.title}
                </h1>

                <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">
                  <FaCircle className="text-[7px]" />
                  {isTechnicien ? "Technicien" : "Live"}
                </span>
              </div>

              <p className="text-[13px] text-slate-500 font-medium truncate mt-0.5">
                {current.subtitle}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={changeLanguage}
              className="h-12 min-w-12 px-4 rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              title="Changer la langue"
            >
              <FaGlobe className="text-blue-600" />
              <span className="hidden sm:inline text-xs font-black uppercase">
                {i18n.language}
              </span>
            </button>

            {/* NOTIFICATIONS */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotifOpen((prev) => !prev);
                  setProfileOpen(false);
                }}
                className="relative h-12 w-12 rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                title="Notifications"
              >
                <FaBell />

                {realNotificationCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[23px] h-[23px] rounded-full bg-red-500 border-2 border-white text-[10px] font-black text-white flex items-center justify-center shadow-lg">
                    {realNotificationCount > 9 ? "9+" : realNotificationCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-4 w-[440px] max-w-[calc(100vw-2rem)] rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] overflow-hidden scale-in">
                  <div className="p-5 bg-slate-950 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-black tracking-tight">
                          {isTechnicien
                            ? "Notifications technicien"
                            : "Centre de notifications"}
                        </p>

                        <p className="text-xs text-slate-300 mt-1">
                          {realNotificationCount > 0
                            ? `${realNotificationCount} alerte(s) détectée(s)`
                            : isTechnicien
                            ? "Aucune intervention urgente"
                            : "Votre activité est stable"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={loadNotificationsData}
                          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center transition"
                          title="Actualiser"
                        >
                          <FaSyncAlt
                            className={loadingNotif ? "animate-spin" : ""}
                          />
                        </button>

                        <button
                          onClick={() => setNotifOpen(false)}
                          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center transition"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 max-h-[430px] overflow-y-auto bg-slate-50 custom-scroll">
                    {notifications.map((notif) => {
                      const style = getNotifStyle(notif.type);

                      return (
                        <button
                          key={notif.id}
                          onClick={() => openNotification(notif)}
                          className="group w-full text-left rounded-3xl bg-white border border-slate-200 p-4 mb-2 last:mb-0 transition-all duration-200 hover:shadow-md hover:border-slate-300"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${style.icon}`}
                            >
                              {notif.icon}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`w-2 h-2 rounded-full ${style.dot}`}
                                    />

                                    <p className="text-xs font-black uppercase text-slate-400">
                                      {style.label}
                                    </p>
                                  </div>

                                  <p className="font-black text-slate-900 mt-1 leading-snug">
                                    {notif.title}
                                  </p>
                                </div>

                                <FaArrowRight className="text-slate-300 group-hover:text-slate-700 transition mt-1" />
                              </div>

                              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                                {notif.message}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {!isTechnicien && (
                    <div className="p-4 border-t border-slate-200 bg-white">
                      <button
                        onClick={() => {
                          setNotifOpen(false);
                          navigate("/rapports");
                        }}
                        className="w-full h-12 rounded-2xl bg-slate-950 text-white font-black hover:bg-slate-800 transition shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
                      >
                        Ouvrir les rapports détaillés
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileOpen((prev) => !prev);
                  setNotifOpen(false);
                }}
                className="h-12 pl-2 pr-3 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3"
              >
                <div className="relative">
                  <FaUserCircle className="text-[34px] text-blue-600" />
                  <span className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                <div className="hidden md:block text-left">
                  <p className="text-sm font-black text-slate-950 leading-none max-w-[150px] truncate">
                    {fullName}
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase">
                    {roleLabel}
                  </p>
                </div>

                <FaChevronDown
                  className={`hidden md:block text-xs text-slate-400 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-4 w-80 rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] overflow-hidden scale-in">
                  <div className="relative p-5 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 text-white overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-16 -left-12 w-36 h-36 rounded-full bg-blue-300/20 blur-2xl" />

                    <div className="relative flex items-center gap-4">
                      <div className="relative">
                        <FaUserCircle className="text-6xl text-white/95" />
                        <span className="absolute right-1 bottom-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-black truncate">{fullName}</p>
                        <p className="text-xs text-blue-100 mt-1 truncate">
                          {currentUser?.email || "admin@garageflow.com"}
                        </p>

                        <span className="inline-flex mt-3 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-black uppercase">
                          {roleLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 bg-white">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full rounded-2xl px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-3"
                    >
                      <span className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FaUser />
                      </span>

                      <span>
                        Mon profil
                        <span className="block text-xs font-medium text-slate-400">
                          Informations personnelles
                        </span>
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/settings");
                      }}
                      className="w-full rounded-2xl px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-3"
                    >
                      <span className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <FaCog />
                      </span>

                      <span>
                        Paramètres
                        <span className="block text-xs font-medium text-slate-400">
                          Sécurité et préférences
                        </span>
                      </span>
                    </button>

                    <div className="h-px bg-slate-100 my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full rounded-2xl px-4 py-3 text-left text-sm font-black text-red-600 hover:bg-red-50 transition flex items-center gap-3"
                    >
                      <span className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                        <FaSignOutAlt />
                      </span>

                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
