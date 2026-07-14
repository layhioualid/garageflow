import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getPublicDevis,
  acceptPublicDevis,
  rejectPublicDevis,
} from "../services/publicDevis.service";

import {
  FaFileInvoice,
  FaCar,
  FaTools,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaUser,
  FaExclamationTriangle,
  FaClock,
  FaChartLine,
} from "react-icons/fa";

export default function ClientDevisValidation() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [devis, setDevis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentaire, setCommentaire] = useState("");
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const money = (value) => `${Number(value || 0).toFixed(2)} DH`;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("fr-FR");
  };

  const load = async () => {
    try {
      setLoading(true);
      const res = await getPublicDevis(token);
      setDevis(res.data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Lien invalide ou devis introuvable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const accept = async () => {
    try {
      setProcessing(true);
      await acceptPublicDevis(token, commentaire);
      setMessage("Devis accepté avec succès.");
      await load();
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l’acceptation du devis.");
    } finally {
      setProcessing(false);
    }
  };

  const reject = async () => {
    try {
      setProcessing(true);
      await rejectPublicDevis(token, commentaire);
      setMessage("Devis refusé avec succès.");
      await load();
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors du refus du devis.");
    } finally {
      setProcessing(false);
    }
  };

  const estimateInterventionDuration = (devisData) => {
    const intervention = devisData?.intervention || {};
    const vehicule = intervention?.vehicule || {};

    const typePanne = String(intervention.typePanne || "").toLowerCase();
    const description = String(intervention.description || "").toLowerCase();
    const text = `${typePanne} ${description}`;

    const kilometrage = Number(vehicule.kilometrage || 0);
    const montant = Number(devisData?.montant || intervention.cout || 0);
    const piecesCount = Array.isArray(intervention.pieces)
      ? intervention.pieces.length
      : 0;

    let hours = 1.5;
    let reasons = [];

    if (
      text.includes("moteur") ||
      text.includes("engine") ||
      text.includes("embrayage") ||
      text.includes("boite") ||
      text.includes("boîte")
    ) {
      hours += 4;
      reasons.push("panne mécanique importante");
    } else if (
      text.includes("frein") ||
      text.includes("brake") ||
      text.includes("suspension")
    ) {
      hours += 2.5;
      reasons.push("intervention sur organe de sécurité");
    } else if (
      text.includes("batterie") ||
      text.includes("alternateur") ||
      text.includes("électrique") ||
      text.includes("electrique")
    ) {
      hours += 1.5;
      reasons.push("diagnostic ou réparation électrique");
    } else if (
      text.includes("vidange") ||
      text.includes("filtre") ||
      text.includes("huile")
    ) {
      hours += 0.8;
      reasons.push("maintenance simple");
    } else if (
      text.includes("pneu") ||
      text.includes("roue") ||
      text.includes("jante")
    ) {
      hours += 1.2;
      reasons.push("intervention pneumatique");
    } else if (text.includes("diagnostic")) {
      hours += 1.5;
      reasons.push("diagnostic technique");
    } else {
      hours += 2;
      reasons.push("intervention standard");
    }

    if (kilometrage > 200000) {
      hours += 1.5;
      reasons.push("kilométrage élevé");
    } else if (kilometrage > 100000) {
      hours += 0.8;
      reasons.push("kilométrage moyen/élevé");
    }

    if (piecesCount > 0) {
      hours += piecesCount * 0.5;
      reasons.push(`${piecesCount} pièce(s) prévue(s)`);
    }

    if (montant > 5000) {
      hours += 1.5;
      reasons.push("montant élevé du devis");
    } else if (montant > 2000) {
      hours += 0.8;
      reasons.push("montant moyen du devis");
    }

    const roundedHours = Math.round(hours * 10) / 10;

    let level = "Simple";
    if (roundedHours >= 6) level = "Complexe";
    else if (roundedHours >= 3) level = "Moyenne";

    const startDate = intervention.dateDebut
      ? new Date(intervention.dateDebut)
      : new Date();

    const endDate = new Date(
      startDate.getTime() + roundedHours * 60 * 60 * 1000
    );

    return {
      hours: roundedHours,
      level,
      endDate,
      reasons,
    };
  };

  const durationEstimate = useMemo(() => {
    if (!devis) return null;
    return estimateInterventionDuration(devis);
  }, [devis]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fb] flex items-center justify-center text-slate-600">
        Chargement du devis...
      </div>
    );
  }

  if (!devis) {
    return (
      <div className="min-h-screen bg-[#f6f8fb] flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center max-w-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-4">
            <FaExclamationTriangle />
          </div>

          <h1 className="text-2xl font-black text-slate-950">
            Devis introuvable
          </h1>

          <p className="text-slate-500 mt-2">{message}</p>
        </div>
      </div>
    );
  }

  const intervention = devis.intervention || {};
  const vehicule = intervention.vehicule || {};
  const client = vehicule.client || {};

  const alreadyAnswered =
    devis.statutClient === "ACCEPTE" || devis.statutClient === "REFUSE";

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-green-100 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <FaFileInvoice />
                Validation de devis
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-slate-950">
                Devis #{devis.id}
              </h1>

              <p className="text-slate-500 mt-2 max-w-2xl">
                Veuillez consulter les informations de votre véhicule, la durée
                estimée de l’intervention, puis valider ou refuser le devis.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-right">
              <p className="text-sm text-blue-700">Montant du devis</p>
              <p className="text-3xl font-black text-blue-600">
                {money(devis.montant)}
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl p-4">
            {message}
          </div>
        )}

        {/* DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InfoPanel title="Véhicule" icon={<FaCar />} color="text-blue-600">
            <Detail label="Immatriculation" value={vehicule.immatriculation} />
            <Detail label="Marque" value={vehicule.marque} />
            <Detail label="Modèle" value={vehicule.modele} />
            <Detail
              label="Kilométrage"
              value={`${vehicule.kilometrage || 0} km`}
            />
          </InfoPanel>

          <InfoPanel
            title="Intervention"
            icon={<FaTools />}
            color="text-orange-600"
          >
            <Detail label="Type panne" value={intervention.typePanne} />
            <Detail label="Description" value={intervention.description} />
            <Detail label="Statut" value={intervention.statut} />
          </InfoPanel>

          <InfoPanel title="Client" icon={<FaUser />} color="text-purple-600">
            <Detail
              label="Nom"
              value={`${client.nom || ""} ${client.prenom || ""}`.trim()}
            />
            <Detail label="Email" value={client.email} />
            <Detail label="Téléphone" value={client.telephone} />
          </InfoPanel>
        </div>

        {/* DUREE ESTIMEE */}
        {durationEstimate && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600 mb-5">
              <FaClock />
              Estimation de la durée d’intervention
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Box
                label="Durée estimée"
                value={`${durationEstimate.hours} heure(s)`}
              />

              <Box label="Complexité" value={durationEstimate.level} />

              <Box
                label="Fin estimée"
                value={formatDate(durationEstimate.endDate)}
              />
            </div>

            <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <FaChartLine className="text-indigo-600 mt-1" />

                <div>
                  <p className="font-bold text-indigo-700">
                    Méthode d’estimation
                  </p>

                  <p className="text-sm text-indigo-700/80 mt-1">
                    Cette durée est estimée automatiquement à partir du type de
                    panne, du kilométrage du véhicule, du montant du devis et
                    des pièces prévues dans l’intervention.
                  </p>

                  {durationEstimate.reasons.length > 0 && (
                    <p className="text-sm text-indigo-700 mt-2">
                      Critères détectés :{" "}
                      <span className="font-semibold">
                        {durationEstimate.reasons.join(", ")}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FINANCE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-green-600 mb-5">
            <FaMoneyBillWave />
            Résumé financier
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Box label="Montant devis" value={money(devis.montant)} />
            <Box label="Statut interne" value={devis.statut} />
            <Box
              label="Statut client"
              value={devis.statutClient || "EN_ATTENTE"}
            />
          </div>
        </div>

        {/* ACTION */}
        {!alreadyAnswered ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <label className="text-sm text-slate-500 block mb-2">
              Commentaire client optionnel
            </label>

            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              rows="4"
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
              placeholder="Ajouter un commentaire..."
            />

            <div className="flex flex-col md:flex-row justify-end gap-3 mt-5">
              <button
                onClick={reject}
                disabled={processing}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <FaTimesCircle />
                Refuser le devis
              </button>

              <button
                onClick={accept}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <FaCheckCircle />
                Accepter le devis
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
            <div
              className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                devis.statutClient === "ACCEPTE"
                  ? "bg-green-50 border border-green-200 text-green-600"
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}
            >
              {devis.statutClient === "ACCEPTE" ? (
                <FaCheckCircle />
              ) : (
                <FaTimesCircle />
              )}
            </div>

            <h2 className="text-2xl font-black text-slate-950">
              Réponse déjà enregistrée
            </h2>

            <p className="text-slate-500 mt-2">
              Le statut client actuel est :{" "}
              <span className="font-bold text-blue-600">
                {devis.statutClient}
              </span>
            </p>

            {devis.commentaireClient && (
              <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left">
                <p className="text-xs text-slate-500 mb-1">
                  Commentaire enregistré
                </p>
                <p className="text-slate-800">{devis.commentaireClient}</p>
              </div>
            )}

            <button
              onClick={() => navigate(`/client/suivi/${token}`)}
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2 mx-auto"
            >
              <FaClock />
              Voir le suivi de mon intervention
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoPanel({ title, icon, color, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h2 className={`text-xl font-bold flex items-center gap-2 mb-5 ${color}`}>
        {icon}
        {title}
      </h2>

      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-3 border-b border-slate-100 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900 text-right">
        {value || "-"}
      </span>
    </div>
  );
}

function Box({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-black text-slate-900 mt-2">{value || "-"}</p>
    </div>
  );
}