import { useEffect } from "react";
import { verifyToken } from "../api/auth.users";
import { useAuthStore } from "../store/auth.store";

export const useInitAuth = () => {
  const { setToken, setIsLoading } = useAuthStore();

  useEffect(() => {
    const checkToken = async () => {
      const token = sessionStorage.getItem("token");

      if (token) {
        const valid = await verifyToken(token);
        if (valid) {
          setToken(token);
        } else {
          sessionStorage.removeItem("token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkToken();
  }, [setToken, setIsLoading]);
};
