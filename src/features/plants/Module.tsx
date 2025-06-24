import { Popover, PopoverTrigger, PopoverContent, Tooltip, Button } from "@heroui/react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, Input,Form } from "@heroui/react";
import PopOverPlant from "./PopOverPlant";
import { useState } from "react";

function PlantIcon({color = "--green"}) {
  const resolvedColor = `var(${color})`;
  return (
    <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32.0954 24.8547C30.5968 25.7656 28.8756 26.2447 27.1219 26.2391C25.6527 26.2275 24.2002 25.927 22.8469 25.3547C21.804 26.8271 21.2458 28.5879 21.2501 30.3922V35C21.2504 35.1714 21.2156 35.341 21.1476 35.4983C21.0797 35.6556 20.9802 35.7973 20.8552 35.9145C20.7302 36.0317 20.5824 36.122 20.4211 36.1797C20.2597 36.2374 20.0882 36.2614 19.9172 36.25C19.596 36.222 19.2971 36.0736 19.0806 35.8346C18.8642 35.5955 18.7461 35.2834 18.7501 34.961V33.0172L12.7157 26.9828C11.8186 27.3175 10.87 27.4925 9.91256 27.5C8.59452 27.5034 7.30114 27.1428 6.17506 26.4578C2.77037 24.3891 0.937558 19.6281 1.29225 13.7172C1.3101 13.4114 1.43963 13.1228 1.65624 12.9062C1.87284 12.6896 2.16144 12.5601 2.46725 12.5422C8.37818 12.1938 13.1391 14.0203 15.2016 17.425C16.012 18.7595 16.3657 20.3216 16.2094 21.875C16.1997 21.9954 16.1553 22.1103 16.0817 22.206C16.008 22.3017 15.9082 22.374 15.7943 22.4141C15.6805 22.4543 15.5574 22.4606 15.44 22.4323C15.3226 22.404 15.2159 22.3423 15.1329 22.2547L12.1329 19.1141C11.8965 18.8896 11.5819 18.7662 11.2559 18.7704C10.93 18.7746 10.6185 18.9059 10.388 19.1364C10.1575 19.3669 10.0262 19.6783 10.022 20.0043C10.0178 20.3302 10.1412 20.6449 10.3657 20.8813L18.7844 29.5141C18.7938 29.3922 18.8047 29.2703 18.8172 29.15C19.0906 26.8324 20.1133 24.6675 21.7297 22.9844L29.6344 14.6313C29.869 14.3969 30.0008 14.079 30.001 13.7474C30.0011 13.4159 29.8696 13.0978 29.6352 12.8633C29.4009 12.6287 29.0829 12.4969 28.7514 12.4967C28.4198 12.4966 28.1018 12.6282 27.8672 12.8625L20.211 20.9594C20.1344 21.0406 20.0374 21.0997 19.9301 21.1307C19.8229 21.1617 19.7093 21.1635 19.6012 21.1357C19.493 21.108 19.3943 21.0518 19.3153 20.9729C19.2362 20.8941 19.1797 20.7956 19.1516 20.6875C18.411 17.9563 18.7376 15.2375 20.1516 12.9031C22.9422 8.29689 29.436 5.83126 37.5235 6.30626C37.8293 6.32412 38.1179 6.45365 38.3345 6.67026C38.5511 6.88686 38.6806 7.17546 38.6985 7.48126C39.1672 15.5703 36.7016 22.0641 32.0954 24.8547Z" fill={resolvedColor}/>
</svg>

  );
}

export default function Module() {
  const { isOpen: isPopoverOpen, onOpenChange: setPopoverOpen } = useDisclosure(); // Popover state
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onOpenChange: setDrawerOpen } = useDisclosure(); // Drawer state

  const [planta, setPlanta] = useState('');
  const [estado, setEstado] = useState('');

  const handleSave = () => {
    // Aquí puedes manejar la lógica para guardar los datos del formulario
    console.log('Planta:', planta);
    console.log('Estado:', estado);
    setDrawerOpen();
  };

  const handlePopoverClose = () => setPopoverOpen(); // Close Popover

  return (
    <>
      <Popover
        placement="top"
        showArrow
        backdrop="opaque"
        isOpen={isPopoverOpen} // Track popover state
        onOpenChange={setPopoverOpen} // Set state when popover opens/closes
      >
        <PopoverTrigger>
          <div className="relative flex flex-col items-center w-16 cursor-pointer">
            {/* Planta with Popover and Tooltip */}
            <div className="absolute -top-12 z-10">
              <Tooltip key="b1" color="success" content="Modulo B1" placement="bottom-end">
                <div className="text-green-500 text-xl select-none">
                  <PlantIcon />
                </div>
              </Tooltip>
            </div>

            {/* Semicírculo */}
            <div className="w-12 h-6 bg-[rgb(123,63,0)] rounded-b-full z-0" />
          </div>
        </PopoverTrigger>

        <PopoverContent>
          <PopOverPlant
            onEditClick={() => {
              handlePopoverClose(); // Close Popover on Edit button click
              openDrawer();         // Open the Drawer
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Drawer */}
        <Drawer isOpen={isDrawerOpen} placement="left" onOpenChange={setDrawerOpen}>
        <DrawerContent className="flex items-center justify-center">
          <DrawerHeader className="flex flex-col gap-1">Editar Planta</DrawerHeader>
          <DrawerBody className="w-full flex justify-center items-center">
            <Form className="space-y-6 w-full max-w-sm" onSubmit={handleSave}>
              
              <h2 className="text-7xl font-bold text-center mb-4" style={{ color: "var(--blue)" }}>
                B3
              </h2>
              <Input
                isRequired
                className="w-full"
                placeholder="Nombre de la planta"
                label="Planta"
                value={planta}
                onChange={(e) => setPlanta(e.target.value)}
              />
              <Input
                isRequired
                className="w-full"
                placeholder="Estado de la planta"
                label="Estado de la planta"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              />
            </Form>
          </DrawerBody>
          <DrawerFooter className="flex justify-between w-full">
            <Button color="danger" variant="light" onClick={() => setDrawerOpen()}>
              Cerrar
            </Button>
            <Button className="w-full text-white" color="success" onClick={handleSave}>
              Guardar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}