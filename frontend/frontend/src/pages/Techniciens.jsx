import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getTechniciens,
  createTechnicien,
  updateTechnicien,
  deleteTechnicien,
} from "../services/technicien.service";

import { getInterventions } from "../services/intervention.service";

import {
  FaUserCog,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaTools,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
  FaEye,
  FaBriefcase,
  FaUserShield,
} from "react-icons/fa";

export default function Techniciens() {
  const navigate = useNavigate();

  const [techniciens, setTechniciens] = useState([]);
  const [interventions, setInterventions] = useState([]);

  const [search, setSearch] = useState("");
  const [specialiteFilter, setSpecialiteFilter] = useState("ALL");

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    telephone: "",
    specialite: "",
    role: "TECHNICIEN",
  });

  const load = async () => {
    try {
      const [techRes, intRes] = await Promise.all([
        getTechniciens(),
        getInterventions(),
      ]);

      setTechniciens(techRes.data || []);
      setInterventions(intRes.data || []);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement des techniciens");
    }
  };

  useEffect(() => {
    load();
  }, []);

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

  const getTechnicienInterventions = (technicienId) => {
    return interventions.filter(
      (i) => Number(i.technicien?.id) === Number(technicienId)
    );
  };

  const getTechnicienStats = (technicienId) => {
    const items = getTechnicienInterventions(technicienId);

    const total = items.length;
    const done = items.filter((i) => i.statut === "DONE").length;
    const inProgress = items.filter((i) => i.statut === "IN_PROGRESS").length;
    const pending = items.filter((i) => i.statut === "PENDING").length;
    const cost = items.reduce((sum, i) => sum + Number(i.cout || 0), 0);

    const performance = total === 0 ? 0 : Math.round((done / total) * 100);

    return { total, done, inProgress, pending, cost, performance };
  };

  const specialites = useMemo(() => {
    const values = techniciens.map((t) => t.specialite).filter(Boolean);
    return ["ALL", ...new Set(values)];
  }, [techniciens]);

  const filteredTechniciens = useMemo(() => {
    return techniciens.filter((t) => {
      const text = `
        ${t.nom || ""}
        ${t.prenom || ""}
        ${t.email || ""}
        ${t.telephone || ""}
        ${t.specialite || ""}
      `.toLowerCase();

      const matchSearch = text.includes(search.toLowerCase());

      const matchSpecialite =
        specialiteFilter === "ALL" || t.specialite === specialiteFilter;

      return matchSearch && matchSpecialite;
    });
  }, [techniciens, search, specialiteFilter]);

  const globalStats = useMemo(() => {
    const totalTechniciens = techniciens.length;

    const totalInterventions = interventions.filter(
      (i) => i.technicien?.role === "TECHNICIEN" || i.technicien?.id
    ).length;

    const done = interventions.filter((i) => i.statut === "DONE").length;

    const inProgress = interventions.filter(
      (i) => i.statut === "IN_PROGRESS"
    ).length;

    const cost = interventions.reduce(
      (sum, i) => sum + Number(i.cout || 0),
      0
    );

    return {
      totalTechniciens,
      totalInterventions,
      done,
      inProgress,
      cost,
    };
  }, [techniciens, interventions]);

  const resetForm = () => {
    setForm({
      nom: "",
      prenom: "",
      email: "",
      motDePasse: "",
      telephone: "",
      specialite: "",
      role: "TECHNICIEN",
    });

    setEditId(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (t) => {
    setEditId(t.id);

    setForm({
      nom: t.nom || "",
      prenom: t.prenom || "",
      email: t.email || "",
      motDePasse: t.motDePasse || "",
      telephone: t.telephone || "",
      specialite: t.specialite || "",
      role: "TECHNICIEN",
    });

    setOpen(true);
  };

  const save = async () => {
    try {
      const payload = {
        ...form,
        role: "TECHNICIEN",
      };

      if (editId) {
        await updateTechnicien(editId, payload);
      } else {
        await createTechnicien(payload);
      }

      setOpen(false);
      resetForm();
      load();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement du technicien");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer ce technicien ?")) return;

    try {
      await deleteTechnicien(id);
      load();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du technicien");
    }
  };

  const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-purple-200 transition">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{label}</p>
        <span className={color}>{icon}</span>
      </div>

      <h2 className={`text-3xl font-black mt-2 ${color}`}>{value}</h2>
    </div>
  );

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-purple-50 to-slate-50 p-6 shadow-sm">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-3xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-sm">
              <FaUserCog className="text-3xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-3">
                <FaUserShield />
                Équipe maintenance
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                Techniciens
              </h1>

              <p className="text-slate-500 mt-2 max-w-3xl">
                Suivi complet des techniciens, performances, spécialités,
                interventions affectées, coûts gérés et productivité.
              </p>
            </div>
          </div>

          <button
            onClick={openCreate}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm font-semibold transition"
          >
            <FaPlus />
            Nouveau technicien
          </button>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mt-6">
          <StatCard
            label="Techniciens"
            value={globalStats.totalTechniciens}
            icon={<FaUserCog />}
            color="text-purple-600"
          />

          <StatCard
            label="Interventions"
            value={globalStats.totalInterventions}
            icon={<FaTools />}
            color="text-blue-600"
          />

          <StatCard
            label="Terminées"
            value={globalStats.done}
            icon={<FaCheckCircle />}
            color="text-green-600"
          />

          <StatCard
            label="En cours"
            value={globalStats.inProgress}
            icon={<FaClock />}
            color="text-yellow-600"
          />

          <StatCard
            label="Coût géré"
            value={money(globalStats.cost)}
            icon={<FaMoneyBillWave />}
            color="text-emerald-600"
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between shadow-sm">
        <div>
          <h2 className="font-bold flex items-center gap-2 text-slate-900">
            <FaSearch className="text-purple-600" />
            Recherche et filtres
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Recherchez par nom, email, téléphone ou spécialité.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher technicien..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
            />
          </div>

          <select
            value={specialiteFilter}
            onChange={(e) => setSpecialiteFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition min-w-[220px]"
          >
            {specialites.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "Toutes les spécialités" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GRID */}
      {filteredTechniciens.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            <FaSearch className="text-2xl text-slate-400" />
          </div>
          Aucun technicien trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTechniciens.map((t) => {
            const techStats = getTechnicienStats(t.id);
            const techInterventions = getTechnicienInterventions(t.id);

            return (
              <div
                key={t.id}
                onClick={() => navigate(`/techniciens/${t.id}`)}
                className="group bg-white border border-slate-200 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-purple-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-sm">
                      {(t.nom || "T").charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h2 className="font-black text-xl text-slate-900 group-hover:text-purple-600 transition">
                        {t.nom || "-"} {t.prenom || ""}
                      </h2>

                      <p className="text-slate-500 text-sm mt-1">
                        {t.specialite || "Technicien maintenance"}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                    ID #{t.id}
                  </span>
                </div>

                <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FaEnvelope className="text-purple-600" />
                    {t.email || "Email non défini"}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FaPhone className="text-green-600" />
                    {t.telephone || "Téléphone non défini"}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FaBriefcase className="text-blue-600" />
                    {t.specialite || "Spécialité non définie"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <p className="text-xs text-slate-500">Total</p>
                    <p className="font-black text-2xl text-blue-600 mt-1">
                      {techStats.total}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <p className="text-xs text-slate-500">Done</p>
                    <p className="font-black text-2xl text-green-600 mt-1">
                      {techStats.done}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <p className="text-xs text-slate-500">Perf.</p>
                    <p className="font-black text-2xl text-purple-600 mt-1">
                      {techStats.performance}%
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                    <FaTools />
                    Dernières interventions
                  </p>

                  {techInterventions.length > 0 ? (
                    <div className="space-y-2">
                      {techInterventions.slice(0, 2).map((i) => (
                        <div
                          key={i.id}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              #{i.id} - {i.typePanne || "Intervention"}
                            </p>

                            <span
                              className={`shrink-0 text-[10px] px-2 py-1 rounded-full border ${statusColor(
                                i.statut
                              )}`}
                            >
                              {statusLabel(i.statut)}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 mt-1">
                            {i.vehicule?.immatriculation || "-"} •{" "}
                            {formatDate(i.dateDebut)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Aucune intervention affectée
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/techniciens/${t.id}`);
                    }}
                    className="text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-xl transition flex items-center gap-2 text-sm"
                  >
                    <FaEye />
                    Détails
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(t);
                    }}
                    className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl transition flex items-center gap-2 text-sm"
                  >
                    <FaEdit />
                    Modifier
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(t.id);
                    }}
                    className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition flex items-center gap-2 text-sm"
                  >
                    <FaTrash />
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL CREATE / EDIT */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="relative overflow-hidden border-b border-slate-200 p-6 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black flex items-center gap-3 text-slate-950">
                    <FaUserCog className="text-purple-600" />
                    {editId ? "Modifier technicien" : "Nouveau technicien"}
                  </h2>

                  <p className="text-slate-500 text-sm mt-1">
                    Informations du profil technicien
                  </p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Nom"
                  value={form.nom}
                  onChange={(value) => setForm({ ...form, nom: value })}
                  placeholder="Nom"
                />

                <InputField
                  label="Prénom"
                  value={form.prenom}
                  onChange={(value) => setForm({ ...form, prenom: value })}
                  placeholder="Prénom"
                />
              </div>

              <InputField
                label="Email"
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
                placeholder="technicien@mail.com"
              />

              {!editId && (
                <InputField
                  label="Mot de passe"
                  type="password"
                  value={form.motDePasse}
                  onChange={(value) =>
                    setForm({ ...form, motDePasse: value })
                  }
                  placeholder="Mot de passe"
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Téléphone"
                  value={form.telephone}
                  onChange={(value) =>
                    setForm({ ...form, telephone: value })
                  }
                  placeholder="+212..."
                />

                <InputField
                  label="Spécialité"
                  value={form.specialite}
                  onChange={(value) =>
                    setForm({ ...form, specialite: value })
                  }
                  placeholder="Mécanique, diagnostic..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
              >
                Annuler
              </button>

              <button
                onClick={save}
                className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition font-semibold"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
      />
    </div>
  );
}