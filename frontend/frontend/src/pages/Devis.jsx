import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDevis,
  approveDevis,
  rejectDevis,
  sendDevisToClient,
} from "../services/devis.service";

import { generateFacture } from "../services/facture.service";

import {
  FaFileInvoice,
  FaCheckCircle,
  FaTimes,
  FaTimesCircle,
  FaSearch,
  FaReceipt,
  FaEye,
  FaSyncAlt,
  FaMoneyBillWave,
  FaClock,
  FaFilter,
  FaCalendarAlt,
  FaTools,
  FaCar,
  FaUserCog,
  FaClipboardList,
  FaChartLine,
  FaArrowRight,
  FaLink,
  FaCopy,
  FaUser,
  FaEnvelope,
  FaWhatsapp,
  FaExternalLinkAlt,
  FaPaperPlane,
} from "react-icons/fa";

export default function DevisPage() {
  const navigate = useNavigate();

  const [devis, setDevis] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDevis, setSelectedDevis] = useState(null);
  const [open, setOpen] = useState(false);

  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [devisToSend, setDevisToSend] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

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
      const res = await getDevis();
      setDevis(res.data || []);
    } catch (err) {
      console.error(err);
      showMessage("Erreur lors du chargement des devis.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const money = (value) => `${Number(value || 0).toFixed(2)} DH`;

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("fr-FR");
  };

  const getClientLink = (d) => {
    if (!d?.tokenValidation) return "";
    return `${window.location.origin}/client/devis/${d.tokenValidation}`;
  };

  const openSendModal = (d) => {
    if (!d.tokenValidation) {
      showMessage("Ce devis n'a pas encore de lien de validation client.", "error");
      return;
    }

    setDevisToSend(d);
    setSendModalOpen(true);
  };

  const copyClientLink = async (d) => {
    try {
      const link = getClientLink(d);

      if (!link) {
        showMessage("Lien client indisponible.", "error");
        return;
      }

      await navigator.clipboard.writeText(link);
      showMessage("Lien client copié avec succès.", "success");
    } catch (error) {
      console.error(error);
      showMessage("Impossible de copier le lien client.", "error");
    }
  };

  const openClientLink = (d) => {
    const link = getClientLink(d);

    if (!link) {
      showMessage("Lien client indisponible.", "error");
      return;
    }

    window.open(link, "_blank");
  };

  const sendByWhatsApp = (d) => {
    const client = d.intervention?.vehicule?.client;
    const phone = client?.telephone;

    if (!phone) {
      showMessage("Le client n'a pas de numéro de téléphone.", "error");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const link = getClientLink(d);

    const text = `Bonjour ${client.nom || ""}, votre devis est prêt. Vous pouvez le consulter et le valider ici : ${link}`;

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const sendByEmail = async (d) => {
  try {
    const client = d.intervention?.vehicule?.client;

    if (!client?.email) {
      showMessage("Le client n'a pas d'adresse email.", "error");
      return;
    }

    console.log("Envoi email devis ID :", d.id);
    console.log("Email client :", client.email);

    setSendingEmail(true);

    const res = await sendDevisToClient(d.id);

    console.log("Réponse backend email :", res.data);

    showMessage("Email envoyé automatiquement au client.", "success");
    setSendModalOpen(false);
    setDevisToSend(null);
  } catch (error) {
    console.error("Erreur email complète :", error);

    if (error.response) {
      console.error("Status :", error.response.status);
      console.error("Data :", error.response.data);

      showMessage(
        "Erreur backend email : " +
          error.response.status +
          " - " +
          JSON.stringify(error.response.data),
        "error"
      );
    } else if (error.request) {
      showMessage(
        "Aucune réponse du backend. Vérifie que Spring Boot est lancé.",
        "error"
      );
    } else {
      showMessage("Erreur email : " + error.message, "error");
    }
  } finally {
    setSendingEmail(false);
  }
};

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-50 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "APPROVED":
        return "Approuvé";
      case "REJECTED":
        return "Refusé";
      default:
        return "En attente";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <FaCheckCircle />;
      case "REJECTED":
        return <FaTimesCircle />;
      default:
        return <FaClock />;
    }
  };

  const getClientStatusStyle = (status) => {
    switch (status) {
      case "ACCEPTE":
        return "bg-green-50 text-green-700 border-green-200";
      case "REFUSE":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const getClientStatusLabel = (status) => {
    switch (status) {
      case "ACCEPTE":
        return "Accepté par client";
      case "REFUSE":
        return "Refusé par client";
      default:
        return "En attente client";
    }
  };

  const getClientStatusIcon = (status) => {
    switch (status) {
      case "ACCEPTE":
        return <FaCheckCircle />;
      case "REFUSE":
        return <FaTimesCircle />;
      default:
        return <FaClock />;
    }
  };

  const filteredDevis = useMemo(() => {
    return devis
      .filter((d) => {
        const client = d.intervention?.vehicule?.client;

        const text = `
          ${d.id || ""}
          ${d.intervention?.id || ""}
          ${d.intervention?.typePanne || ""}
          ${d.intervention?.vehicule?.immatriculation || ""}
          ${d.intervention?.vehicule?.marque || ""}
          ${d.intervention?.vehicule?.modele || ""}
          ${d.intervention?.technicien?.nom || ""}
          ${client?.nom || ""}
          ${client?.prenom || ""}
          ${client?.email || ""}
          ${client?.telephone || ""}
          ${d.montant || ""}
          ${d.statut || ""}
          ${d.statutClient || ""}
        `.toLowerCase();

        const matchSearch = text.includes(search.toLowerCase());
        const matchFilter = filter === "ALL" || d.statut === filter;

        return matchSearch && matchFilter;
      })
      .sort((a, b) => {
        const dateA = new Date(a.dateCreation || a.createdAt || 0);
        const dateB = new Date(b.dateCreation || b.createdAt || 0);
        return dateB - dateA;
      });
  }, [devis, search, filter]);

  const stats = useMemo(() => {
    const total = devis.reduce((sum, d) => sum + Number(d.montant || 0), 0);

    const pendingItems = devis.filter((d) => d.statut === "PENDING");
    const approvedItems = devis.filter((d) => d.statut === "APPROVED");
    const rejectedItems = devis.filter((d) => d.statut === "REJECTED");

    const acceptedClient = devis.filter((d) => d.statutClient === "ACCEPTE");
    const refusedClient = devis.filter((d) => d.statutClient === "REFUSE");
    const waitingClient = devis.filter(
      (d) => !d.statutClient || d.statutClient === "EN_ATTENTE"
    );

    const pendingAmount = pendingItems.reduce(
      (sum, d) => sum + Number(d.montant || 0),
      0
    );

    const approvedAmount = approvedItems.reduce(
      (sum, d) => sum + Number(d.montant || 0),
      0
    );

    return {
      total,
      count: devis.length,
      pending: pendingItems.length,
      approved: approvedItems.length,
      rejected: rejectedItems.length,
      acceptedClient: acceptedClient.length,
      refusedClient: refusedClient.length,
      waitingClient: waitingClient.length,
      pendingAmount,
      approvedAmount,
    };
  }, [devis]);

  const handleApprove = async (d) => {
    try {
      await approveDevis(d.id);
      showMessage("Devis approuvé avec succès.", "success");
      await load();
    } catch (error) {
      console.error(error);
      showMessage("Erreur lors de l'approbation du devis.", "error");
    }
  };

  const handleReject = async (d) => {
    try {
      if (!window.confirm("Voulez-vous vraiment refuser ce devis ?")) return;

      await rejectDevis(d.id);
      showMessage("Devis refusé avec succès.", "success");
      await load();
    } catch (error) {
      console.error(error);
      showMessage("Erreur lors du refus du devis.", "error");
    }
  };

  const handleGenerateFacture = async (d) => {
    try {
      if (d.statut !== "APPROVED") {
        showMessage(
          "Le devis doit être approuvé avant de générer une facture.",
          "error"
        );
        return;
      }

      if (!d.intervention?.id) {
        showMessage(
          "Impossible de générer une facture : intervention introuvable.",
          "error"
        );
        return;
      }

      await generateFacture(d.intervention.id);

      showMessage("Facture générée avec succès.", "success");
      setOpen(false);
      await load();
    } catch (error) {
      console.error(error);
      showMessage(
        "Facture déjà générée ou erreur lors de la génération.",
        "error"
      );
    }
  };

  const openDetails = (d) => {
    setSelectedDevis(d);
    setOpen(true);
  };

  const StatCard = ({ label, value, icon, color, subtitle }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{label}</p>
        <span className={color}>{icon}</span>
      </div>

      <h2 className={`text-2xl md:text-3xl font-black mt-2 ${color}`}>
        {value}
      </h2>

      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );

  const DetailLine = ({ label, value }) => (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="text-slate-900 font-semibold text-sm text-right">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-emerald-50 to-blue-50 p-6 shadow-sm">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <FaFileInvoice className="text-3xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
                <FaChartLine />
                Pipeline commercial & financier
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                Gestion des Devis
              </h1>

              <p className="text-slate-500 mt-2 max-w-3xl">
                Suivez les estimations clients, les validations internes, les
                réponses clients et la génération automatique des factures à
                partir des interventions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={load}
              disabled={loading}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition disabled:opacity-50 shadow-sm"
            >
              <FaSyncAlt />
              Actualiser
            </button>

            <button
              onClick={() => navigate("/factures")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-sm"
            >
              <FaReceipt />
              Voir factures
            </button>
          </div>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 mt-6">
          <StatCard
            label="Nombre devis"
            value={stats.count}
            icon={<FaFileInvoice />}
            color="text-slate-900"
          />

          <StatCard
            label="Total estimé"
            value={money(stats.total)}
            icon={<FaMoneyBillWave />}
            color="text-emerald-600"
          />

          <StatCard
            label="En attente interne"
            value={stats.pending}
            icon={<FaClock />}
            color="text-yellow-600"
            subtitle={money(stats.pendingAmount)}
          />

          <StatCard
            label="Approuvés"
            value={stats.approved}
            icon={<FaCheckCircle />}
            color="text-green-600"
            subtitle={money(stats.approvedAmount)}
          />

          <StatCard
            label="En attente client"
            value={stats.waitingClient}
            icon={<FaLink />}
            color="text-blue-600"
          />

          <StatCard
            label="Acceptés client"
            value={stats.acceptedClient}
            icon={<FaUser />}
            color="text-purple-600"
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
            {messageType === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
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

      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h2 className="font-bold flex items-center gap-2 text-slate-900">
              <FaFilter className="text-emerald-600" />
              Recherche et filtres
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Recherchez par devis, intervention, véhicule, technicien ou client.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full xl:w-auto">
            <div className="relative md:col-span-2">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher devis, véhicule, client..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
            >
              <option value="ALL">Tous les devis</option>
              <option value="PENDING">En attente</option>
              <option value="APPROVED">Approuvés</option>
              <option value="REJECTED">Refusés</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Chargement des devis...
        </div>
      ) : filteredDevis.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Aucun devis trouvé.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDevis.map((d) => {
            const client = d.intervention?.vehicule?.client;

            return (
              <div
                key={d.id}
                onClick={() => openDetails(d)}
                className="group bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 cursor-pointer"
              >
                <div className="flex justify-between items-start gap-4 mb-5">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Devis</p>
                    <h2 className="font-black text-3xl mt-1 text-slate-950 group-hover:text-emerald-600 transition">
                      #{d.id}
                    </h2>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border font-semibold flex items-center gap-2 ${getStatusStyle(
                        d.statut
                      )}`}
                    >
                      {getStatusIcon(d.statut)}
                      {getStatusLabel(d.statut)}
                    </span>

                    <span
                      className={`text-xs px-3 py-1 rounded-full border font-semibold flex items-center gap-2 ${getClientStatusStyle(
                        d.statutClient
                      )}`}
                    >
                      {getClientStatusIcon(d.statutClient)}
                      {getClientStatusLabel(d.statutClient)}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <InfoLine
                    icon={<FaTools />}
                    label="Intervention"
                    value={`#${d.intervention?.id || "-"}`}
                    color="text-blue-600"
                  />

                  <InfoLine
                    icon={<FaCar />}
                    label="Véhicule"
                    value={d.intervention?.vehicule?.immatriculation || "Non défini"}
                    color="text-cyan-600"
                  />

                  <InfoLine
                    icon={<FaUser />}
                    label="Client"
                    value={
                      client
                        ? `${client.nom || ""} ${client.prenom || ""}`
                        : "Non défini"
                    }
                    color="text-emerald-600"
                  />

                  <InfoLine
                    icon={<FaUserCog />}
                    label="Technicien"
                    value={d.intervention?.technicien?.nom || "Non défini"}
                    color="text-purple-600"
                  />

                  <InfoLine
                    icon={<FaCalendarAlt />}
                    label="Date"
                    value={formatDate(d.dateCreation)}
                    color="text-yellow-600"
                  />
                </div>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Montant estimé</p>
                    <p className="text-3xl font-black text-emerald-600 mt-1">
                      {money(d.montant)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(d);
                    }}
                    className="text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-xl transition flex items-center gap-2"
                  >
                    <FaEye />
                    Voir
                  </button>
                </div>

                <div className="mt-5">
                  {d.statutClient === "ACCEPTE" && (
                    <StatusNotice color="green" text="Le client a accepté ce devis." />
                  )}

                  {d.statutClient === "REFUSE" && (
                    <StatusNotice color="red" text="Le client a refusé ce devis." />
                  )}

                  {(!d.statutClient || d.statutClient === "EN_ATTENTE") && (
                    <StatusNotice
                      color="blue"
                      text="En attente de validation par le client."
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openSendModal(d);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white border border-green-600 py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                  >
                    <FaPaperPlane />
                    Envoyer au client
                  </button>

                  <div className="flex gap-3">
                    {d.statut === "PENDING" && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(d);
                          }}
                          className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                        >
                          <FaCheckCircle />
                          Valider
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(d);
                          }}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                        >
                          <FaTimes />
                          Refuser
                        </button>
                      </>
                    )}

                    {d.statut === "APPROVED" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateFacture(d);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                      >
                        <FaReceipt />
                        Générer facture
                      </button>
                    )}

                    {d.intervention?.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/interventions/details/${d.intervention.id}`);
                        }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-2xl transition font-semibold flex items-center justify-center gap-2"
                      >
                        <FaArrowRight />
                        Intervention
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {open && selectedDevis && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="w-full max-w-6xl max-h-[92vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="relative overflow-hidden border-b border-slate-200">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-blue-50 to-cyan-50" />

              <div className="relative p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-3xl shadow-sm">
                    <FaFileInvoice />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-black text-slate-950">
                        Devis #{selectedDevis.id}
                      </h2>

                      <span
                        className={`text-xs px-3 py-1 rounded-full border font-semibold flex items-center gap-2 ${getStatusStyle(
                          selectedDevis.statut
                        )}`}
                      >
                        {getStatusIcon(selectedDevis.statut)}
                        {getStatusLabel(selectedDevis.statut)}
                      </span>

                      <span
                        className={`text-xs px-3 py-1 rounded-full border font-semibold flex items-center gap-2 ${getClientStatusStyle(
                          selectedDevis.statutClient
                        )}`}
                      >
                        {getClientStatusIcon(selectedDevis.statutClient)}
                        {getClientStatusLabel(selectedDevis.statutClient)}
                      </span>
                    </div>

                    <p className="text-slate-500 mt-2">
                      Créé le {formatDate(selectedDevis.dateCreation)} •
                      Intervention #{selectedDevis.intervention?.id || "-"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  label="Montant"
                  value={money(selectedDevis.montant)}
                  icon={<FaMoneyBillWave />}
                  color="text-emerald-600"
                />

                <StatCard
                  label="Statut interne"
                  value={getStatusLabel(selectedDevis.statut)}
                  icon={getStatusIcon(selectedDevis.statut)}
                  color={
                    selectedDevis.statut === "APPROVED"
                      ? "text-green-600"
                      : selectedDevis.statut === "REJECTED"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                />

                <StatCard
                  label="Statut client"
                  value={getClientStatusLabel(selectedDevis.statutClient)}
                  icon={getClientStatusIcon(selectedDevis.statutClient)}
                  color={
                    selectedDevis.statutClient === "ACCEPTE"
                      ? "text-green-600"
                      : selectedDevis.statutClient === "REFUSE"
                      ? "text-red-600"
                      : "text-blue-600"
                  }
                />

                <StatCard
                  label="Véhicule"
                  value={
                    selectedDevis.intervention?.vehicule?.immatriculation || "-"
                  }
                  icon={<FaCar />}
                  color="text-cyan-600"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                  <h3 className="font-bold text-emerald-600 mb-5 flex items-center gap-2">
                    <FaClipboardList />
                    Informations devis
                  </h3>

                  <div className="space-y-3">
                    <DetailLine label="ID devis" value={`#${selectedDevis.id}`} />
                    <DetailLine
                      label="Statut interne"
                      value={getStatusLabel(selectedDevis.statut)}
                    />
                    <DetailLine
                      label="Statut client"
                      value={getClientStatusLabel(selectedDevis.statutClient)}
                    />
                    <DetailLine label="Montant" value={money(selectedDevis.montant)} />
                    <DetailLine
                      label="Date création"
                      value={formatDate(selectedDevis.dateCreation)}
                    />
                    <DetailLine
                      label="Date validation"
                      value={formatDate(selectedDevis.dateValidation)}
                    />
                    <DetailLine
                      label="Intervention"
                      value={`#${selectedDevis.intervention?.id || "-"}`}
                    />
                  </div>

                  <button
                    onClick={() => openSendModal(selectedDevis)}
                    className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                  >
                    <FaPaperPlane />
                    Envoyer au client
                  </button>
                </div>

                <div className="xl:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                  <h3 className="font-bold text-blue-600 mb-5 flex items-center gap-2">
                    <FaTools />
                    Intervention liée
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoBox
                      label="Type de panne"
                      value={selectedDevis.intervention?.typePanne || "-"}
                    />

                    <InfoBox
                      label="Statut intervention"
                      value={selectedDevis.intervention?.statut || "-"}
                    />

                    <InfoBox
                      label="Véhicule"
                      value={
                        selectedDevis.intervention?.vehicule
                          ? `${selectedDevis.intervention.vehicule.immatriculation || "-"} - ${
                              selectedDevis.intervention.vehicule.marque || ""
                            } ${selectedDevis.intervention.vehicule.modele || ""}`
                          : "-"
                      }
                    />

                    <InfoBox
                      label="Technicien"
                      value={
                        selectedDevis.intervention?.technicien
                          ? `${selectedDevis.intervention.technicien.nom || ""} ${
                              selectedDevis.intervention.technicien.prenom || ""
                            }`
                          : "-"
                      }
                    />
                  </div>

                  <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-5">
                    <p className="text-xs text-slate-500 mb-2">Description</p>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedDevis.description ||
                        selectedDevis.intervention?.description ||
                        "Aucune description disponible."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 flex flex-col md:flex-row gap-3">
              {selectedDevis.statut === "PENDING" && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedDevis);
                      setOpen(false);
                    }}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-4 rounded-2xl transition font-semibold flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle />
                    Valider
                  </button>

                  <button
                    onClick={() => {
                      handleReject(selectedDevis);
                      setOpen(false);
                    }}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-4 rounded-2xl transition font-semibold flex items-center justify-center gap-2"
                  >
                    <FaTimes />
                    Refuser
                  </button>
                </>
              )}

              {selectedDevis.statut === "APPROVED" && (
                <button
                  onClick={() => handleGenerateFacture(selectedDevis)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl transition font-semibold flex items-center justify-center gap-2"
                >
                  <FaReceipt />
                  Générer facture
                </button>
              )}

              {selectedDevis.intervention?.id && (
                <button
                  onClick={() =>
                    navigate(`/interventions/details/${selectedDevis.intervention.id}`)
                  }
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-4 rounded-2xl transition font-semibold flex items-center justify-center gap-2"
                >
                  <FaTools />
                  Voir intervention
                </button>
              )}

              <button
                onClick={() => setOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-4 rounded-2xl transition font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {sendModalOpen && devisToSend && (
        <SendClientModal
          devis={devisToSend}
          link={getClientLink(devisToSend)}
          sendingEmail={sendingEmail}
          onClose={() => {
            setSendModalOpen(false);
            setDevisToSend(null);
          }}
          onWhatsApp={() => sendByWhatsApp(devisToSend)}
          onEmail={() => sendByEmail(devisToSend)}
          onCopy={() => copyClientLink(devisToSend)}
          onOpen={() => openClientLink(devisToSend)}
        />
      )}
    </div>
  );
}

