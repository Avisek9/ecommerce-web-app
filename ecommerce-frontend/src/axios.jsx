import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Attach Basic Auth header on every request if credentials are stored
API.interceptors.request.use((config) => {
  const creds = sessionStorage.getItem("basicAuth");
  if (creds) {
    config.headers["Authorization"] = `Basic ${creds}`;
  }
  return config;
});

// If server returns 401, clear credentials and reload to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem("basicAuth");
      sessionStorage.removeItem("authUser");
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export default API;
