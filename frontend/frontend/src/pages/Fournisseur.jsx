import { useEffect, useMemo, useState } from "react";

import {
  getFournisseurs,
  createFournisseur,
  updateFournisseur,
  deleteFournisseur,
} from "../services/fournisseur.service";

import {
  FaIndustry,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaSyncAlt,
  FaCheckCircle,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaBoxOpen,
  FaEye,
  FaCubes,
  FaExclamationTriangle,
  FaSave,
  FaUserTie,
  FaChartLine,
  FaClipboardList,
  FaMapMarkerAlt,
} from "react-icons/fa";

const API_URL = "http://localhost:8080";

export default function Fournisseurs() {
  const [list, setList] = useState([]);
  const [piecesMap, setPiecesMap] = useState({});
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
  });

  const load = async () => {
    try {
      setLoading(true);

      const res = await getFournisseurs();
      const data = res.data || [];

      setList(data);

      const entries = await Promise.all(
        data.map(async (f) => {
          try {
            const response = await fetch(
              `${API_URL}/api/fournisseurs/${f.id}/pieces`
            );
            const pieces = response.ok ? await response.json() : [];
            return [f.id, pieces || []];
          } catch {
            return [f.id, []];
          }
        })
      );

      setPiecesMap(Object.fromEntries(entries));
    } catch (err) {
      console.error(err);
      alert("Erreur lors du chargement des fournisseurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return list.filter((f) => {
      const text = `
        ${f.nom || ""}
        ${f.email || ""}
        ${f.telephone || ""}
        ${f.adresse || ""}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [list, search]);

  const stats = useMemo(() => {
    const totalPieces = Object.values(piecesMap).reduce(
      (sum, pieces) => sum + pieces.length,
      0
    );

    const fournisseursAvecPieces = list.filter(
      (f) => (piecesMap[f.id] || []).length > 0
    ).length;

    const fournisseursSansPieces = list.length - fournisseursAvecPieces;

    return {
      totalFournisseurs: list.length,
      totalPieces,
      fournisseursAvecPieces,
      fournisseursSansPieces,
    };
  }, [list, piecesMap]);

  const reset = () => {
    setForm({
      nom: "",
      email: "",
      telephone: "",
      adresse: "",
    });
    setEditId(null);
  };

  const openCreate = () => {
    reset();
    setOpen(true);
  };

  const save = async () => {
    try {
      if (!form.nom.trim()) {
        alert("Veuillez saisir le nom du fournisseur.");
        return;
      }

      setSaving(true);

      const payload = {
        nom: form.nom.trim(),
        email: form.email.trim(),
        telephone: form.telephone.trim(),
        adresse: form.adresse.trim(),
      };

      if (editId) {
        await updateFournisseur(editId, payload);
      } else {
        await createFournisseur(payload);
      }

      reset();
      setOpen(false);
      await load();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du fournisseur.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer ce fournisseur ?")) return;

    try {
      await deleteFournisseur(id);

      if (selected?.id === id) {
        setSelected(null);
        setDetailsOpen(false);
      }

      await load();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du fournisseur.");
    }
  };

  const edit = (f) => {
    setEditId(f.id);
    setForm({
      nom: f.nom || "",
      email: f.email || "",
      telephone: f.telephone || "",
      adresse: f.adresse || "",
    });
    setOpen(true);
  };

  const openDetails = (f) => {
    setSelected(f);
    setDetailsOpen(true);
  };

  const money = (value) => `${Number(value || 0).toFixed(2)} DH`;

  const getPieces = (fournisseurId) => piecesMap[fournisseurId] || [];

  const getStockTotal = (fournisseurId) => {
    return getPieces(fournisseurId).reduce(
      (sum, p) => sum + Number(p.quantiteStock || p.stock || 0),
      0
    );
  };

  const getValeurStock = (fournisseurId) => {
    return getPieces(fournisseurId).reduce((sum, p) => {
      const prix = Number(p.prix || 0);
      const qte = Number(p.quantiteStock || p.stock || 0);
      return sum + prix * qte;
    }, 0);
  };

  const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{label}</p>
        <span className={color}>{icon}</span>
      </div>

      <h2 className={`text-3xl font-black mt-2 ${color}`}>{value}</h2>
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
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-cyan-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaIndustry className="text-3xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <FaUserTie />
                Réseau fournisseurs
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                Fournisseurs
              </h1>

              <p className="text-slate-500 mt-2 max-w-3xl">
                Gérez vos partenaires d’approvisionnement, leurs contacts,
                adresses, pièces associées, stock disponible et valeur globale
                fournie au garage.
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm font-semibold transition"
            >
              <FaPlus />
              Ajouter fournisseur
            </button>
          </div>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <StatCard
            label="Total fournisseurs"
            value={stats.totalFournisseurs}
            icon={<FaIndustry />}
            color="text-blue-600"
          />

          <StatCard
            label="Pièces associées"
            value={stats.totalPieces}
            icon={<FaCubes />}
            color="text-cyan-600"
          />

          <StatCard
            label="Avec pièces"
            value={stats.fournisseursAvecPieces}
            icon={<FaCheckCircle />}
            color="text-green-600"
          />

          <StatCard
            label="Sans pièces"
            value={stats.fournisseursSansPieces}
            icon={<FaExclamationTriangle />}
            color="text-yellow-600"
          />
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between shadow-sm">
        <div>
          <h2 className="font-bold flex items-center gap-2 text-slate-900">
            <FaSearch className="text-blue-600" />
            Recherche fournisseur
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Recherchez par nom, email, téléphone ou adresse.
          </p>
        </div>

        <div className="relative w-full lg:w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            placeholder="Rechercher fournisseur..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Chargement des fournisseurs...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            <FaSearch className="text-2xl text-slate-400" />
          </div>
          Aucun fournisseur trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {filtered.map((f) => {
            const pieces = getPieces(f.id);
            const stockTotal = getStockTotal(f.id);
            const valeurStock = getValeurStock(f.id);

            return (
              <div
                key={f.id}
                onClick={() => openDetails(f)}
                className="group bg-white border border-slate-200 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center font-black text-2xl shadow-sm">
                      {(f.nom || "F").charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h2 className="font-black text-xl text-slate-900 group-hover:text-blue-600 transition">
                        {f.nom || "Fournisseur"}
                      </h2>

                      <p className="text-slate-500 text-sm mt-1">
                        Partenaire d’approvisionnement
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                    ID #{f.id}
                  </span>
                </div>

                <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FaEnvelope className="text-blue-600" />
                    {f.email || "Email non défini"}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FaPhone className="text-green-600" />
                    {f.telephone || "Téléphone non défini"}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FaMapMarkerAlt className="text-yellow-600" />
                    {f.adresse || "Adresse non définie"}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FaBoxOpen className="text-cyan-600" />
                    {pieces.length} pièce(s) associée(s)
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <p className="text-xs text-slate-500">Pièces</p>
                    <p className="font-black text-2xl text-cyan-600 mt-1">
                      {pieces.length}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <p className="text-xs text-slate-500">Stock</p>
                    <p className="font-black text-2xl text-green-600 mt-1">
                      {stockTotal}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <p className="text-xs text-slate-500">Valeur</p>
                    <p className="font-black text-sm text-emerald-600 mt-2 truncate">
                      {money(valeurStock)}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                    <FaCubes />
                    Pièces récentes
                  </p>

                  {pieces.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      Aucune pièce associée.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {pieces.slice(0, 2).map((p) => (
                        <div
                          key={p.id}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {p.nom || "Pièce"}
                            </p>

                            <span className="text-xs text-emerald-600 font-semibold">
                              {money(p.prix)}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 mt-1">
                            Stock : {p.quantiteStock || 0}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(f);
                    }}
                    className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl transition flex items-center gap-2 text-sm"
                  >
                    <FaEye />
                    Détails
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      edit(f);
                    }}
                    className="text-yellow-600 hover:bg-yellow-50 px-3 py-2 rounded-xl transition flex items-center gap-2 text-sm"
                  >
                    <FaEdit />
                    Modifier
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(f.id);
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
            <div className="relative overflow-hidden border-b border-slate-200 p-6 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black flex items-center gap-3 text-slate-950">
                    <FaIndustry className="text-blue-600" />
                    {editId ? "Modifier fournisseur" : "Nouveau fournisseur"}
                  </h2>

                  <p className="text-slate-500 text-sm mt-1">
                    Informations du fournisseur, contact et adresse.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setOpen(false);
                    reset();
                  }}
                  className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <InputField
                label="Nom du fournisseur"
                value={form.nom}
                onChange={(value) => setForm({ ...form, nom: value })}
                placeholder="Ex : AutoParts Maroc"
              />

              <InputField
                label="Email"
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
                placeholder="contact@fournisseur.com"
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
                placeholder="Adresse du fournisseur"
              />
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
              >
                Annuler
              </button>

              <button
                onClick={save}
                disabled={saving}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition font-semibold flex items-center gap-2 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white w-full max-w-6xl max-h-[92vh] rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
            <div className="relative overflow-hidden border-b border-slate-200">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-cyan-50 to-purple-50" />

              <div className="relative p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center text-3xl font-black shadow-sm">
                    {(selected.nom || "F").charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-black text-slate-950">
                        {selected.nom || "Fournisseur"}
                      </h2>

                      <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                        FOURNISSEUR
                      </span>
                    </div>

                    <p className="text-slate-500 mt-2">
                      {selected.email || "Email non défini"} •{" "}
                      {selected.telephone || "Téléphone non défini"} •{" "}
                      {selected.adresse || "Adresse non définie"}
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
                  label="Pièces associées"
                  value={getPieces(selected.id).length}
                  icon={<FaCubes />}
                  color="text-cyan-600"
                />

                <StatCard
                  label="Stock total"
                  value={getStockTotal(selected.id)}
                  icon={<FaBoxOpen />}
                  color="text-green-600"
                />

                <StatCard
                  label="Valeur stock"
                  value={money(getValeurStock(selected.id))}
                  icon={<FaChartLine />}
                  color="text-emerald-600"
                />

                <StatCard
                  label="État"
                  value="Actif"
                  icon={<FaCheckCircle />}
                  color="text-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                  <h3 className="font-bold text-blue-600 mb-5 flex items-center gap-2">
                    <FaClipboardList />
                    Informations fournisseur
                  </h3>

                  <div className="space-y-3">
                    <DetailLine label="ID" value={`#${selected.id}`} />
                    <DetailLine label="Nom" value={selected.nom} />
                    <DetailLine label="Email" value={selected.email} />
                    <DetailLine label="Téléphone" value={selected.telephone} />
                    <DetailLine label="Adresse" value={selected.adresse} />
                    <DetailLine
                      label="Pièces associées"
                      value={getPieces(selected.id).length}
                    />
                  </div>
                </div>

                <div className="xl:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                  <h3 className="font-bold text-cyan-600 mb-5 flex items-center gap-2">
                    <FaCubes />
                    Pièces fournies
                  </h3>

                  {getPieces(selected.id).length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
                      Aucune pièce associée à ce fournisseur.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getPieces(selected.id).map((p) => (
                        <div
                          key={p.id}
                          className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-cyan-300 transition"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <h4 className="font-bold text-slate-900">
                                {p.nom || "Pièce"}
                              </h4>

                              <p className="text-sm text-slate-500 mt-1">
                                Référence : {p.reference || "-"}
                              </p>
                            </div>

                            <div className="grid grid-cols-3 gap-6 text-right">
                              <div>
                                <p className="text-xs text-slate-500">Prix</p>
                                <p className="font-semibold text-emerald-600">
                                  {money(p.prix)}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-slate-500">Stock</p>
                                <p className="font-semibold text-slate-900">
                                  {p.quantiteStock || 0}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-slate-500">Seuil</p>
                                <p
                                  className={`font-semibold ${
                                    Number(p.quantiteStock || 0) <=
                                    Number(p.seuilAlerte || 0)
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {p.seuilAlerte || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 flex flex-col md:flex-row gap-3">
              <button
                onClick={() => {
                  edit(selected);
                  setDetailsOpen(false);
                }}
                className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
              >
                <FaEdit />
                Modifier
              </button>

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

function InputField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      />
    </div>
  );
}