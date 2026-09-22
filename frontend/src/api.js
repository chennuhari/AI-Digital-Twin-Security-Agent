import axios from "axios";

export const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

export function setToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("digitalTwinToken", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("digitalTwinToken");
  }
}

export const savedToken = localStorage.getItem("digitalTwinToken");

if (savedToken) {
  setToken(savedToken);
}