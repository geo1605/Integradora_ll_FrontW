import axios from "axios"; 
import { useAuthStore } from "../store/auth.store";
import { handleUnauthorized } from "../components/handleUnauthorized";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllModules = async () => {
  try {
    const token = useAuthStore.getState().token;
    const response = await axios.get(`${API_URL}/api/botanic/getAll/Inventory`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error al obtener módulos:", error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          await handleUnauthorized();
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        case 404:
          throw new Error('No se encontraron módulos.');
        default:
          throw new Error(error.response.data.message || 'Error al obtener los módulos');
      }
    } else {
      throw new Error('Error de conexión. Por favor, verifica tu conexión a internet.');
    }
  }
};

export const createModule = async (moduleData: {
  name: string;
  ubication: string;
  plants: Array<{
    plantName: string;
    type: string;
    status: string;
  }>;
}) => {
  try {
    const token = useAuthStore.getState().token;
    const response = await axios.post(`${API_URL}/api/botanic/createBotanic`, moduleData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.inventory;
  } catch (error: any) {
    console.error("Error al crear módulo:", error);
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error('Límite máximo de 50 módulos alcanzado. Elimina alguno para agregar uno nuevo.');
        case 409:
          throw new Error('Ya existe un módulo con ese nombre.');
        case 401:
          await handleUnauthorized();
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        default:
          throw new Error(error.response.data.message || 'Error al crear el módulo');
      }
    } else {
      throw new Error('Error de conexión. Por favor, verifique su conexión a internet.');
    }
  }
};

export const deleteModule = async (moduleName: string) => {
  try {
    const token = useAuthStore.getState().token;
    const response = await axios.delete(
      `${API_URL}/api/botanic/deletePlant/${moduleName}`, // se usa `name`, no `_id`
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error al eliminar módulo:", error);
    
    if (error.response) {
      switch (error.response.status) {
        case 404:
          throw new Error('Módulo no encontrado.');
        case 401:
          await handleUnauthorized();
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        case 403:
          throw new Error('No tiene permisos para eliminar este módulo.');
        default:
          throw new Error(error.response.data.message || 'Error al eliminar el módulo');
      }
    } else {
      throw new Error('Error de conexión. Por favor, verifique su conexión a internet.');
    }
  }
};

export const updateModule = async (
  moduleName: string,
  updateData: {
    name?: string;
    ubication?: string;
    plants?: Array<{
      plantName?: string;
      type?: string;
      status?: string;
    }>;
  }
) => {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.put(
      `${API_URL}/api/botanic/updateInventory/data/${moduleName}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.updatedInventory;
  } catch (error: any) {
    console.error("Error al actualizar módulo:", error);

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("Datos de actualización no válidos.");
        case 404:
          throw new Error("Módulo no encontrado.");
        case 409:
          throw new Error("Ya existe otro módulo con ese nombre.");
        case 401:
          await handleUnauthorized();
          throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
        default:
          throw new Error(error.response.data.message || "Error al actualizar el módulo.");
      }
    } else {
      throw new Error("Error de conexión. Por favor, verifica tu conexión a internet.");
    }
  }
};
