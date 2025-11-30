import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL: `${BACKEND_URL}${BASE_URL}`,
  withCredentials: true,
});

export const baseUrl = BASE_URL;
export const backendUrl = BACKEND_URL;
