export default function ElbowPipe({ color = "--pipe-color" }) {
  // Usa la variable CSS como valor de estilo: var(--pipe-color)
  const resolvedColor = `var(${color})`;

  return (
    <svg
      viewBox="-40 60 120 130"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto aspect-[0.55]"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Parte vertical */}
      <rect x="5" y="65" width="50" height="200" fill={resolvedColor} />

      {/* Parte horizontal */}
      <rect x="50" y="65" width="40" height="60" fill={resolvedColor} />
    </svg>
  );
}
