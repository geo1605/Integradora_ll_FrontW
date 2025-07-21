import { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Switch,
  useDisclosure,
} from "@heroui/react";
import {
  LeafIcon,
  MonitorIcon,
  ClockIcon,
  BarChart2Icon,
  ChevronDown,
  Moon,
  Sun,
  UserIcon,
} from "lucide-react";
import logo from "../assets/blanco.webp";

import { useAuthStore } from "../store/auth.store";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../contexts/themeContext";
import { useUserRole } from "../hooks/useUserRole";
import { getUserDataById } from "../api/Users";
import { useUserId } from "../hooks/useUserId"; 
import AlertModal from "./alerts";

export default function SuudaiNavbar() {
  const { token, setToken } = useAuthStore();
  const userId = useUserId(); 
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("Cargando...");
  const role = useUserRole();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (!userId || !token) return;

      try {
        const userData = await getUserDataById(userId, token);
        setEmail(userData.email);
      } catch (err) {
        console.error("Error al obtener el correo:", err);
        setEmail("Error al cargar");
      }
    };

    fetchUserEmail();
  }, [userId, token]);

  const roleAccess: Record<string, string[]> = {
    Adm1ni$trad0r: ["dashboard", "plants", "users", "monitoring", "inventory", "history", "profile"],
    M4ntenim1ent0: ["dashboard", "monitoring", "inventory", "history", "profile"],
    B0t4nic0: ["dashboard", "plants", "history", "profile"],
    Default: ["dashboard", "history", "profile"],
  };

  const allMenuItems = [
    { label: "Plantas", icon: <LeafIcon size={18} />, path: "/plants", key: "plants" },
    { label: "Monitoreo", icon: <MonitorIcon size={18} />, path: "/monitoring", key: "monitoring" },
    { label: "Historial", icon: <ClockIcon size={18} />, path: "/history", key: "history" },
    { label: "Inventario", icon: <BarChart2Icon size={18} />, path: "/inventory", key: "inventory" },
    { label: "Usuarios", icon: <BarChart2Icon size={18} />, path: "/users", key: "users" },
  ];

  const allowedRoutes = roleAccess[role ?? "Default"];

  const filteredMenuItems = allMenuItems.filter(item => {
    if (role === "Adm1ni$trad0r" && (item.key === "inventory" || item.key === "users")) {
      return false;
    }
    return allowedRoutes.includes(item.key);
  });

  const hasManagementItems = allowedRoutes.includes("inventory") || allowedRoutes.includes("users");

  const handleLogout = () => {
    setToken(null);
    navigate("/auth");
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <Navbar
        className="text-white shadow-md"
        style={{ backgroundColor: "var(--green)" }}
        maxWidth="full"
        isBordered
        isBlurred={false}
        position="sticky"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <Link to="/" className="flex items-center gap-2 px-4 py-2 no-underline text-inherit">
            <NavbarBrand>
              <img src={logo} alt="SUUDAI logo" className="h-12" />
              <span className="font-bold text-lg">SUUDAI</span>
            </NavbarBrand>
          </Link>
        </NavbarContent>

        <NavbarContent className="gap-6 hidden sm:flex" justify="center">
          {filteredMenuItems.map(({ label, icon, path, key }) => (
            <NavbarItem key={key}>
              <Link to={path} className="flex flex-col items-center text-white">
                {icon}
                <span className="text-xs">{label}</span>
              </Link>
            </NavbarItem>
          ))}

          {hasManagementItems && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="bg-transparent text-white p-0 data-[hover=true]:bg-transparent"
                  radius="sm"
                  variant="light"
                  endContent={<ChevronDown size={16} />}
                >
                  <div className="flex flex-col items-center">
                    <BarChart2Icon size={20} />
                    <span className="text-xs">Gestión</span>
                  </div>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Gestion Menu">
                {allowedRoutes.includes("inventory") ? (
                  <DropdownItem key="inventory" onClick={() => handleMenuItemClick("/inventory")}>
                    Inventario
                  </DropdownItem>
                ) : null}
                {allowedRoutes.includes("users") ? (
                  <DropdownItem key="users" onClick={() => handleMenuItemClick("/users")}>
                    Usuarios
                  </DropdownItem>
                ) : null}
              </DropdownMenu>
            </Dropdown>
          )}
        </NavbarContent>

        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                size="sm"
                icon={<UserIcon size={20} className="text-white" />}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Inició sesión como:</p>
                <p className="font-semibold">{email}</p>
              </DropdownItem>
              <DropdownItem key="settings" onClick={() => navigate("/profile")}>
                Ajustes de Perfil
              </DropdownItem>
              <DropdownItem key="notifications">Notificaciones</DropdownItem>
              <DropdownItem key="switch" isReadOnly>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium">Modo Oscuro</span>
                  <Switch
                    isSelected={theme === "dark"}
                    onValueChange={toggleTheme}
                    color="success"
                    size="sm"
                    endContent={<Moon size={16} />}
                    startContent={<Sun size={16} />}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={onOpen}>
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>

        <NavbarMenu>
          {filteredMenuItems.map(({ label, icon, path, key }) => (
            <NavbarMenuItem key={key}>
              <Button
                variant="light"
                className="w-full flex gap-2 items-center justify-start text-left"
                onClick={() => handleMenuItemClick(path)}
              >
                {icon}
                {label}
              </Button>
            </NavbarMenuItem>
          ))}

          {hasManagementItems && (
            <>
              {allowedRoutes.includes("inventory") && (
                <NavbarMenuItem>
                  <Button
                    variant="light"
                    className="w-full flex gap-2 items-center justify-start text-left"
                    onClick={() => handleMenuItemClick("/inventory")}
                  >
                    <BarChart2Icon size={18} />
                    Inventario
                  </Button>
                </NavbarMenuItem>
              )}
              {allowedRoutes.includes("users") && (
                <NavbarMenuItem>
                  <Button
                    variant="light"
                    className="w-full flex gap-2 items-center justify-start text-left"
                    onClick={() => handleMenuItemClick("/users")}
                  >
                    <BarChart2Icon size={18} />
                    Usuarios
                  </Button>
                </NavbarMenuItem>
              )}
            </>
          )}
        </NavbarMenu>
      </Navbar>

      <AlertModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Confirmar cierre de sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        onConfirm={handleLogout}
      />
    </>
  );
}