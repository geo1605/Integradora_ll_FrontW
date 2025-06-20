
const API_URL = import.meta.env.VITE_API_URL;
// Crear sesión QR
export const createQRSession = async (sessionCode: string): Promise<void> => {
  await fetch(`${API_URL}/api/qr/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionCode }),
  });
};

// Consultar si el token ya fue vinculado
export const getQRStatus = async (sessionCode: string): Promise<string | null> => {
  const res = await fetch(`${API_URL}/api/qr/status/${sessionCode}`);
  const data = await res.json();
  return data.token || null;
};
