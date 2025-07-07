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

import AlertModal from "../../components/alerts";

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
  { value: "Disabled", label: "Deshabilitado" },
];

export default function ToolFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: ToolFormModalProps) {
  const [formData, setFormData] = React.useState<ToolData>({
    toolName: "",
    description: "Active",
    status: true,
  });

  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertConfirmText, setAlertConfirmText] = React.useState("Aceptar");
  const [alertShowCancel, setAlertShowCancel] = React.useState(true);
  const [alertOnConfirm, setAlertOnConfirm] = React.useState<
    (() => void) | undefined
  >(undefined);

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

  // Ahora con parámetro para decidir si cerrar modal formulario antes de mostrar alerta
  const showAlert = (
    title: string,
    message: string,
    confirmText = "Aceptar",
    showCancelButton = true,
    onConfirm?: () => void,
    closeFormModal = true
  ) => {
    if (closeFormModal) onClose();

    setTimeout(() => {
      setAlertTitle(title);
      setAlertMessage(message);
      setAlertConfirmText(confirmText);
      setAlertShowCancel(showCancelButton);
      setAlertOnConfirm(() => onConfirm);
      setAlertOpen(true);
    }, 0);
  };

  const handleSubmit = () => {
    if (!formData.toolName.trim()) {
      // No cerramos modal formulario en error
      showAlert(
        "Error",
        "El nombre de la herramienta es requerido",
        "Cerrar",
        false,
        undefined,
        false
      );
      return;
    }

    try {
      onSubmit(formData);
      showAlert(
        "¡Guardado exitosamente!",
        "La herramienta se ha guardado correctamente.",
        "Cerrar",
        false,
        () => {
          setAlertOpen(false);
          onClose();
        }
      );
    } catch {
      // En error no cerramos modal formulario
      showAlert(
        "Error",
        "Error inesperado al guardar la herramienta",
        "Cerrar",
        false,
        undefined,
        false
      );
    }
  };

  return (
    <>
      {/* Modal Formulario */}
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
                    handleChange(
                      "description",
                      Array.from(keys)[0] as ToolDescription
                    )
                  }
                >
                  {descriptionOptions.map((option) => (
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

      {/* Modal Alerta (Error o éxito) */}
      <AlertModal
        isOpen={alertOpen}
        onOpenChange={setAlertOpen}
        title={alertTitle}
        message={alertMessage}
        confirmText={alertConfirmText}
        showCancelButton={alertShowCancel}
        onConfirm={() => {
          alertOnConfirm?.();
          setAlertOpen(false);
        }}
      />
    </>
  );
}
