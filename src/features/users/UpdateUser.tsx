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

export default function UpdateUser() {
  const [status, setStatus] = useState(true); // true = Activo, false = Inactivo
  const [role, setRole] = useState("user");   // Valor inicial del rol

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Editar Usuario</ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            {/* Cambiar estatus con Switch */}
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

            {/* Seleccionar rol con Select */}
            <Select
              label="Rol"
              placeholder="Selecciona un rol"
              selectedKeys={[role]}
              onSelectionChange={(keys) => setRole(Array.from(keys)[0])}
              isRequired
              items={[
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
                { label: "Guest", value: "guest" },
              ]}
            >
              {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
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
