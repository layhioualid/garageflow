import axios from "axios";

const API_URL = "http://localhost:8080/api/clients";

export const getClients = () => {
  return axios.get(API_URL);
};

export const getClientById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createClient = (client) => {
  return axios.post(API_URL, client);
};

export const updateClient = (id, client) => {
  return axios.put(`${API_URL}/${id}`, client);
};

export const deleteClient = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};