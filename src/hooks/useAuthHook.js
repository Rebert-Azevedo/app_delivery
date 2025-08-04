import { useState, useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import api from "./useApi";

export const useAuth = () => {
  const { user, setUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (numero, senha) => {
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
        ? err.response.data.error || err.response.statusText || "Erro desconhecido da API."
        : err.message || "Erro de rede ou conexão.";
      setError(errorMessage);
      setUser(null);
      console.error("useAuth: Erro no login:", errorMessage, err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const register = useCallback(async (nm_cliente, numero, senha) => {
    setLoading(true);
    setError(null);
    console.log("useAuth: Tentando registrar novo usuário:", nm_cliente, numero);
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
        ? err.response.data.error || err.response.statusText || "Erro desconhecido da API."
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
