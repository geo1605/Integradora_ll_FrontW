// ToolsTable.tsx
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
import ToolFormModal from "./ToolFormModal";

const initialTools = [
  {
    id: 1,
    name: "Drill",
    description: "Activo",
    status: true,
    createdAt: new Date("2024-06-01"),
  },
  {
    id: 2,
    name: "Torch",
    description: "EnUso",
    status: true,
    createdAt: new Date("2024-06-05"),
  },
  {
    id: 3,
    name: "Hydraulic Jack",
    description: "Mantenimiento",
    status: false,
    createdAt: new Date("2024-06-10"),
  },
  {
    id: 4,
    name: "Pressure Washer",
    description: "Deshabilitado",
    status: false,
    createdAt: new Date("2024-06-15"),
  },
];

const toolColumns = [
  { name: "NOMBRE", uid: "name", sortable: true },
  { name: "DESCRIPCIÓN", uid: "description", sortable: true },
  { name: "ESTADO", uid: "status", sortable: true },
  { name: "FECHA DE CREACIÓN", uid: "createdAt", sortable: true },
  { name: "ACCIONES", uid: "actions" },
];

const statusColorMap = {
  Activo: "success",
  EnUso: "primary",
  Mantenimiento: "warning",
  Deshabilitado: "danger",
};

export default function ToolsTable() {
  const [tools, setTools] = React.useState(initialTools);
  const [filter, setFilter] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingTool, setEditingTool] = React.useState(null);

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(filter.toLowerCase())
  );

  const pages = Math.ceil(filteredTools.length / rowsPerPage);
  const pagedTools = filteredTools.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleDelete = (id) => {
    setTools((prev) => prev.filter((tool) => tool.id !== id));
  };

  const handleSave = (data) => {
    if (editingTool) {
      setTools((prev) =>
        prev.map((t) => (t.id === editingTool.id ? { ...t, ...data } : t))
      );
    } else {
      setTools((prev) => [
        { ...data, id: Date.now(), createdAt: new Date() },
        ...prev,
      ]);
    }
    setEditingTool(null);
  };

  const renderCell = (item, key) => {
    const value = item[key];

    switch (key) {
      case "status":
        return (
          <Chip color={item.status ? "success" : "danger"} size="sm">
            {item.status ? "Disponible" : "No disponible"}
          </Chip>
        );
      case "description":
        return (
          <Chip color={statusColorMap[item.description]} size="sm">
            {item.description}
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
                onClick={() => handleDelete(item.id)}
              >
                Eliminar
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      case "createdAt":
        return new Date(value).toLocaleDateString();
      default:
        return value;
    }
  };

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
            <TableRow key={item.id}>
              {(col) => <TableCell>{renderCell(item, col)}</TableCell>}
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
        initialData={editingTool}
        onSubmit={handleSave}
      />
    </div>
  );
}
