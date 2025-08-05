import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      console.log(
        "AuthContext: Inicializando usuário do sessionStorage:",
        parsedUser
      );
      return parsedUser;
    } catch (error) {
      console.error(
        "AuthContext: Falha ao analisar usuário do sessionStorage:",
        error
      );
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem("user", JSON.stringify(user));
        console.log("AuthContext: Usuário salvo no sessionStorage:", user);
      } else {
        sessionStorage.removeItem("user");
        console.log("AuthContext: Usuário removido do sessionStorage (logout).");
      }
    } catch (error) {
      console.error(
        "AuthContext: Falha ao salvar usuário no sessionStorage:",
        error
      );
    }
  }, [user]);

  const authContextValue = {
    user,
    setUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error(
      "Erro: useAuthContext deve ser usado dentro de um AuthProvider."
    );
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
