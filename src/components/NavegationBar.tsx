import React from "react";
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
} from "@heroui/react";
import {
  LeafIcon,
  MonitorIcon,
  ClockIcon,
  BarChart2Icon,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";
import logo from "../assets/blanco.webp";

import { useAuthStore } from "../store/auth.store";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../contexts/themeContext";
import { useUserRole } from "../hooks/useUserRole";

export default function SuudaiNavbar() {
  const { setToken } = useAuthStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const role = useUserRole();

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

  
  // Filtramos los elementos del menú, excluyendo inventory y users si el usuario es admin
  const filteredMenuItems = allMenuItems.filter(item => {
    if (role === "Adm1ni$trad0r" && (item.key === "inventory" || item.key === "users")) {
      return false; // Excluimos estos items para admin (aparecerán en el dropdown)
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
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 no-underline text-inherit"
        >
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
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex flex-col items-center">
                  <BarChart2Icon size={20} />
                  <span className="text-xs">Gestión</span>
                </div>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Gestion Menu">
            {allowedRoutes.includes("inventory")
              ? (
                <DropdownItem
                  key="g2"
                  onClick={() => {
                    navigate("/inventory");
                    setIsMenuOpen(false);
                  }}
                >
                  Inventario
                </DropdownItem>
              ) : null}

            {allowedRoutes.includes("users")
              ? (
                <DropdownItem
                  key="g3"
                  onClick={() => {
                    navigate("/users");
                    setIsMenuOpen(false);
                  }}
                >
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
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings" onClick={() => navigate("/profile")}>
              My Settings
            </DropdownItem>
            <DropdownItem key="notifications">Notifications</DropdownItem>
            <DropdownItem key="switch" isReadOnly>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium">Dark mode</span>
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
            <DropdownItem key="logout" color="danger" onPress={handleLogout}>
              Log Out
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
  );
}