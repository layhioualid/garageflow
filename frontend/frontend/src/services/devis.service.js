import axios from "axios";

const API_URL = "http://localhost:8080/api/devis";

export const getDevis = () => {
  return axios.get(API_URL);
};

export const generateDevis = (interventionId) => {
  return axios.post(`${API_URL}/generate/${interventionId}`);
};

export const approveDevis = (id) => {
  return axios.put(`${API_URL}/approve/${id}`);
};

export const rejectDevis = (id) => {
  return axios.put(`${API_URL}/reject/${id}`);
};

export const sendDevisToClient = (devisId) => {
  return axios.post(`${API_URL}/${devisId}/send-client`);
};