import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/auth.store";

interface JwtPayload {
  userId: string;
  role: string;
  email?: string;
  exp?: number;
}

export const useUserId = (): string | null => {
  const { token } = useAuthStore();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded?.userId || null;
  } catch {
    return null;
  }
};
