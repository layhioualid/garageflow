import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/user.service";

import {
  FaUser,
  FaUserTie,
  FaTools,
  FaPlus,
  FaSearch,
  FaTrash,
  FaEdit,
  FaTimes,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";

export default function Users() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    role: "TECHNICIEN",
    telephone: "",
  });

  const load = async () => {
    const res = await getUsers();
    setList(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setForm({
      nom: "",
      prenom: "",
      email: "",
      motDePasse: "",
      role: "TECHNICIEN",
      telephone: "",
    });
    setEditId(null);
  };

  const save = async () => {
    if (editId) {
      await updateUser(editId, form);
    } else {
      await createUser(form);
    }

    reset();
    setOpen(false);
    load();
  };

  const remove = async () => {
    await deleteUser(confirm);
    setConfirm(null);
    load();
  };

  const edit = (u) => {
    setEditId(u.id);
    setForm({
      nom: u.nom || "",
      prenom: u.prenom || "",
      email: u.email || "",
      motDePasse: "",
      role: u.role || "TECHNICIEN",
      telephone: u.telephone || "",
    });
    setOpen(true);
  };

  const filtered = list
    .filter((u) => (filter === "ALL" ? true : u.role === filter))
    .filter((u) =>
      `${u.nom || ""} ${u.prenom || ""} ${u.email || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const roleStyle = (role) => {
    switch (role) {
      case "TECHNICIEN":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "GESTIONNAIRE":
        return "bg-green-50 text-green-700 border-green-200";
      case "ADMIN":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const avatar = (u) => {
    return `${u.nom?.[0] || ""}${u.prenom?.[0] || ""}`.toUpperCase() || "U";
  };

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-6 shadow-sm">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-purple-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaUsers className="text-2xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <FaShieldAlt />
                Gestion des accès
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950">
                Utilisateurs
              </h1>

              <p className="text-slate-500 mt-2 max-w-2xl">
                Gérez les comptes utilisateurs du système, leurs rôles, leurs
                informations de contact et leurs accès à la plateforme.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              reset();
              setOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm font-semibold transition"
          >
            <FaPlus />
            Nouvel utilisateur
          </button>
        </div>

        {/* STATS */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <StatCard
            title="Total utilisateurs"
            value={list.length}
            icon={<FaUser />}
            color="text-blue-600"
          />

          <StatCard
            title="Techniciens"
            value={list.filter((u) => u.role === "TECHNICIEN").length}
            icon={<FaTools />}
            color="text-green-600"
          />

          <StatCard
            title="Gestionnaires"
            value={list.filter((u) => u.role === "GESTIONNAIRE").length}
            icon={<FaUserTie />}
            color="text-purple-600"
          />
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between shadow-sm">
        <div>
          <h2 className="font-bold flex items-center gap-2 text-slate-900">
            <FaSearch className="text-blue-600" />
            Recherche et filtres
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Recherchez par nom, prénom ou email, puis filtrez par rôle.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              placeholder="Rechercher utilisateur..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filter}
            className="bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition min-w-[200px]"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">Tous les rôles</option>
            <option value="TECHNICIEN">TECHNICIEN</option>
            <option value="GESTIONNAIRE">GESTIONNAIRE</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[850px]">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4 text-left">Utilisateur</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Rôle</th>
                <th className="p-4 text-left">Téléphone</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-black shadow-sm">
                          {avatar(u)}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {u.nom || "-"} {u.prenom || ""}
                          </p>

                          <p className="text-xs text-slate-400">
                            ID #{u.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600">{u.email || "-"}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border font-semibold ${roleStyle(
                          u.role
                        )}`}
                      >
                        {u.role || "-"}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600">
                      {u.telephone || "-"}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => edit(u)}
                          className="text-yellow-600 hover:bg-yellow-50 p-3 rounded-xl transition"
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => setConfirm(u.id)}
                          className="text-red-600 hover:bg-red-50 p-3 rounded-xl transition"
                          title="Supprimer"
                        >
                          <FaTrash />
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

      {/* MODAL FORM */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-blue-600">
                  <FaUser />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {editId ? "Modifier utilisateur" : "Créer utilisateur"}
                  </h2>

                  <p className="text-sm text-slate-500">
                    Gestion des utilisateurs système
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField
                  label="Nom"
                  value={form.nom}
                  onChange={(value) => setForm({ ...form, nom: value })}
                />

                <InputField
                  label="Prénom"
                  value={form.prenom}
                  onChange={(value) => setForm({ ...form, prenom: value })}
                />
              </div>

              <InputField
                label="Email"
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
              />

              {!editId && (
                <InputField
                  label="Mot de passe"
                  type="password"
                  value={form.motDePasse}
                  onChange={(value) =>
                    setForm({ ...form, motDePasse: value })
                  }
                />
              )}

              <InputField
                label="Téléphone"
                value={form.telephone}
                onChange={(value) => setForm({ ...form, telephone: value })}
              />

              <div>
                <label className="text-sm text-slate-500 block mb-2">
                  Rôle
                </label>

                <select
                  className="w-full p-3 bg-white border border-slate-200 text-slate-900 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="TECHNICIEN">TECHNICIEN</option>
                  <option value="GESTIONNAIRE">GESTIONNAIRE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition font-semibold"
              >
                Annuler
              </button>

              <button
                onClick={save}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition font-semibold"
              >
                {editId ? "Modifier" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      {confirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center space-y-5 shadow-2xl max-w-md w-full">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
              <FaTrash />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-950">
                Supprimer utilisateur
              </h2>

              <p className="text-slate-500 mt-2">
                Êtes-vous sûr de vouloir supprimer cet utilisateur ?
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition font-semibold"
              >
                Annuler
              </button>

              <button
                onClick={remove}
                className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition font-semibold"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{title}</p>
        <span className={color}>{icon}</span>
      </div>

      <h2 className={`text-3xl font-black mt-2 ${color}`}>{value}</h2>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-slate-500 block mb-2">{label}</label>

      <input
        type={type}
        value={value}
        className="w-full p-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}