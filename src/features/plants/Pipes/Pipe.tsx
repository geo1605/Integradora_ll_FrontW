import Module from "../Module";


function PipeStructure({ color = "--pipe-color" }) {
  const resolvedColor = `var(${color})`;

  return (
    <svg
      viewBox="0 0 200 80"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto aspect-[2.5]"
      preserveAspectRatio="none"
    >
      {/* Left block */}
      <rect x="0" y="10" width="20" height="60" fill={resolvedColor} />

      {/* Middle bar */}
      <rect x="20" y="20" width="160" height="40" fill={resolvedColor} />

      {/* Right block */}
      <rect x="180" y="10" width="20" height="60" fill={resolvedColor} />
    </svg>
  );
}


export default function Pipe() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Módulos arriba */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex gap-4">
        <Module />
        <Module />
        <Module />
      </div>
      {/* Estructura de la tubería */}
      <PipeStructure />

      {/* Etiqueta */}
      <div className="mt-2 text-gray-500 text-sm">Modulo BI</div>
    </div>
  );
}


