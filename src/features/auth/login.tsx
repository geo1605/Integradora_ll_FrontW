import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import QrCodeOutlinedIcon from "@mui/icons-material/QrCodeOutlined";

import LoginQR from "./LoginQr";
import { loginUser } from "../../api/auth.users";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../api/authGoogle.api";
import { useAuthStore } from "../../store/auth.store";

export default function Login({ clear }: { clear: boolean }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  const loginSuccessModal = useDisclosure();
  const qrModal = useDisclosure();

  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      const token = data.token || data.accessToken;

      if (token) {
        setToken(token);
        sessionStorage.setItem("token", token);

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

  interface GoogleTokenResponse {
    id_token?: string;
    access_token?: string;
    error?: string;
    error_description?: string;
  }

  const login = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (tokenResponse: GoogleTokenResponse) => {
      try {
        const tokenToSend =
          tokenResponse.id_token || tokenResponse.access_token;
        if (!tokenToSend) throw new Error("No se recibió token válido");

        const res = await loginWithGoogle(tokenToSend);
        setToken(res.token);
        sessionStorage.setItem("token", res.token);
        window.location.assign("/");
      } catch (error) {
        console.error("Error completo:", error);
        const errorMsg =
          error instanceof Error ? error.message : String(error);
        setErrorMessage(errorMsg);
        setErrorModalOpen(true);
      }
    },
    onError: (error) => {
      console.error("Error de Google:", error);
      setErrorMessage("Falló la autenticación con Google.");
      setErrorModalOpen(true);
    },
  });

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
            <button
              type="button"
              onClick={togglePassword}
              className="focus:outline-none"
            >
              {showPassword ? (
                <VisibilityOffIcon className="text-gray-500" />
              ) : (
                <VisibilityIcon className="text-gray-500" />
              )}
            </button>
          }
        />

        <Button
          className="w-full text-white"
          color="success"
          onPress={handleLogin}
        >
          Aceptar
        </Button>
      </Form>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-gray-500 text-sm">o continua con</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <Button
        className={`w-full border ${
          isConsentGiven
            ? "border-green-500 text-green-700 hover:bg-green-100"
            : "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100"
        }`}
        variant="bordered"
        disabled={!isConsentGiven}
        onClick={() => isConsentGiven && login()}
        startContent={
          <img
            src="https://img.icons8.com/?size=512&id=17949&format=png"
            alt="Google"
            className="w-5 h-5"
          />
        }
      >
        Continuar con Google
      </Button>

      <div className="flex items-start mb-2 text-sm text-gray-700">
        <input
          type="checkbox"
          id="consent"
          checked={isConsentGiven}
          onChange={(e) => setIsConsentGiven(e.target.checked)}
          className="mr-2 mt-1"
        />
        <label htmlFor="consent" className="flex flex-col">
          <span>
            Autorizo el uso de mis datos por sistemas externos (como Google).
          </span>
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mt-1"
          >
            Ver política de privacidad
          </a>
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

      {/* ✅ Modal: Login Exitoso */}
      <Modal
        isOpen={loginSuccessModal.isOpen}
        onOpenChange={loginSuccessModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-green-600 font-bold">
                ¡Login exitoso!
              </ModalHeader>
              <ModalBody>
                <p>Serás redirigido al inicio en unos segundos...</p>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ❌ Modal: Error */}
      <Modal
        isOpen={errorModalOpen}
        onOpenChange={() => setErrorModalOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-red-600 font-bold">
                Error de autenticación
              </ModalHeader>
              <ModalBody>
                <p>{errorMessage || "Error inesperado"}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 📷 Modal: Login QR */}
      <Modal isOpen={qrModal.isOpen} onOpenChange={qrModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Registro con QR</ModalHeader>
              <ModalBody>
                <LoginQR />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
