import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid";
import { createQRSession, getQRStatus } from "../../api/qr.api"; // nueva importación

export default function LoginQR() {
  const [sessionCode, setSessionCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  let timeout: ReturnType<typeof setTimeout> | null = null;

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

      const token = await getQRStatus(sessionCode);
      if (token) {
        console.log(" Token recibido:", token);
        clearInterval(poll);
        if (timeout) clearTimeout(timeout);
        // Aquí puedes usar setToken(token) y navigate("/dashboard");
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [sessionCode]);

  const generateNewCode = async () => {
    const newCode = uuidv4();
    setSessionCode(newCode);
    setTimeLeft(60);
    await createQRSession(newCode); //  llamada API separada
  };

  return (
    <div className="flex flex-col items-center">
      <QRCode value={sessionCode} />
      <p>QR válido por: {timeLeft} segundos</p>
    </div>
  );
}
