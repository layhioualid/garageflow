import axios from "axios";

const API_URL = "http://localhost:8080/api/devis/public";

export const getPublicDevis = (token) => {
  return axios.get(`${API_URL}/${token}`);
};

export const acceptPublicDevis = (token, commentaire = "") => {
  return axios.post(`${API_URL}/${token}/accept`, {
    commentaire,
  });
};

export const rejectPublicDevis = (token, commentaire = "") => {
  return axios.post(`${API_URL}/${token}/reject`, {
    commentaire,
  });
};
export const getPublicSuivi = (token) => {
  return axios.get(`${API_URL}/${token}/suivi`);
};