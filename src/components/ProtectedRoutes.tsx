import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { token, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
