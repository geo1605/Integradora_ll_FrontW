import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: true,
  setToken: (token) => set({ token }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
