
const API_URL = import.meta.env.VITE_API_URL;
// Crear sesión QR
export const createQRSession = async (sessionCode: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/qr/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionCode }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "No se pudo crear la sesión QR");
    }
  } catch (error: any) {
    console.error("Error al crear sesión QR:", error);

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("Código de sesión inválido.");
        case 404:
          throw new Error("Ruta para crear sesión QR no encontrada.");
        case 500:
          throw new Error("Error interno del servidor al crear sesión QR.");
        default:
          throw new Error(error.response.data.message || "Error al crear la sesión QR.");
      }
    } else {
      throw new Error(error.message || "Error de conexión. Verifique su red.");
    }
  }
};


// Consultar si el token ya fue vinculado
export const getQRStatus = async (sessionCode: string): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/api/qr/status/${sessionCode}`);

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "No se pudo consultar el estado del QR");
    }

    const data = await response.json();
    return data.token || null;
  } catch (error: any) {
    console.error("Error al consultar estado del QR:", error);

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("Código de sesión inválido.");
        case 401:
          throw new Error("No autorizado para consultar el estado del QR.");
        case 404:
          throw new Error("Sesión QR no encontrada.");
        case 500:
          throw new Error("Error interno del servidor al consultar estado del QR.");
        default:
          throw new Error(error.response.data.message || "Error al obtener el estado del QR.");
      }
    } else {
      throw new Error(error.message || "Error de conexión. Verifique su red.");
    }
  }
};

