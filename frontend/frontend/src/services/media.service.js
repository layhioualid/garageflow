import axios from "axios";

const PHOTO_API = "http://localhost:8080/api/photos";
const DOC_API = "http://localhost:8080/api/documents";

// PHOTOS
export const uploadPhoto = (formData) =>
  axios.post(`${PHOTO_API}/upload`, formData);

export const getPhotos = () =>
  axios.get(PHOTO_API);

// DOCUMENTS
export const uploadDocument = (formData) =>
  axios.post(`${DOC_API}/upload`, formData);

export const getDocuments = () =>
  axios.get(DOC_API);