import { addToast } from "@heroui/react";

const WS_URL = import.meta.env.VITE_WS_API_URL || "ws://localhost:3006";

let socket: WebSocket | null = null;

export const connectWebSocketAlerts = () => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(WS_URL); // URL WebSocket (asegúrate que sea ws:// o wss://)

    socket.onopen = () => {
      console.log(" WebSocket de alertas conectado");
    };

    socket.onmessage = (event) => {
      console.log("Mensaje recibido WS:", event.data);
      try {
        const data = JSON.parse(event.data);

        if (data.type === "alert" && Array.isArray(data.alerts)) {
          data.alerts.forEach((msg: string) => {
            addToast({
              title: "⚠️ Alerta del sistema",
              description: msg,
              color: "warning", // Puedes usar "success", "danger", "primary", etc.
            });
          });
        }
      } catch (err) {
        console.error("Error procesando mensaje WebSocket:", err);
      }
    };

    socket.onclose = () => {
      console.log(" WebSocket cerrado");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  }
};
