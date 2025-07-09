import { Button } from "@heroui/react";

export default function PopOverPlant({
  name,
  ubication,
  plantName,
  status,
  createDate,
  onEditClick,
  onDeleteClick
}: {
  name: string;
  ubication?: string;
  plantName?: string;
  status?: string;
  createDate?: string;
  onEditClick: () => void;
  onDeleteClick: () => void;
}) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return '-';
    }
  };

  return (
    <div className="py-3 w-64">
      <div className="flex justify-between items-start mb-2">
        <span className="text-5xl font-bold" style={{ color: "var(--blue)" }}>
          {name}
        </span>
        <span className="text-xs" style={{ color: "var(--text-color)" }}>
          Fecha C: {formatDate(createDate)}
        </span>
      </div>

      <div className="mb-1">
        <p className="text-sm font-semibold" style={{ color: "var(--text-color)" }}>
          Ubicación: <span className="font-normal">{ubication || "Sin ubicación"}</span>
        </p>
        <p className="text-sm font-semibold" style={{ color: "var(--text-color)" }}>
          Planta: <span className="font-normal">{plantName || "Sin planta"}</span>
        </p>
        {plantName?.trim() && (
          <p className="text-sm font-semibold" style={{ color: "var(--text-color)" }}>
            Estado:{" "}
            <span className="font-bold" style={{ color: "var(--green)" }}>
              {status || "-"}
            </span>
          </p>
        )}
      </div>

      <div className="flex justify-between mt-3 gap-2">
        <Button 
          color="success" 
          className="w-full text-sm font-semibold" 
          style={{ color: "var(--text-color)" }} 
          onClick={onEditClick}
        >
          Editar
        </Button>
        <Button 
          color="danger" 
          className="w-full text-sm font-semibold" 
          style={{ color: "var(--text-color)" }}
          onClick={onDeleteClick}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
}