import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getVehicules } from "../services/vehicule.service";
import { getInterventions } from "../services/intervention.service";
import { getFactures } from "../services/facture.service";
import { getPieces } from "../services/piece.service";
import { getDevis } from "../services/devis.service";

import {
  FaArrowLeft,
  FaChartLine,
  FaDownload,
  FaFileExcel,
  FaFileInvoice,
  FaPrint,
  FaTools,
  FaCar,
  FaBoxes,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaUserCog,
  FaClipboardList,
  FaSyncAlt,
  FaCalendarAlt,
  FaEye,
} from "react-icons/fa";

const API_URL = "http://localhost:8080";

export default function Rapports() {
  const navigate = useNavigate();

  const [vehicules, setVehicules] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [factures, setFactures] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [devis, setDevis] = useState([]);

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [activeReport, setActiveReport] = useState("global");

  const money = (value) => `${Number(value || 0).toFixed(2)} DH`;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("fr-FR");
  };

  const load = async () => {
    try {
      setLoading(true);

      const [v, i, f, p, d] = await Promise.all([
        getVehicules(),
        getInterventions(),
        getFactures(),
        getPieces(),
        getDevis(),
      ]);

      setVehicules(v.data || []);
      setInterventions(i.data || []);
      setFactures(f.data || []);
      setPieces(p.data || []);
      setDevis(d.data || []);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement des rapports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filterByPeriod = (items, fields) => {
    if (period === "all") return items;

    const now = new Date();
    const limit = new Date();

    if (period === "month") limit.setMonth(now.getMonth() - 1);
    if (period === "quarter") limit.setMonth(now.getMonth() - 3);
    if (period === "year") limit.setFullYear(now.getFullYear() - 1);

    return items.filter((item) => {
      const dateValue = fields.map((field) => item[field]).find(Boolean);
      if (!dateValue) return true;
      return new Date(dateValue) >= limit;
    });
  };

  const scopedInterventions = useMemo(
    () => filterByPeriod(interventions, ["dateDebut", "dateFin", "createdAt"]),
    [interventions, period]
  );

  const scopedFactures = useMemo(
    () => filterByPeriod(factures, ["dateFacture", "createdAt"]),
    [factures, period]
  );

  const scopedDevis = useMemo(
    () => filterByPeriod(devis, ["dateCreation", "dateValidation", "createdAt"]),
    [devis, period]
  );

  const analytics = useMemo(() => {
    const totalMaintenance = scopedInterventions.reduce(
      (sum, i) => sum + Number(i.cout || 0),
      0
    );

    const totalFacture = scopedFactures.reduce(
      (sum, f) => sum + Number(f.montantTtc || 0),
      0
    );

    const totalPaid = scopedFactures
      .filter((f) => f.statut === "PAID")
      .reduce((sum, f) => sum + Number(f.montantTtc || 0), 0);

    const totalUnpaid = scopedFactures
      .filter((f) => f.statut === "UNPAID")
      .reduce((sum, f) => sum + Number(f.montantTtc || 0), 0);

    const pendingInterventions = scopedInterventions.filter(
      (i) => i.statut === "PENDING"
    );

    const inProgressInterventions = scopedInterventions.filter(
      (i) => i.statut === "IN_PROGRESS"
    );

    const doneInterventions = scopedInterventions.filter(
      (i) => i.statut === "DONE"
    );

    const pendingDevis = scopedDevis.filter((d) => d.statut === "PENDING");
    const approvedDevis = scopedDevis.filter((d) => d.statut === "APPROVED");
    const rejectedDevis = scopedDevis.filter((d) => d.statut === "REJECTED");

    const paidFactures = scopedFactures.filter((f) => f.statut === "PAID");
    const unpaidFactures = scopedFactures.filter((f) => f.statut === "UNPAID");

    const lowStock = pieces.filter((p) => Number(p.quantiteStock || 0) <= 5);
    const ruptureStock = pieces.filter((p) => Number(p.quantiteStock || 0) <= 0);

    const maintenanceVehicules = vehicules.filter(
      (v) => v.statut === "MAINTENANCE"
    );

    const activeVehicules = vehicules.filter((v) => v.statut === "ACTIVE");

    return {
      totalMaintenance,
      totalFacture,
      totalPaid,
      totalUnpaid,
      pendingInterventions,
      inProgressInterventions,
      doneInterventions,
      pendingDevis,
      approvedDevis,
      rejectedDevis,
      paidFactures,
      unpaidFactures,
      lowStock,
      ruptureStock,
      maintenanceVehicules,
      activeVehicules,
    };
  }, [scopedInterventions, scopedFactures, scopedDevis, pieces, vehicules]);

  const topVehicules = useMemo(() => {
    const map = {};

    scopedInterventions.forEach((i) => {
      const id = i.vehicule?.id || "unknown";
      const label =
        i.vehicule?.immatriculation ||
        `${i.vehicule?.marque || ""} ${i.vehicule?.modele || ""}`.trim() ||
        "Véhicule inconnu";

      if (!map[id]) {
        map[id] = {
          id,
          label,
          marque: i.vehicule?.marque || "-",
          modele: i.vehicule?.modele || "-",
          count: 0,
          cost: 0,
        };
      }

      map[id].count += 1;
      map[id].cost += Number(i.cout || 0);
    });

    return Object.values(map)
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10);
  }, [scopedInterventions]);

  const technicienPerformance = useMemo(() => {
    const map = {};

    scopedInterventions.forEach((i) => {
      const name = i.technicien?.nom || "Non affecté";

      if (!map[name]) {
        map[name] = {
          name,
          total: 0,
          done: 0,
          inProgress: 0,
          cost: 0,
        };
      }

      map[name].total += 1;
      if (i.statut === "DONE") map[name].done += 1;
      if (i.statut === "IN_PROGRESS") map[name].inProgress += 1;
      map[name].cost += Number(i.cout || 0);
    });

    return Object.values(map).sort((a, b) => b.done - a.done);
  }, [scopedInterventions]);

  const exportCSV = (filename, rows) => {
    if (!rows || rows.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    const headers = Object.keys(rows[0]);

    const csv = [
      headers.join(";"),
      ...rows.map((row) =>
        headers
          .map((field) => {
            const value = row[field] ?? "";
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(";")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  const exportInterventions = () => {
    const rows = scopedInterventions.map((i) => ({
      ID: i.id,
      Vehicule: i.vehicule?.immatriculation || "-",
      Client: i.vehicule?.client
        ? `${i.vehicule.client.nom || ""} ${i.vehicule.client.prenom || ""}`
        : "-",
      TypePanne: i.typePanne || "-",
      Statut: i.statut || "-",
      Technicien: i.technicien?.nom || "-",
      Cout: Number(i.cout || 0),
      DateDebut: formatDate(i.dateDebut),
      DateFin: formatDate(i.dateFin),
    }));

    exportCSV("rapport_interventions.csv", rows);
  };

  const exportFactures = () => {
    const rows = scopedFactures.map((f) => ({
      ID: f.id,
      Numero: f.numero || "-",
      Vehicule: f.intervention?.vehicule?.immatriculation || "-",
      Client: f.intervention?.vehicule?.client
        ? `${f.intervention.vehicule.client.nom || ""} ${
            f.intervention.vehicule.client.prenom || ""
          }`
        : "-",
      MontantHT: Number(f.montantHt || 0),
      TVA: Number(f.tva || 0),
      MontantTTC: Number(f.montantTtc || 0),
      Statut: f.statut || "-",
      DateFacture: formatDate(f.dateFacture),
    }));

    exportCSV("rapport_factures.csv", rows);
  };

  const exportStock = () => {
    const rows = pieces.map((p) => ({
      ID: p.id,
      Nom: p.nom || "-",
      Reference: p.reference || "-",
      Prix: Number(p.prix || 0),
      QuantiteStock: Number(p.quantiteStock || 0),
      Etat:
        Number(p.quantiteStock || 0) <= 0
          ? "Rupture"
          : Number(p.quantiteStock || 0) <= 5
          ? "Stock critique"
          : "Normal",
    }));

    exportCSV("rapport_stock.csv", rows);
  };

  const printReport = () => {
    window.print();
  };

  const reportTabs = [
    { id: "global", label: "Global", icon: <FaChartLine /> },
    { id: "interventions", label: "Interventions", icon: <FaTools /> },
    { id: "finance", label: "Finance", icon: <FaMoneyBillWave /> },
    { id: "stock", label: "Stock", icon: <FaBoxes /> },
    { id: "vehicules", label: "Véhicules", icon: <FaCar /> },
    { id: "techniciens", label: "Techniciens", icon: <FaUserCog /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fb] flex items-center justify-center text-slate-600">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          Chargement des rapports...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f8fb] text-slate-900 p-6 space-y-6 print:bg-white">
      {/* HEADER */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm print:shadow-none">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-100 rounded-full blur-3xl print:hidden" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-green-100 rounded-full blur-3xl print:hidden" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate(-1)}
              className="print:hidden w-12 h-12 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700"
            >
              <FaArrowLeft />
            </button>

            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <FaChartLine />
                Centre de rapports
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-slate-950">
                Rapports professionnels
              </h1>

              <p className="text-slate-500 mt-2 max-w-3xl">
                Analyse complète de la flotte, des interventions, des devis, des factures,
                du stock et de la performance opérationnelle.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 print:hidden">
            <button
              onClick={load}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
            >
              <FaSyncAlt />
              Actualiser
            </button>

            <button
              onClick={printReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
            >
              <FaPrint />
              Imprimer / PDF
            </button>

            <button
              onClick={exportInterventions}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
            >
              <FaFileExcel />
              Export interventions
            </button>

            <button
              onClick={exportFactures}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
            >
              <FaDownload />
              Export factures
            </button>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:hidden">
        <div>
          <h2 className="font-black flex items-center gap-2 text-slate-950">
            <FaCalendarAlt className="text-blue-600" />
            Période du rapport
          </h2>
          <p className="text-sm text-slate-500">
            Sélectionnez une période pour filtrer les données affichées.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Tout" },
            { id: "month", label: "30 jours" },
            { id: "quarter", label: "3 mois" },
            { id: "year", label: "1 an" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 rounded-2xl font-semibold transition ${
                period === p.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* REPORT TABS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-3 flex flex-wrap gap-3 shadow-sm print:hidden">
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={`px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition ${
              activeReport === tab.id
                ? "bg-blue-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <ReportCard
          title="Coût maintenance"
          value={money(analytics.totalMaintenance)}
          icon={<FaTools />}
          color="text-blue-600"
        />

        <ReportCard
          title="Total facturé"
          value={money(analytics.totalFacture)}
          icon={<FaFileInvoice />}
          color="text-emerald-600"
        />

        <ReportCard
          title="Impayé"
          value={money(analytics.totalUnpaid)}
          icon={<FaExclamationTriangle />}
          color="text-red-600"
        />

        <ReportCard
          title="Stock critique"
          value={analytics.lowStock.length}
          icon={<FaBoxes />}
          color="text-yellow-600"
        />
      </div>

      {/* GLOBAL */}
      {activeReport === "global" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Panel title="Résumé global" icon={<FaChartLine className="text-blue-600" />}>
            <div className="space-y-3">
              <Line label="Véhicules total" value={vehicules.length} />
              <Line label="Véhicules actifs" value={analytics.activeVehicules.length} />
              <Line label="Véhicules en maintenance" value={analytics.maintenanceVehicules.length} />
              <Line label="Interventions total" value={scopedInterventions.length} />
              <Line label="Interventions terminées" value={analytics.doneInterventions.length} />
              <Line label="Devis total" value={scopedDevis.length} />
              <Line label="Factures total" value={scopedFactures.length} />
              <Line label="Pièces stock critique" value={analytics.lowStock.length} />
            </div>
          </Panel>

          <Panel title="Alertes rapport" icon={<FaExclamationTriangle className="text-red-600" />}>
            <div className="space-y-3">
              {analytics.lowStock.length > 0 && (
                <Alert text={`${analytics.lowStock.length} pièce(s) en stock critique.`} color="yellow" />
              )}

              {analytics.ruptureStock.length > 0 && (
                <Alert text={`${analytics.ruptureStock.length} pièce(s) en rupture.`} color="red" />
              )}

              {analytics.unpaidFactures.length > 0 && (
                <Alert text={`${analytics.unpaidFactures.length} facture(s) impayée(s).`} color="red" />
              )}

              {analytics.pendingDevis.length > 0 && (
                <Alert text={`${analytics.pendingDevis.length} devis en attente.`} color="blue" />
              )}

              {analytics.lowStock.length === 0 &&
                analytics.unpaidFactures.length === 0 &&
                analytics.pendingDevis.length === 0 && (
                  <Alert text="Aucune alerte critique." color="green" />
                )}
            </div>
          </Panel>

          <Panel title="Synthèse financière" icon={<FaMoneyBillWave className="text-green-600" />}>
            <div className="space-y-3">
              <Line label="Montant facturé" value={money(analytics.totalFacture)} />
              <Line label="Montant payé" value={money(analytics.totalPaid)} />
              <Line label="Montant impayé" value={money(analytics.totalUnpaid)} />
              <Line label="Factures payées" value={analytics.paidFactures.length} />
              <Line label="Factures impayées" value={analytics.unpaidFactures.length} />
            </div>
          </Panel>
        </div>
      )}

      {/* INTERVENTIONS */}
      {activeReport === "interventions" && (
        <Panel
          title="Rapport des interventions"
          icon={<FaTools className="text-blue-600" />}
          action={
            <button
              onClick={exportInterventions}
              className="print:hidden bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
            >
              <FaFileExcel />
              Exporter
            </button>
          }
        >
          <Table
            headers={[
              "ID",
              "Véhicule",
              "Client",
              "Type panne",
              "Statut",
              "Technicien",
              "Coût",
              "Date début",
              "Action",
            ]}
          >
            {scopedInterventions.map((i) => (
              <tr key={i.id} className="border-b border-slate-100">
                <Td>#{i.id}</Td>
                <Td>{i.vehicule?.immatriculation || "-"}</Td>
                <Td>
                  {i.vehicule?.client
                    ? `${i.vehicule.client.nom || ""} ${i.vehicule.client.prenom || ""}`
                    : "-"}
                </Td>
                <Td>{i.typePanne || "-"}</Td>
                <Td>
                  <Badge value={i.statut} />
                </Td>
                <Td>{i.technicien?.nom || "-"}</Td>
                <Td>{money(i.cout)}</Td>
                <Td>{formatDate(i.dateDebut)}</Td>
                <Td>
                  <button
                    onClick={() => navigate(`/interventions/details/${i.id}`)}
                    className="print:hidden text-blue-600 hover:bg-blue-50 p-2 rounded-xl"
                  >
                    <FaEye />
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      {/* FINANCE */}
      {activeReport === "finance" && (
        <Panel
          title="Rapport financier"
          icon={<FaMoneyBillWave className="text-green-600" />}
          action={
            <button
              onClick={exportFactures}
              className="print:hidden bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
            >
              <FaFileExcel />
              Exporter
            </button>
          }
        >
          <Table
            headers={[
              "ID",
              "Numéro",
              "Client",
              "Véhicule",
              "HT",
              "TVA",
              "TTC",
              "Statut",
              "Date",
            ]}
          >
            {scopedFactures.map((f) => (
              <tr key={f.id} className="border-b border-slate-100">
                <Td>#{f.id}</Td>
                <Td>{f.numero || "-"}</Td>
                <Td>
                  {f.intervention?.vehicule?.client
                    ? `${f.intervention.vehicule.client.nom || ""} ${
                        f.intervention.vehicule.client.prenom || ""
                      }`
                    : "-"}
                </Td>
                <Td>{f.intervention?.vehicule?.immatriculation || "-"}</Td>
                <Td>{money(f.montantHt)}</Td>
                <Td>{money(f.tva)}</Td>
                <Td>{money(f.montantTtc)}</Td>
                <Td>
                  <Badge value={f.statut} />
                </Td>
                <Td>{formatDate(f.dateFacture)}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      {/* STOCK */}
      {activeReport === "stock" && (
        <Panel
          title="Rapport du stock"
          icon={<FaBoxes className="text-yellow-600" />}
          action={
            <button
              onClick={exportStock}
              className="print:hidden bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
            >
              <FaFileExcel />
              Exporter
            </button>
          }
        >
          <Table headers={["ID", "Nom", "Référence", "Prix", "Stock", "État"]}>
            {pieces.map((p) => {
              const stock = Number(p.quantiteStock || 0);

              return (
                <tr key={p.id} className="border-b border-slate-100">
                  <Td>#{p.id}</Td>
                  <Td>{p.nom || "-"}</Td>
                  <Td>{p.reference || "-"}</Td>
                  <Td>{money(p.prix)}</Td>
                  <Td>{stock}</Td>
                  <Td>
                    {stock <= 0 ? (
                      <Badge value="RUPTURE" color="red" />
                    ) : stock <= 5 ? (
                      <Badge value="CRITIQUE" color="yellow" />
                    ) : (
                      <Badge value="NORMAL" color="green" />
                    )}
                  </Td>
                </tr>
              );
            })}
          </Table>
        </Panel>
      )}

      {/* VEHICULES */}
      {activeReport === "vehicules" && (
        <Panel title="Top véhicules coûteux" icon={<FaCar className="text-blue-600" />}>
          <Table headers={["Véhicule", "Marque", "Modèle", "Interventions", "Coût total"]}>
            {topVehicules.map((v, index) => (
              <tr key={index} className="border-b border-slate-100">
                <Td>{v.label}</Td>
                <Td>{v.marque}</Td>
                <Td>{v.modele}</Td>
                <Td>{v.count}</Td>
                <Td>{money(v.cost)}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      {/* TECHNICIENS */}
      {activeReport === "techniciens" && (
        <Panel title="Performance techniciens" icon={<FaUserCog className="text-purple-600" />}>
          <Table headers={["Technicien", "Interventions", "Terminées", "En cours", "Coût traité"]}>
            {technicienPerformance.map((t, index) => (
              <tr key={index} className="border-b border-slate-100">
                <Td>{t.name}</Td>
                <Td>{t.total}</Td>
                <Td>{t.done}</Td>
                <Td>{t.inProgress}</Td>
                <Td>{money(t.cost)}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}
    </div>
  );
}

function ReportCard({ title, value, icon, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <span className={`${color} text-xl`}>{icon}</span>
      </div>

      <h2 className={`text-3xl font-black mt-3 ${color}`}>{value}</h2>
    </div>
  );
}

function Panel({ title, icon, children, action }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm print:shadow-none print:border-slate-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
          {icon}
          {title}
        </h2>

        {action}
      </div>

      {children}
    </div>
  );
}

function Line({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-3 border-b border-slate-100">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-900 text-right">
        {value || "-"}
      </span>
    </div>
  );
}

function Alert({ text, color }) {
  const style =
    color === "red"
      ? "bg-red-50 border-red-200 text-red-700"
      : color === "yellow"
      ? "bg-yellow-50 border-yellow-200 text-yellow-700"
      : color === "blue"
      ? "bg-blue-50 border-blue-200 text-blue-700"
      : "bg-green-50 border-green-200 text-green-700";

  return (
    <div className={`border rounded-2xl p-4 font-semibold ${style}`}>
      {text}
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left p-3 font-bold text-slate-600 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Td({ children }) {
  return <td className="p-3 text-slate-700 whitespace-nowrap">{children}</td>;
}

function Badge({ value, color }) {
  const c =
    color === "red" || value === "REJECTED" || value === "RUPTURE"
      ? "bg-red-50 text-red-700 border-red-200"
      : color === "yellow" ||
        value === "PENDING" ||
        value === "UNPAID" ||
        value === "CRITIQUE"
      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
      : "bg-green-50 text-green-700 border-green-200";

  return (
    <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${c}`}>
      {value || "-"}
    </span>
  );
}