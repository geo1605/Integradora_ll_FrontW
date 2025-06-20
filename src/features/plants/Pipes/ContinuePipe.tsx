export default function ContinuePipe({ color = "--pipe-color" }) {
  const resolvedColor = `var(${color})`;

  return (
    <svg
      viewBox="-20 30 180 280"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto aspect-[0.55]"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Entrada horizontal */}
      <rect x="25" y="0" width="120" height="30" fill={resolvedColor} />

      {/* Parte vertical alargada para asegurar contacto */}
      <rect x="43" y="0" width="77" height="400" fill={resolvedColor} />

      {/* Salida horizontal */}
      <rect x="120" y="100" width="40" height="80" fill={resolvedColor} />
    </svg>
  );
}
