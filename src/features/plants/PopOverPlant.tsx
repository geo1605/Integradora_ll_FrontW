import { Button } from "@heroui/react";

export default function PopOverPlant({ onEditClick }: { onEditClick: () => void }) {
  return (
    <div className="py-3 w-64">
      {/* Encabezado */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-5xl font-bold" style={{ color: "var(--blue)" }}>
          BI-3
        </span>
        <span className="text-xs" style={{ color: "var(--text-color)" }}>
          Fecha C: 20/5/2025
        </span>
      </div>

      {/* Detalles */}
      <div className="mb-1">
        <p className="text-sm font-semibold" style={{ color: "var(--text-color)" }}>
          Planta: <span className="font-normal">Tomate</span>
        </p>
        <p className="text-sm font-semibold" style={{ color: "var(--text-color)" }}>
          Estado:{" "}
          <span className="font-bold" style={{ color: "var(--green)" }}>
            Sano
          </span>
        </p>
      </div>

      {/* Botones */}
      <div className="flex justify-between mt-3 gap-2">
        <Button
          color="success"
          className="w-full text-sm font-semibold"
          style={{ color: "var(--text-color)" }}
          onClick={onEditClick} // Trigger the Edit functionality
        >
          Editar
        </Button>
        <Button
          color="danger"
          className="w-full text-sm font-semibold"
          style={{ color: "var(--text-color)" }}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
}
