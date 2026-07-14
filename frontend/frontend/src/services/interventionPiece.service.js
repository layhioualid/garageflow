import api from "./api";

export const addPieceToIntervention = (data) =>
  api.post("/intervention-pieces", data);