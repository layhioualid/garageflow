import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getFactures,
  updateFacture,
  deleteFacture,
  downloadFacturePdf,
} from "../services/facture.service";

import {
  FaFileInvoice,
  FaTrash,
  FaDownload,
  FaPrint,
  FaEdit,
  FaSearch,
  FaTimes,
  FaSyncAlt,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaReceipt,
  FaEye,
  FaCar,
  FaTools,
  FaUser,
  FaCubes,
  FaEnvelope,
  FaWhatsapp,
  FaPaperPlane,
  FaCopy,
  FaExternalLinkAlt,
  FaFilter,
  FaUserCog,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";

const API_URL = "http://localhost:8080";

export default function Factures() {
  const navigate = useNavigate();

  const [factures, setFactures] = useState([]);
  const [editing, setEditing] = useState(null);
  const [selectedFacture, setSelectedFacture] = useState(null);

  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [factureToSend, setFactureToSend] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [form, setForm] = useState({
    numero: "",
    dateFacture: "",
    montantHt: "",
    tva: "",
    montantTtc: "",
    statut: "UNPAID",
  });

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 3500);
  };

  const load = async () => {
    try {
      setLoading(true);
      const res = await getFactures();
      setFactures(res.data || []);
    } catch (error) {
      console.error(error);
      showMessage("Erreur lors du chargement des factures.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 16);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("fr-FR");
  };

  const money = (value) => `${Number(value || 0).toFixed(2)} DH`;

  const getClient = (facture) => {
    return facture?.intervention?.vehicule?.client || null;
  };

  const getClientFullName = (client) => {
    if (!client) return "client";
    return `${client.nom || ""} ${client.prenom || ""}`.trim() || "client";
  };

  const getVehicleLabel = (facture) => {
    const v = facture?.intervention?.vehicule;

    if (!v) return "véhicule non défini";

    return `${v.marque || ""} ${v.modele || ""} - ${
      v.immatriculation || ""
    }`.trim();
  };

  const getFactureViewLink = (facture) => {
    return `${API_URL}/api/factures/${facture.id}/print`;
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

  const openSendModal = (facture) => {
    setFactureToSend(facture);
    setSendModalOpen(true);
  };

  const sendByWhatsApp = (facture) => {
    const client = getClient(facture);

    if (!client?.telephone) {
      showMessage("Le client n'a pas de numéro de téléphone.", "error");
      return;
    }

    const phone = normalizePhoneForWhatsApp(client.telephone);

    const text =
      `Bonjour ${getClientFullName(client)},\n\n` +
      `Votre facture ${facture.numero || `#${facture.id}`} est prête.\n\n` +
      `Véhicule : ${getVehicleLabel(facture)}\n` +
      `Montant TTC : ${money(facture.montantTtc)}\n\n` +
      `Vous pouvez consulter votre facture ici :\n` +
      `${getFactureViewLink(facture)}\n\n` +
      `Cordialement,\nGarageFlow+`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const sendByGmail = (facture) => {
    const client = getClient(facture);

    if (!client?.email) {
      showMessage("Le client n'a pas d'adresse email.", "error");
      return;
    }

    const subject = `Votre facture ${
      facture.numero || `#${facture.id}`
    } - GarageFlow+`;

    const body =
      `Bonjour ${getClientFullName(client)},\n\n` +
      `Votre facture ${facture.numero || `#${facture.id}`} est prête.\n\n` +
      `Véhicule : ${getVehicleLabel(facture)}\n` +
      `Montant HT : ${money(facture.montantHt)}\n` +
      `TVA : ${money(facture.tva)}\n` +
      `Montant TTC : ${money(facture.montantTtc)}\n` +
      `Statut : ${statusLabel(facture.statut)}\n\n` +
      `Lien de consultation de la facture :\n` +
      `${getFactureViewLink(facture)}\n\n` +
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

  const copyFactureViewLink = async (facture) => {
    try {
      await navigator.clipboard.writeText(getFactureViewLink(facture));
      showMessage(
        "Lien de consultation de la facture copié avec succès.",
        "success"
      );
    } catch (error) {
      console.error(error);
      showMessage("Impossible de copier le lien de consultation.", "error");
    }
  };

  const openFactureViewLink = (facture) => {
    window.open(getFactureViewLink(facture), "_blank");
  };

  const statusBadge = (statut) => {
    if (statut === "PAID") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  const statusLabel = (statut) => {
    if (statut === "PAID") return "Payée";
    return "Non payée";
  };

  const filteredFactures = useMemo(() => {
    return factures
      .filter((f) => {
        const client = getClient(f);

        const text = `
          ${f.numero || ""}
          ${f.id || ""}
          ${f.intervention?.id || ""}
          ${f.intervention?.typePanne || ""}
          ${f.intervention?.vehicule?.immatriculation || ""}
          ${f.intervention?.vehicule?.marque || ""}
          ${f.intervention?.vehicule?.modele || ""}
          ${client?.nom || ""}
          ${client?.prenom || ""}
          ${client?.email || ""}
          ${client?.telephone || ""}
          ${f.statut || ""}
        `.toLowerCase();

        const matchSearch = text.includes(search.toLowerCase());
        const matchFilter = filter === "ALL" || f.statut === filter;

        return matchSearch && matchFilter;
      })
      .sort((a, b) => {
        const dateA = new Date(a.dateFacture || a.createdAt || 0);
        const dateB = new Date(b.dateFacture || b.createdAt || 0);

        return dateB - dateA;
      });
  }, [factures, search, filter]);

  const stats = useMemo(() => {
    const total = factures.reduce(
      (sum, f) => sum + Number(f.montantTtc || 0),
      0
    );

    const paidItems = factures.filter((f) => f.statut === "PAID");
    const unpaidItems = factures.filter((f) => f.statut === "UNPAID");

    const paid = paidItems.reduce(
      (sum, f) => sum + Number(f.montantTtc || 0),
      0
    );

    const unpaid = unpaidItems.reduce(
      (sum, f) => sum + Number(f.montantTtc || 0),
      0
    );

    return {
      total,
      paid,
      unpaid,
      count: factures.length,
      paidCount: paidItems.length,
      unpaidCount: unpaidItems.length,
    };
  }, [factures]);

  const changeStatut = async (facture, statut) => {
    try {
      await updateFacture(facture.id, {
        numero: facture.numero,
        dateFacture: facture.dateFacture,
        montantHt: Number(facture.montantHt || 0),
        tva: Number(facture.tva || 0),
        montantTtc: Number(facture.montantTtc || 0),
        statut,
      });

      showMessage("État de la facture mis à jour.", "success");
      await load();
    } catch (error) {
      console.error("Erreur changement état facture :", error);
      showMessage("Erreur lors de la modification de l'état.", "error");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer cette facture ?")) return;

    try {
      await deleteFacture(id);

      if (selectedFacture?.id === id) {
        setSelectedFacture(null);
      }

      showMessage("Facture supprimée avec succès.", "success");
      load();
    } catch (error) {
      console.error(error);
      showMessage("Erreur lors de la suppression de la facture.", "error");
    }
  };

  const openEdit = (f) => {
    setEditing(f);

    setForm({
      numero: f.numero || "",
      dateFacture: formatDateForInput(f.dateFacture),
      montantHt: f.montantHt || 0,
      tva: f.tva || 0,
      montantTtc: f.montantTtc || 0,
      statut: f.statut || "UNPAID",
    });
  };

  const handleMontantChange = (field, value) => {
    const updated = {
      ...form,
      [field]: value,
    };

    const ht = Number(field === "montantHt" ? value : updated.montantHt || 0);
    const tva = Number(field === "tva" ? value : updated.tva || 0);

    updated.montantTtc = ht + tva;

    setForm(updated);
  };

  const saveEdit = async () => {
    try {
      await updateFacture(editing.id, {
        ...form,
        dateFacture: form.dateFacture,
        montantHt: Number(form.montantHt),
        tva: Number(form.tva),
        montantTtc: Number(form.montantTtc),
      });

      setEditing(null);
      showMessage("Facture modifiée avec succès.", "success");
      load();
    } catch (error) {
      console.error(error);
      showMessage("Erreur lors de la modification de la facture.", "error");
    }
  };

  const printFacture = (id) => {
    window.open(`${API_URL}/api/factures/${id}/print`, "_blank");
  };

  const DetailItem = ({ label, value, color = "text-slate-900" }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`font-semibold break-words ${color}`}>{value || "-"}</p>
    </div>
  );

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-6 shadow-sm">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-emerald-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaFileInvoice className="text-3xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <FaChartLine />
                Gestion financière & facturation client
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                Factures
              </h1>

              <p className="text-slate-500 mt-2 max-w-3xl">
                Gérez les factures générées depuis les interventions, suivez les
                paiements, envoyez les factures aux clients et centralisez les
                actions PDF, impression, Gmail et WhatsApp.
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
              onClick={() => navigate("/devis")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-sm"
            >
              <FaReceipt />
              Voir devis
            </button>
          </div>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mt-6">
          <StatCard
            label="Nombre factures"
            value={stats.count}
            icon={<FaFileInvoice />}
            color="text-slate-900"
          />

          <StatCard
            label="Total facturé"
            value={money(stats.total)}
            icon={<FaMoneyBillWave />}
            color="text-blue-600"
          />

          <StatCard
            label="Total payé"
            value={money(stats.paid)}
            icon={<FaCheckCircle />}
            color="text-green-600"
          />

          <StatCard
            label="Total impayé"
            value={money(stats.unpaid)}
            icon={<FaClock />}
            color="text-yellow-600"
          />

          <StatCard
            label="Factures impayées"
            value={stats.unpaidCount}
            icon={<FaExclamationTriangle />}
            color="text-red-600"
          />
        </div>
      </div>

      {message && (
        <div
          className={`px-5 py-4 rounded-2xl border flex items-center justify-between gap-4 shadow-sm ${
            messageType === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center gap-3 font-medium">
            {messageType === "success" ? <FaCheckCircle /> : <FaTimes />}
            <span>{message}</span>
          </div>

          <button
            onClick={() => setMessage("")}
            className="text-slate-400 hover:text-slate-700 transition"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between shadow-sm">
        <div>
          <h2 className="font-bold flex items-center gap-2 text-slate-900">
            <FaFilter className="text-blue-600" />
            Recherche et filtres
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Filtrez par numéro, intervention, véhicule, client ou statut de
            paiement.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
          <div className="relative w-full md:w-[440px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher facture, client, véhicule..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition min-w-[190px]"
          >
            <option value="ALL">Toutes les factures</option>
            <option value="PAID">Payées</option>
            <option value="UNPAID">Non payées</option>
          </select>
        </div>
      </div>

      {/* TABLEAU PRINCIPAL */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Chargement des factures...
        </div>
      ) : filteredFactures.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Aucune facture trouvée.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white">
            <div>
              <h2 className="text-lg font-black text-slate-950 flex items-center gap-2">
                <FaFileInvoice className="text-blue-600" />
                Liste des factures
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Les actions principales restent visibles. Les autres actions sont dans le modal de détails.
              </p>
            </div>

            <div className="text-sm text-slate-500">
              {filteredFactures.length} résultat{filteredFactures.length > 1 ? "s" : ""}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-5 py-4 text-left font-bold">Facture</th>
                  <th className="px-5 py-4 text-left font-bold">Client</th>
                  <th className="px-5 py-4 text-left font-bold">Véhicule</th>
                  <th className="px-5 py-4 text-left font-bold">Intervention</th>
                  <th className="px-5 py-4 text-right font-bold">Montant TTC</th>
                  <th className="px-5 py-4 text-left font-bold">Statut</th>
                  <th className="px-5 py-4 text-left font-bold">Date</th>
                  <th className="px-5 py-4 text-right font-bold">Actions principales</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredFactures.map((f) => {
                  const client = getClient(f);
                  const vehicule = f.intervention?.vehicule;

                  return (
                    <tr
                      key={f.id}
                      onClick={() => setSelectedFacture(f)}
                      className="group hover:bg-blue-50/40 transition cursor-pointer"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                            <FaFileInvoice />
                          </div>
                          <div>
                            <p className="font-black text-slate-950 group-hover:text-blue-600 transition">
                              {f.numero || `Facture #${f.id}`}
                            </p>
                            <p className="text-xs text-slate-500">ID #{f.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {client
                            ? `${client.nom || ""} ${client.prenom || ""}`.trim()
                            : "Non défini"}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[190px]">
                          {client?.email || client?.telephone || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {vehicule
                            ? `${vehicule.marque || ""} ${vehicule.modele || ""}`.trim() || "Véhicule"
                            : "Non défini"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {vehicule?.immatriculation || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          #{f.intervention?.id || "-"}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[180px]">
                          {f.intervention?.typePanne || "Non défini"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <p className="font-black text-emerald-600 text-base">
                          {money(f.montantTtc)}
                        </p>
                        <p className="text-xs text-slate-500">
                          HT {money(f.montantHt)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={f.statut}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            changeStatut(f, e.target.value);
                          }}
                          className={`border rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-semibold ${
                            f.statut === "PAID"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          <option value="UNPAID">Non payée</option>
                          <option value="PAID">Payée</option>
                        </select>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {formatDate(f.dateFacture)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFacture(f);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold transition"
                          >
                            <FaEye />
                            Détails
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openSendModal(f);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition shadow-sm"
                          >
                            <FaPaperPlane />
                            Envoyer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {selectedFacture && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-6xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col">
            <div className="shrink-0 p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-gradient-to-r from-blue-50 via-white to-emerald-50">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                  <FaFileInvoice />
                  Détails facture
                </div>

                <h2 className="text-3xl font-black text-slate-950">
                  {selectedFacture.numero || `Facture #${selectedFacture.id}`}
                </h2>

                <p className="text-slate-500 mt-1">
                  Facture liée à l’intervention #
                  {selectedFacture.intervention?.id || "-"} et au véhicule{" "}
                  {selectedFacture.intervention?.vehicule?.immatriculation ||
                    "-"}
                  .
                </p>
              </div>

              <button
                onClick={() => setSelectedFacture(null)}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KpiBox
                  label="Montant HT"
                  value={money(selectedFacture.montantHt)}
                  color="text-blue-600"
                />
                <KpiBox
                  label="TVA"
                  value={money(selectedFacture.tva)}
                  color="text-yellow-600"
                />
                <KpiBox
                  label="Montant TTC"
                  value={money(selectedFacture.montantTtc)}
                  color="text-green-600"
                />
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <p className="text-xs text-slate-500 mb-2">Statut</p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${statusBadge(
                      selectedFacture.statut
                    )}`}
                  >
                    {statusLabel(selectedFacture.statut)}
                  </span>
                </div>
              </div>

              <SectionTitle icon={<FaUser />} color="text-purple-600">
                Client
              </SectionTitle>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailItem
                  label="Nom client"
                  value={
                    getClient(selectedFacture)
                      ? `${getClient(selectedFacture)?.nom || ""} ${
                          getClient(selectedFacture)?.prenom || ""
                        }`
                      : "Non défini"
                  }
                />
                <DetailItem
                  label="Email"
                  value={getClient(selectedFacture)?.email}
                />
                <DetailItem
                  label="Téléphone"
                  value={getClient(selectedFacture)?.telephone}
                />
              </div>

              <SectionTitle icon={<FaFileInvoice />} color="text-blue-600">
                Informations de la facture
              </SectionTitle>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailItem label="ID facture" value={`#${selectedFacture.id}`} />
                <DetailItem label="Numéro" value={selectedFacture.numero} />
                <DetailItem
                  label="Date facture"
                  value={formatDate(selectedFacture.dateFacture)}
                />
                <DetailItem
                  label="Montant HT"
                  value={money(selectedFacture.montantHt)}
                />
                <DetailItem label="TVA" value={money(selectedFacture.tva)} />
                <DetailItem
                  label="Montant TTC"
                  value={money(selectedFacture.montantTtc)}
                  color="text-green-600"
                />
              </div>

              <SectionTitle icon={<FaTools />} color="text-orange-600">
                Intervention liée
              </SectionTitle>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailItem
                  label="ID intervention"
                  value={
                    selectedFacture.intervention?.id
                      ? `#${selectedFacture.intervention.id}`
                      : "-"
                  }
                />
                <DetailItem
                  label="Type de panne"
                  value={selectedFacture.intervention?.typePanne}
                />
                <DetailItem
                  label="Statut intervention"
                  value={selectedFacture.intervention?.statut}
                />
                <DetailItem
                  label="Date début"
                  value={formatDate(selectedFacture.intervention?.dateDebut)}
                />
                <DetailItem
                  label="Date fin"
                  value={formatDate(selectedFacture.intervention?.dateFin)}
                />
                <DetailItem
                  label="Durée"
                  value={
                    selectedFacture.intervention?.duree !== undefined
                      ? `${selectedFacture.intervention.duree} h`
                      : "-"
                  }
                />
                <DetailItem
                  label="Coût intervention"
                  value={money(selectedFacture.intervention?.cout)}
                  color="text-green-600"
                />
                <DetailItem
                  label="Description"
                  value={selectedFacture.intervention?.description}
                />
              </div>

              <SectionTitle icon={<FaCar />} color="text-cyan-600">
                Véhicule concerné
              </SectionTitle>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailItem
                  label="ID véhicule"
                  value={
                    selectedFacture.intervention?.vehicule?.id
                      ? `#${selectedFacture.intervention.vehicule.id}`
                      : "-"
                  }
                />
                <DetailItem
                  label="Immatriculation"
                  value={selectedFacture.intervention?.vehicule?.immatriculation}
                />
                <DetailItem
                  label="Marque"
                  value={selectedFacture.intervention?.vehicule?.marque}
                />
                <DetailItem
                  label="Modèle"
                  value={selectedFacture.intervention?.vehicule?.modele}
                />
                <DetailItem
                  label="Année"
                  value={selectedFacture.intervention?.vehicule?.annee}
                />
                <DetailItem
                  label="Kilométrage"
                  value={
                    selectedFacture.intervention?.vehicule?.kilometrage !==
                    undefined
                      ? `${selectedFacture.intervention.vehicule.kilometrage} km`
                      : "-"
                  }
                />
              </div>

              <SectionTitle icon={<FaUserCog />} color="text-purple-600">
                Technicien
              </SectionTitle>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailItem
                  label="ID technicien"
                  value={
                    selectedFacture.intervention?.technicien?.id
                      ? `#${selectedFacture.intervention.technicien.id}`
                      : "-"
                  }
                />
                <DetailItem
                  label="Nom"
                  value={
                    selectedFacture.intervention?.technicien?.nom ||
                    selectedFacture.intervention?.technicien?.username
                  }
                />
                <DetailItem
                  label="Email"
                  value={selectedFacture.intervention?.technicien?.email}
                />
              </div>

              <SectionTitle icon={<FaCubes />} color="text-emerald-600">
                Pièces utilisées
              </SectionTitle>

              {selectedFacture.intervention?.pieces?.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-sm min-w-[700px]">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="p-4 text-left">Pièce</th>
                        <th className="p-4 text-left">Référence</th>
                        <th className="p-4 text-left">Prix unitaire</th>
                        <th className="p-4 text-left">Quantité</th>
                        <th className="p-4 text-right">Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedFacture.intervention.pieces.map((ligne) => {
                        const piece = ligne.piece || {};
                        const prix = Number(piece.prix || 0);
                        const quantite = Number(ligne.quantite || 0);

                        return (
                          <tr
                            key={ligne.id}
                            className="border-t border-slate-100"
                          >
                            <td className="p-4 font-medium text-slate-900">
                              {piece.nom || "-"}
                            </td>
                            <td className="p-4 text-slate-500">
                              {piece.reference || "-"}
                            </td>
                            <td className="p-4 text-slate-700">{money(prix)}</td>
                            <td className="p-4 text-slate-700">{quantite}</td>
                            <td className="p-4 text-right font-semibold text-green-600">
                              {money(prix * quantite)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-500">
                  Aucune pièce liée à cette intervention ou données non
                  retournées par le backend.
                </div>
              )}
            </div>

            <div className="shrink-0 p-6 border-t border-slate-200 flex flex-wrap justify-end gap-3 bg-white">
              {selectedFacture.intervention?.id && (
                <button
                  onClick={() =>
                    navigate(`/interventions/details/${selectedFacture.intervention.id}`)
                  }
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-5 py-3 rounded-2xl transition flex items-center gap-2 font-semibold"
                >
                  <FaTools />
                  Voir intervention
                </button>
              )}

              <button
                onClick={() => openSendModal(selectedFacture)}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl transition flex items-center gap-2 font-semibold"
              >
                <FaPaperPlane />
                Envoyer au client
              </button>

              <button
                onClick={() => openEdit(selectedFacture)}
                className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 px-5 py-3 rounded-2xl transition flex items-center gap-2 font-semibold"
              >
                <FaEdit />
                Modifier
              </button>

              <button
                onClick={() => downloadFacturePdf(selectedFacture.id)}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-5 py-3 rounded-2xl transition flex items-center gap-2 font-semibold"
              >
                <FaDownload />
                Télécharger
              </button>

              <button
                onClick={() => printFacture(selectedFacture.id)}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-5 py-3 rounded-2xl transition flex items-center gap-2 font-semibold"
              >
                <FaPrint />
                Imprimer
              </button>

              <button
                onClick={() => remove(selectedFacture.id)}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-5 py-3 rounded-2xl transition flex items-center gap-2 font-semibold"
              >
                <FaTrash />
                Supprimer
              </button>

              <button
                onClick={() => setSelectedFacture(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-2xl transition font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEND MODAL */}
      {sendModalOpen && factureToSend && (
        <SendFactureModal
          facture={factureToSend}
          client={getClient(factureToSend)}
          link={getFactureViewLink(factureToSend)}
          money={money}
          getVehicleLabel={getVehicleLabel}
          statusLabel={statusLabel}
          onClose={() => {
            setSendModalOpen(false);
            setFactureToSend(null);
          }}
          onWhatsApp={() => sendByWhatsApp(factureToSend)}
          onGmail={() => sendByGmail(factureToSend)}
          onCopy={() => copyFactureViewLink(factureToSend)}
          onOpen={() => openFactureViewLink(factureToSend)}
        />
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-[560px] shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Modifier facture
                </h2>
                <p className="text-sm text-slate-500">
                  Facture {editing.numero}
                </p>
              </div>

              <button
                onClick={() => setEditing(null)}
                className="w-11 h-11 rounded-xl hover:bg-slate-100 text-slate-700 transition flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <InputBlock
                label="Numéro"
                value={form.numero}
                onChange={(value) => setForm({ ...form, numero: value })}
              />

              <div>
                <label className="text-sm text-slate-500">Date facture</label>
                <input
                  type="datetime-local"
                  value={form.dateFacture}
                  onChange={(e) =>
                    setForm({ ...form, dateFacture: e.target.value })
                  }
                  className="w-full mt-1 p-3 bg-white border border-slate-200 text-slate-900 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InputBlock
                  label="Montant HT"
                  type="number"
                  value={form.montantHt}
                  onChange={(value) =>
                    handleMontantChange("montantHt", value)
                  }
                />

                <InputBlock
                  label="TVA"
                  type="number"
                  value={form.tva}
                  onChange={(value) => handleMontantChange("tva", value)}
                />

                <div>
                  <label className="text-sm text-slate-500">TTC</label>
                  <input
                    type="number"
                    value={form.montantTtc}
                    readOnly
                    className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-green-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500">Statut</label>
                <select
                  value={form.statut}
                  onChange={(e) =>
                    setForm({ ...form, statut: e.target.value })
                  }
                  className="w-full mt-1 p-3 bg-white border border-slate-200 text-slate-900 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="UNPAID">Non payée</option>
                  <option value="PAID">Payée</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl transition font-semibold"
              >
                Annuler
              </button>

              <button
                onClick={saveEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition font-semibold"
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

/* COMPONENTS */

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

function InfoBox({ icon, label, value, color }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <span className={`${color} mt-1`}>{icon}</span>
        <div className="min-w-0">
          <p className="text-xs text-slate-500">{label}</p>
          <p className="font-semibold text-slate-900 break-words">
            {value || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

function AmountBox({ label, value, color = "text-slate-900" }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`font-black mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function ActionButton({ icon, label, color, onClick }) {
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

function KpiBox({ label, value, color }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <h3 className={`text-2xl font-black ${color}`}>{value}</h3>
    </div>
  );
}

function SectionTitle({ icon, color, children }) {
  return (
    <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-slate-900">
      <span className={color}>{icon}</span>
      {children}
    </h3>
  );
}

function InputBlock({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-slate-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 p-3 bg-white border border-slate-200 text-slate-900 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}

function SendFactureModal({
  facture,
  client,
  link,
  money,
  getVehicleLabel,
  statusLabel,
  onClose,
  onWhatsApp,
  onGmail,
  onCopy,
  onOpen,
}) {
  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Envoyer la facture au client
            </h2>

            <p className="text-slate-500 mt-1">
              Choisissez le canal d’envoi pour{" "}
              <span className="font-semibold text-slate-800">
                {client
                  ? `${client.nom || ""} ${client.prenom || ""}`
                  : "client non défini"}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="text-xs text-slate-500">Facture</p>
            <p className="font-black text-slate-950">
              {facture.numero || `#${facture.id}`}
            </p>

            <p className="text-xs text-slate-500 mt-3">Véhicule</p>
            <p className="font-semibold text-slate-800">
              {getVehicleLabel(facture)}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <p className="text-xs text-slate-500">Montant TTC</p>
                <p className="font-black text-emerald-600">
                  {money(facture.montantTtc)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Statut</p>
                <p className="font-black text-slate-900">
                  {statusLabel(facture.statut)}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl p-5 flex items-center gap-4 transition shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <FaWhatsapp className="text-2xl" />
            </div>

            <div className="text-left">
              <p className="font-black">Envoyer par WhatsApp</p>
              <p className="text-sm text-white/80">
                {client?.telephone || "Téléphone non défini"}
              </p>
            </div>
          </button>

          <button
            onClick={onGmail}
            className="w-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl p-5 flex items-center gap-4 transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <FaEnvelope className="text-xl" />
            </div>

            <div className="text-left">
              <p className="font-black">Ouvrir Gmail</p>
              <p className="text-sm text-slate-500">
                {client?.email || "Email non défini"}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3 py-2">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-slate-400 text-sm">OU</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="flex gap-2">
            <input
              readOnly
              value={link}
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none"
            />

            <button
              onClick={onCopy}
              className="w-12 h-12 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center transition"
              title="Copier le lien de consultation"
            >
              <FaCopy />
            </button>

            <button
              onClick={onOpen}
              className="w-12 h-12 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center transition"
              title="Ouvrir facture"
            >
              <FaExternalLinkAlt />
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}