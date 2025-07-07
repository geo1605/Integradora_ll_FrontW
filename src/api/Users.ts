import { useAuthStore } from "../store/auth.store";
const API_URL = import.meta.env.VITE_API_URL;
export const getAllUsers = async () => {
  try {
    const token = useAuthStore.getState().token;

    if (!token) {
      throw new Error("Token no disponible");
    }

    const response = await fetch(`${API_URL}/api/users/getAllUsers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "No se pudo obtener la lista de usuarios");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error al obtener usuarios:", error);

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("Solicitud inválida al obtener usuarios.");
        case 401:
          throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
        case 404:
          throw new Error("No se encontró el recurso de usuarios.");
        case 500:
          throw new Error("Error interno del servidor al obtener usuarios.");
        default:
          throw new Error(error.response.data.message || "Error al obtener los usuarios.");
      }
    } else {
      throw new Error(error.message || "Error de conexión. Verifique su red.");
    }
  }
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
  try {
    const response = await fetch(`${API_URL}/api/users/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registro fallido");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error al registrar usuario:", error);

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("Datos inválidos o faltantes en el registro.");
        case 401:
          throw new Error("No autorizado para registrar usuarios.");
        case 404:
          throw new Error("Ruta de registro no encontrada.");
        case 500:
          throw new Error("Error interno del servidor durante el registro.");
        default:
          throw new Error(error.response.data.message || "Error al registrar usuario.");
      }
    } else {
      throw new Error(error.message || "Error de conexión. Verifique su red.");
    }
  }
};

