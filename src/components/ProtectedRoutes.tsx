// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { token, isLoading } = useAuth(); // Ahora también usa isLoading

  if (isLoading) {
    return <div>Cargando...</div>; // Muestra un loader mientras verifica el token
  }

  if (!token) {
    return <Navigate to="/auth" replace />; // Redirige si no hay token
  }

  return children; // Renderiza el contenido protegido si hay token
};

export default ProtectedRoute;