import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import { useState } from "react";
import type { Key } from "react";
import { updateUserByAdmin } from "../../api/Users";
import AlertModal from "../../components/alerts"; // Ajusta el path según tu estructura

interface User {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  status: boolean;
}

interface UpdateUserProps {
  user: User;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const roleMap: Record<string, string> = {
  "Administrador": "Adm1ni$trad0r",
  "Mantenimiento": "M4ntenim1ent0",
  "Botánico": "B0t4nic0",
  "Default": "Default",
};

const reverseRoleMap: Record<string, string> = {
  "Adm1ni$trad0r": "Administrador",
  "M4ntenim1ent0": "Mantenimiento",
  "B0t4nic0": "Botánico",
  "Default": "Default",
};

export default function UpdateUser({ user, onClose, onUpdateSuccess }: UpdateUserProps) {
  const [status, setStatus] = useState(user.status);
  const [role, setRole] = useState(reverseRoleMap[user.role] || "Default");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: ""
  });
  const [wasSuccess, setWasSuccess] = useState(false); // NUEVO: marca si fue éxito

  const handleRoleChange = (keys: Set<Key> | "all") => {
    if (keys === "all") return;
    const selectedKey = Array.from(keys)[0];
    if (typeof selectedKey === "string") {
      setRole(selectedKey);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const backendRole = roleMap[role] || "Default";

      await updateUserByAdmin(user._id, {
        role: backendRole,
        status,
      });

      setAlert({
        isOpen: true,
        title: "Actualización exitosa",
        message: "El usuario ha sido actualizado correctamente.",
      });
      setWasSuccess(true); // marca que fue exitosa
    } catch (err: any) {
      console.error("Error al actualizar usuario:", err);
      setAlert({
        isOpen: true,
        title: "Error",
        message: err.message || "Hubo un error al actualizar el usuario.",
      });
      setWasSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertClose = (open: boolean) => {
    setAlert((prev) => ({ ...prev, isOpen: open }));
    if (!open && wasSuccess) {
      onUpdateSuccess(); // solo si fue exitoso
      onClose(); // cierra el modal padre
    }
  };

  return (
    <>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Editar Usuario: {user.firstName} {user.lastName}
        </ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estatus</span>
            <Switch
              isSelected={status}
              onValueChange={setStatus}
              color="success"
            >
              {status ? "Activo" : "Inactivo"}
            </Switch>
          </div>

          <Select
            label="Rol"
            placeholder="Selecciona un rol"
            selectedKeys={new Set([role])}
            onSelectionChange={handleRoleChange}
            isRequired
          >
            {Object.keys(roleMap).map((readableRole) => (
              <SelectItem key={readableRole} value={roleMap[readableRole]}>
                {readableRole}
              </SelectItem>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>

      <AlertModal
        isOpen={alert.isOpen}
        onOpenChange={handleAlertClose}
        title={alert.title}
        message={alert.message}
        showCancelButton={false}
        confirmText="Entendido"
      />
    </>
  );
}
