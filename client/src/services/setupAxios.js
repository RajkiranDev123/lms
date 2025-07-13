// setupAxios.js
import axios from "axios";

const token = localStorage.getItem("authToken");

axios.interceptors.request.use(config => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
