export const loginUser = async (email: string, password: string) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}/api/auth/login-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};