import axios from 'axios';
import { useAuthStore } from '../store/auth.store'; // ajusta la ruta si es necesario
import { handleUnauthorized } from '../components/handleUnauthorized'; // si tienes esta función implementada

const API_URL = import.meta.env.VITE_API_URL;

export const generateSensorPDFReport = async () => {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.get(`${API_URL}/api/reports/generate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // contiene: message, path, fileName, driveLink
  } catch (error: any) {
    console.error("Error al generar reporte PDF:", error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          await handleUnauthorized();
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        case 404:
          throw new Error('No hay datos para generar el reporte.');
        default:
          throw new Error(error.response.data.message || 'Error al generar el reporte PDF');
      }
    } else {
      throw new Error('Error de conexión. Por favor, verifica tu conexión a internet.');
    }
  }
};
