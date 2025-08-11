import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProdutoManagement } from "../../../hooks/useProdutoManagement";
import { useCategoriaManagement } from "../../../hooks/useCategoriaManagement";
import styles from "./CadastroProduto.module.css";
// Importando ícones
import { FaPlus, FaEdit, FaTrash, FaTimes, FaListAlt } from "react-icons/fa";

function ToastMessage({ message, type }) {
  return (
    <div className={`${styles.toastMessage} ${styles[type]}`}>{message}</div>
  );
}

const CadastroProduto = () => {
  const [produtos, setProdutos] = useState([]);

  const [categorias, setCategorias] = useState([]);

  const [formData, setFormData] = useState({
    dataRows: {
      CD_PRODUTO: "",
      NM_PRODUTO: "",
      DS_PRODUTO: "",
      VL_PRODUTO: "",
      ID_CATEGORIA: "",
    },
  });

  const [editingProdutoId, setEditingProdutoId] = useState(null);
  const [editingProdutoImageUrl, setEditingProdutoImageUrl] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();
  const {
    createProduto,
    fetchProduto,
    updateProduto,
    deleteProduto,
    loading,
    error,
  } = useProdutoManagement();

  const { fetchCategoria } = useCategoriaManagement();

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
    loadData();
  }, []);

  const loadData = async () => {
    const fetchedProdutos = await fetchProduto();
    if (fetchedProdutos) {
      const sortedProdutos = fetchedProdutos.sort((a, b) => {
        const cdA = Number(a.CD_PRODUTO) || 0;
        const cdB = Number(b.CD_PRODUTO) || 0;
        return cdA - cdB;
      });
      setProdutos(sortedProdutos);
    }
    const fetchedCategorias = await fetchCategoria();
    if (fetchedCategorias) {
      setCategorias(fetchedCategorias);
    }
  };

  const [imagem, setImagem] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "IMG_PRODUTO") {
      setFormData((prev) => ({
        ...prev,
        dataRows: {
          ...prev.dataRows,
          [name]: files[0],
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        dataRows: {
          ...prev.dataRows,
          [name]: value,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !String(formData.dataRows.CD_PRODUTO).trim() ||
      !String(formData.dataRows.NM_PRODUTO).trim() ||
      !String(formData.dataRows.DS_PRODUTO).trim() ||
      !String(formData.dataRows.VL_PRODUTO).trim() ||
      !String(formData.dataRows.ID_CATEGORIA).trim()
    ) {
      showTemporaryMessage(
        "Todos os campos, incluindo a imagem, são obrigatórios.",
        "error"
      );
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("img", imagem);

    const dataRowsCopy = { ...formData.dataRows };
    delete dataRowsCopy.IMG_PRODUTO;
    formDataToSend.append("json", JSON.stringify(dataRowsCopy));

    let success = false;
    if (editingProdutoId) {
      success = await updateProduto(editingProdutoId, formDataToSend);
      if (success) {
        showTemporaryMessage("Produto atualizado com sucesso!", "success");
      } else {
        showTemporaryMessage(
          error || "Falha ao atualizar produto. Tente novamente.",
          "error"
        );
      }
    } else {
      success = await createProduto(formDataToSend);
      if (success) {
        showTemporaryMessage("Produto cadastrado com sucesso!", "success");
      } else {
        showTemporaryMessage(
          error || "Falha ao cadastrar produto. Tente novamente.",
          "error"
        );
      }
    }

    if (success) {
      setFormData({
        dataRows: {
          CD_PRODUTO: "",
          NM_PRODUTO: "",
          DS_PRODUTO: "",
          VL_PRODUTO: "",
          ID_CATEGORIA: "",
          IMG_PRODUTO: null,
        },
      });
      setEditingProdutoId(null);
      setEditingProdutoImageUrl("");
      loadData();
    }
  };

  const handleEdit = (produto) => {
    setEditingProdutoId(produto.ID_PRODUTO);
    setEditingProdutoImageUrl(produto.IMG_PRODUTO);
    setFormData({
      dataRows: {
        CD_PRODUTO: produto.CD_PRODUTO,
        NM_PRODUTO: produto.NM_PRODUTO,
        DS_PRODUTO: produto.DS_PRODUTO,
        VL_PRODUTO: produto.VL_PRODUTO,
        ID_CATEGORIA: produto.ID_CATEGORIA,
        IMG_PRODUTO: null,
      },
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      const success = await deleteProduto(id);
      if (success) {
        showTemporaryMessage("Produto excluído com sucesso!", "success");
        loadData();
      } else {
        showTemporaryMessage(
          error || "Falha ao excluir produto. Tente novamente.",
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
          {editingProdutoId ? (
            <>
              <FaEdit className={styles.icon} /> Editar Produto
            </>
          ) : (
            <>
              <FaPlus className={styles.icon} /> Cadastro de Produto
            </>
          )}
        </h1>
        <p className={styles.description}>
          Preencha os campos para {editingProdutoId ? "editar" : "cadastrar"} um
          produto.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="CD_PRODUTO" className={styles.label}>
              Código do Produto:
            </label>
            <input
              type="number"
              id="CD_PRODUTO"
              name="CD_PRODUTO"
              value={formData.dataRows.CD_PRODUTO}
              onChange={handleChange}
              required
              className={styles.inputField}
              placeholder="Ex: 101, 102"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="NM_PRODUTO" className={styles.label}>
              Nome do Produto:
            </label>
            <input
              type="text"
              id="NM_PRODUTO"
              name="NM_PRODUTO"
              value={formData.dataRows.NM_PRODUTO}
              onChange={handleChange}
              required
              className={styles.inputField}
              placeholder="Ex: Pizza de Calabresa"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="DS_PRODUTO" className={styles.label}>
              Descrição do Produto:
            </label>
            <textarea
              id="DS_PRODUTO"
              name="DS_PRODUTO"
              value={formData.dataRows.DS_PRODUTO}
              onChange={handleChange}
              required
              className={styles.inputField}
              placeholder="Ex: Pizza com molho de tomate, queijo e calabresa."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="VL_PRODUTO" className={styles.label}>
              Valor do Produto:
            </label>
            <input
              type="number"
              id="VL_PRODUTO"
              name="VL_PRODUTO"
              value={formData.dataRows.VL_PRODUTO}
              onChange={handleChange}
              required
              className={styles.inputField}
              placeholder="Ex: 50.00"
              step="0.01"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ID_CATEGORIA" className={styles.label}>
              Categoria:
            </label>
            <select
              id="ID_CATEGORIA"
              name="ID_CATEGORIA"
              value={formData.dataRows.ID_CATEGORIA}
              onChange={handleChange}
              required
              className={styles.inputField}
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              {categorias.map((categoria) => (
                <option
                  key={categoria.ID_CATEGORIA}
                  value={categoria.ID_CATEGORIA}
                >
                  {categoria.NM_CATEGORIA}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="IMG_PRODUTO" className={styles.label}>
              Imagem do Produto:
            </label>
            <input
              type="file"
              id="IMG_PRODUTO"
              name="IMG_PRODUTO"
              onChange={(e) => setImagem(e.target.files[0])}
              accept="image/*"
              className={styles.inputField}
            />
            {editingProdutoId && editingProdutoImageUrl && (
              <p className={styles.infoMessage}>
                Imagem atual:{" "}
                <a
                  href={editingProdutoImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver imagem
                </a>
              </p>
            )}
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              "Salvando..."
            ) : editingProdutoId ? (
              <>
                <FaEdit /> Atualizar Produto
              </>
            ) : (
              <>
                <FaPlus /> Salvar Produto
              </>
            )}
          </button>

          {editingProdutoId && (
            <button
              type="button"
              onClick={() => {
                setEditingProdutoId(null);
                setEditingProdutoImageUrl("");
                setFormData({
                  dataRows: {
                    CD_PRODUTO: "",
                    NM_PRODUTO: "",
                    DS_PRODUTO: "",
                    VL_PRODUTO: "",
                    ID_CATEGORIA: "",
                    IMG_PRODUTO: null,
                  },
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
        <FaListAlt className={styles.icon} /> Lista de Produtos
      </h2>
      <div className={styles.produtoList}>
        {loading && <p className={styles.loading}>Carregando produtos...</p>}
        {!loading && produtos.length === 0 ? (
          <p className={styles.noItemsMessage}>Nenhum produto cadastrado.</p>
        ) : (
          produtos.map((produto) => (
            <div key={produto.ID_PRODUTO} className={styles.produtoItem}>
              <div className={styles.imageContainer}>
                <img
                  src={produto.IMG_PRODUTO}
                  alt={produto.NM_PRODUTO}
                  className={styles.produtoImage}
                />
              </div>
              <div className={styles.produtoInfo}>
                <p>
                  <strong>Código:</strong> {produto.CD_PRODUTO}
                </p>
                <p>
                  <strong>Nome:</strong> {produto.NM_PRODUTO}
                </p>
                <p>
                  <strong>Descrição:</strong> {produto.DS_PRODUTO}
                </p>
                <p>
                  <strong>Valor:</strong> R$ {produto.VL_PRODUTO}
                </p>
                <p>
                  <strong>Categoria:</strong>{" "}
                  {categorias.find(
                    (c) => c.ID_CATEGORIA === produto.ID_CATEGORIA
                  )?.NM_CATEGORIA || "N/A"}
                </p>
              </div>
              <div className={styles.produtoActions}>
                <button
                  onClick={() => handleEdit(produto)}
                  className={`${styles.actionButton} ${styles.editButton}`}
                >
                  <FaEdit /> Editar
                </button>
                <button
                  onClick={() => handleDelete(produto.ID_PRODUTO)}
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

export default CadastroProduto;
