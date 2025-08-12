import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@heroui/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { resetPassword } from "../../api/Password";
import fondo from '../../assets/fondo_auth.png';
import logo from '../../assets/blanco.webp';

export default function ChangePassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (!urlToken) {
      setError("Token no encontrado en la URL");
      return;
    }
    setToken(urlToken);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/auth"), 3000);
    } catch (err: any) {
      console.error("Error al restablecer contraseña:", err);
      setError(err.message || "Error al restablecer la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${fondo})` }}>
        <div className="min-h-screen w-full backdrop-blur-sm bg-black/40 flex flex-col items-center justify-center px-4">
          <div className="text-center w-full max-w-md">
            <div className="flex flex-row items-center justify-center mb-6">
              <img src={logo} alt="Logo" className="w-20 h-20" />
              <div className="ml-4 text-white">
                <h1 className="text-2xl font-bold">SUDAAI</h1>
                <h2 className="text-lg font-semibold">ACUAPONIA</h2>
              </div>
            </div>

            <div className="rounded-lg shadow-lg p-8 w-full max-w-md bg-white">
              <h1 className="text-2xl font-bold text-center text-red-600 mb-4">
                Token no válido
              </h1>
              <p className="text-center text-gray-600 mb-6">
                El enlace de restablecimiento es inválido o ha expirado.
              </p>
              <Button 
                className="w-full" 
                color="danger"
                onPress={() => navigate("/EmailPassword")}
              >
                Solicitar nuevo enlace
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="min-h-screen w-full backdrop-blur-sm bg-black/40 flex flex-col items-center justify-center px-4">
        <div className="text-center w-full max-w-md">
          <div className="flex flex-row items-center justify-center mb-6">
            <img src={logo} alt="Logo" className="w-20 h-20" />
            <div className="ml-4 text-white">
              <h1 className="text-2xl font-bold">SUDAAI</h1>
              <h2 className="text-lg font-semibold">ACUAPONIA</h2>
            </div>
          </div>

          <div className="rounded-lg shadow-lg p-8 w-full max-w-md bg-white">
            <h1 className="text-2xl font-bold text-center mb-6">Restablecer contraseña</h1>
            
            {success ? (
              <div className="text-center">
                <div className="text-green-600 mb-4 text-lg font-semibold">
                  ¡Contraseña restablecida con éxito!
                </div>
                <p className="mb-4">Serás redirigido a la página de inicio de sesión...</p>
                <Spinner className="mt-4" />
              </div>
            ) : (
              <Form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  isRequired
                  label="Nueva contraseña"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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

                <Input
                  isRequired
                  label="Confirmar nueva contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon className="text-gray-500" />
                      ) : (
                        <VisibilityIcon className="text-gray-500" />
                      )}
                    </button>
                  }
                />

                {error && (
                  <div className="p-2 text-sm text-red-600 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}

                <Button
                  className="w-full mt-2"
                  color="success"
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? "Procesando..." : "Restablecer contraseña"}
                </Button>
              </Form>
            )}
          </div>
        </div>
      </div>

      {/* Modal de error */}
      <Modal isOpen={!!error} onOpenChange={() => setError("")}>
        <ModalContent>
          <ModalHeader className="text-red-600">Error</ModalHeader>
          <ModalBody>
            <p>{error}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => setError("")}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}