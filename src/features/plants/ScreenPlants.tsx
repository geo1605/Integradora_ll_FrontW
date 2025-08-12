import { useEffect, useState } from "react";
import { Pipe, ElbowPipe, ContinuePipe } from './Pipes';
import { getAllModules, createModule } from "../../api/Botanic";
import { 
  Button, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Input, 
  Select, 
  SelectItem, 
  useDisclosure,
  Checkbox
} from "@heroui/react";
import {AlertModal, Loader} from "../../components/"; // Importamos el componente AlertModal

interface Plant {
  plantName: string;
  type: string;
  status: string;
  statusDisplay?: string; // agregado para traducción
}

interface Module {
  name: string;
  ubication: string;
  plants?: Plant[];
}

// Función para traducir estados al español
const translateStatusToSpanish = (status: string) => {
  const statusMap: Record<string, string> = {
    'Growing': 'Creciendo',
    'Geerntet': 'Germinando',
    'Dead': 'Muerta'
  };
  return statusMap[status] || status;
};

export default function HydroSystem() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pipesPerRow, setPipesPerRow] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onOpenChange: onAddModalOpenChange } = useDisclosure();
  const [includePlant, setIncludePlant] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isAddingModule, setIsAddingModule] = useState(false); // Estado para el loader del botón

  // Estado para el nuevo módulo
  const [newModule, setNewModule] = useState({
    name: "",
    ubication: "Sector Norte",
    plantName: "",
    type: "Hortaliza",
    status: "Growing"
  });

  useEffect(() => {
    const loadModules = async () => {
      try {
        const data = await getAllModules();
        // Traducir los estados al español para el frontend
        const translatedData = data.map((module: Module) => ({
          ...module,
          plants: module.plants?.map((plant: Plant) => ({
            ...plant,
            statusDisplay: translateStatusToSpanish(plant.status)
          })) || []
        }));

        setModules(translatedData);
      } catch (error) {
        console.error("Error loading modules:", error);
        setAlertTitle("Error al cargar");
        setAlertMessage("No se pudieron cargar los módulos");
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadModules();
  }, []);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 700);
      if (width <= 745) setPipesPerRow(1);
      else if (width <= 1020) setPipesPerRow(2);
      else setPipesPerRow(3);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const handleIncludePlantChange = (isChecked: boolean) => {
    setIncludePlant(isChecked);
    if (!isChecked) {
      setNewModule({
        ...newModule,
        plantName: "",
        type: "Hortaliza",
        status: "Growing"
      });
    }
  };

  const handleAddModule = async () => {
    setIsAddingModule(true); // Activar loader del botón
    try {
      if (!newModule.name.trim()) {
        throw new Error('El nombre del módulo es requerido');
      }

      const moduleData = {
        name: newModule.name,
        ubication: newModule.ubication,
        plants: includePlant ? [{
          plantName: newModule.plantName,
          type: newModule.type,
          status: newModule.status // Enviar en inglés al backend
        }] : []
      };

      const createdModule = await createModule(moduleData);
      
      // Traducir el estado para el frontend
      const translatedModule = {
        ...createdModule,
        plants: createdModule.plants?.map((plant: Plant) => ({
          ...plant,
          statusDisplay: translateStatusToSpanish(plant.status)
        })) || []
      };

      
      setModules([...modules, translatedModule]);
      onAddModalOpenChange();
      
      // Reset form
      setNewModule({
        name: "",
        ubication: "Sector Norte",
        plantName: "",
        type: "Hortaliza",
        status: "Growing"
      });
      setIncludePlant(false);

      // Mostrar alerta de éxito
      setAlertTitle("Módulo creado");
      setAlertMessage(`El módulo "${createdModule.name}" se ha creado exitosamente.`);
      setShowAlert(true);

    } catch (error: any) {
      console.error("Error creating module:", error);
      setAlertTitle("Error al crear");
      setAlertMessage(error.message || "Ocurrió un error al crear el módulo");
      setShowAlert(true);
    } finally {
      setIsAddingModule(false); // Desactivar loader del botón
    }
  };

  if (loading) return <Loader />;

  const modulosPorPipe = 3;
  const totalPipes = Math.ceil(modules.length / modulosPorPipe);
  const totalRows = Math.ceil(totalPipes / pipesPerRow);

  return (
    <>
      <div className="flex flex-col items-center -mt-[1px] relative min-h-screen pb-16">
        {/* Botón de Añadir */}
        <Button 
          color="success" 
          className="fixed bottom-6 right-6 z-50 shadow-lg"
          onClick={onAddModalOpen}
        >
          Añadir Módulo
        </Button>

        {modules.length === 0 && !loading ? (
          <div className="text-center py-8">
            <p className="text-lg">No hay módulos registrados</p>
            <Button 
              color="success" 
              className="mt-4"
              onClick={onAddModalOpen}
            >
              Crear Primer Módulo
            </Button>
          </div>
        ) : (
          Array.from({ length: totalRows }).map((_, rowIndex) => {
            const start = rowIndex * pipesPerRow;
            const end = Math.min(start + pipesPerRow, totalPipes);
            
            const pipes = Array.from({ length: end - start }).map((_, pipeIndex) => {
              const pipeNumber = start + pipeIndex;
              const startModule = pipeNumber * modulosPorPipe;
              const pipeModules = modules.slice(startModule, startModule + modulosPorPipe);
              
              return (
                <Pipe 
                  key={pipeNumber} 
                  modules={pipeModules}  // Pasa los módulos específicos para este Pipe
                />
              );
            });

            return (
              <div
                key={rowIndex}
                className={`flex ${
                  isMobile ? "flex-col items-center" : "flex-row"
                } w-full max-w-6xl`}
              >
                {!isMobile && (
                  <div className="w-full max-w-[120px] sm:w-[20%] md:w-[15%] sm:min-w-[100px]">
                    {rowIndex === 0 ? <ElbowPipe /> : <ContinuePipe />}
                  </div>
                )}
                <div
                  className={`flex flex-wrap flex-1 mt-5 ${
                    isMobile ? "justify-center" : "justify-start"
                  }`}
                >
                  {pipes}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal para añadir nuevo módulo */}
      <Modal isOpen={isAddModalOpen} onOpenChange={onAddModalOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold" style={{ color: "var(--blue)" }}>
              Añadir Nuevo Módulo
            </h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Nombre del Módulo"
                placeholder="Ej: B1, B2, etc."
                value={newModule.name}
                onChange={(e) => setNewModule({...newModule, name: e.target.value})}
                isRequired
              />
              
              <Select 
                label="Ubicación"
                selectedKeys={[newModule.ubication]}
                onChange={(e) => setNewModule({...newModule, ubication: e.target.value})}
              >
                <SelectItem key="Sector Norte">Sector Norte</SelectItem>
                <SelectItem key="Sector Sur">Sector Sur</SelectItem>
                <SelectItem key="Sector Este">Sector Este</SelectItem>
                <SelectItem key="Sector Oeste">Sector Oeste</SelectItem>
              </Select>

              <Checkbox 
                isSelected={includePlant}
                onValueChange={handleIncludePlantChange}
                className="mt-4"
              >
                Incluir información de planta
              </Checkbox>

              {includePlant && (
                <>
                  <Input
                    label="Nombre de la Planta"
                    placeholder="Ej: Tomate, Lechuga, etc."
                    value={newModule.plantName}
                    onChange={(e) => setNewModule({...newModule, plantName: e.target.value})}
                  />
                  
                  <Select 
                    label="Tipo de Planta"
                    selectedKeys={[newModule.type]}
                    onChange={(e) => setNewModule({...newModule, type: e.target.value})}
                  >
                    <SelectItem key="Hortaliza">Hortaliza</SelectItem>
                    <SelectItem key="Fruta">Fruta</SelectItem>
                    <SelectItem key="Hierba">Hierba</SelectItem>
                    <SelectItem key="Flor">Flor</SelectItem>
                  </Select>
                  
                  <Select 
                    label="Estado"
                    selectedKeys={[newModule.status]}
                    onChange={(e) => setNewModule({...newModule, status: e.target.value})}
                  >
                    <SelectItem key="Growing">Creciendo</SelectItem>
                    <SelectItem key="Geerntet">Germinando</SelectItem>
                    <SelectItem key="Dead">Muerta</SelectItem>
                  </Select>
                </>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onClick={() => {
              onAddModalOpenChange();
              setIncludePlant(false);
            }}>
              Cancelar
            </Button>
            <Button 
              color="success" 
              onClick={handleAddModule}
              isLoading={isAddingModule} // Mostrar loader cuando se está agregando
            >
              {isAddingModule ? "Procesando..." : "Añadir Módulo"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Componente de alerta */}
      <AlertModal
        isOpen={showAlert}
        onOpenChange={setShowAlert}
        title={alertTitle}
        message={alertMessage}
        showCancelButton={false}
        confirmText="Entendido"
      />
    </>
  );
}