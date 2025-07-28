import { useState, useCallback } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";

const TOKEN = process.env.REACT_APP_TOKEN;
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://192.168.0.134:8081";

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

export const useAuth = () => {
  const { user, setUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(
    async (numero, senha) => {
      setLoading(true);
      setError(null);
      console.log("useAuth: Tentando login para o número:", numero);
      try {
        const response = await api.post("/login", {
          dataRows: { numero, senha },
        });

        console.log("useAuth: Resposta da API de login:", response.data);

        if (response.data && response.data.error) {
          throw new Error(response.data.error);
        }

        const userData = response.data;
        setUser(userData);
        console.log("useAuth: setUser chamado com sucesso. Usuário:", userData);
        return true;
      } catch (err) {
        const errorMessage = err.response
          ? err.response.data.error ||
            err.response.statusText ||
            "Erro desconhecido da API."
          : err.message || "Erro de rede ou conexão.";
        setError(errorMessage);
        setUser(null);
        console.error("useAuth: Erro no login:", errorMessage, err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setUser]
  );

  const register = useCallback(async (nm_cliente, numero, senha) => {
    setLoading(true);
    setError(null);
    console.log(
      "useAuth: Tentando registrar novo usuário:",
      nm_cliente,
      numero
    );
    try {
      const response = await api.post("/importData/login", {
        dataRows: { nm_cliente, numero, senha },
      });

      console.log("useAuth: Resposta da API de registro:", response.data);

      if (response.data && response.data.error) {
        throw new Error(response.data.error);
      }

      return true;
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.error ||
          err.response.statusText ||
          "Erro desconhecido da API."
        : err.message || "Erro de rede ou conexão.";
      setError(errorMessage);
      console.error("useAuth: Erro no registro:", errorMessage, err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    console.log("useAuth: Logout realizado. Usuário definido como null.");
  }, [setUser]);

  return { user, loading, error, login, register, logout };
};
