import { useState, useEffect } from "react";
import axios from "axios";

const TOKEN = process.env.REACT_APP_TOKEN;

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://192.168.0.134:8081",
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

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (numero, senha) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/login", {
        dataRows: { numero, senha },
      });

      if (response.data && response.data.error) {
        throw new Error(response.data.error);
      }

      const userData = response.data;
      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));

      return true;
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.error || err.response.statusText
        : err.message;
      setError(errorMessage);
      setUser(null);
      localStorage.removeItem("currentUser");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return { user, login, logout, loading, error, api };
}
