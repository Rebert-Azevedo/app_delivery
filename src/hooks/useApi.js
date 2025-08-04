import axios from "axios";

const TOKEN = process.env.REACT_APP_TOKEN;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    TOKEN: TOKEN,
  },
});

api.interceptors.request.use(
  (config) => {
    if (TOKEN) {
      config.headers.Authorization = `Bearer ${TOKEN}`;
      console.log(
        `[Frontend Interceptor] Token adicionado para URL: ${config.url}`
      );
    } else {
      console.warn(
        "[Frontend Interceptor] TOKEN não encontrado. Não será adicionado Header Authorization."
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn(
        "Requisição não autorizada (401). Isso pode indicar um problema de token ou permissões."
      );
    }
    return Promise.reject(error);
  }
);

export default api;
