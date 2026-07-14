import api from "./api";

export const getUsers = () => api.get("/users");

export const createUser = (data) => api.post("/users", data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getTechniciens = () => api.get("/users/techniciens");