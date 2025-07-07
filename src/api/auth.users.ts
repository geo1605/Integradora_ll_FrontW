const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Error al iniciar sesión");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error);

    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar al servidor. Intenta más tarde.");
    }

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("Credenciales inválidas.");
        case 401:
          throw new Error("No autorizado. Verifica tu email y contraseña.");
        case 404:
          throw new Error("Ruta de autenticación no encontrada.");
        case 500:
          throw new Error("Error interno del servidor durante el inicio de sesión.");
        default:
          throw new Error(error.response.data.message || "Error al iniciar sesión.");
      }
    } else {
      throw new Error(error.message || "Error inesperado al iniciar sesión.");
    }
  }
};


// Solicita un nuevo token usando el token actual
export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/timeTokenLife`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Token inválido o expirado");
    }

    return true;
  } catch (error: any) {
    console.error("Error al verificar token:", error);

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("Token mal formado.");
        case 401:
          throw new Error("Token no autorizado o expirado.");
        case 404:
          throw new Error("Ruta de verificación de token no encontrada.");
        case 500:
          throw new Error("Error del servidor al verificar el token.");
        default:
          throw new Error(error.response.data.message || "Error al verificar el token.");
      }
    } else {
      return false;
    }
  }
};

