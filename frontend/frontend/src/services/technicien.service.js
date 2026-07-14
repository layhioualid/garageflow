import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

export const getTechniciens = () => {
  return axios.get(`${API_URL}/techniciens`);
};

export const createTechnicien = (data) => {
  return axios.post(API_URL, {
    ...data,
    role: "TECHNICIEN",
  });
};

export const updateTechnicien = (id, data) => {
  return axios.put(`${API_URL}/${id}`, {
    ...data,
    role: "TECHNICIEN",
  });
};

export const deleteTechnicien = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};