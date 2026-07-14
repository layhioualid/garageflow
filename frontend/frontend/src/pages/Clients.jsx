import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../services/client.service";

import {
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaSyncAlt,
  FaIdCard,
  FaEye,
  FaWhatsapp,
  FaCar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFilter,
  FaArrowRight,
  FaChartLine,
  FaClipboardList,
} from "react-icons/fa";

export default function Clients() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [loading, setLoading] = useState(false);

  const emptyForm = {
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
  };

  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getClients();
      setClients(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement des clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (client) => {
    setEditId(client.id);
    setForm({
      nom: client.nom || "",
      prenom: client.prenom || "",
      email: client.email || "",
      telephone: client.telephone || "",
      adresse: client.adresse || "",
    });
    setOpen(true);
  };

  const save = async () => {
    try {
      if (!form.nom.trim() || !form.email.trim()) {
        alert("Veuillez saisir au moins le nom et l'email du client.");
        return;
      }

      const payload = {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim(),
        telephone: form.telephone.trim(),
        adresse: form.adresse.trim(),
      };

      if (editId) {
        await updateClient(editId, payload);
      } else {
        await createClient(payload);
      }

      resetForm();
      setOpen(false);
      await load();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement du client.");
    }
  };

  const remove = async () => {
    try {
      await deleteClient(confirmDelete);
      setConfirmDelete(null);
      await load();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du client.");
    }
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

  const getClientFullName = (client) => {
  if (!client) return "Client non associé";

  return `${client.nom || ""} ${client.prenom || ""}`.trim() || "Client non associé";
};

  const openWhatsApp = (client) => {
    if (!client?.telephone) {
      alert("Ce client n'a pas de numéro de téléphone.");
      return;
    }

    const phone = normalizePhoneForWhatsApp(client.telephone);

    const message =
      `Bonjour ${getClientFullName(client)},\n\n` +
      `Nous vous contactons depuis GarageFlow+ concernant le suivi de votre dossier véhicule.\n\n` +
      `Cordialement,\nGarageFlow+`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const openGmail = (client) => {
    if (!client?.email) {
      alert("Ce client n'a pas d'adresse email.");
      return;
    }

    const subject = "Suivi de votre dossier véhicule - GarageFlow+";

    const body =
      `Bonjour ${getClientFullName(client)},\n\n` +
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

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const text = `
        ${client.nom || ""}
        ${client.prenom || ""}
        ${client.email || ""}
        ${client.telephone || ""}
        ${client.adresse || ""}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [clients, search]);

  const stats = useMemo(() => {
    const total = clients.length;
    const withEmail = clients.filter((c) => c.email).length;
    const withPhone = clients.filter((c) => c.telephone).length;
    const complete = clients.filter(
      (c) => c.nom && c.email && c.telephone && c.adresse
    ).length;

    return {
      total,
      withEmail,
      withPhone,
      complete,
    };
  }, [clients]);

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 shadow-sm">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-purple-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaUsers className="text-3xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <FaIdCard />
                Gestion relation client
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                Clients
              </h1>

              <p className="text-slate-500 mt-2 max-w-3xl">
                Gérez les propriétaires des véhicules, leurs coordonnées,
                l’historique de contact et préparez l’envoi des liens de
                validation des devis.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={load}
              disabled={loading}
              className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition border border-slate-200 shadow-sm disabled:opacity-50"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Actualiser
            </button>

            <button
              onClick={openCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm font-semibold transition"
            >
              <FaUserPlus />
              Nouveau client
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <StatCard
            label="Total clients"
            value={stats.total}
            icon={<FaUsers />}
            color="text-blue-600"
          />

          <StatCard
            label="Avec email"
            value={stats.withEmail}
            icon={<FaEnvelope />}
            color="text-green-600"
          />

          <StatCard
            label="Avec téléphone"
            value={stats.withPhone}
            icon={<FaPhone />}
            color="text-purple-600"
          />

          <StatCard
            label="Profils complets"
            value={stats.complete}
            icon={<FaCheckCircle />}
            color="text-emerald-600"
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between shadow-sm">
        <div>
          <h2 className="font-bold flex items-center gap-2 text-slate-900">
            <FaFilter className="text-blue-600" />
            Recherche et filtrage
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Recherchez par nom, prénom, email, téléphone ou adresse.
          </p>
        </div>

        <div className="relative w-full xl:w-[460px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher client..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Chargement des clients...
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            <FaSearch className="text-2xl text-slate-400" />
          </div>
          Aucun client trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const isComplete =
              client.nom && client.email && client.telephone && client.adresse;

            return (
              <div
                key={client.id}
                onClick={() => navigate(`/clients/${client.id}`)}
                className="group bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
                      {(client.nom || "C").charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-black text-xl text-slate-950 group-hover:text-blue-600 transition truncate">
                        {client.nom || "-"} {client.prenom || ""}
                      </h2>

                      <p className="text-slate-500 text-sm mt-1">
                        Client propriétaire
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full border text-xs font-semibold ${
                      isComplete
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-yellow-50 border-yellow-200 text-yellow-700"
                    }`}
                  >
                    {isComplete ? "Complet" : "À compléter"}
                  </span>
                </div>

                <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <InfoLine
                    icon={<FaEnvelope />}
                    label="Email"
                    value={client.email || "Email non défini"}
                    color="text-blue-600"
                  />

                  <InfoLine
                    icon={<FaPhone />}
                    label="Téléphone"
                    value={client.telephone || "Téléphone non défini"}
                    color="text-green-600"
                  />

                  <InfoLine
                    icon={<FaMapMarkerAlt />}
                    label="Adresse"
                    value={client.adresse || "Adresse non définie"}
                    color="text-yellow-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <MiniAction
                    icon={<FaEnvelope />}
                    label="Gmail"
                    color="text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      openGmail(client);
                    }}
                  />

                  <MiniAction
                    icon={<FaWhatsapp />}
                    label="WhatsApp"
                    color="text-green-600 bg-green-50 border-green-200 hover:bg-green-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      openWhatsApp(client);
                    }}
                  />

                  <MiniAction
                    icon={<FaEye />}
                    label="Détails"
                    color="text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/clients/${client.id}`);
                    }}
                  />
                </div>

                <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(client);
                    }}
                    className="text-yellow-700 hover:bg-yellow-50 px-3 py-2 rounded-xl transition flex items-center gap-2 text-sm"
                  >
                    <FaEdit />
                    Modifier
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(client.id);
                    }}
                    className="text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition flex items-center gap-2 text-sm"
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

      {/* MODAL CREATE/EDIT */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950 flex items-center gap-3">
                  <FaUser className="text-blue-600" />
                  {editId ? "Modifier client" : "Nouveau client"}
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Informations du client propriétaire du véhicule.
                </p>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Nom"
                  value={form.nom}
                  onChange={(value) => setForm({ ...form, nom: value })}
                  placeholder="Nom du client"
                />

                <InputField
                  label="Prénom"
                  value={form.prenom}
                  onChange={(value) => setForm({ ...form, prenom: value })}
                  placeholder="Prénom du client"
                />
              </div>

              <InputField
                label="Email"
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
                placeholder="client@email.com"
              />

              <InputField
                label="Téléphone"
                value={form.telephone}
                onChange={(value) => setForm({ ...form, telephone: value })}
                placeholder="+212..."
              />

              <InputField
                label="Adresse"
                value={form.adresse}
                onChange={(value) => setForm({ ...form, adresse: value })}
                placeholder="Adresse du client"
              />
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition font-semibold"
              >
                Annuler
              </button>

              <button
                onClick={save}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition font-semibold flex items-center gap-2"
              >
                <FaSave />
                {editId ? "Modifier" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center space-y-5 shadow-2xl max-w-md w-full">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
              <FaTrash />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-950">
                Supprimer client
              </h2>

              <p className="text-slate-500 mt-2">
                Êtes-vous sûr de vouloir supprimer ce client ?
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
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

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{label}</p>
        <span className={color}>{icon}</span>
      </div>

      <h2 className={`text-3xl font-black mt-2 ${color}`}>{value}</h2>
    </div>
  );
}

function MiniAction({ icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`border rounded-2xl py-3 flex flex-col items-center justify-center gap-1 text-xs font-semibold transition ${color}`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}

function InfoLine({ icon, label, value, color }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className={`${color} mt-0.5`}>{icon}</span>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-semibold text-slate-800 break-words">{value}</p>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-slate-500 block mb-2">{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
      />
    </div>
  );
}