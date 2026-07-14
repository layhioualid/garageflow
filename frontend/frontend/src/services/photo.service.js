import axios from "axios";

const API = "http://localhost:8080/api/photos";

export const uploadPhoto = (formData) =>
  axios.post(`${API}/upload`, formData);

export const getPhotos = () =>
  axios.get(API);