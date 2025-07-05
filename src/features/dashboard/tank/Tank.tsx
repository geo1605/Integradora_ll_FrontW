import TankWaves from "./Waves";

interface TankProps {
  level: number;
}

export default function Tank({ level }: TankProps) {
  return (
    <div className="relative w-full rounded-md overflow-hidden shadow-lg h-full">
  {/* Texto del porcentaje en un círculo blanco */}
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center bg-white z-20">
    <span className="text-2xl font-bold text-black">
      {level}%
    </span>
  </div>

  {/* Texto de pH debajo del círculo */}
  <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-white rounded z-20">
    <span className="text-xs font-semibold" style={{ color: "var(--green)" }}>
      pH: 7.0
    </span>
  </div>

  {/* Fondo animado u olas */}
  <div className="absolute bottom-0 w-full h-full z-10">
    <TankWaves level={level} />
  </div>
</div>


  );
}
