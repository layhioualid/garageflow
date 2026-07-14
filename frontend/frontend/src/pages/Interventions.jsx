import { useEffect, useMemo, useState } from "react";
import {
  getInterventions,
  deleteIntervention,
} from "../services/intervention.service";

import { getCurrentUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

import {
  FaTools,
  FaCar,
  FaClock,
  FaMoneyBill,
  FaPlus,
  FaUser,
  FaImages,
  FaCamera,
  FaTimes,
  FaLayerGroup,
  FaSearch,
  FaTrash,
  FaEdit,
  FaEye,
  FaCheckCircle,
  FaCalendarAlt,
  FaClipboardList,
  FaMoneyBillWave,
  FaInfoCircle,
  FaRoute,
  FaUserCog,
  FaCubes,
} from "react-icons/fa";

export default function Interventions() {
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const isTechnicien = currentUser?.role === "TECHNICIEN";

  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getInterventions();
      const all = res?.data || [];

      if (isTechnicien) {
        const mine = all.filter(
          (i) => Number(i.technicien?.id) === Number(currentUser?.id)
        );

        setList(mine);
      } else {
        setList(all);
      }
    } catch (error) {
      console.error("Erreur chargement interventions :", error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/photos");
      const data = await res.json();
      setPhotos(data || []);
    } catch (error) {
      console.error("Erreur chargement photos :", error);
      setPhotos([]);
    }
  };

  useEffect(() => {
    load();
    loadPhotos();
  }, []);

  const remove = async (id) => {
    if (isTechnicien) {
      alert("Accès refusé : un technicien ne peut pas supprimer une intervention.");
      return;
    }

    if (!window.confirm("Supprimer cette intervention ?")) return;

    await deleteIntervention(id);
    setSelected(null);
    load();
  };

  const money = (v) => `${Number(v || 0).toFixed(2)} DH`;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("fr-FR");
  };

  const formatShortDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const buildPhotoUrl = (url) => {
    if (!url) return "";
    return `http://localhost:8080/${url.replace(/^\//, "")}`;
  };

  const getInitialPhoto = (interventionId) =>
    photos.find(
      (photo) =>
        Number(photo.intervention?.id) === Number(interventionId) &&
        photo.type === "INITIAL"
    );

  const statusColor = (s) => {
    switch (s) {
      case "DONE":
        return "bg-green-50 text-green-700 border-green-200";
      case "IN_PROGRESS":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const statusLabel = (s) => {
    switch (s) {
      case "DONE":
        return "Terminée";
      case "IN_PROGRESS":
        return "En cours";
      default:
        return "En attente";
    }
  };

  const getPiecesTotal = (intervention) => {
    const pieces = intervention?.pieces || [];

    return pieces.reduce((sum, ligne) => {
      const piece = ligne.piece || ligne;
      const prix = Number(piece?.prix || 0);
      const quantite = Number(ligne?.quantite || 1);

      return sum + prix * quantite;
    }, 0);
  };

  const filteredList = useMemo(() => {
    return list
      .filter((i) => {
        const text = `
          ${i.typePanne || ""}
          ${i.description || ""}
          ${i.numeroOrdreReparation || ""}
          ${(i.besoinsClient || []).join(" ")}
          ${i.vehicule?.immatriculation || ""}
          ${i.vehicule?.marque || ""}
          ${i.vehicule?.modele || ""}
          ${i.technicien?.nom || ""}
          ${i.technicien?.email || ""}
          ${i.vehicule?.client?.nom || ""}
          ${i.vehicule?.client?.prenom || ""}
          ${i.vehicule?.client?.telephone || ""}
        `.toLowerCase();

        const matchSearch = text.includes(search.toLowerCase());
        const matchFilter = filter === "ALL" || i.statut === filter;

        return matchSearch && matchFilter;
      })
      .sort((a, b) => {
        const dateA = new Date(a.dateDebut || 0);
        const dateB = new Date(b.dateDebut || 0);
        return dateB - dateA;
      });
  }, [list, search, filter]);

  const stats = useMemo(() => {
    const total = list.length;
    const done = list.filter((i) => i.statut === "DONE").length;
    const inProgress = list.filter((i) => i.statut === "IN_PROGRESS").length;
    const pending = list.filter((i) => i.statut === "PENDING").length;
    const cost = list.reduce((sum, i) => sum + Number(i.cout || 0), 0);

    return { total, done, inProgress, pending, cost };
  }, [list]);

  const selectedWithPhotos = selected
    ? {
        ...selected,
        photos: photos.filter((p) => p.intervention?.id === selected.id),
      }
    : null;

  const DetailLine = ({ label, value }) => (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="text-slate-900 font-semibold text-sm text-right">
        {value || "-"}
      </span>
    </div>
  );

  const InfoCard = ({ icon, title, children, color = "text-blue-600" }) => (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h3 className={`font-bold mb-5 text-lg flex items-center gap-2 ${color}`}>
        {icon}
        {title}
      </h3>

      <div className="space-y-3">{children}</div>
    </div>
  );

  const StatBox = ({ icon, label, value, color }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{label}</p>
        <span className={color}>{icon}</span>
      </div>

      <h2 className={`text-3xl font-black mt-2 ${color}`}>{value}</h2>
    </div>
  );

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      {/* HEADER + STATS */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-6 shadow-sm mb-6">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-purple-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaTools className="text-2xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <FaTools />
                {isTechnicien ? "Espace technicien" : "Centre de maintenance"}
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950">
                {isTechnicien ? "Mes interventions" : "Interventions"}
              </h1>

              <p className="text-slate-500 mt-2 max-w-2xl">
                {isTechnicien
                  ? "Suivez uniquement les interventions qui vous sont affectées, avec les véhicules, pièces et photos associés."
                  : "Suivez les réparations, les pièces utilisées, les photos avant/après, les techniciens et les coûts de maintenance."}
              </p>
            </div>
          </div>

          {!isTechnicien && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/interventions/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm font-semibold transition"
              >
                <FaPlus />
                Nouvelle intervention
              </button>
            </div>
          )}
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <StatBox
            label={isTechnicien ? "Mes interventions" : "Total interventions"}
            value={stats.total}
            icon={<FaTools />}
            color="text-blue-600"
          />

          <StatBox
            label="Terminées"
            value={stats.done}
            icon={<FaCheckCircle />}
            color="text-green-600"
          />

          <StatBox
            label="En cours"
            value={stats.inProgress}
            icon={<FaClock />}
            color="text-yellow-600"
          />

          <StatBox
            label={isTechnicien ? "En attente" : "Coût total"}
            value={isTechnicien ? stats.pending : money(stats.cost)}
            icon={isTechnicien ? <FaClock /> : <FaMoneyBillWave />}
            color={isTechnicien ? "text-orange-600" : "text-emerald-600"}
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
            {isTechnicien
              ? "Filtrez vos interventions par panne, véhicule, client ou statut."
              : "Filtrez par panne, véhicule, technicien ou statut d’intervention."}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isTechnicien
                  ? "Rechercher panne, véhicule, client..."
                  : "Rechercher panne, véhicule, technicien..."
              }
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition min-w-[210px]"
          >
            <option value="ALL">Toutes les interventions</option>
            <option value="PENDING">En attente</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="DONE">Terminées</option>
          </select>
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          Chargement des interventions...
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            <FaSearch className="text-2xl text-slate-400" />
          </div>
          {isTechnicien
            ? "Aucune intervention ne vous est affectée."
            : "Aucune intervention trouvée."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredList.map((i) => {
            const piecesTotal = getPiecesTotal(i);
            const initialPhoto = getInitialPhoto(i.id);

            return (
              <div
                key={i.id}
                onClick={() => navigate(`/interventions/details/${i.id}`)}
                className="group bg-white border border-slate-200 rounded-3xl p-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-300 overflow-hidden"
              >
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  {initialPhoto ? (
                    <img
                      src={buildPhotoUrl(initialPhoto.url)}
                      alt={`Etat initial ${i.vehicule?.immatriculation || "vehicule"}`}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <FaImages className="text-3xl" />
                      <span className="text-xs font-semibold mt-2">
                        Aucune photo d'etat initial
                      </span>
                    </div>
                  )}

                  <span className="absolute left-3 top-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur text-white text-[11px] font-black flex items-center gap-2">
                    <FaCamera />
                    Etat initial
                  </span>

                  <span
                    className={`absolute right-3 top-3 text-xs px-3 py-1.5 rounded-xl border font-semibold ${statusColor(
                      i.statut
                    )}`}
                  >
                    {statusLabel(i.statut)}
                  </span>
                </div>

                <div className="p-2 pt-4">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h2 className="flex items-center gap-2 font-bold text-lg text-slate-900 group-hover:text-blue-600 transition">
                      <FaCar className="text-blue-600" />
                      {i.vehicule?.immatriculation || "Véhicule inconnu"}
                    </h2>

                    <p className="text-slate-500 text-sm mt-1">
                      {i.vehicule?.marque || "-"} {i.vehicule?.modele || ""}
                    </p>

                    {i.numeroOrdreReparation && (
                      <span className="inline-flex mt-2 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black">
                        {i.numeroOrdreReparation}
                      </span>
                    )}
                  </div>

                </div>

                <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <p className="text-slate-500 text-xs mb-1">Type de panne</p>

                  <p className="font-semibold text-slate-900">
                    {i.typePanne || "-"}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      {formatShortDate(i.dateDebut)}
                    </div>

                    <div className="flex items-center gap-2">
                      <FaClock />
                      {i.duree || 0}h
                    </div>

                    <div className="flex items-center gap-2">
                      <FaUser />
                      {isTechnicien
                        ? `${i.vehicule?.client?.nom || "-"} ${
                            i.vehicule?.client?.prenom || ""
                          }`
                        : i.technicien?.nom || "-"}
                    </div>

                    <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                      <FaMoneyBill />
                      {money(i.cout)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <FaLayerGroup />
                      Pièces
                    </p>
                    <p className="font-bold mt-1 text-slate-900">
                      {i.pieces?.length || 0}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <FaMoneyBillWave />
                      Total pièces
                    </p>
                    <p className="font-bold mt-1 text-emerald-600">
                      {money(piecesTotal)}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                    <FaLayerGroup />
                    Pièces utilisées
                  </p>

                  {i.pieces?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {i.pieces.slice(0, 3).map((p, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-slate-600"
                        >
                          {p.piece?.nom || "Pièce"} x{p.quantite}
                        </span>
                      ))}

                      {i.pieces.length > 3 && (
                        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">
                          +{i.pieces.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Aucune pièce</p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/interventions/details/${i.id}`);
                    }}
                    className="text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-xl transition flex items-center gap-2 text-sm"
                  >
                    <FaEye />
                    Détails
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/interventions/${i.id}`);
                    }}
                    className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl transition flex items-center gap-2 text-sm"
                  >
                    {isTechnicien ? <FaTools /> : <FaEdit />}
                    {isTechnicien ? "Travailler" : "Modifier"}
                  </button>

                  {!isTechnicien && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(i.id);
                      }}
                      className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition flex items-center gap-2 text-sm"
                    >
                      <FaTrash />
                      Supprimer
                    </button>
                  )}
                </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PREMIUM MODAL DETAILS */}
      {selectedWithPhotos && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-start justify-center pt-6 px-4 pb-4 overflow-y-auto">
          <div className="bg-white w-full max-w-7xl max-h-[94vh] rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
            {/* HEADER */}
            <div className="shrink-0 relative overflow-hidden border-b border-slate-200">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-cyan-50 to-purple-50" />

              <div className="relative px-6 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                    <FaClipboardList className="text-3xl" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-black text-slate-950">
                        Intervention #{selectedWithPhotos.id}
                      </h2>

                      <span
                        className={`text-xs px-3 py-1 rounded-full border font-semibold ${statusColor(
                          selectedWithPhotos.statut
                        )}`}
                      >
                        {statusLabel(selectedWithPhotos.statut)}
                      </span>
                    </div>

                    <p className="text-slate-500 text-sm mt-2">
                      {selectedWithPhotos.vehicule?.marque || "-"}{" "}
                      {selectedWithPhotos.vehicule?.modele || ""} •{" "}
                      {selectedWithPhotos.vehicule?.immatriculation || "-"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* TOP SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5">
                  <p className="text-xs text-blue-700 flex items-center gap-2 mb-2">
                    <FaClock />
                    Durée
                  </p>
                  <p className="text-3xl font-black text-blue-600">
                    {selectedWithPhotos.duree || 0}h
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5">
                  <p className="text-xs text-emerald-700 flex items-center gap-2 mb-2">
                    <FaMoneyBillWave />
                    Coût
                  </p>
                  <p className="text-3xl font-black text-emerald-600">
                    {money(selectedWithPhotos.cout)}
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-3xl p-5">
                  <p className="text-xs text-purple-700 flex items-center gap-2 mb-2">
                    <FaUserCog />
                    Technicien
                  </p>
                  <p className="text-xl font-black text-purple-600 truncate">
                    {selectedWithPhotos.technicien?.nom || "-"}
                  </p>
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded-3xl p-5">
                  <p className="text-xs text-cyan-700 flex items-center gap-2 mb-2">
                    <FaLayerGroup />
                    Pièces
                  </p>
                  <p className="text-3xl font-black text-cyan-600">
                    {selectedWithPhotos.pieces?.length || 0}
                  </p>
                </div>
              </div>

              {/* MAIN GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* LEFT */}
                <div className="xl:col-span-2 space-y-6">
                  <InfoCard
                    icon={<FaTools />}
                    title="Informations de l’intervention"
                    color="text-orange-600"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailLine
                        label="ID intervention"
                        value={`#${selectedWithPhotos.id}`}
                      />
                      <DetailLine
                        label="Type de panne"
                        value={selectedWithPhotos.typePanne}
                      />
                      <DetailLine
                        label="Statut"
                        value={statusLabel(selectedWithPhotos.statut)}
                      />
                      <DetailLine
                        label="Coût"
                        value={money(selectedWithPhotos.cout)}
                      />
                      <DetailLine
                        label="Durée"
                        value={`${selectedWithPhotos.duree || 0} h`}
                      />
                      <DetailLine
                        label="Date début"
                        value={formatDate(selectedWithPhotos.dateDebut)}
                      />
                      <DetailLine
                        label="Date fin"
                        value={formatDate(selectedWithPhotos.dateFin)}
                      />
                      <DetailLine
                        label="Nombre de pièces"
                        value={selectedWithPhotos.pieces?.length || 0}
                      />
                    </div>

                    <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <p className="text-slate-500 text-sm mb-2 flex items-center gap-2">
                        <FaInfoCircle />
                        Description
                      </p>

                      <p className="text-slate-700 leading-relaxed text-sm">
                        {selectedWithPhotos.description ||
                          "Aucune description disponible."}
                      </p>
                    </div>
                  </InfoCard>

                  <InfoCard
                    icon={<FaCubes />}
                    title="Pièces utilisées"
                    color="text-emerald-600"
                  >
                    {selectedWithPhotos.pieces?.length > 0 ? (
                      <div className="space-y-3">
                        {selectedWithPhotos.pieces.map((p, index) => {
                          const piece = p.piece || p;
                          const prix = Number(piece?.prix || 0);
                          const quantite = Number(p?.quantite || 1);
                          const total = prix * quantite;

                          return (
                            <div
                              key={p.id || index}
                              className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:border-emerald-300 transition"
                            >
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <p className="font-bold text-slate-900 text-lg">
                                    {piece?.nom || "Pièce"}
                                  </p>

                                  <p className="text-sm text-slate-500 mt-1">
                                    Référence : {piece?.reference || "-"}
                                  </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-right">
                                  <div>
                                    <p className="text-xs text-slate-500">
                                      Prix
                                    </p>
                                    <p className="font-semibold text-slate-900">
                                      {money(prix)}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-slate-500">
                                      Qté
                                    </p>
                                    <p className="font-semibold text-slate-900">
                                      {quantite}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-slate-500">
                                      Total
                                    </p>
                                    <p className="font-black text-emerald-600">
                                      {money(total)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 text-right">
                            <p className="text-xs text-emerald-700">
                              Total des pièces
                            </p>
                            <p className="text-2xl font-black text-emerald-600">
                              {money(getPiecesTotal(selectedWithPhotos))}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                        Aucune pièce utilisée.
                      </div>
                    )}
                  </InfoCard>

                  <InfoCard
                    icon={<FaImages />}
                    title="Photos de l’intervention"
                    color="text-pink-600"
                  >
                    {selectedWithPhotos.photos?.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedWithPhotos.photos.map((photo, index) => (
                          <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                          >
                            <img
                              src={`http://localhost:8080/${photo.url.replace(
                                /^\/+/,
                                ""
                              )}`}
                              alt="intervention"
                              className="w-full h-52 object-cover group-hover:scale-110 transition duration-300"
                            />

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {photo.type || "Photo"}
                                </p>

                                <p className="text-xs text-slate-200">
                                  {photo.dateAjout || ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                        Aucune photo disponible.
                      </div>
                    )}
                  </InfoCard>
                </div>

                {/* RIGHT */}
                <div className="space-y-6">
                  <InfoCard
                    icon={<FaCar />}
                    title="Véhicule"
                    color="text-cyan-600"
                  >
                    <DetailLine
                      label="ID véhicule"
                      value={
                        selectedWithPhotos.vehicule?.id
                          ? `#${selectedWithPhotos.vehicule.id}`
                          : "-"
                      }
                    />
                    <DetailLine
                      label="Immatriculation"
                      value={selectedWithPhotos.vehicule?.immatriculation}
                    />
                    <DetailLine
                      label="Marque"
                      value={selectedWithPhotos.vehicule?.marque}
                    />
                    <DetailLine
                      label="Modèle"
                      value={selectedWithPhotos.vehicule?.modele}
                    />
                    <DetailLine
                      label="Année"
                      value={selectedWithPhotos.vehicule?.annee}
                    />
                    <DetailLine
                      label="Kilométrage"
                      value={
                        selectedWithPhotos.vehicule?.kilometrage !== undefined
                          ? `${selectedWithPhotos.vehicule.kilometrage} km`
                          : "-"
                      }
                    />
                    <DetailLine
                      label="Carburant"
                      value={selectedWithPhotos.vehicule?.carburant}
                    />
                    <DetailLine
                      label="Transmission"
                      value={selectedWithPhotos.vehicule?.transmission}
                    />
                    <DetailLine
                      label="Motorisation"
                      value={selectedWithPhotos.vehicule?.engineSize}
                    />
                  </InfoCard>

                  <InfoCard
                    icon={<FaUser />}
                    title={isTechnicien ? "Client" : "Technicien"}
                    color="text-purple-600"
                  >
                    {isTechnicien ? (
                      <>
                        <DetailLine
                          label="Nom"
                          value={`${selectedWithPhotos.vehicule?.client?.nom || "-"} ${
                            selectedWithPhotos.vehicule?.client?.prenom || ""
                          }`}
                        />
                        <DetailLine
                          label="Téléphone"
                          value={selectedWithPhotos.vehicule?.client?.telephone}
                        />
                        <DetailLine
                          label="Email"
                          value={selectedWithPhotos.vehicule?.client?.email}
                        />
                      </>
                    ) : (
                      <>
                        <DetailLine
                          label="ID technicien"
                          value={
                            selectedWithPhotos.technicien?.id
                              ? `#${selectedWithPhotos.technicien.id}`
                              : "-"
                          }
                        />
                        <DetailLine
                          label="Nom"
                          value={
                            selectedWithPhotos.technicien?.nom ||
                            selectedWithPhotos.technicien?.username
                          }
                        />
                        <DetailLine
                          label="Email"
                          value={selectedWithPhotos.technicien?.email}
                        />
                        <DetailLine
                          label="Rôle"
                          value={selectedWithPhotos.technicien?.role}
                        />
                      </>
                    )}
                  </InfoCard>

                  <InfoCard
                    icon={<FaRoute />}
                    title="Chronologie"
                    color="text-pink-600"
                  >
                    <div className="space-y-5">
                      <div className="relative pl-7">
                        <span className="absolute left-0 top-1 w-3 h-3 rounded-full bg-blue-500" />
                        <p className="text-sm font-semibold text-slate-900">
                          Début intervention
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(selectedWithPhotos.dateDebut)}
                        </p>
                      </div>

                      <div className="relative pl-7">
                        <span className="absolute left-0 top-1 w-3 h-3 rounded-full bg-yellow-500" />
                        <p className="text-sm font-semibold text-slate-900">
                          Statut actuel
                        </p>
                        <p className="text-xs text-slate-500">
                          {statusLabel(selectedWithPhotos.statut)}
                        </p>
                      </div>

                      <div className="relative pl-7">
                        <span className="absolute left-0 top-1 w-3 h-3 rounded-full bg-emerald-500" />
                        <p className="text-sm font-semibold text-slate-900">
                          Fin intervention
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(selectedWithPhotos.dateFin)}
                        </p>
                      </div>
                    </div>
                  </InfoCard>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="shrink-0 bg-white border-t border-slate-200 p-5 flex flex-col lg:flex-row gap-3">
              <button
                onClick={() => navigate(`/interventions/${selectedWithPhotos.id}`)}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
              >
                {isTechnicien ? <FaTools /> : <FaEdit />}
                {isTechnicien ? "Travailler" : "Modifier"}
              </button>

              {!isTechnicien && (
                <button
                  onClick={() => remove(selectedWithPhotos.id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <FaTrash />
                  Supprimer
                </button>
              )}

              <button
                onClick={() => setSelected(null)}
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
