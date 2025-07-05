// src/components/PublicOnlyRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import type { ReactNode } from "react";

export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { token, isLoading } = useAuthStore();

  if (isLoading) return <div>Cargando...</div>;

  return token ? <Navigate to="/" replace /> : <>{children}</>;
}