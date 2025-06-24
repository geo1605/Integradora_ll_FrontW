import { useEffect, useMemo, useState } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
  Chip, User, Pagination, Modal, useDisclosure
} from "@heroui/react";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getAllUsers } from "../../api/Users";
import { SuudaiNavbar } from "../../components";
import UpdateUser from "./UpdateUser";

const columns = [
  { name: "Nombre", uid: "name", sortable: true },
  { name: "Rol", uid: "role", sortable: true },
  { name: "Correo", uid: "email" },
  { name: "Teléfono", uid: "phoneNumber" },
  { name: "Estatus", uid: "status", sortable: true },
  { name: "Acciones", uid: "actions" }
];

const statusOptions = [
  { name: "Activo", uid: "true" },
  { name: "Inactivo", uid: "false" }
];

const statusColorMap = {
  true: "success",
  false: "danger"
};

const INITIAL_VISIBLE_COLUMNS = ["name", "email", "role", "status", "actions"];

export default function UserTable() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [users, setUsers] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState({ column: "name", direction: "ascending" });
  const [selectedUser, setSelectedUser] = useState(null);


  useEffect(() => {
    getAllUsers()
      .then((res) => setUsers(res.userList))
      .catch((err) => console.error("Error al cargar usuarios", err));
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = [...users];
    if (filterValue) {
      filtered = filtered.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => String(user.status) === statusFilter);
    }
    return filtered;
  }, [users, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [filteredItems, page, rowsPerPage]);

  const sortedItems = useMemo(() => {
    const items = [...paginatedItems];
    const { column, direction } = sortDescriptor;
    return items.sort((a, b) => {
      const aVal = a[column]?.toString().toLowerCase() || "";
      const bVal = b[column]?.toString().toLowerCase() || "";
      const compare = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return direction === "descending" ? -compare : compare;
    });
  }, [paginatedItems, sortDescriptor]);

  const renderCell = (user, columnKey) => {
    switch (columnKey) {
      case "name":
        return (
          <User
            name={`${user.firstName} ${user.middleName} ${user.lastName}`}
            description={user.email}
          />
        );
      case "email":
        return user.email;
      case "phoneNumber":
        return user.phoneNumber;
      case "role":
        return <span className="capitalize">{user.role}</span>;
      case "status":
        return (
          <Chip
            color={statusColorMap[user.status]}
            className="capitalize"
            size="sm"
            variant="flat"
          >
            {user.status ? "Activo" : "Inactivo"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MoreVertIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="edit"
                  onPress={() => {
                    setSelectedUser(user);
                    onOpen();
                  }}
                >
                  Editar
                </DropdownItem>

                <DropdownItem key="delete" className="text-danger" color="danger">
                  Eliminar
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return user[columnKey] || "-";
    }
  };

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Buscar por nombre..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button endContent={<KeyboardArrowDownIcon />} variant="flat">
                Estatus
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={new Set([statusFilter])}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0];
                setStatusFilter(key);
                setPage(1);
              }}
            >
              <DropdownItem key="all">Todos</DropdownItem>
              {statusOptions.map((status) => (
                <DropdownItem key={status.uid}>{status.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button endContent={<KeyboardArrowDownIcon />} variant="flat">
                Columnas
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              selectionMode="multiple"
              disallowEmptySelection
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              onSelectionChange={setVisibleColumns}
            >
              {columns.map((col) => (
                <DropdownItem key={col.uid}>{col.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {users.length} usuarios
        </span>
        <label className="flex items-center text-default-400 text-small">
          Filas por página:
          <select
            className="bg-transparent outline-none text-default-400 text-small ml-2"
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
  );

  const bottomContent = (
    <div className="py-2 px-2 flex justify-between items-center">
      <span className="w-[30%] text-small text-default-400">
        {selectedKeys === "all"
          ? "Todos los elementos seleccionados"
          : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
      </span>
      <Pagination
        isCompact
        showControls
        showShadow
        color="success"
        page={page}
        total={pages}
        onChange={setPage}
      />
      <div className="hidden sm:flex w-[30%] justify-end gap-2">
        <Button isDisabled={page === 1} size="sm" variant="flat" onPress={() => setPage(page - 1)}>
          Anterior
        </Button>
        <Button isDisabled={page === pages} size="sm" variant="flat" onPress={() => setPage(page + 1)}>
          Siguiente
        </Button>
      </div>
    </div>
  );

  const headerColumns = useMemo(() => {
    return columns.filter(col => visibleColumns.has(col.uid));
  }, [visibleColumns]);

  return (
    <>
      <SuudaiNavbar />
      <Table
        isHeaderSticky
        aria-label="Tabla avanzada de usuarios"
        topContent={topContent}
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{ wrapper: "max-h-[500px]" }}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(col) => (
            <TableColumn key={col.uid} allowsSorting={col.sortable}>
              {col.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent="No se encontraron usuarios" items={sortedItems}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <UpdateUser />
      </Modal>
    </>
  );
}
