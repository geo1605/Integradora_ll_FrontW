import { useEffect, useState } from "react";
import Module from "../Module";
import { getAllModules } from "../../../api/Botanic"; // ajusta el path si es distinto

import type { ReactNode } from "react";

interface PipeProps {
  label?: string;
  color?: string;
  children?: ReactNode;
  modules?: Array<any>;
}


function PipeStructure({ color = "--pipe-color" }: { color?: string }) {
  const resolvedColor = `var(${color})`;
  return (
    <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto aspect-[2.5]" preserveAspectRatio="none">
      <rect x="0" y="10" width="20" height="60" fill={resolvedColor} />
      <rect x="20" y="20" width="160" height="40" fill={resolvedColor} />
      <rect x="180" y="10" width="20" height="60" fill={resolvedColor} />
    </svg>
  );
}

export default function Pipe({  color, modules = [] }: PipeProps) {
  // Elimina el useEffect y el estado local de módulos
  
  // Filtrar módulos válidos (con nombre)
  const modulesToRender = modules.filter((m) => m?.name?.trim());

  if (modulesToRender.length === 0) {
    return <div className="text-gray-500 italic">No hay módulos disponibles</div>;
  }

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex gap-4">
        {modulesToRender.map((module, index) => {
          const firstPlant = module.plants?.[0];
          return (
            <Module
              key={module._id || `${module.name}-${index}`}
              name={module.name}
              plantName={firstPlant?.plantName}
              status={firstPlant?.status}
              createDate={module.createDate}
            />
          );
        })}
      </div>

      <PipeStructure color={color} />

    </div>
  );
}
