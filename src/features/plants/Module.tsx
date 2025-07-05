import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Input,
  Form,
  Select,
  SelectItem,
  Checkbox,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@heroui/react";
import PopOverPlant from "./PopOverPlant";
import { useState } from "react";
import { PlantIcon } from "./plant.icon";
import { updateModule, deleteModule } from "../../api/Botanic";

interface ModuleProps {
  _id: string;
  name: string;
  ubication?: string;
  plantName?: string;
  type?: string;
  status?: string;
  createDate?: string;
  onUpdate?: () => void;
}

export default function Module({ 
  _id, 
  name, 
  ubication = "Sector Norte", 
  plantName, 
  type = "Hortaliza", 
  status = "Growing", 
  createDate,
  onUpdate
}: ModuleProps) {
  const { isOpen: isPopoverOpen, onOpenChange: setPopoverOpen } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onOpenChange: setDrawerOpen } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpenChange: setDeleteModalOpen } = useDisclosure();
  
  const [hasPlant, setHasPlant] = useState(!!plantName);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [moduleData, setModuleData] = useState({
    name,
    ubication,
    plantName: plantName || "",
    type,
    status
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        name: moduleData.name,
        ubication: moduleData.ubication,
        plants: hasPlant ? [{
          plantName: moduleData.plantName,
          type: moduleData.type,
          status: moduleData.status
        }] : []
      };

      await updateModule(_id, updateData);
      console.log("Módulo actualizado correctamente");
      
      setDrawerOpen();
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error("Error al guardar:", error.message);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (deletePlantOnly: boolean) => {
    setIsDeleting(true);
    try {
      if (deletePlantOnly) {
        await updateModule(_id, { plants: [] });
        console.log("Planta eliminada correctamente");
      } else {
        await deleteModule(_id);
        console.log("Módulo eliminado correctamente");
      }

      setDeleteModalOpen();
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error("Error al eliminar:", error.message);
      alert(`Error al eliminar: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setModuleData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlantToggle = (isChecked: boolean) => {
    setHasPlant(isChecked);
    if (!isChecked) {
      setModuleData(prev => ({
        ...prev,
        plantName: "",
        type: "Hortaliza",
        status: "Growing"
      }));
    }
  };

  return (
    <>
      {/* Popover principal */}
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
            status={moduleData.status}
            createDate={createDate}
            onEditClick={() => {
              setPopoverOpen();
              openDrawer();
            }}
            onDeleteClick={() => {
              setDeleteModalOpen();
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Drawer de edición */}
      <Drawer isOpen={isDrawerOpen} placement="left" onOpenChange={setDrawerOpen}>
        <DrawerContent className="flex items-center justify-center">
          <DrawerHeader className="flex flex-col gap-1">
            Editar Módulo
          </DrawerHeader>
          <DrawerBody className="w-full flex justify-center items-center">
            <Form className="space-y-6 w-full max-w-sm" onSubmit={handleSave}>
              <h2 className="text-7xl font-bold text-center mb-4" style={{ color: "var(--blue)" }}>
                {moduleData.name}
              </h2>
              
              <Input
                isRequired
                label="Nombre del módulo"
                value={moduleData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              
              <Select
                label="Ubicación"
                selectedKeys={[moduleData.ubication]}
                onChange={(e) => handleInputChange('ubication', e.target.value)}
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
                    onChange={(e) => handleInputChange('plantName', e.target.value)}
                  />
                  
                  <Select
                    label="Tipo de planta"
                    selectedKeys={[moduleData.type]}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <SelectItem key="Hortaliza">Hortaliza</SelectItem>
                    <SelectItem key="Fruta">Fruta</SelectItem>
                    <SelectItem key="Hierba">Hierba</SelectItem>
                    <SelectItem key="Flor">Flor</SelectItem>
                  </Select>
                  
                  <Select
                    label="Estado"
                    selectedKeys={[moduleData.status]}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <SelectItem key="Growing">Growing</SelectItem>
                    <SelectItem key="Germinating">Germinating</SelectItem>
                    <SelectItem key="Harvesting">Harvesting</SelectItem>
                    <SelectItem key="Dormant">Dormant</SelectItem>
                  </Select>
                </>
              )}
            </Form>
          </DrawerBody>
          <DrawerFooter className="flex justify-between w-full">
            <Button color="danger" variant="light" onClick={() => setDrawerOpen()}>
              Cancelar
            </Button>
            <Button 
              color="success" 
              onClick={handleSave}
              isLoading={isSaving}
            >
              Guardar cambios
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Confirmar eliminación
          </ModalHeader>
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
              Eliminar módulo completo
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
    </>
  );
}