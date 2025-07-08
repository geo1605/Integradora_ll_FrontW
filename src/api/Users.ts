import axios from 'axios'
import { useAuthStore } from '../store/auth.store'
import { handleUnauthorized } from '../components/handleUnauthorized'

const API_URL = import.meta.env.VITE_API_URL

export const getAllUsers = async () => {
  try {
    const token = useAuthStore.getState().token

    if (!token) {
      throw new Error("Token no disponible")
    }

    const response = await axios.get(`${API_URL}/api/users/getAllUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    })

    return response.data
  } catch (error: any) {
    console.error("Error al obtener usuarios:", error)

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("Solicitud inválida al obtener usuarios.")
        case 401:
          await handleUnauthorized()
          throw new Error("No autorizado. Por favor, inicie sesión nuevamente.")
        case 404:
          throw new Error("No se encontró el recurso de usuarios.")
        case 500:
          throw new Error("Error interno del servidor al obtener usuarios.")
        default:
          throw new Error(error.response.data.message || "Error al obtener los usuarios.")
      }
    } else {
      throw new Error(error.message || "Error de conexión. Verifique su red.")
    }
  }
}


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
    const response = await axios.post(`${API_URL}/api/users/createUser`, userData, {
      headers: {
        "Content-Type": "application/json",
      }
    })

    return response.data
  } catch (error: any) {
    console.error("Error al registrar usuario:", error)

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("Datos inválidos o faltantes en el registro.")
        case 401:
          await handleUnauthorized()
          throw new Error("No autorizado. Por favor, inicie sesión nuevamente.")
        case 404:
          throw new Error("Ruta de registro no encontrada.")
        case 500:
          throw new Error("Error interno del servidor durante el registro.")
        default:
          throw new Error(error.response.data.message || "Error al registrar usuario.")
      }
    } else {
      throw new Error(error.message || "Error de conexión. Verifique su red.")
    }
  }
}