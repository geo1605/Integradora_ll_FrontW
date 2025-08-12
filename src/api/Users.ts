import axios from 'axios'
import { useAuthStore } from '../store/auth.store'
import { handleUnauthorized } from '../components/handleUnauthorized'

const API_URL = import.meta.env.VITE_API_URL

interface UserData {
  userPK: {
    phoneNumber: string;
    middleName: string;
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: string;
  };
}

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

export const getUserDataById = async (userId: string, token: string): Promise<UserData['userPK']> => {
  try {
    const response = await axios.get<UserData>(`${API_URL}/api/users/getUserbyId/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.userPK;
  } catch (error: any) {
    console.error("Error al obtener datos del usuario:", error);

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("Solicitud inválida para obtener datos del usuario.");
        case 401:
          throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
        case 404:
          throw new Error("Usuario no encontrado.");
        case 500:
          throw new Error("Error interno del servidor al obtener datos del usuario.");
        default:
          throw new Error(error.response.data.message || "Error al obtener datos del usuario.");
      }
    } else {
      throw new Error(error.message || "Error de conexión. Verifique su red.");
    }
  }
};

export const updateUserByAdmin = async (
  userId: string,
  updateData: {
    role?: string;
    status?: boolean;
    email?: string;
    phoneNumber?: string;
  }
): Promise<{ message: string; user: any }> => {
  try {
    const token = useAuthStore.getState().token;
    
    if (!token) {
      throw new Error("Token no disponible");
    }

    const response = await axios.put(
      `${API_URL}/api/users/updateDataUserByAdmin/${userId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error al actualizar usuario:", error);

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error(error.response.data.message || "Solicitud inválida para actualizar usuario.");
        case 401:
          await handleUnauthorized();
          throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
        case 404:
          throw new Error(error.response.data.message || "Usuario no encontrado.");
        case 500:
          throw new Error("Error interno del servidor al actualizar usuario.");
        default:
          throw new Error(error.response.data.message || "Error al actualizar usuario.");
      }
    } else {
      throw new Error(error.message || "Error de conexión. Verifique su red.");
    }
  }
};

export const updateUserData = async (
  token: string,
  updateData: {
    email?: string;
    phoneNumber?: string;
    newPassword?: string;
    currentPassword?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
  }
): Promise<void> => {
  try {
    await axios.put(`${API_URL}/api/users/updateDataUserByUser`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error al actualizar datos del usuario:", error);

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error(error.response.data.message || "Datos de actualización inválidos.");
        case 401:
          throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
        case 404:
          throw new Error("Usuario no encontrado.");
        case 409:
          throw new Error(error.response.data.message || "Conflicto con los datos proporcionados.");
        case 500:
          throw new Error("Error interno del servidor al actualizar datos del usuario.");
        default:
          throw new Error(error.response.data.message || "Error al actualizar datos del usuario.");
      }
    } else {
      throw new Error(error.message || "Error de conexión. Verifique su red.");
    }
  }
};
