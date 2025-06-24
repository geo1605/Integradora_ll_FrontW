// ToolFormModal.tsx
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox,
} from "@heroui/react";

export default function ToolFormModal({ isOpen, onClose, initialData, onSubmit }) {
  const [formData, setFormData] = React.useState({
    name: "",
    description: "Activo",
    status: true,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "Activo",
        status: initialData.status ?? true,
      });
    } else {
      setFormData({
        name: "",
        description: "Activo",
        status: true,
      });
    }
  }, [initialData]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onCloseInner) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {initialData ? "Editar herramienta" : "Añadir herramienta"}
            </ModalHeader>
            <ModalBody>
              <Input
                isRequired
                label="Nombre"
                placeholder="Ej. Taladro"
                value={formData.name}
                onValueChange={(v) => handleChange("name", v)}
              />

              <Select
                label="Descripción"
                selectedKeys={[formData.description]}
                onSelectionChange={(keys) =>
                  handleChange("description", Array.from(keys)[0])
                }
              >
                <SelectItem key="Activo">Activo</SelectItem>
                <SelectItem key="EnUso">En uso</SelectItem>
                <SelectItem key="Mantenimiento">Mantenimiento</SelectItem>
                <SelectItem key="Deshabilitado">Deshabilitado</SelectItem>
              </Select>

              <Checkbox
                color="success"
                isSelected={formData.status}
                onValueChange={(v) => handleChange("status", v)}
                >
                Disponible
                </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onCloseInner}>
                Cancelar
              </Button>
              <Button color="success" onPress={handleSubmit}>
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
