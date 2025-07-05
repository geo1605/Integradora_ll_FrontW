import { useAuthStore } from "../store/auth.store";

export const getAllUsers = async () => {
  const API_URL = import.meta.env.VITE_API_URL;
    const token = useAuthStore.getState().token;

  if (!token) {
    throw new Error("Token no disponible");
  }

  const res = await fetch(`${API_URL}/api/users/getAllUsers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "No se pudo obtener la lista de usuarios");
  }

  return res.json(); 
};


// src/api/registerUser.ts
export const registerUser = async (userData: {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}/api/users/createUser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registro fallido");
  }

  return res.json();
};
