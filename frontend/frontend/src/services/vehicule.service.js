import api from "./api";

export const getVehicules = () => api.get("/vehicules");

export const createVehicule = (data) =>
  api.post("/vehicules", data);

export const updateVehicule = (id, data) =>
  api.put(`/vehicules/${id}`, data);

export const deleteVehicule = (id) =>
  api.delete(`/vehicules/${id}`);
