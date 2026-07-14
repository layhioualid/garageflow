import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTools,
  FaCar,
  FaUser,
  FaEye,
  FaSearch,
  FaSyncAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

import { getCurrentUser } from "../../services/auth.service";
import { getInterventions } from "../../services/intervention.service";

export default function TechnicienInterventions() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const load = async () => {
    try {
      setLoading(true);

      const res = await getInterventions();
      const all = res.data || [];

      const mine = all.filter(
        (i) => Number(i.technicien?.id) === Number(currentUser?.id)
      );

      setInterventions(mine);
    } catch (error) {
      console.error("Erreur chargement interventions technicien :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      load();
    }
  }, []);

  const filtered = useMemo(() => {
    return interventions.filter((i) => {
      const text = `
        ${i.id || ""}
        ${i.typePanne || ""}
        ${i.description || ""}
        ${i.statut || ""}
        ${i.vehicule?.immatriculation || ""}
        ${i.vehicule?.marque || ""}
        ${i.vehicule?.modele || ""}
        ${i.vehicule?.client?.nom || ""}
        ${i.vehicule?.client?.prenom || ""}
      `.toLowerCase();

      const matchSearch = text.includes(search.toLowerCase());
      const matchFilter = filter === "ALL" || i.statut === filter;

      return matchSearch && matchFilter;
    });
  }, [interventions, search, filter]);

  const statusLabel = (status) => {
    if (status === "DONE") return "Terminée";
    if (status === "IN_PROGRESS") return "En cours";
    if (status === "PENDING") return "En attente";
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

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-6 shadow-sm">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaTools className="text-3xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
                Espace technicien
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                Mes interventions
              </h1>

              <p className="text-slate-500 mt-2 max-w-2xl">
                Retrouvez uniquement les interventions qui vous sont affectées.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total"
          value={interventions.length}
          icon={<FaTools />}
          color="text-blue-600"
        />

        <StatCard
          label="En attente"
          value={interventions.filter((i) => i.statut === "PENDING").length}
          icon={<FaClock />}
          color="text-yellow-600"
        />

        <StatCard
          label="Terminées"
          value={interventions.filter((i) => i.statut === "DONE").length}
          icon={<FaCheckCircle />}
          color="text-green-600"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between shadow-sm">
        <div>
          <h2 className="font-bold flex items-center gap-2 text-slate-900">
            <FaSearch className="text-blue-600" />
            Recherche
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Rechercher par véhicule, client, panne ou statut.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full md:w-96 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="DONE">Terminée</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-4 text-left">Intervention</th>
                <th className="p-4 text-left">Véhicule</th>
                <th className="p-4 text-left">Client</th>
                <th className="p-4 text-left">Statut</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500">
                    Aucune intervention trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map((i) => (
                  <tr
                    key={i.id}
                    className="border-t border-slate-100 hover:bg-blue-50/40 transition"
                  >
                    <td className="p-4">
                      <p className="font-black text-slate-950">
                        Intervention #{i.id}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {i.typePanne || "-"}
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
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                          <FaUser />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {i.vehicule?.client?.nom || "-"}{" "}
                            {i.vehicule?.client?.prenom || ""}
                          </p>
                          <p className="text-xs text-slate-500">
                            {i.vehicule?.client?.telephone || "-"}
                          </p>
                        </div>
                      </div>
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
                      {i.dateDebut
                        ? new Date(i.dateDebut).toLocaleString("fr-FR")
                        : "-"}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-semibold">{label}</p>
        <span className={color}>{icon}</span>
      </div>

      <h2 className={`text-3xl font-black mt-3 ${color}`}>{value}</h2>
    </div>
  );
}