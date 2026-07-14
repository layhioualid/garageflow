import axios from "axios";

const API = "http://localhost:8080/api";

export const getPredictions = () => {
  return axios.get(`${API}/predictions`);
};

export const predictVehicle = (data) => {
  return axios.post(`${API}/predictions/maintenance`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Alias si une page utilise createPrediction
export const createPrediction = (data) => {
  return predictVehicle(data);
};