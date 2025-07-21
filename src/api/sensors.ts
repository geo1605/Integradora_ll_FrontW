// /api/labView/getAllRegisters.ts
import axios from "axios";
import { useAuthStore } from "../store/auth.store";
import { handleUnauthorized } from "../components/handleUnauthorized";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllSensorRegisters = async () => {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.get(`${API_URL}/api/labView/allRegisters`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error al obtener lecturas de sensores:", error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          await handleUnauthorized();
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        case 404:
          throw new Error('No se encontraron registros de sensores.');
        default:
          throw new Error(error.response.data.message || 'Error al obtener los registros de sensores');
      }
    } else {
      throw new Error('Error de conexión. Por favor, verifica tu conexión a internet.');
    }
  }
};

export const getLastSensorRegister = async () => {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.get(`${API_URL}/api/labView/lastRegister`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error al obtener la última lectura del sensor:", error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          await handleUnauthorized();
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        case 404:
          throw new Error('No se encontraron registros de sensores.');
        default:
          throw new Error(error.response.data.message || 'Error al obtener el último registro del sensor');
      }
    } else {
      throw new Error('Error de conexión. Por favor, verifica tu conexión a internet.');
    }
  }
};