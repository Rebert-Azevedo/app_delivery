import { useState, useCallback } from "react";
import api from "./useApi";

export const useCategoriaManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCategoria = useCallback(async (dataRows) => {
    setLoading(true);
    setError(null);
    console.log(
      "useCategoriaManagement: Tentando cadastrar categoria:",
      dataRows
    );
    try {
      const response = await api.post("/importData/categoria", {
        dataRows: dataRows,
      });
      console.log(
        "useCategoriaManagement: Resposta da API de cadastro de categoria:",
        response.data
      );
      if (response.data && response.data.error) {
        throw new Error(response.data.error);
      }
      return true;
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.error ||
          err.response.statusText ||
          "Erro desconhecido ao cadastrar categoria."
        : err.message || "Erro de rede ou conexão.";
      setError(errorMessage);
      console.error(
        "useCategoriaManagement: Erro ao cadastrar categoria:",
        errorMessage,
        err
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategoria = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("useCategoriaManagement: Buscando categorias...");
    try {
      const response = await api.get("/exportData/categoria");
      console.log(
        "useCategoriaManagement: Categorias carregadas:",
        response.data
      );

      return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.error ||
          err.response.statusText ||
          "Erro desconhecido ao buscar categorias."
        : err.message || "Erro de rede ou conexão.";
      setError(errorMessage);
      console.error(
        "useCategoriaManagement: Erro ao buscar categorias:",
        errorMessage,
        err
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategoria = useCallback(async (id, dataRows) => {
    setLoading(true);
    setError(null);
    console.log(
      "useCategoriaManagement: Tentando atualizar categoria:",
      id,
      dataRows
    );
    try {
      const response = await api.put(`/importData/categoria/${id}`, {
        dataRows: dataRows,
      });
      console.log(
        "useCategoriaManagement: Resposta da API de atualização de categoria:",
        response.data
      );
      if (response.data && response.data.error) {
        throw new Error(response.data.error);
      }
      return true;
    } catch (err) {
      let errorMessage = "Ocorreu um erro desconhecido.";

      if (err.response) {
        if (err.response.data && err.response.data.error) {
          errorMessage =
            typeof err.response.data.error === "string"
              ? err.response.data.error
              : err.response.data.error.sqlMessage ||
                err.response.data.error.message ||
                errorMessage;
        } else {
          errorMessage = err.response.statusText || errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error(
        "useCategoriaManagement: Erro ao atualizar categoria:",
        errorMessage,
        err
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategoria = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    console.log("useCategoriaManagement: Tentando excluir categoria:", id);
    try {
      await api.delete(`/deleteData/categoria/${id}`);
      console.log(
        "useCategoriaManagement: Categoria excluída com sucesso:",
        id
      );
      return true;
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.error ||
          err.response.statusText ||
          "Erro desconhecido ao excluir categoria."
        : err.message || "Erro de rede ou conexão.";
      setError(errorMessage);
      console.error(
        "useCategoriaManagement: Erro ao excluir categoria:",
        errorMessage,
        err
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createCategoria,
    fetchCategoria,
    updateCategoria,
    deleteCategoria,
    loading,
    error,
  };
};
