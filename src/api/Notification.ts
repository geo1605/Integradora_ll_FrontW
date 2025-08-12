import { addToast } from "@heroui/react";
import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const WS_URL = import.meta.env.VITE_WS_API_URL;

const API_URL = import.meta.env.VITE_API_URL;

let socket: WebSocket | null = null;

export const connectWebSocketAlerts = () => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("WebSocket de alertas conectado");
    };

    socket.onmessage = (event) => {
      console.log("Mensaje recibido WS:", event.data);
      try {
        const data = JSON.parse(event.data);

        if (data.type === "alert") {
          // Mensaje mejor formateado con todos los datos relevantes
          const alertMessage = `Sensor ${data.sensor.toUpperCase()} (${data.parameter}): 
                              Valor ${data.value} - ${data.alertType}`;

          addToast({
            title: ` Alerta: ${data.parameter}`,
            description: alertMessage,
            color: "warning",
          });
        }
      } catch (err) {
        console.error("Error procesando mensaje WebSocket:", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket cerrado");
      // Opcional: intentar reconexión
      setTimeout(connectWebSocketAlerts, 5000);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  }
};


export const getAllNotifications = async () => {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.get(`${API_URL}/api/labView/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.notifications;
  } catch (error: any) {
    console.error("Error al obtener notificaciones:", error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        case 404:
          throw new Error('No se encontraron notificaciones.');
        default:
          throw new Error(error.response.data.message || 'Error al obtener las notificaciones');
      }
    } else {
      throw new Error('Error de conexión. Por favor, verifica tu conexión a internet.');
    }
  }
};