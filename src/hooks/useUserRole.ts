import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/auth.store";

interface JwtPayload {
  role: string;
  email?: string;
  exp?: number;
}

export const useUserRole = (): string | null => {
  const { token } = useAuthStore();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded?.role || null;
  } catch {
    return null;
  }
};
