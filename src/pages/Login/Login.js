import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuthHook";
import styles from "./Login.module.css";

function Login() {
  const [numero, setNumero] = useState("");
  const [senha, setSenha] = useState("");

  const { login, loading, error } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const success = await login(numero, senha);

    if (success) {
      console.log("Login bem-sucedido!");
    } else {
      console.error("Falha no login. Verifique a mensagem de erro acima.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label htmlFor="numero">Numero:</label>
          <input
            type="text"
            id="numero"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

export default Login;
