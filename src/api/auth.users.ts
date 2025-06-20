const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/login-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      const message = data?.message || "Error en el servidor";
      throw new Error(message);
    }

    return await res.json();
  } catch (err: any) {
    // Si falla la conexión con el backend (por ejemplo, no está encendido)
    if (err.message === "Failed to fetch") {
      throw new Error("No se pudo conectar al servidor. Intenta más tarde.");
    }
    throw err;
  }
};

// Solicita un nuevo token usando el token actual
export const verifyToken = async (token: string): Promise<boolean> => { 
  try {
    const response = await fetch(`${API_URL}/api/auth/timeTokenLife`, {  // Usa backticks para interpolar correctamente la URL
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,  // Asegúrate de que la interpolación de token sea correcta
      },
    });

    return response.ok;
  } catch {
    return false;
  }
};
