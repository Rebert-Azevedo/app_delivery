import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuthHook";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  console.log("ProtectedRoute: Verificando autenticação. Usuário atual:", user);

  if (!user) {
    console.log(
      "ProtectedRoute: Usuário não autenticado, redirecionando para /login."
    );
    return <Navigate to="/login" replace />;
  }

  console.log("ProtectedRoute: Usuário autenticado, renderizando filhos.");
  return children;
};

export default ProtectedRoute;
