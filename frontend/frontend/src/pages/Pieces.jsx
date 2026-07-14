import { useEffect, useMemo, useState } from "react";

import {
  getPieces,
  createPiece,
  deletePiece,
} from "../services/piece.service";

import { getFournisseurs } from "../services/fournisseur.service";

import {
  FaBox,
  FaPlus,
  FaTrash,
  FaIndustry,
  FaExclamationTriangle,
  FaSearch,
  FaWarehouse,
  FaEuroSign,
  FaBoxes,
  FaTimes,
  FaSave,
  FaSyncAlt,
  FaLayerGroup,
  FaMoneyBillWave,
  FaCubes,
  FaEye,
  FaSortAmountDown,
  FaChartLine,
  FaClipboardList,
  FaFilter,
} from "react-icons/fa";

export default function Pieces() {
  const [pieces, setPieces] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);

  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [supplierFilter, setSupplierFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("VALUE_DESC");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    reference: "",
    prix: "",
    quantiteStock: "",
    seuilAlerte: "",
    fournisseur: "",
  });

  const load = async () => {
    try {
      setLoading(true);

      const [p, f] = await Promise.all([getPieces(), getFournisseurs()]);

      setPieces(p.data || []);
      setFournisseurs(f.data || []);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement des pièces.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const money = (value) => `${Number(value || 0).toFixed(2)} DH`;

  const getSeuil = (piece) => Number(piece.seuilAlerte ?? 3);

  const isLowStock = (piece) => {
    return Number(piece.quantiteStock || 0) <= getSeuil(piece);
  };

  const getStockValue = (piece) => {
    return Number(piece.prix || 0) * Number(piece.quantiteStock || 0);
  };

  const resetForm = () => {
    setForm({
      nom: "",
      reference: "",
      prix: "",
      quantiteStock: "",
      seuilAlerte: "",
      fournisseur: "",
    });
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const save = async () => {
    try {
      if (!form.nom.trim() || !form.prix || !form.quantiteStock) {
        alert("Veuillez remplir le nom, le prix et la quantité.");
        return;
      }

      setSaving(true);

      await createPiece({
        nom: form.nom.trim(),
        reference: form.reference.trim(),
        prix: Number(form.prix),
        quantiteStock: Number(form.quantiteStock),
        seuilAlerte: form.seuilAlerte ? Number(form.seuilAlerte) : 3,
        fournisseur: form.fournisseur
          ? { id: Number(form.fournisseur) }
          : null,
      });

      resetForm();
      setOpen(false);
      await load();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement de la pièce.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer cette pièce ?")) return;

    try {
      await deletePiece(id);

      if (selected?.id === id) {
        setSelected(null);
        setDetailsOpen(false);
      }

      await load();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression de la pièce.");
    }
  };

  const openDetails = (piece) => {
    setSelected(piece);
    setDetailsOpen(true);
  };

  const filteredPieces = useMemo(() => {
    const result = pieces.filter((p) => {
      const text = `
        ${p.nom || ""}
        ${p.reference || ""}
        ${p.fournisseur?.nom || ""}
      `.toLowerCase();

      const matchSearch = text.includes(search.toLowerCase());

      const matchStock =
        filter === "ALL"
          ? true
          : filter === "LOW"
          ? isLowStock(p)
          : !isLowStock(p);

      const matchSupplier =
        supplierFilter === "ALL"
          ? true
          : Number(p.fournisseur?.id) === Number(supplierFilter);

      return matchSearch && matchStock && matchSupplier;
    });

    return result.sort((a, b) => {
      if (sortBy === "VALUE_DESC") return getStockValue(b) - getStockValue(a);
      if (sortBy === "VALUE_ASC") return getStockValue(a) - getStockValue(b);
      if (sortBy === "STOCK_ASC") {
        return Number(a.quantiteStock || 0) - Number(b.quantiteStock || 0);
      }
      if (sortBy === "STOCK_DESC") {
        return Number(b.quantiteStock || 0) - Number(a.quantiteStock || 0);
      }
      if (sortBy === "PRICE_DESC") return Number(b.prix || 0) - Number(a.prix || 0);
      if (sortBy === "PRICE_ASC") return Number(a.prix || 0) - Number(b.prix || 0);

      return String(a.nom || "").localeCompare(String(b.nom || ""));
    });
  }, [pieces, search, filter, supplierFilter, sortBy]);

  const stats = useMemo(() => {
    const total = pieces.length;

    const lowStock = pieces.filter((p) => isLowStock(p)).length;

    const outOfStock = pieces.filter(
      (p) => Number(p.quantiteStock || 0) === 0
    ).length;

    const stockValue = pieces.reduce((sum, p) => sum + getStockValue(p), 0);

    const totalStock = pieces.reduce(
      (sum, p) => sum + Number(p.quantiteStock || 0),
      0
    );

    const avgPrice =
      total === 0
        ? 0
        : pieces.reduce((sum, p) => sum + Number(p.prix || 0), 0) / total;

    return {
      total,
      lowStock,
      outOfStock,
      stockValue,
      totalStock,
      avgPrice,
    };
  }, [pieces]);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{title}</p>
        <span className={`text-lg ${color}`}>{icon}</span>
      </div>

      <h2 className={`text-3xl font-black mt-2 ${color}`}>{value}</h2>

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
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-6 shadow-sm">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-emerald-100 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaBox className="text-3xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <FaWarehouse />
                Gestion intelligente du stock
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                Gestion des pièces
              </h1>

              <p className="text-slate-500 mt-2 max-w-3xl">
                Pilotez votre inventaire, contrôlez la valeur du stock,
                surveillez les ruptures et gardez une vision claire des pièces
                critiques du garage.
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
              onClick={openCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm transition font-semibold"
            >
              <FaPlus />
              Ajouter pièce
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 mt-6">
          <StatCard
            title="Total pièces"
            value={stats.total}
            icon={<FaBox />}
            color="text-slate-900"
          />

          <StatCard
            title="Stock total"
            value={stats.totalStock}
            icon={<FaLayerGroup />}
            color="text-blue-600"
          />

          <StatCard
            title="Valeur stock"
            value={money(stats.stockValue)}
            icon={<FaMoneyBillWave />}
            color="text-emerald-600"
          />

          <StatCard
            title="Stock faible"
            value={stats.lowStock}
            icon={<FaExclamationTriangle />}
            color="text-red-600"
          />

          <StatCard
            title="Rupture"
            value={stats.outOfStock}
            icon={<FaWarehouse />}
            color="text-yellow-600"
          />

          <StatCard
            title="Prix moyen"
            value={money(stats.avgPrice)}
            icon={<FaChartLine />}
            color="text-purple-600"
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h2 className="font-bold flex items-center gap-2 text-slate-900">
              <FaFilter className="text-blue-600" />
              Recherche, filtres et tri
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Filtrez par nom, référence, fournisseur, niveau de stock ou valeur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full xl:w-auto">
            <div className="relative md:col-span-2">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher pièce, référence, fournisseur..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            >
              <option value="ALL">Toutes les pièces</option>
              <option value="LOW">Stock faible</option>
              <option value="NORMAL">Stock normal</option>
            </select>

            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            >
              <option value="ALL">Tous fournisseurs</option>
              {fournisseurs.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FaBoxes className="text-cyan-600" />
            {filteredPieces.length} pièce(s) affichée(s) sur {pieces.length}
          </div>

          <div className="flex items-center gap-3">
            <FaSortAmountDown className="text-slate-400" />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition min-w-[230px]"
            >
              <option value="VALUE_DESC">Valeur stock décroissante</option>
              <option value="VALUE_ASC">Valeur stock croissante</option>
              <option value="STOCK_ASC">Stock faible d’abord</option>
              <option value="STOCK_DESC">Stock élevé d’abord</option>
              <option value="PRICE_DESC">Prix décroissant</option>
              <option value="PRICE_ASC">Prix croissant</option>
              <option value="NAME_ASC">Nom A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Chargement des pièces...
        </div>
      ) : filteredPieces.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            <FaSearch className="text-2xl text-slate-400" />
          </div>
          Aucune pièce trouvée.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPieces.map((p) => {
            const low = isLowStock(p);
            const stockValue = getStockValue(p);

            return (
              <div
                key={p.id}
                onClick={() => openDetails(p)}
                className="group bg-white border border-slate-200 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-300"
              >
                {/* TOP */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl shadow-sm ${
                        low
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-blue-50 text-blue-600 border border-blue-200"
                      }`}
                    >
                      <FaBox />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition truncate">
                        {p.nom || "Pièce"}
                      </h2>

                      <p className="text-slate-500 text-sm mt-1 truncate">
                        {p.reference || "Aucune référence"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 text-xs px-3 py-1 rounded-full border font-semibold ${
                      low
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    {low ? "Stock faible" : "Stock OK"}
                  </span>
                </div>

                {/* BODY */}
                <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                  <InfoLine
                    icon={<FaIndustry />}
                    color="text-yellow-600"
                    label="Fournisseur"
                    value={p.fournisseur?.nom || "Non défini"}
                  />

                  <InfoLine
                    icon={<FaEuroSign />}
                    color="text-emerald-600"
                    label="Prix"
                    value={money(p.prix)}
                    valueClass="text-emerald-600 font-black"
                  />

                  <InfoLine
                    icon={<FaWarehouse />}
                    color="text-blue-600"
                    label="Quantité"
                    value={p.quantiteStock}
                    valueClass={low ? "text-red-600 font-black" : "text-slate-900 font-black"}
                  />

                  <InfoLine
                    icon={<FaExclamationTriangle />}
                    color="text-red-600"
                    label="Seuil alerte"
                    value={getSeuil(p)}
                  />

                  <InfoLine
                    icon={<FaBoxes />}
                    color="text-purple-600"
                    label="Valeur stock"
                    value={money(stockValue)}
                    valueClass="text-purple-600 font-black"
                  />
                </div>

                {/* WARNING */}
                {low && (
                  <div className="mt-4 flex items-start gap-3 text-red-700 text-sm bg-red-50 border border-red-200 rounded-2xl p-3">
                    <FaExclamationTriangle className="mt-0.5 shrink-0" />
                    <span>Stock critique — réapprovisionnement conseillé.</span>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="mt-5 flex justify-between items-center pt-4 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(p);
                    }}
                    className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl transition flex items-center gap-2"
                  >
                    <FaEye />
                    Détails
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(p.id);
                    }}
                    className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition flex items-center gap-2"
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

      {/* CREATE MODAL */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="relative overflow-hidden border-b border-slate-200 p-6 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="relative flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black flex items-center gap-3 text-slate-950">
                    <FaBox className="text-blue-600" />
                    Ajouter une pièce
                  </h2>

                  <p className="text-slate-500 text-sm mt-1">
                    Ajoutez une nouvelle pièce au stock avec prix, quantité,
                    seuil d’alerte et fournisseur.
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
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <InputField
                label="Nom pièce"
                value={form.nom}
                placeholder="Ex : Filtre à huile"
                onChange={(value) => setForm({ ...form, nom: value })}
              />

              <InputField
                label="Référence"
                value={form.reference}
                placeholder="Ex : REF-12345"
                onChange={(value) => setForm({ ...form, reference: value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Prix (DH)"
                  type="number"
                  value={form.prix}
                  placeholder="0.00"
                  onChange={(value) => setForm({ ...form, prix: value })}
                />

                <InputField
                  label="Quantité stock"
                  type="number"
                  value={form.quantiteStock}
                  placeholder="0"
                  onChange={(value) =>
                    setForm({ ...form, quantiteStock: value })
                  }
                />

                <InputField
                  label="Seuil alerte"
                  type="number"
                  value={form.seuilAlerte}
                  placeholder="3"
                  onChange={(value) => setForm({ ...form, seuilAlerte: value })}
                />
              </div>

              <div>
                <label className="text-sm text-slate-500 block mb-2">
                  Fournisseur
                </label>

                <select
                  value={form.fournisseur}
                  className="w-full p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fournisseur: e.target.value,
                    })
                  }
                >
                  <option value="">Choisir fournisseur</option>

                  {fournisseurs.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700">
                La valeur du stock sera calculée automatiquement :
                <span className="font-black ml-1">
                  {money(Number(form.prix || 0) * Number(form.quantiteStock || 0))}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
              >
                Annuler
              </button>

              <button
                onClick={save}
                disabled={saving}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                <FaSave />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {detailsOpen && selected && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
            <div className="relative overflow-hidden border-b border-slate-200">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-cyan-50 to-purple-50" />

              <div className="relative p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black shadow-sm ${
                      isLowStock(selected)
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-blue-50 text-blue-600 border border-blue-200"
                    }`}
                  >
                    <FaBox />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-black text-slate-950">
                        {selected.nom || "Pièce"}
                      </h2>

                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-semibold ${
                          isLowStock(selected)
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {isLowStock(selected)
                          ? "Stock critique"
                          : "Stock disponible"}
                      </span>
                    </div>

                    <p className="text-slate-500 mt-2">
                      Référence : {selected.reference || "-"} • Fournisseur :{" "}
                      {selected.fournisseur?.nom || "Non défini"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDetailsOpen(false);
                    setSelected(null);
                  }}
                  className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  title="Prix unitaire"
                  value={money(selected.prix)}
                  icon={<FaEuroSign />}
                  color="text-emerald-600"
                />

                <StatCard
                  title="Quantité"
                  value={selected.quantiteStock || 0}
                  icon={<FaWarehouse />}
                  color={isLowStock(selected) ? "text-red-600" : "text-blue-600"}
                />

                <StatCard
                  title="Valeur stock"
                  value={money(getStockValue(selected))}
                  icon={<FaMoneyBillWave />}
                  color="text-purple-600"
                />

                <StatCard
                  title="Seuil alerte"
                  value={getSeuil(selected)}
                  icon={<FaExclamationTriangle />}
                  color="text-yellow-600"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                  <h3 className="font-bold text-blue-600 mb-5 flex items-center gap-2">
                    <FaClipboardList />
                    Informations pièce
                  </h3>

                  <div className="space-y-3">
                    <DetailLine label="ID" value={`#${selected.id}`} />
                    <DetailLine label="Nom" value={selected.nom} />
                    <DetailLine label="Référence" value={selected.reference} />
                    <DetailLine label="Prix" value={money(selected.prix)} />
                    <DetailLine
                      label="Quantité"
                      value={selected.quantiteStock}
                    />
                    <DetailLine label="Seuil alerte" value={getSeuil(selected)} />
                    <DetailLine
                      label="Valeur stock"
                      value={money(getStockValue(selected))}
                    />
                  </div>
                </div>

                <div className="xl:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                  <h3 className="font-bold text-cyan-600 mb-5 flex items-center gap-2">
                    <FaIndustry />
                    Fournisseur associé
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                      <p className="text-xs text-slate-500">Nom fournisseur</p>
                      <p className="font-black text-xl mt-2 text-slate-900">
                        {selected.fournisseur?.nom || "Non défini"}
                      </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                      <p className="text-xs text-slate-500">Identifiant</p>
                      <p className="font-black text-xl mt-2 text-slate-900">
                        {selected.fournisseur?.id
                          ? `#${selected.fournisseur.id}`
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {isLowStock(selected) && (
                    <div className="mt-5 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700 flex gap-3">
                      <FaExclamationTriangle className="mt-1 shrink-0" />
                      <div>
                        <p className="font-bold">Réapprovisionnement conseillé</p>
                        <p className="text-sm mt-1 text-red-600">
                          Cette pièce est sous le seuil d’alerte. Il est recommandé
                          de créer un achat ou de contacter le fournisseur.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 flex flex-col md:flex-row gap-3">
              <button
                onClick={() => remove(selected.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
              >
                <FaTrash />
                Supprimer
              </button>

              <button
                onClick={() => {
                  setDetailsOpen(false);
                  setSelected(null);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-4 rounded-2xl transition font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoLine({ icon, color, label, value, valueClass = "font-semibold" }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className={`flex items-center gap-2 ${color}`}>
        {icon}
        <span className="text-slate-500 text-sm">{label}</span>
      </div>

      <span className={`text-sm text-right ${valueClass}`}>{value || "-"}</span>
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
        className="w-full p-4 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}