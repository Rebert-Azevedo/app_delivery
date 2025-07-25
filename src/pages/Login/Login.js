import React, { useState } from "react";
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

function LoginForm({ toggleView, login, loading, error }) {
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
      console.error("Por favor, digite os 11 d gitos do telefone.");
      return;
    }
    const success = await login(numero.replace(/\D/g, ""), senha);
    if (success) {
      console.log("Login bem-sucedido!");
    } else {
      console.error("Falha no login. Verifique a mensagem de erro acima.");
    }
  };

  const isNumeroInvalid = numero.replace(/\D/g, "").length < 11;

  return (
    <div className={styles.loginForm}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className={styles.formGroup}>
          <label htmlFor="login-numero">N mero:</label>
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
      {error && <p className={styles.errorMessage}>{error}</p>}
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

function CreateUserForm({ toggleView, register, loading, error }) {
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
      console.error("Por favor, digite os 11 d gitos do telefone.");
      return;
    }
    const success = await register(
      nm_cliente,
      numero.replace(/\D/g, ""),
      senha
    );
    if (success) {
      console.log("Usu rio criado com sucesso!");
      toggleView();
    } else {
      console.error(
        "Falha ao criar usu rio. Verifique a mensagem de erro acima."
      );
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
          <label htmlFor="create-numero">N mero:</label>
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
      {error && <p className={styles.errorMessage}>{error}</p>}
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

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className={styles.loginContainer}>
      {isLoginView ? (
        <LoginForm
          toggleView={toggleView}
          login={login}
          loading={loading}
          error={error}
        />
      ) : (
        <CreateUserForm
          toggleView={toggleView}
          register={register}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}

export default App;
