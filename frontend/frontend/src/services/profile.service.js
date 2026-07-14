import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

export const getProfile = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const updateProfile = (id, data) => {
  return axios.put(`${API_URL}/${id}/profile`, data);
};

export const updatePassword = (id, data) => {
  return axios.put(`${API_URL}/${id}/password`, data);
};