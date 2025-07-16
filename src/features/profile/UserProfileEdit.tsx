import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { CheckIcon, XIcon, LockIcon, MailIcon, PhoneIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function UserProfileEdit({
  userInfo,
  onSave,
  onCancel,
}: {
  userInfo: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role: string;
    password?: string;
  };
  onSave: (info: typeof userInfo & { password?: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    ...userInfo,
    password: ""
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPhoneValid = /^\d{10}$/.test(form.phoneNumber || "");
  const isPasswordValid = form.password === "" || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password);

  const handleSubmit = () => {
    const requiredFields = ["firstName", "middleName", "lastName", "email", "phoneNumber"];
    const hasErrors = requiredFields.some(field => !form[field as keyof typeof form]) ||
      !isEmailValid || !isPhoneValid || !isPasswordValid;

    if (hasErrors) {
      setTouched(requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
      return;
    }

    onSave({
      ...form,
      password: currentPassword
    });
  };

  return (
    <div className="w-full p-6 md:p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-bold mb-6">Editar Perfil</h2>
        <div className="space-y-4">

          {/* Nombres */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre completo</label>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Nombre"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                isInvalid={touched.firstName && !form.firstName}
                errorMessage="Campo obligatorio"
                className="w-full"
              />
              <Input
                placeholder="Primer apellido"
                value={form.middleName}
                onChange={(e) => handleChange("middleName", e.target.value)}
                isInvalid={touched.middleName && !form.middleName}
                errorMessage="Campo obligatorio"
                className="w-full"
              />
              <Input
                placeholder="Segundo apellido"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                isInvalid={touched.lastName && !form.lastName}
                errorMessage="Campo obligatorio"
                className="w-full"
              />
            </div>
          </div>

          {/* Email */}
          <Input
            label="Correo electrónico"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            isInvalid={touched.email && !isEmailValid}
            errorMessage="Correo inválido"
            className="w-full"
            startContent={<MailIcon className="h-4 w-4" />}
          />

          {/* Teléfono */}
          <Input
            label="Teléfono"
            type="tel"
            value={form.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            isInvalid={touched.phoneNumber && !isPhoneValid}
            errorMessage="Debe tener 10 dígitos"
            className="w-full"
            startContent={<PhoneIcon className="h-4 w-4" />}
          />

          {/* Contraseña actual */}
            <Input
              label="Contraseña actual"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              startContent={<LockIcon className="h-4 w-4" />}
              onChange={(e) => setCurrentPassword(e.target.value)}
              endContent={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <XIcon className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />}
              </button>
            }
            />
          

          {/* Nueva contraseña */}
          <Input
            label="Nueva contraseña"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            isInvalid={touched.password && !isPasswordValid}
            errorMessage="Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
            className="w-full"
            startContent={<LockIcon className="h-4 w-4" />}
            endContent={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <XIcon className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />}
              </button>
            }
          />

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button color="primary" onClick={handleSubmit}>
                <CheckIcon className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button color="danger" variant="light" onClick={onCancel}>
                Cancelar
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
