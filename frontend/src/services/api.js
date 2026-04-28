import axios from "axios";

const envBaseUrl = process.env.REACT_APP_API_URL?.replace(/\/+$/, "");
const fallbackBaseUrl =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "/api"
    : "http://localhost:5002/api";

const baseURL = envBaseUrl || fallbackBaseUrl;

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const API_BASE_URL = baseURL;
export const API_ORIGIN = baseURL.replace(/\/api$/, "");

export default API;
