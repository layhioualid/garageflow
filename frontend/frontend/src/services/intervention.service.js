import api from "./api";

export const getInterventions = () => api.get("/interventions");
export const createIntervention = (data) => api.post("/interventions", data);
export const updateIntervention = (id, data) => api.put(`/interventions/${id}`, data);
export const deleteIntervention = (id) => api.delete(`/interventions/${id}`);