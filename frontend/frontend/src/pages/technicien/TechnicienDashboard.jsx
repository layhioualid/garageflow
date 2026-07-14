import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser } from "../../services/auth.service";
import { getInterventions } from "../../services/intervention.service";

import {
  FaTools,
  FaCar,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaSyncAlt,
  FaUser,
  FaCalendarAlt,
  FaClipboardList,
  FaArrowRight,
} from "react-icons/fa";

export default function TechnicienDashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [loading, setLoading] = useState(false);
  const [interventions, setInterventions] = useState([]);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getInterventions();
      const all = res?.data || [];

      const mine = all.filter(
        (i) => Number(i.technicien?.id) === Number(currentUser?.id)
      );

      setInterventions(mine);
    } catch (error) {
      console.error("Erreur dashboard technicien :", error);
      setInterventions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      load();
    }
  }, []);

  const stats = useMemo(() => {
    const total = interventions.length;
    const pending = interventions.filter((i) => i.statut === "PENDING").length;
    const inProgress = interventions.filter(
      (i) => i.statut === "IN_PROGRESS"
    ).length;
    const done = interventions.filter((i) => i.statut === "DONE").length;

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
      pending,
      inProgress,
      done,
      vehicules: vehiculeIds.length,
    };
  }, [interventions]);

  const recentInterventions = useMemo(() => {
    return [...interventions]
      .sort((a, b) => new Date(b.dateDebut || 0) - new Date(a.dateDebut || 0))
      .slice(0, 5);
  }, [interventions]);

  const statusLabel = (status) => {
    if (status === "PENDING") return "En attente";
    if (status === "IN_PROGRESS") return "En cours";
    if (status === "DONE") return "Terminée";
    return status || "-";
  };

  const statusStyle = (status) => {
    if (status === "DONE") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (status === "IN_PROGRESS") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("fr-FR");
  };

  const fullName =
    `${currentUser?.nom || ""} ${currentUser?.prenom || ""}`.trim() ||
    "Technicien";

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-6 shadow-sm">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-orange-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaTools className="text-3xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
                <FaUser />
                Espace technicien
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                Bonjour, {fullName}
              </h1>

              <p className="text-slate-500 mt-2 max-w-2xl">
                Voici un résumé de vos interventions affectées, des véhicules
                concernés et de l’avancement de votre travail.
              </p>
            </div>
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-sm disabled:opacity-50"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total interventions"
          value={stats.total}
          icon={<FaClipboardList />}
          color="text-blue-600"
        />

        <StatCard
          title="En attente"
          value={stats.pending}
          icon={<FaClock />}
          color="text-yellow-600"
        />

        <StatCard
          title="En cours"
          value={stats.inProgress}
          icon={<FaExclamationTriangle />}
          color="text-orange-600"
        />

        <StatCard
          title="Terminées"
          value={stats.done}
          icon={<FaCheckCircle />}
          color="text-green-600"
        />

        <StatCard
          title="Véhicules liés"
          value={stats.vehicules}
          icon={<FaCar />}
          color="text-purple-600"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <QuickAction
          icon={<FaTools />}
          title="Mes interventions"
          description="Voir toutes les interventions qui vous sont affectées."
          onClick={() => navigate("/technicien/interventions")}
        />

        <QuickAction
          icon={<FaCar />}
          title="Véhicules liés"
          description="Consulter les véhicules liés à vos interventions."
          onClick={() => navigate("/vehicules")}
        />

        <QuickAction
          icon={<FaUser />}
          title="Mon profil"
          description="Modifier vos informations personnelles."
          onClick={() => navigate("/profile")}
        />
      </div>

      {/* RECENT INTERVENTIONS */}
      <div className="bg-white border border-slate-200 rounded-[30px] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Dernières interventions
            </h2>
            <p className="text-slate-500 mt-1">
              Vos interventions les plus récentes.
            </p>
          </div>

          <button
            onClick={() => navigate("/technicien/interventions")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-bold transition"
          >
            Voir tout
            <FaArrowRight />
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Chargement des interventions...
          </div>
        ) : recentInterventions.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            Aucune intervention ne vous est affectée.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="p-4 text-left">Intervention</th>
                  <th className="p-4 text-left">Véhicule</th>
                  <th className="p-4 text-left">Client</th>
                  <th className="p-4 text-left">Statut</th>
                  <th className="p-4 text-left">Date début</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {recentInterventions.map((i) => (
                  <tr
                    key={i.id}
                    className="border-t border-slate-100 hover:bg-blue-50/40 transition"
                  >
                    <td className="p-4">
                      <p className="font-black text-slate-950">
                        Intervention #{i.id}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {i.typePanne || "Type non défini"}
                      </p>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                          <FaCar />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {i.vehicule?.marque || "-"}{" "}
                            {i.vehicule?.modele || ""}
                          </p>
                          <p className="text-xs text-slate-500">
                            {i.vehicule?.immatriculation || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-slate-900">
                        {i.vehicule?.client?.nom || "-"}{" "}
                        {i.vehicule?.client?.prenom || ""}
                      </p>
                      <p className="text-xs text-slate-500">
                        {i.vehicule?.client?.telephone || "-"}
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-bold ${statusStyle(
                          i.statut
                        )}`}
                      >
                        {statusLabel(i.statut)}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-slate-400" />
                        {formatDate(i.dateDebut)}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/interventions/details/${i.id}`)
                          }
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl inline-flex items-center gap-2 font-semibold transition"
                        >
                          <FaEye />
                          Détails
                        </button>

                        <button
                          onClick={() => navigate(`/interventions/${i.id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl inline-flex items-center gap-2 font-semibold transition"
                        >
                          <FaTools />
                          Travailler
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-semibold">{title}</p>
        <span className={color}>{icon}</span>
      </div>

      <h2 className={`text-3xl font-black mt-3 ${color}`}>{value}</h2>
    </div>
  );
}

function QuickAction({ icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-left hover:shadow-md hover:border-blue-300 transition group"
    >
      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
        {icon}
      </div>

      <h3 className="text-lg font-black text-slate-950 mt-4">{title}</h3>

      <p className="text-sm text-slate-500 mt-1 leading-relaxed">
        {description}
      </p>
    </button>
  );
}