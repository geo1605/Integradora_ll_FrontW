import React, { useState, useEffect } from "react";
import {
  Form, Input, Button, Modal, ModalContent, ModalHeader,
  ModalBody, ModalFooter, useDisclosure
} from "@heroui/react";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import QrCodeOutlinedIcon from "@mui/icons-material/QrCodeOutlined";

import { loginUser } from "../../api/auth.users";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginQR from "./LoginQr";

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
        className="w-full"
        variant="bordered"
        startContent={<img src="https://img.icons8.com/?size=512&id=17949&format=png" alt="Google" className="w-5 h-5" />}
      >
        Continuar con Google
      </Button>

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
