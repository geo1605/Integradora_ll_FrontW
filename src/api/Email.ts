import axios from "axios";
import { handleUnauthorized } from "../components/handleUnauthorized";

const API_URL = import.meta.env.VITE_API_URL;

export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/api/users/request/passwordReset`, { email }, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    return response.data;
  } catch (error: any) {
    console.error("Error al solicitar restablecimiento de contraseña:", error);

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("Correo inválido o faltante.");
        case 401:
          await handleUnauthorized();
          throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
        case 404:
          throw new Error("Usuario no encontrado.");
        case 500:
          throw new Error("Error del servidor al procesar la solicitud.");
        default:
          throw new Error(error.response.data.message || "Error al solicitar restablecimiento.");
      }
    } else {
      throw new Error(error.message || "Error de conexión. Verifique su red.");
    }
  }
};
