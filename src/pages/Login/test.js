import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuthHook";
import styles from "./Login.module.css";

const formatPhoneNumber = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");

  if (value.length > 11) {
    value = value.substring(0, 11);
  }

  let formattedValue = "";
  if (value.length > 0) {
    formattedValue += `(${value.substring(0, 2)}`;
    if (value.length > 2) {
      formattedValue += `)${value.substring(2, 7)}`;
      if (value.length > 7) {
        formattedValue += `-${value.substring(7, 11)}`;
      }
    }
  }
  return formattedValue;
};

function LoginForm({ toggleView, login, loading, error, showMessage }) {
  const [numero, setNumero] = useState("");
  const [senha, setSenha] = useState("");

  const handleNumeroChange = (e) => {
    const rawValue = e.target.value;
    const formatted = formatPhoneNumber(rawValue);
    setNumero(formatted);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (numero.replace(/\D/g, "").length !== 11) {
      showMessage("Por favor, digite os 11 dígitos do telefone.", "error");
      return;
    }
    const success = await login(numero.replace(/\D/g, ""), senha);
    if (success) {
      showMessage("Login bem-sucedido!", "success");
    } else {
      showMessage(error, "error");
    }
  };

  const isNumeroInvalid = numero.replace(/\D/g, "").length < 11;

  return (
    <div className={styles.loginForm}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className={styles.formGroup}>
          <label htmlFor="login-numero">Número:</label>
          <input
            type="text"
            id="login-numero"
            placeholder="(00)00000-0000"
            value={numero}
            onChange={handleNumeroChange}
            required
            maxLength="15"
            className={`${styles.inputField} ${
              isNumeroInvalid ? styles.inputError : ""
            }`}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="login-senha">Senha:</label>
          <input
            type="password"
            id="login-senha"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || isNumeroInvalid}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <button
        type="button"
        className={styles.secondaryButton}
        onClick={toggleView}
      >
        Criar Nova Conta
      </button>
    </div>
  );
}

function CreateUserForm({ toggleView, register, loading, error, showMessage }) {
  const [nm_cliente, setNm_cliente] = useState("");
  const [numero, setNumero] = useState("");
  const [senha, setSenha] = useState("");

  const handleNumeroChange = (e) => {
    const rawValue = e.target.value;
    const formatted = formatPhoneNumber(rawValue);
    setNumero(formatted);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (numero.replace(/\D/g, "").length !== 11) {
      showMessage("Por favor, digite os 11 dígitos do telefone.", "error");
      return;
    }
    const success = await register(
      nm_cliente,
      numero.replace(/\D/g, ""),
      senha
    );
    if (success) {
      showMessage("Usuário criado com sucesso!", "success");
      toggleView();
    } else {
      showMessage(error, "error");
    }
  };

  const isNumeroInvalid = numero.replace(/\D/g, "").length < 11;

  return (
    <div className={styles.loginForm}>
      <h2>Criar Conta</h2>
      <form onSubmit={handleCreateUser}>
        <div className={styles.formGroup}>
          <label htmlFor="create-nm_cliente">Nome:</label>
          <input
            placeholder="Digite seu nome"
            id="create-nome"
            value={nm_cliente}
            onChange={(e) => setNm_cliente(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="create-numero">Número:</label>
          <input
            placeholder="(00)00000-0000"
            type="text"
            id="create-numero"
            value={numero}
            onChange={handleNumeroChange}
            required
            maxLength="15"
            className={`${styles.inputField} ${
              isNumeroInvalid ? styles.inputError : ""
            }`}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="create-senha">Senha:</label>
          <input
            placeholder="Digite sua senha"
            type="password"
            id="create-senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || isNumeroInvalid}
        >
          {loading ? "Criando..." : "Criar Conta"}
        </button>
      </form>
      <button
        type="button"
        className={styles.secondaryButton}
        onClick={toggleView}
      >
        Voltar para Login
      </button>
    </div>
  );
}

function App() {
  const [isLoginView, setIsLoginView] = useState(true);
  const { login, register, loading, error } = useAuth();
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setMessage(null);
    setMessageType(null);
  };

  const showMessage = useCallback((msg, type) => {
    setMessage(msg);
    setMessageType(type);
    const timer = setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timerCleanup;
    if (error) {
      timerCleanup = showMessage(error, "error");
    }
    return () => {
      if (timerCleanup) {
        timerCleanup();
      }
    };
  }, [error, showMessage]);

  return (
    <div className={styles.loginContainer}>
      {message && (
        <div
          className={`${styles.tempMessage} ${
            messageType === "success" ? styles.successMessage : styles.errorMessage
          }`}
        >
          {message}
        </div>
      )}
      {isLoginView ? (
        <LoginForm
          toggleView={toggleView}
          login={login}
          loading={loading}
          error={error}
          showMessage={showMessage}
        />
      ) : (
        <CreateUserForm
          toggleView={toggleView}
          register={register}
          loading={loading}
          error={error}
          showMessage={showMessage}
        />
      )}
    </div>
  );
}

export default App;
