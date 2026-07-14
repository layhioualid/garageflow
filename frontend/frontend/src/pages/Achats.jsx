import { useEffect, useMemo, useState } from "react";

import {
  getAchats,
  createAchat,
  deleteAchat,
  getTotalAchats,
} from "../services/achat.service";

import { getPieces } from "../services/piece.service";
import { getFournisseurs } from "../services/fournisseur.service";

import {
  FaShoppingCart,
  FaPlus,
  FaTrash,
  FaEuroSign,
  FaBox,
  FaIndustry,
  FaCalendarAlt,
  FaSearch,
  FaTimes,
  FaSave,
  FaBoxes,
  FaExclamationTriangle,
  FaSyncAlt,
  FaEye,
  FaReceipt,
  FaClipboardList,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function Achats() {
  const [achats, setAchats] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [filteredPieces, setFilteredPieces] = useState([]);
  const [total, setTotal] = useState(0);

  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAchat, setSelectedAchat] = useState(null);

  const [search, setSearch] = useState("");
  const [fournisseurFilter, setFournisseurFilter] = useState("ALL");

  const [form, setForm] = useState({
    piece: "",
    fournisseur: "",
    quantite: 1,
    dateAchat: "",
  });

  const load = async () => {
    try {
      const [a, p, f, t] = await Promise.all([
        getAchats(),
        getPieces(),
        getFournisseurs(),
        getTotalAchats(),
      ]);

      setAchats(a.data || []);
      setPieces(p.data || []);
      setFournisseurs(f.data || []);
      setTotal(t.data || 0);
      setFilteredPieces(p.data || []);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du chargement des achats");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const money = (v) => `${Number(v || 0).toFixed(2)} DH`;

  const selectedPiece = pieces.find((p) => p.id === Number(form.piece));

  const estimatedTotal = selectedPiece
    ? Number(selectedPiece.prix || 0) * Number(form.quantite || 0)
    : 0;

  const handleFournisseurChange = (id) => {
    const fournisseurId = Number(id);

    setForm({
      ...form,
      fournisseur: fournisseurId || "",
      piece: "",
    });

    if (!fournisseurId) {
      setFilteredPieces(pieces);
      return;
    }

    setFilteredPieces(pieces.filter((p) => p.fournisseur?.id === fournisseurId));
  };

  const resetForm = () => {
    setForm({
      piece: "",
      fournisseur: "",
      quantite: 1,
      dateAchat: "",
    });
    setFilteredPieces(pieces);
  };

  const save = async () => {
    if (!form.fournisseur || !form.piece || !form.quantite || !form.dateAchat) {
      alert("Veuillez remplir fournisseur, pièce, quantité et date.");
      return;
    }

    await createAchat({
      piece: { id: Number(form.piece) },
      fournisseur: { id: Number(form.fournisseur) },
      quantite: Number(form.quantite),
      dateAchat: form.dateAchat,
    });

    resetForm();
    setOpen(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer cet achat ?")) return;

    await deleteAchat(id);
    setDetailsOpen(false);
    setSelectedAchat(null);
    load();
  };

  const openDetails = (achat) => {
    setSelectedAchat(achat);
    setDetailsOpen(true);
  };

  const filteredAchats = useMemo(() => {
    return achats
      .filter((a) => {
        const text = `
          ${a.piece?.nom || ""}
          ${a.piece?.reference || ""}
          ${a.fournisseur?.nom || ""}
          ${a.dateAchat || ""}
          ${a.montantTotal || ""}
        `.toLowerCase();

        const matchSearch = text.includes(search.toLowerCase());

        const matchFournisseur =
          fournisseurFilter === "ALL" ||
          String(a.fournisseur?.id) === String(fournisseurFilter);

        return matchSearch && matchFournisseur;
      })
      .sort((a, b) => {
        const dateA = new Date(a.dateAchat || 0);
        const dateB = new Date(b.dateAchat || 0);
        return dateB - dateA;
      });
  }, [achats, search, fournisseurFilter]);

  const stats = useMemo(() => {
    const quantity = achats.reduce((sum, a) => sum + Number(a.quantite || 0), 0);
    const avg = achats.length > 0 ? Number(total || 0) / achats.length : 0;

    return {
      count: achats.length,
      total,
      quantity,
      avg,
    };
  }, [achats, total]);

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-6 shadow-sm">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-purple-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaShoppingCart className="text-2xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <FaShoppingCart />
                Suivi des achats
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950">
                Gestion des achats
              </h1>

              <p className="text-slate-500 mt-2 max-w-2xl">
                Suivez les entrées de stock, les fournisseurs, les quantités achetées
                et les dépenses liées aux pièces du garage.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={load}
              className="bg-white hover:bg-slate-50 px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition border border-slate-200 text-slate-700 shadow-sm"
            >
              <FaSyncAlt />
              Actualiser
            </button>

            <button
              onClick={() => {
                resetForm();
                setOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition shadow-sm"
            >
              <FaPlus />
              Nouvel achat
            </button>
          </div>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <StatBox
            title="Total dépenses"
            value={money(stats.total)}
            icon={FaMoneyBillWave}
            color="text-emerald-600"
          />
          <StatBox
            title="Total achats"
            value={stats.count}
            icon={FaShoppingCart}
            color="text-blue-600"
          />
          <StatBox
            title="Quantités achetées"
            value={stats.quantity}
            icon={FaBoxes}
            color="text-purple-600"
          />
          <StatBox
            title="Fournisseurs"
            value={fournisseurs.length}
            icon={FaIndustry}
            color="text-yellow-600"
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between shadow-sm">
        <div>
          <h2 className="font-bold flex items-center gap-2 text-slate-900">
            <FaSearch className="text-blue-600" />
            Recherche et filtres
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Filtrez les achats par pièce, fournisseur, référence ou date.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher pièce, fournisseur, référence..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          <select
            value={fournisseurFilter}
            onChange={(e) => setFournisseurFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition min-w-[220px]"
          >
            <option value="ALL">Tous les fournisseurs</option>
            {fournisseurs.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[980px]">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4 text-left">Pièce</th>
                <th className="p-4 text-left">Fournisseur</th>
                <th className="p-4 text-left">Quantité</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAchats.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500">
                    Aucun achat trouvé.
                  </td>
                </tr>
              ) : (
                filteredAchats.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => openDetails(a)}
                    className="border-t border-slate-100 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                          <FaBox />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {a.piece?.nom || "-"}
                          </p>
                          <p className="text-xs text-slate-500">
                            Ref: {a.piece?.reference || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-2 text-yellow-600 font-medium">
                        <FaIndustry />
                        {a.fournisseur?.nom || "-"}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {a.quantite}
                      </span>
                    </td>

                    <td className="p-4 text-slate-500">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt />
                        {a.dateAchat
                          ? new Date(a.dateAchat).toLocaleDateString("fr-FR")
                          : "-"}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-emerald-600">
                      {money(a.montantTotal)}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetails(a);
                          }}
                          className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl transition"
                          title="Voir détails"
                        >
                          <FaEye />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(a.id);
                          }}
                          className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition"
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

      {/* CREATE MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[9999] p-4">
          <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="shrink-0 flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                  <FaShoppingCart className="text-blue-600" />
                  Créer un achat
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Ajouter une entrée de stock et mettre à jour les quantités.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Fournisseur">
                  <select
                    className="w-full p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={form.fournisseur}
                    onChange={(e) => handleFournisseurChange(e.target.value)}
                  >
                    <option value="">Choisir fournisseur</option>
                    {fournisseurs.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nom}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Pièce">
                  <select
                    className="w-full p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={form.piece}
                    onChange={(e) => setForm({ ...form, piece: e.target.value })}
                  >
                    <option value="">Choisir pièce</option>
                    {filteredPieces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nom} - {p.prix} DH
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Quantité">
                  <input
                    type="number"
                    min="1"
                    className="w-full p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={form.quantite}
                    onChange={(e) =>
                      setForm({ ...form, quantite: e.target.value })
                    }
                  />
                </Field>

                <Field label="Date achat">
                  <input
                    type="date"
                    className="w-full p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={form.dateAchat}
                    onChange={(e) =>
                      setForm({ ...form, dateAchat: e.target.value })
                    }
                  />
                </Field>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-blue-600 mt-1" />

                  <div className="w-full">
                    <p className="font-semibold text-blue-700">
                      Aperçu de l’achat
                    </p>

                    <p className="text-sm text-slate-600 mt-1">
                      Cette opération va augmenter le stock de la pièce sélectionnée.
                    </p>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <PreviewBox label="Pièce" value={selectedPiece?.nom || "-"} />
                      <PreviewBox label="Quantité" value={form.quantite || 0} />
                      <PreviewBox
                        label="Total estimé"
                        value={money(estimatedTotal)}
                        color="text-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
              >
                Annuler
              </button>

              <button
                onClick={save}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition font-semibold flex items-center gap-2"
              >
                <FaSave />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {detailsOpen && selectedAchat && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
          onClick={() => setDetailsOpen(false)}
        >
          <div
            className="w-full max-w-5xl max-h-[92vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 via-purple-50 to-white flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                  <FaReceipt />
                  Détails achat
                </div>

                <h2 className="text-3xl font-black text-slate-950">
                  Achat #{selectedAchat.id}
                </h2>

                <p className="text-slate-500 mt-2">
                  Consultation complète de l’achat, de la pièce et du fournisseur.
                </p>
              </div>

              <button
                onClick={() => setDetailsOpen(false)}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InfoBox
                  title="Total achat"
                  value={money(selectedAchat.montantTotal)}
                  icon={FaEuroSign}
                  color="text-emerald-600"
                />
                <InfoBox
                  title="Quantité"
                  value={selectedAchat.quantite}
                  icon={FaBoxes}
                  color="text-blue-600"
                />
                <InfoBox
                  title="Prix unitaire"
                  value={money(selectedAchat.piece?.prix)}
                  icon={FaBox}
                  color="text-purple-600"
                />
                <InfoBox
                  title="Date achat"
                  value={
                    selectedAchat.dateAchat
                      ? new Date(selectedAchat.dateAchat).toLocaleDateString("fr-FR")
                      : "-"
                  }
                  icon={FaCalendarAlt}
                  color="text-yellow-600"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <DetailCard
                  title="Pièce achetée"
                  subtitle="Informations de la pièce"
                  icon={FaBox}
                  color="text-blue-600"
                  rows={[
                    ["Nom", selectedAchat.piece?.nom || "-"],
                    ["Référence", selectedAchat.piece?.reference || "-"],
                    ["Prix unitaire", money(selectedAchat.piece?.prix)],
                    ["Stock actuel", selectedAchat.piece?.quantiteStock ?? "-"],
                  ]}
                />

                <DetailCard
                  title="Fournisseur"
                  subtitle="Informations fournisseur"
                  icon={FaIndustry}
                  color="text-yellow-600"
                  rows={[
                    ["Nom", selectedAchat.fournisseur?.nom || "-"],
                    ["Téléphone", selectedAchat.fournisseur?.telephone || "-"],
                    ["Email", selectedAchat.fournisseur?.email || "-"],
                    ["Adresse", selectedAchat.fournisseur?.adresse || "-"],
                  ]}
                />
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-slate-200 rounded-3xl p-6">
                <h3 className="font-bold text-xl mb-5 flex items-center gap-2 text-slate-900">
                  <FaClipboardList className="text-emerald-600" />
                  Résumé opérationnel
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PreviewBox label="Pièce" value={selectedAchat.piece?.nom || "-"} />

                  <PreviewBox
                    label="Fournisseur"
                    value={selectedAchat.fournisseur?.nom || "-"}
                  />

                  <PreviewBox
                    label="Montant"
                    value={money(selectedAchat.montantTotal)}
                    color="text-emerald-600"
                  />
                </div>

                <p className="text-slate-500 text-sm mt-5">
                  Cet achat représente une entrée de stock liée à la pièce sélectionnée.
                  Le montant total est calculé automatiquement à partir du prix unitaire
                  et de la quantité achetée.
                </p>
              </div>
            </div>

            <div className="shrink-0 p-6 border-t border-slate-200 flex flex-col md:flex-row justify-end gap-3">
              <button
                onClick={() => setDetailsOpen(false)}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
              >
                Fermer
              </button>

              <button
                onClick={() => remove(selectedAchat.id)}
                className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white transition font-semibold flex items-center justify-center gap-2"
              >
                <FaTrash />
                Supprimer achat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */

function StatBox({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{title}</p>
        <Icon className={color} />
      </div>

      <h2 className={`text-3xl font-black mt-2 ${color}`}>{value}</h2>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm text-slate-500 block mb-2">{label}</label>
      {children}
    </div>
  );
}

function PreviewBox({ label, value, color = "text-slate-900" }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function InfoBox({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xs text-slate-500">{title}</p>
        <Icon className={color} />
      </div>

      <h3 className={`text-xl font-black ${color}`}>{value}</h3>
    </div>
  );
}

function DetailCard({ title, subtitle, icon: Icon, color, rows }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center ${color}`}
        >
          <Icon />
        </div>

        <div>
          <h3 className="font-bold text-lg text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map(([label, value], index) => (
          <div
            key={index}
            className="flex justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0"
          >
            <span className="text-slate-500 text-sm">{label}</span>
            <span className="font-semibold text-sm text-right text-slate-900">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}