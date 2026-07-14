import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { getPublicSuivi } from "../services/publicDevis.service";

import {
  FaCar,
  FaCheckCircle,
  FaClock,
  FaFileInvoice,
  FaTools,
  FaUser,
  FaSpinner,
  FaTimesCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function ClientSuiviPublic() {
  const { token } = useParams();

  const [devis, setDevis] = useState(null);
  const [loading, setLoading] = useState(true);

  const money = (value) => `${Number(value || 0).toFixed(2)} DH`;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("fr-FR");
  };

  const load = async () => {
    try {
      setLoading(true);
      const res = await getPublicSuivi(token);
      setDevis(res.data);
    } catch (error) {
      console.error(error);
      alert("Lien de suivi invalide.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const steps = useMemo(() => {
    if (!devis) return [];

    const intervention = devis.intervention || {};

    return [
      {
        label: "Devis envoyé",
        done: true,
        icon: <FaFileInvoice />,
      },
      {
        label: "Devis accepté",
        done: devis.statutClient === "ACCEPTE",
        rejected: devis.statutClient === "REFUSE",
        icon:
          devis.statutClient === "REFUSE" ? <FaTimesCircle /> : <FaCheckCircle />,
      },
      {
        label: "Intervention en cours",
        done:
          intervention.statut === "IN_PROGRESS" ||
          intervention.statut === "DONE",
        icon: <FaTools />,
      },
      {
        label: "Intervention terminée",
        done: intervention.statut === "DONE",
        icon: <FaCheckCircle />,
      },
      {
        label: "Facture disponible",
        done: intervention.statut === "DONE",
        icon: <FaFileInvoice />,
      },
    ];
  }, [devis]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fb] flex items-center justify-center text-slate-600">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex items-center gap-3">
          <FaSpinner className="animate-spin text-blue-600" />
          Chargement du suivi...
        </div>
      </div>
    );
  }

  if (!devis) {
    return (
      <div className="min-h-screen bg-[#f6f8fb] flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm text-center">
          <h1 className="text-2xl font-black text-slate-900">
            Suivi introuvable
          </h1>
          <p className="text-slate-500 mt-2">
            Le lien est invalide ou le suivi n’est pas disponible.
          </p>
        </div>
      </div>
    );
  }

  const intervention = devis.intervention || {};
  const vehicule = intervention.vehicule || {};
  const client = vehicule.client || {};

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-green-100 rounded-full blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
              <FaClock />
              Suivi client
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-950">
              Suivi de votre intervention
            </h1>

            <p className="text-slate-500 mt-2 max-w-2xl">
              Suivez l’état de votre devis, de votre intervention et de votre véhicule.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Avancement</h2>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    step.rejected
                      ? "bg-red-50 text-red-600 border-red-200"
                      : step.done
                      ? "bg-green-50 text-green-600 border-green-200"
                      : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}
                >
                  {step.icon}
                </div>

                <div>
                  <p
                    className={`font-bold ${
                      step.rejected
                        ? "text-red-600"
                        : step.done
                        ? "text-green-600"
                        : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </p>

                  <p className="text-xs text-slate-400">
                    {step.rejected
                      ? "Refusé par le client"
                      : step.done
                      ? "Étape terminée"
                      : "En attente"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InfoPanel title="Client" icon={<FaUser />} color="text-purple-600">
            <Detail
              label="Nom"
              value={`${client.nom || ""} ${client.prenom || ""}`.trim()}
            />
            <Detail label="Email" value={client.email} />
            <Detail label="Téléphone" value={client.telephone} />
          </InfoPanel>

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
            title="Devis"
            icon={<FaMoneyBillWave />}
            color="text-green-600"
          >
            <Detail label="Montant" value={money(devis.montant)} />
            <Detail label="Statut client" value={devis.statutClient} />
            <Detail label="Statut interne" value={devis.statut} />
            <Detail label="Validation" value={formatDate(devis.dateValidation)} />
          </InfoPanel>
        </div>

        <InfoPanel
          title="Intervention"
          icon={<FaTools />}
          color="text-orange-600"
        >
          <Detail label="Type panne" value={intervention.typePanne} />
          <Detail label="Description" value={intervention.description} />
          <Detail label="Statut" value={intervention.statut} />
          <Detail label="Date début" value={formatDate(intervention.dateDebut)} />
          <Detail label="Date fin" value={formatDate(intervention.dateFin)} />
        </InfoPanel>
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