import React from "react";
import TankWaves from "./Waves";

interface TankProps {
  level: number;
}

export default function Tank({ level }: TankProps) {
  return (
    <div
  className="relative w-full rounded-md overflow-hidden bg-white shadow-lg h-full"
  style={{ backgroundColor: 'var(--bg-color)' }}
>
  {/* Contenido aquí */}
  
  {/* Texto del porcentaje */}
  <div
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold z-20"
    style={{ color: 'var(--text-color)' }}
  >
    {level}%
  </div>

  {/* Contenedor de las olas */}
  <div className="absolute bottom-0 w-full h-full z-10">
    <TankWaves level={level} />
  </div>
</div>

  );
}
