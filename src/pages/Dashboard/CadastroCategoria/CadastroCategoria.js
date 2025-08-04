import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCategoriaManagement } from "../../../hooks/useCategoriaManagement";
import styles from "./CadastroCategoria.module.css";
// Importando ícones
import { FaPlus, FaEdit, FaTrash, FaTimes, FaListAlt } from "react-icons/fa";

function ToastMessage({ message, type }) {
  return (
    <div className={`${styles.toastMessage} ${styles[type]}`}>{message}</div>
  );
}

const CadastroCategoria = () => {
  const [categoria, setCategoria] = useState([]);
  const [formData, setFormData] = useState({
    dataRows: {
      NM_CATEGORIA: "",
      CD_CATEGORIA: "",
    },
  });
  const [editingCategoriaId, setEditingCategoriaId] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();
  const {
    createCategoria,
    fetchCategoria,
    updateCategoria,
    deleteCategoria,
    loading,
    error,
  } = useCategoriaManagement();

  const showTemporaryMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage("");
      setToastType("");
    }, 3000);
  };

  useEffect(() => {
    loadCategoria();
  }, []);

  const loadCategoria = async () => {
    const fetchedCategoria = await fetchCategoria();
    if (fetchedCategoria) {
      setCategoria(fetchedCategoria);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      dataRows: {
        ...prev.dataRows,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.dataRows.CD_CATEGORIA.trim() ||
      !formData.dataRows.NM_CATEGORIA.trim()
    ) {
      showTemporaryMessage(
        "Código e nome da categoria são obrigatórios.",
        "error"
      );
      return;
    }

    let success = false;
    if (editingCategoriaId) {
      success = await updateCategoria(editingCategoriaId, formData.dataRows);
      if (success) {
        showTemporaryMessage("Categoria atualizada com sucesso!", "success");
      } else {
        showTemporaryMessage(
          error || "Falha ao atualizar categoria. Tente novamente.",
          "error"
        );
      }
    } else {
      success = await createCategoria(formData.dataRows);
      if (success) {
        showTemporaryMessage("Categoria cadastrada com sucesso!", "success");
      } else {
        showTemporaryMessage(
          error || "Falha ao cadastrar categoria. Tente novamente.",
          "error"
        );
      }
    }

    if (success) {
      setFormData({ dataRows: { CD_CATEGORIA: "", NM_CATEGORIA: "" } });
      setEditingCategoriaId(null);
      loadCategoria();
    }
  };

  const handleEdit = (categoria) => {
    setEditingCategoriaId(categoria.id);
    setFormData({
      dataRows: {
        CD_CATEGORIA: categoria.CD_CATEGORIA,
        NM_CATEGORIA: categoria.NM_CATEGORIA,
      },
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      const success = await deleteCategoria(id);
      if (success) {
        showTemporaryMessage("Categoria excluída com sucesso!", "success");
        loadCategoria();
      } else {
        showTemporaryMessage(
          error || "Falha ao excluir categoria. Tente novamente.",
          "error"
        );
      }
    }
  };

  return (
    <div className={styles.container}>
      {showToast && <ToastMessage message={toastMessage} type={toastType} />}

      <div className={styles.card}>
        <h1 className={styles.heading}>
          {editingCategoriaId ? (
            <>
              <FaEdit className={styles.icon} /> Editar Categoria
            </>
          ) : (
            <>
              <FaPlus className={styles.icon} /> Cadastro de Categoria
            </>
          )}
        </h1>
        <p className={styles.description}>
          Preencha os campos para {editingCategoriaId ? "editar" : "cadastrar"}{" "}
          uma categoria.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="CD_CATEGORIA" className={styles.label}>
              Código da Categoria:
            </label>
            <input
              type="number"
              id="CD_CATEGORIA"
              name="CD_CATEGORIA"
              value={formData.dataRows.CD_CATEGORIA}
              onChange={handleChange}
              required
              className={styles.inputField}
              placeholder="Ex: 1, 2"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="NM_CATEGORIA" className={styles.label}>
              Nome da Categoria:
            </label>
            <input
              type="text"
              id="NM_CATEGORIA"
              name="NM_CATEGORIA"
              value={formData.dataRows.NM_CATEGORIA}
              onChange={handleChange}
              required
              className={styles.inputField}
              placeholder="Ex: Pizzas, Bebidas, Sobremesas"
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              "Salvando..."
            ) : editingCategoriaId ? (
              <>
                <FaEdit /> Atualizar Categoria
              </>
            ) : (
              <>
                <FaPlus /> Salvar Categoria
              </>
            )}
          </button>

          {editingCategoriaId && (
            <button
              type="button"
              onClick={() => {
                setEditingCategoriaId(null);
                setFormData({
                  dataRows: { CD_CATEGORIA: "", NM_CATEGORIA: "" },
                });
              }}
              className={`${styles.submitButton} ${styles.cancelButton}`}
            >
              <FaTimes /> Cancelar Edição
            </button>
          )}
        </form>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.heading}>
        <FaListAlt className={styles.icon} /> Lista de Categorias
      </h2>
      <div className={styles.categoriaList}>
        {loading && <p className={styles.loading}>Carregando categorias...</p>}
        {!loading && categoria.length === 0 ? (
          <p className={styles.noItemsMessage}>Nenhuma categoria cadastrada.</p>
        ) : (
          categoria.map((categoria) => (
            <div key={categoria.ID_CATEGORIA} className={styles.categoriaItem}>
              <div className={styles.categoriaInfo}>
                <p>
                  <strong>Código:</strong> {categoria.CD_CATEGORIA}
                </p>
                <p>
                  <strong>Nome:</strong> {categoria.NM_CATEGORIA}
                </p>
              </div>
              <div className={styles.categoriaActions}>
                <button
                  onClick={() => handleEdit(categoria)}
                  className={`${styles.actionButton} ${styles.editButton}`}
                >
                  <FaEdit /> Editar
                </button>
                <button
                  onClick={() => handleDelete(categoria.ID_CATEGORIA)}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                >
                  <FaTrash /> Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CadastroCategoria;