// src/components/PublicOnlyRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { token, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;

  return token ? <Navigate to="/" replace /> : <>{children}</>;
}