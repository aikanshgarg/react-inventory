// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://mocki.io/v1/bb4e5188-d5d8-4cc1-95a4-eb80a4090b48",
});

export const fetchProducts = async () => {
  const response = await api.get("/");
  return response.data;
};
