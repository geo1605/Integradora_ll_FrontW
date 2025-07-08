import axios from 'axios';
import { useAuthStore } from '../store/auth.store'; 
import { handleUnauthorized } from '../components/handleUnauthorized';

const API_URL =   import.meta.env.VITE_API_URL;


export const createTool = async (toolData: {
  toolName: string;
  description: string;
}) => {

  try {
    const token = useAuthStore.getState().token;
    const response = await axios.post(`${API_URL}/api/toolInventory/new`, toolData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.tool;
  } catch (error: any) {
    console.error("Error al crear herramienta:", error);
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error('Ya existe una herramienta con ese nombre.');
        case 401:
          await handleUnauthorized();
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        default:
          throw new Error(error.response.data.message || 'Error al crear la herramienta');
      }
    } else {
      throw new Error('Error de conexión. Por favor, verifique su conexión a internet.');
    }
  }
};

export const getAllTools = async () => {
  try {
    const token = useAuthStore.getState().token;
    const response = await axios.get(`${API_URL}/api/toolInventory/get-all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.tools;
  } catch (error: any) {
    console.error("Error al obtener herramientas:", error);
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          await handleUnauthorized();
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        case 404:
          throw new Error('No se encontraron herramientas.');
        default:
          throw new Error(error.response.data.message || 'Error al obtener las herramientas');
      }
    } else {
      throw new Error('Error de conexión. Por favor, verifique su conexión a internet.');
    }
  }
};

export const getToolById = async (id: string) => {
  try {
    const token = useAuthStore.getState().token;
    const response = await axios.get(`${API_URL}/api/toolInventory/get-one/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.tool;
  } catch (error: any) {
    console.error("Error al obtener herramienta:", error);
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          await handleUnauthorized();
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        case 404:
          throw new Error('Herramienta no encontrada.');
        default:
          throw new Error(error.response.data.message || 'Error al obtener la herramienta');
      }
    } else {
      throw new Error('Error de conexión. Por favor, verifique su conexión a internet.');
    }
  }
};

export const updateTool = async (id: string, toolData: {
  toolName?: string;
  description?: string;
}) => {
  try {
    const token = useAuthStore.getState().token;
    const response = await axios.put(`${API_URL}/api/toolInventory/update/${id}`, toolData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.tool;
  } catch (error: any) {
    console.error("Error al actualizar herramienta:", error);
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error('Ya existe otra herramienta con ese nombre.');
        case 401:
          await handleUnauthorized();
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        case 404:
          throw new Error('Herramienta no encontrada.');
        default:
          throw new Error(error.response.data.message || 'Error al actualizar la herramienta');
      }
    } else {
      throw new Error('Error de conexión. Por favor, verifique su conexión a internet.');
    }
  }
};

export const deleteTool = async (id: string) => {
  try {
    const token = useAuthStore.getState().token;
    const response = await axios.delete(`${API_URL}/api/toolInventory/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.tool;
  } catch (error: any) {
    console.error("Error al eliminar herramienta:", error);
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error('La herramienta ya está eliminada.');
        case 401:
          await handleUnauthorized();
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        case 404:
          throw new Error('Herramienta no encontrada.');
        default:
          throw new Error(error.response.data.message || 'Error al eliminar la herramienta');
      }
    } else {
      throw new Error('Error de conexión. Por favor, verifique su conexión a internet.');
    }
  }
};