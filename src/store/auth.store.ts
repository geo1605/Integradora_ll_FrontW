import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

const SECRET_KEY = import.meta.env.VITE_SECRET_CRYPTO_JS;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLoading: true,
      setToken: (token) => set({ token }),
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          if (item) {
            try {
              const bytes = CryptoJS.AES.decrypt(item, SECRET_KEY);
              return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            } catch (error) {
              console.error('Error decrypting data', error);
              return null;
            }
          }
          return null;
        },
        setItem: (name, value) => {
          const strValue = JSON.stringify(value);
          const encrypted = CryptoJS.AES.encrypt(strValue, SECRET_KEY).toString();
          sessionStorage.setItem(name, encrypted);
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
      partialize: (state) => ({ token: state.token }),
    }
  )
);