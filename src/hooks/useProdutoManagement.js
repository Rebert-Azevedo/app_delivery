import { useState, useCallback } from "react";
import api from "./useApi";

export const useProdutoManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProduto = useCallback(async (dataRows) => {
    setLoading(true);
    setError(null);
    console.log("useProdutoManagement: Tentando cadastrar produto:", dataRows);
    try {
      const response = await api.post("/importData/produto", dataRows, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(
        "useProdutoManagement: Resposta da API de cadastro de produto:",
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
          "Erro desconhecido ao cadastrar produto."
        : err.message || "Erro de rede ou conexão.";
      setError(errorMessage);
      console.error(
        "useProdutoManagement: Erro ao cadastrar produto:",
        errorMessage,
        err
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProduto = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("useProdutoManagement: Buscando produtos...");
    try {
      const response = await api.get("/exportData/produto");
      console.log("useProdutoManagement: Produtos carregadas:", response.data);

      return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.error ||
          err.response.statusText ||
          "Erro desconhecido ao buscar produtos."
        : err.message || "Erro de rede ou conexão.";
      setError(errorMessage);
      console.error(
        "useProdutoManagement: Erro ao buscar produtos:",
        errorMessage,
        err
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduto = useCallback(async (id, dataRows) => {
    setLoading(true);
    setError(null);
    console.log(
      "useProdutoManagement: Tentando atualizar produto:",
      id,
      dataRows
    );
    try {
      const response = await api.put(`/importData/produto/${id}`, dataRows, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(
        "useProdutoManagement: Resposta da API de atualização de produto:",
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
        "useProdutoManagement: Erro ao atualizar produto:",
        errorMessage,
        err
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduto = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    console.log("useProdutoManagement: Tentando excluir produto:", id);
    try {
      await api.delete(`/deleteData/produto/${id}`);
      console.log("useProdutoManagement: Produto excluída com sucesso:", id);
      return true;
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.error ||
          err.response.statusText ||
          "Erro desconhecido ao excluir produto."
        : err.message || "Erro de rede ou conexão.";
      setError(errorMessage);
      console.error(
        "useProdutoManagement: Erro ao excluir produto:",
        errorMessage,
        err
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createProduto,
    fetchProduto,
    updateProduto,
    deleteProduto,
    loading,
    error,
  };
};
