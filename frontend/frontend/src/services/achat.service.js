import api from "./api";

export const getAchats = () => api.get("/achats");

export const createAchat = (data) => api.post("/achats", data);

export const deleteAchat = (id) => api.delete(`/achats/${id}`);

export const getTotalAchats = () => api.get("/achats/stats/total");

export const getStatsByFournisseur = () =>
  api.get("/achats/stats/fournisseurs");