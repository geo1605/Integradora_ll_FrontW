import axios from 'axios';

export const loginWithGoogle = async (googleAccessToken: string) => {
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login-google`, {
    token: googleAccessToken,
  });
  return {
    token: res.data.token,
    user: res.data.user,
  }
};