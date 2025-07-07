import type { ChipProps } from "@heroui/react";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Input,
  useDisclosure,
} from "@heroui/react";
import ToolFormModal from './ToolFormModal';
import AlertModal from '../../components/alerts'
import {
  createTool,
  getAllTools,
  updateTool,
  deleteTool
} from '../../api/tools.inventory';

interface Tool {
  _id: string;
  toolName: string;
  description: "Active" | "InUse" | "Maintenance" | "Disabled";
  status: boolean;
  createDate: Date;
}

interface ToolColumn {
  name: string;
  uid: keyof Tool | 'actions';
  sortable?: boolean;
}

const statusColorMap = {
  Active: "success",
  InUse: "primary",
  Maintenance: "warning",
  Disabled: "danger",
} as const;

const descriptionLabels = {
  Active: "Activo",
  InUse: "En uso",
  Maintenance: "Mantenimiento",
  Disabled: "Deshabilitado"
} as const;

const toolColumns: ToolColumn[] = [
  { name: "NOMBRE", uid: "toolName", sortable: true },
  { name: "DESCRIPCIÓN", uid: "description", sortable: true },
  { name: "ESTADO", uid: "status", sortable: true },
  { name: "FECHA DE CREACIÓN", uid: "createDate", sortable: true },
  { name: "ACCIONES", uid: "actions" },
];

export default function ToolsTable() {
  const [tools, setTools] = React.useState<Tool[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingTool, setEditingTool] = React.useState<Tool | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [toolToDelete, setToolToDelete] = React.useState<Tool | null>(null);
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        const data = await getAllTools();
        setTools(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar herramientas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  const filteredTools = tools.filter((tool) =>
    tool.toolName.toLowerCase().includes(filter.toLowerCase())
  );

  const pages = Math.ceil(filteredTools.length / rowsPerPage);
  const pagedTools = filteredTools.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const confirmDeleteTool = async () => {
    if (!toolToDelete) return;
    try {
      await deleteTool(toolToDelete._id);
      setTools(prev => prev.filter(tool => tool._id !== toolToDelete._id));
      setToolToDelete(null);
      setDeleteModalOpen(false);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al eliminar herramienta');
      setErrorModalOpen(true);
    }
  };

  const handleSave = async (data: {
    toolName: string;
    description: "Active" | "InUse" | "Maintenance" | "Disabled";
    status: boolean;
  }) => {
    try {
      if (editingTool) {
        const updatedTool = await updateTool(editingTool._id, data);
        setTools(prev =>
          prev.map(t => t._id === editingTool._id ? updatedTool : t)
        );
      } else {
        const newTool = await createTool(data);
        setTools(prev => [newTool, ...prev]);
      }
      setEditingTool(null);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al guardar herramienta');
      setErrorModalOpen(true);
    }
  };

  const renderCell = (item: Tool, key: keyof Tool | 'actions') => {
    const value = item[key as keyof Tool];

    switch (key) {
      case "status":
        return (
          <Chip color={item.status ? "success" : "danger"} size="sm">
            {item.status ? "Disponible" : "No disponible"}
          </Chip>
        );
      case "description":
        return (
          <Chip
            color={statusColorMap[item.description] as ChipProps['color']}
            size="sm"
          >
            {descriptionLabels[item.description]}
          </Chip>
        );
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                ⋮
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="edit"
                onClick={() => {
                  setEditingTool(item);
                  onOpen();
                }}
              >
                Editar
              </DropdownItem>
              <DropdownItem
                key="delete"
                color="danger"
                onClick={() => {
                  setToolToDelete(item);
                  setDeleteModalOpen(true);
                }}
              >
                Eliminar
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      case "createDate":
        return new Date(value as Date).toLocaleDateString();
      default:
        return value as React.ReactNode;
    }
  };

  if (isLoading) return <div>Cargando herramientas...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
        <Input
          placeholder="Buscar herramienta..."
          value={filter}
          onValueChange={setFilter}
        />
        <div className="flex gap-3 items-center">
          <Button
            color="success"
            onClick={() => {
              setEditingTool(null);
              onOpen();
            }}
          >
            Añadir herramienta
          </Button>
          <label className="flex items-center text-default-400 text-sm">
            Mostrar:
            <select
              className="bg-transparent outline-none text-default-400 text-sm ml-2"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
      <Table aria-label="Tabla de herramientas">
        <TableHeader columns={toolColumns}>
          {(col) => (
            <TableColumn key={col.uid} allowsSorting={col.sortable}>
              {col.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No hay herramientas"} items={pagedTools}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as keyof Tool | 'actions')}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-default-400">
          Mostrando {pagedTools.length} de {filteredTools.length}
        </span>
        <Pagination
          isCompact
          showControls
          color="success"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>

      <ToolFormModal
        isOpen={isOpen}
        onClose={onOpenChange}
        initialData={editingTool || undefined}
        onSubmit={handleSave}
      />

      <AlertModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}   // Aquí va para controlar abrir/cerrar
        title="¿Eliminar herramienta?"
        message={`¿Estás seguro de que deseas eliminar "${toolToDelete?.toolName}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteTool}
        showCancelButton={true}  // o omitir porque es true por defecto
      />


      <AlertModal
        isOpen={errorModalOpen}
        onOpenChange={setErrorModalOpen}
        title="Error"
        message={errorMessage}
        confirmText="Cerrar"
        showCancelButton={false}  // oculta botón cancelar
        onConfirm={() => setErrorModalOpen(false)}
      />

    </div>
  );
}
