// ✅ Register.tsx
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
} from "@heroui/react";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";



import { registerUser } from "../../api/Register.users";

interface RegisterProps {
  clear: boolean;
}

export default function Register({ clear }: RegisterProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async () => {
    try {
      const response = await registerUser(formData);
      console.log("Usuario creado:", response);
      alert("Usuario creado exitosamente");
      navigate("/");
    } catch (err: any) {
      console.error("Error en el registro:", err);
      alert(err.message);
    }
  };

  useEffect(() => {
    if (clear) {
      setShowPassword(false);
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
      setTouchedFields({});
    }
  }, [clear]);

  return (
    <Form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <Input
        isRequired
        label="Nombres"
        placeholder="Juan Carlos"
        startContent={<PersonIcon />}
        className="w-full"
        value={formData.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
        isInvalid={touchedFields.firstName && !formData.firstName}
        errorMessage="Este campo es obligatorio"
      />

      <div className="flex w-full gap-4">
        <Input
          isRequired
          label="Apellido Paterno"
          placeholder="García"
          className="w-full"
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          isInvalid={touchedFields.lastName && !formData.lastName}
          errorMessage="Este campo es obligatorio"
        />
        <Input
          isRequired
          label="Apellido Materno"
          placeholder="López"
          className="w-full"
          value={formData.middleName}
          onChange={(e) => handleChange("middleName", e.target.value)}
          isInvalid={touchedFields.middleName && !formData.middleName}
          errorMessage="Este campo es obligatorio"
        />
      </div>

      <Input
        isRequired
        label="Correo electrónico"
        placeholder="juan.garcia@email.com"
        startContent={<EmailIcon />}
        className="w-full"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        isInvalid={
          touchedFields.email &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        }
        errorMessage="Ingresa un correo válido"
      />

      <Input
        isRequired
        label="Número de Teléfono"
        placeholder="5551234567"
        startContent={<PhoneIcon />}
        className="w-full"
        value={formData.phoneNumber}
        onChange={(e) => handleChange("phoneNumber", e.target.value)}
        isInvalid={
          touchedFields.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)
        }
        errorMessage="Debe contener 10 dígitos"
      />

      <Input
        isRequired
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        placeholder="********"
        startContent={<LockIcon />}
        description="Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números"
        className="w-full"
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
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        isInvalid={
          touchedFields.password &&
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)
        }
        errorMessage="Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
      />

      <Input
        isRequired
        label="Confirmar Contraseña"
        type={showPassword ? "text" : "password"}
        placeholder="********"
        startContent={<LockIcon />}
        className="w-full"
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
        value={formData.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
        isInvalid={
          touchedFields.confirmPassword &&
          formData.confirmPassword !== formData.password
        }
        errorMessage="Las contraseñas no coinciden"
      />

      <Button
        color="success"
        className="w-full text-white"
        variant="solid"
        onPress={handleSubmit}
      >
        Crear Cuenta
      </Button>
    </Form>
  );
}

