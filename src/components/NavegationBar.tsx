import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
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
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/themeContext";

export default function SuudaiNavbar() {
  const { setToken } = useAuthStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    setToken(null);
    navigate("/auth");
  };

  return (
    <Navbar
      className="text-white shadow-md"
      style={{ backgroundColor: "var(--green)" }}
      maxWidth="full"
      isBordered
      isBlurred={false}
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <Link href="/" className="flex items-center gap-2 px-4 py-2 no-underline text-inherit">
          <NavbarBrand>
            <img src={logo} alt="SUUDAI logo" className="h-12" />
            <span className="font-bold text-lg">SUUDAI</span>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent className="gap-6 hidden sm:flex" justify="center">
        <NavbarItem>
          <Link href="/plants" className="flex flex-col items-center text-white">
            <LeafIcon size={20} />
            <span className="text-xs">Plantas</span>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/monitoring" className="flex flex-col items-center text-white">
            <MonitorIcon size={20} />
            <span className="text-xs">Monitoreo</span>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/history" className="flex flex-col items-center text-white">
            <ClockIcon size={20} />
            <span className="text-xs">Historial</span>
          </Link>
        </NavbarItem>

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
            <DropdownItem key="g2" href="/inventory">
              Inventario
            </DropdownItem>
            <DropdownItem key="g3" href="/users">
              Usuarios
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
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
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
          >
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
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
        {[{ label: "Plantas", icon: <LeafIcon size={18} />, path: "/plants" },
          { label: "Monitoreo", icon: <MonitorIcon size={18} />, path: "/monitoring" },
          { label: "Historial", icon: <ClockIcon size={18} />, path: "/history" },
          { label: "Inventario", icon: <BarChart2Icon size={18} />, path: "/inventory" },
          { label: "Usuarios", icon: <BarChart2Icon size={18} />, path: "/users" }].map((item, index) => (
            <NavbarMenuItem key={index}>
              <Button
                variant="light"
                className="w-full flex gap-2 items-center justify-start text-left"
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
              >
                {item.icon}
                {item.label}
              </Button>
            </NavbarMenuItem>
          ))}
      </NavbarMenu>
    </Navbar>
  );
}