function InfoLine({ icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className={`flex items-center gap-2 ${color}`}>
        {icon}
        <span className="text-slate-500 text-sm">{label}</span>
      </div>

      <span className="text-sm text-right font-semibold text-slate-900">
        {value || "-"}
      </span>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-bold text-slate-900 mt-2">{value || "-"}</p>
    </div>
  );
}

function StatusNotice({ color, text }) {
  const styles = {
    green: "text-green-700 bg-green-50 border-green-200",
    yellow: "text-yellow-700 bg-yellow-50 border-yellow-200",
    red: "text-red-700 bg-red-50 border-red-200",
    blue: "text-blue-700 bg-blue-50 border-blue-200",
  };

  return <div className={`text-xs rounded-xl border p-3 ${styles[color]}`}>{text}</div>;
}

function SendClientModal({
  devis,
  link,
  sendingEmail,
  onClose,
  onWhatsApp,
  onEmail,
  onCopy,
  onOpen,
}) {
  const client = devis.intervention?.vehicule?.client;
  const vehicule = devis.intervention?.vehicule;

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
              Envoyer le devis au client
            </h2>

            <p className="text-slate-500 mt-1">
              Choisissez comment envoyer le devis à{" "}
              <span className="font-semibold text-slate-800">
                {client?.nom || "client"}
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
            onClick={onEmail}
            disabled={sendingEmail}
            className="w-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl p-5 flex items-center gap-4 transition disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <FaEnvelope className="text-xl" />
            </div>

            <div className="text-left">
              <p className="font-black">
                {sendingEmail ? "Envoi en cours..." : "Envoyer par Email"}
              </p>
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
              title="Copier le lien"
            >
              <FaCopy />
            </button>

            <button
              onClick={onOpen}
              className="w-12 h-12 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center transition"
              title="Ouvrir le lien"
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