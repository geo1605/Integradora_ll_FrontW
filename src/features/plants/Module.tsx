import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Checkbox,
} from "@heroui/react";
import PopOverPlant from "./PopOverPlant";
import { useState } from "react";
import { PlantIcon } from "./plant.icon";
import { updateModule, deleteModule } from "../../api/Botanic";
import AlertModal from "../../components/alerts";

// Función para traducir estados al español
const translateStatusToSpanish = (status: string) => {
  const statusMap: Record<string, string> = {
    'Growing': 'Creciendo',
    'Geerntet': 'Germinando',
    'Dead': 'Muerta'
  };
  return statusMap[status] || status;
};

interface ModuleProps {
  name: string;
  ubication?: string;
  plantName?: string;
  type?: string;
  status?: string;
  createDate?: string;
  onUpdate?: () => void;
}

export default function Module({
  name,
  ubication = "Sector Norte",
  plantName,
  type = "Hortaliza",
  status = "Growing",
  createDate,
  onUpdate,
}: ModuleProps) {
  const { isOpen: isPopoverOpen, onOpenChange: setPopoverOpen } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: openEditModal, onOpenChange: setEditModalOpen } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpenChange: setDeleteModalOpen } = useDisclosure();

  const [hasPlant, setHasPlant] = useState(!!plantName);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [moduleDeleted, setModuleDeleted] = useState(false);

  const [moduleData, setModuleData] = useState({
    name,
    ubication,
    plantName: plantName || "",
    type,
    status,
    statusDisplay: translateStatusToSpanish(status) // Estado traducido para mostrar
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        name: moduleData.name,
        ubication: moduleData.ubication,
        plants: hasPlant
          ? [
              {
                plantName: moduleData.plantName,
                type: moduleData.type,
                status: moduleData.status, // Enviar en inglés al backend
              },
            ]
          : [],
      };

      await updateModule(name, updateData);
      setEditModalOpen();
      if (onUpdate) onUpdate();

      // Actualizar el estado mostrado
      setModuleData(prev => ({
        ...prev,
        statusDisplay: translateStatusToSpanish(prev.status)
      }));

      setAlertTitle("Módulo actualizado");
      setAlertMessage(`El módulo "${moduleData.name}" se ha actualizado correctamente.`);
      setShowAlert(true);
      setModuleDeleted(false);
    } catch (error: any) {
      setAlertTitle("Error al guardar");
      setAlertMessage(error.message || "Ocurrió un error al actualizar el módulo.");
      setShowAlert(true);
      setModuleDeleted(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (deletePlantOnly: boolean) => {
    setIsDeleting(true);
    try {
      if (deletePlantOnly) {
        await updateModule(name, { plants: [] });
        setAlertTitle("Planta eliminada");
        setAlertMessage(`La planta del módulo "${name}" fue eliminada correctamente.`);
        setModuleDeleted(false);
      } else {
        await deleteModule(name);
        setAlertTitle("Módulo eliminado");
        setAlertMessage(`El módulo "${name}" fue eliminado correctamente.`);
        setModuleDeleted(true);
      }

      setDeleteModalOpen();
      setShowAlert(true);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      setAlertTitle("Error al eliminar");
      setAlertMessage(error.message || "Ocurrió un error al eliminar.");
      setShowAlert(true);
      setModuleDeleted(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setModuleData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlantToggle = (isChecked: boolean) => {
    setHasPlant(isChecked);
    if (!isChecked) {
      setModuleData((prev) => ({
        ...prev,
        plantName: "",
        type: "Hortaliza",
        status: "Growing",
        statusDisplay: "Creciendo"
      }));
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <Popover
        placement="top"
        showArrow
        backdrop="opaque"
        isOpen={isPopoverOpen}
        onOpenChange={setPopoverOpen}
      >
        <PopoverTrigger>
          <div className="relative flex flex-col items-center w-16 cursor-pointer">
            {moduleData.plantName?.trim() && (
              <div className="absolute -top-12 z-10">
                <Tooltip
                  key={name}
                  color="success"
                  content={`Módulo ${name}`}
                  placement="bottom-end"
                >
                  <div className="text-green-500 text-xl select-none">
                    <PlantIcon />
                  </div>
                </Tooltip>
              </div>
            )}
            <div className="w-12 h-6 bg-[rgb(123,63,0)] rounded-b-full z-0" />
          </div>
        </PopoverTrigger>

        <PopoverContent>
          <PopOverPlant
            name={moduleData.name}
            ubication={moduleData.ubication}
            plantName={moduleData.plantName}
            status={moduleData.statusDisplay} // Mostrar estado traducido
            createDate={createDate}
            onEditClick={() => {
              setPopoverOpen();
              openEditModal();
            }}
            onDeleteClick={() => {
              setPopoverOpen();
              setDeleteModalOpen();
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Modal de edición (reemplazo del Drawer) */}
      <Modal isOpen={isEditModalOpen} onOpenChange={setEditModalOpen} size="xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold" style={{ color: "var(--blue)" }}>
              Editar Módulo {moduleData.name}
            </h2>
          </ModalHeader>
          <ModalBody className="space-y-6">
            <Input
              isRequired
              label="Nombre del módulo"
              value={moduleData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />

            <Select
              label="Ubicación"
              selectedKeys={[moduleData.ubication]}
              onChange={(e) => handleInputChange("ubication", e.target.value)}
            >
              <SelectItem key="Sector Norte">Sector Norte</SelectItem>
              <SelectItem key="Sector Sur">Sector Sur</SelectItem>
              <SelectItem key="Sector Este">Sector Este</SelectItem>
              <SelectItem key="Sector Oeste">Sector Oeste</SelectItem>
            </Select>

            <Checkbox
              isSelected={hasPlant}
              onValueChange={handlePlantToggle}
              className="mt-4"
            >
              Contiene planta
            </Checkbox>

            {hasPlant && (
              <>
                <Input
                  label="Nombre de la planta"
                  value={moduleData.plantName}
                  onChange={(e) => handleInputChange("plantName", e.target.value)}
                />

                <Select
                  label="Tipo de planta"
                  selectedKeys={[moduleData.type]}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                >
                  <SelectItem key="Hortaliza">Hortaliza</SelectItem>
                  <SelectItem key="Fruta">Fruta</SelectItem>
                  <SelectItem key="Hierba">Hierba</SelectItem>
                  <SelectItem key="Flor">Flor</SelectItem>
                </Select>

                <Select
                  label="Estado"
                  selectedKeys={[moduleData.status]}
                  onChange={(e) => {
                    handleInputChange("status", e.target.value);
                    // Actualizar el estado mostrado también
                    setModuleData(prev => ({
                      ...prev,
                      statusDisplay: translateStatusToSpanish(e.target.value)
                    }));
                  }}
                >
                  <SelectItem key="Growing">Creciendo</SelectItem>
                  <SelectItem key="Geerntet">Germinando</SelectItem>
                  <SelectItem key="Dead">Muerta</SelectItem>
                </Select>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onClick={() => setEditModalOpen()}>
              Cancelar
            </Button>
            <Button 
              color="success" 
              onClick={handleSave}
              isLoading={isSaving}
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de eliminación */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Confirmar eliminación</ModalHeader>
          <ModalBody>
            <p>¿Qué deseas eliminar?</p>

            {hasPlant && (
              <>
                <Button
                  color="danger"
                  variant="ghost"
                  className="w-full mt-2"
                  onClick={() => handleDelete(true)}
                  isLoading={isDeleting}
                >
                  Eliminar solo la planta
                </Button>
                <p className="text-sm text-gray-500 mt-1">
                  Solo se eliminará la planta asociada, el módulo permanecerá
                </p>
              </>
            )}

            <Button
              color="danger"
              className="w-full mt-4"
              onClick={() => handleDelete(false)}
              isLoading={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar módulo completo"}
            </Button>
            {hasPlant && (
              <p className="text-sm text-gray-500 mt-1">
                Se eliminará el módulo y todas las plantas asociadas
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onClick={() => setDeleteModalOpen()}
              isDisabled={isDeleting}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertModal
        isOpen={showAlert}
        onOpenChange={(open) => {
          setShowAlert(open);
          if (!open) {
            if (moduleDeleted) {
              setIsVisible(false);
            }
            if (onUpdate) onUpdate();
          }
        }}
        title={alertTitle}
        message={alertMessage}
        showCancelButton={false}
        confirmText="Entendido"
      />
    </>
  );
}