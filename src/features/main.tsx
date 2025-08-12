import { SuudaiNavbar } from "../components";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { connectWebSocketAlerts } from "../api/Notification";
import { ToastProvider } from "@heroui/react"; // Añade esto

export default function Main() {
  useEffect(() => {
    connectWebSocketAlerts();
  }, []);

  return (
    <>
  <ToastProvider />
  <SuudaiNavbar />
  <Outlet />
</>

  );
}