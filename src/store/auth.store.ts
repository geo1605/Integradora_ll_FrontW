import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLoading: true,
      setToken: (token) => set({ token }),
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage', // nombre clave para el storage
      storage: createJSONStorage(() => sessionStorage), // usa sessionStorage
      partialize: (state) => ({ token: state.token }), // solo persiste el token
    }
  )
);