import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid";
import { createQRSession, getQRStatus } from "../../api/qr.api";
import { useAuthStore } from "../../store/auth.store";

export default function LoginQR() {
  const [sessionCode, setSessionCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    generateNewCode();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateNewCode();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const poll = setInterval(async () => {
      if (!sessionCode) return;
      try {
        const token = await getQRStatus(sessionCode);
        if (token) {
          clearInterval(poll);
          setToken(token);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error consultando estado del QR:", error);
      }
    }, 2000);
    return () => clearInterval(poll);
  }, [sessionCode, navigate, setToken]);

  const generateNewCode = async () => {
    const newCode = uuidv4();
    setSessionCode(newCode);
    setTimeLeft(60);
    try {
      await createQRSession(newCode);
    } catch (error) {
      console.error("Error creando sesión QR:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <QRCode value={sessionCode} />
      <p>QR válido por: {timeLeft} segundos</p>
    </div>
  );
}
