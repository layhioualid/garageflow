import axios from "axios";

const API = "http://localhost:8080/api/factures";

export const getFactures = () => {
  return axios.get(API);
};

export const generateFacture = (interventionId) => {
  return axios.post(`${API}/generate/${interventionId}`);
};

export const updateFactureStatut = (id, statut) => {
  return axios.put(`${API}/${id}/statut`, { statut });
};

export const updateFacture = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

export const deleteFacture = (id) => {
  return axios.delete(`${API}/${id}`);
};

export const downloadFacturePdf = (id) => {
  window.open(`${API}/${id}/pdf`, "_blank");
};

export const printFacture = (id) => {
  window.open(`${API}/${id}/print`, "_blank");
};

// Envoi automatique email au client depuis Spring Boot
export const sendFactureToClient = (id) => {
  return axios.post(`${API}/${id}/send-client`);
};