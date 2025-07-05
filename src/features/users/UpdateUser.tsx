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
}

export default function UpdateUser({ user }: UpdateUserProps) {
  const [status, setStatus] = useState(user.status); // Use the user's current status
  const [role, setRole] = useState(user.role);      // Use the user's current role

  const handleRoleChange = (keys: Set<Key> | "all") => {
    if (keys === "all") return;
    const selectedKey = Array.from(keys)[0];
    if (typeof selectedKey === "string") {
      setRole(selectedKey);
    }
  };

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            Editar Usuario: {user.firstName} {user.lastName}
          </ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            {/* Status toggle */}
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

            {/* Role selection */}
            <Select
              label="Rol"
              placeholder="Selecciona un rol"
              selectedKeys={new Set([role])}
              onSelectionChange={handleRoleChange}
              isRequired
            >
              {[
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
                { label: "Guest", value: "guest" },
              ].map((item) => (
                <SelectItem key={item.value}>{item.label}</SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={() => {
                console.log("Guardar cambios:", { status, role });
                // Here you would typically call an API to update the user
                onClose();
              }}
            >
              Guardar
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
}