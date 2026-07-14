import axios from "axios";

const API = "http://localhost:8080/api/documents";

export const uploadDocument = (formData) =>
  axios.post(`${API}/upload`, formData);

export const getDocuments = () =>
  axios.get(API);