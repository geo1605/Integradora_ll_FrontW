// api/motores.ts
const API_URL = import.meta.env.VITE_API_URL;

interface MotorStates {
  VERTICAL?: boolean;
  RIEGO?: boolean;
  AGITACION?: boolean;
  CASCADA?: boolean;
  MOSQUITOS?: boolean;
}

/**
 * ✅ Obtener el estado actual de los motores
 */
export const getMotorStates = async () => {
  try {
    const response = await fetch(`${API_URL}/api/labView/estado-esp`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Error al obtener estados de motores");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error al obtener estados de motores:", error);

    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar al servidor. Intenta más tarde.");
    }

    if (error.response) {
      switch (error.response.status) {
        case 404:
          throw new Error("No se encontraron datos de motores.");
        case 500:
          throw new Error("Error interno del servidor al obtener estados.");
        default:
          throw new Error(error.response.data?.message || "Error desconocido.");
      }
    } else {
      throw new Error(error.message || "Error inesperado al obtener estados.");
    }
  }
};

/**
 * ✅ Actualizar el estado de los motores
 */
export const updateMotorStates = async (states: MotorStates) => {
  try {
    const response = await fetch(`${API_URL}/api/labView/actualizar-estados`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(states),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Error al actualizar estados de motores");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error al actualizar estados de motores:", error);

    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar al servidor. Intenta más tarde.");
    }

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("Datos inválidos enviados para actualizar los motores.");
        case 404:
          throw new Error("No se encontró el registro de motores.");
        case 500:
          throw new Error("Error interno del servidor al actualizar estados.");
        default:
          throw new Error(error.response.data?.message || "Error desconocido.");
      }
    } else {
      throw new Error(error.message || "Error inesperado al actualizar estados.");
    }
  }
};
