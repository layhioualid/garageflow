import api from "./api";

export const getFournisseurs = () => api.get("/fournisseurs");

export const getPiecesByFournisseur = (id) =>
  api.get(`/fournisseurs/${id}/pieces`);

export const createFournisseur = (data) =>
  api.post("/fournisseurs", data);

export const updateFournisseur = (id, data) =>
  api.put(`/fournisseurs/${id}`, data);

export const deleteFournisseur = (id) =>
  api.delete(`/fournisseurs/${id}`);