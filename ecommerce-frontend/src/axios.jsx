import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});


API.interceptors.request.use((config) => {
  const creds = sessionStorage.getItem("basicAuth");
  if (creds) {
    config.headers["Authorization"] = `Basic ${creds}`;
  }
  return config;
});


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
