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

type ToolDescription = "Active" | "InUse" | "Maintenance" | "Disabled";

interface ToolData {
  toolName: string;
  description: ToolDescription;
  status: boolean;
}

interface ToolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ToolData>;
  onSubmit: (data: ToolData) => void;
}

const descriptionOptions = [
  { value: "Active", label: "Activo" },
  { value: "InUse", label: "En uso" },
  { value: "Maintenance", label: "Mantenimiento" },
  { value: "Disabled", label: "Deshabilitado" }
];

export default function ToolFormModal({ 
  isOpen, 
  onClose, 
  initialData, 
  onSubmit 
}: ToolFormModalProps) {
  const [formData, setFormData] = React.useState<ToolData>({
    toolName: "",
    description: "Active",
    status: true,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        toolName: initialData.toolName || "",
        description: initialData.description || "Active",
        status: initialData.status ?? true,
      });
    } else {
      setFormData({
        toolName: "",
        description: "Active",
        status: true,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (key: keyof ToolData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formData.toolName.trim()) {
      alert("El nombre de la herramienta es requerido");
      return;
    }
    
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
                value={formData.toolName}
                onValueChange={(v) => handleChange("toolName", v)}
              />

              <Select
                label="Estado"
                selectedKeys={[formData.description]}
                onSelectionChange={(keys) =>
                  handleChange("description", Array.from(keys)[0] as ToolDescription)
                }
              >
                {descriptionOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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