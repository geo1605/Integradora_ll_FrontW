import { useState, useEffect } from "react";
import {
  Form, Input, Button, Modal, ModalContent, ModalHeader,
  ModalBody, ModalFooter, useDisclosure
} from "@heroui/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import QrCodeOutlinedIcon from "@mui/icons-material/QrCodeOutlined";

import { loginUser } from "../../api/auth.users";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginQR from "./LoginQr";
import { useGoogleLogin } from '@react-oauth/google';
import { loginWithGoogle } from '../../api/authGoogle.api'
import axios from "axios";




export default function Login({ clear }: { clear: boolean }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const loginSuccessModal = useDisclosure();
  const qrModal = useDisclosure();

  const { setToken } = useAuth();
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      if (data.token || data.accessToken) {
        setToken(data.token || data.accessToken);
        loginSuccessModal.onOpen();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        throw new Error("Token no encontrado");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorMessage(err.message || "Error de autenticación");
      setErrorModalOpen(true);
    }
  };

  useEffect(() => {
    if (clear) {
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setErrorModalOpen(false);
      loginSuccessModal.onClose();
      qrModal.onClose();
    }
  }, [clear]);

  const login = useGoogleLogin({
    flow: 'implicit',
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      try {
        console.log("[1] Respuesta de Google recibida");

        const tokenToSend = tokenResponse.id_token || tokenResponse.access_token;
        if (!tokenToSend) throw new Error("No se recibió token válido");

        console.log("[2] Enviando token al backend...");
        const res = await loginWithGoogle(tokenToSend);

        console.log("[3] Respuesta del backend recibida:", res);
        localStorage.setItem('token', res.token);

        console.log("[4] Token almacenado. Redirigiendo...");

        // Opción 1: Redirección forzada (funciona siempre)
        window.location.assign('/');

        // Opción 2: Si usas React Router (puede fallar si hay estado que bloquee)
        // navigate('/', { replace: true });

      } catch (error) {
        console.error("Error completo:", error);
        const errorMsg = (error instanceof Error) ? error.message : String(error);
        alert(`Error: ${errorMsg}`);
      }
    },
    onError: (error) => console.error("Error de Google:", error),
  });

  const [isConsentGiven, setIsConsentGiven] = useState(false);

  return (
    <>
      <Form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <Input
          isRequired
          className="w-full"
          placeholder="Ingresa tu correo"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          isRequired
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endContent={
            <button type="button" onClick={togglePassword} className="focus:outline-none">
              {showPassword ? <VisibilityOffIcon className="text-gray-500" /> : <VisibilityIcon className="text-gray-500" />}
            </button>
          }
        />

        <Button className="w-full text-white" color="success" onPress={handleLogin}>
          Aceptar
        </Button>
      </Form>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-gray-500 text-sm">o continua con</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <Button
        className={`w-full border ${isConsentGiven
            ? "border-green-500 text-green-700 hover:bg-green-100"
            : "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100"
          }`}
        variant="bordered"
        disabled={!isConsentGiven}
        onClick={() => isConsentGiven && login()}
        startContent={<img src="https://img.icons8.com/?size=512&id=17949&format=png" alt="Google" className="w-5 h-5" />}
      >
        Continuar con Google
      </Button>

      <div className="flex items-start mb-2">
        <input
          type="checkbox"
          id="consent"
          checked={isConsentGiven}
          onChange={(e) => setIsConsentGiven(e.target.checked)}
          className="mr-2 mt-1"
        />
        <label htmlFor="consent" className="text-sm text-gray-700">
          Autorizo el permiso para almacenar mis datos en servicios externos (Nuestro Sistema).
        </label>
      </div>

      <Button
        onPress={qrModal.onOpen}
        className="w-full mt-2"
        variant="bordered"
        startContent={<QrCodeOutlinedIcon className="w-5 h-5" />}
      >
        Escanear código QR
      </Button>

      {/* Modal de Éxito */}
      <Modal isOpen={loginSuccessModal.isOpen} onOpenChange={loginSuccessModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-green-600 font-bold">¡Login exitoso!</ModalHeader>
              <ModalBody>
                <p>Serás redirigido al inicio en unos segundos...</p>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={onClose}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal de Error */}
      <Modal isOpen={errorModalOpen} onOpenChange={() => setErrorModalOpen(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-red-600 font-bold">Error de autenticación</ModalHeader>
              <ModalBody>
                <p>{errorMessage || "Error de autenticación"}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal de QR */}
      <Modal isOpen={qrModal.isOpen} onOpenChange={qrModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Registro con QR</ModalHeader>
              <ModalBody>
                <LoginQR />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
