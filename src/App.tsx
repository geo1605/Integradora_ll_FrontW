import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./features/auth/authPage";
import {
  Home,
  ScreenPlants,
  UsersTable,
  MonitoringScreen,
  HistoryScreen,
  InventoryScreen,
  ProfileScreen,
} from "./features/";
import { PublicOnlyRoute, ProtectedRoute } from "./components/";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "./contexts/themeContext";
import PrivacyPolicy from "./features/auth/PrivacyPolicy";
import { useInitAuth } from "./hooks/useInitAuth";
import Main from "./features/main";
import { useUserRole } from "./hooks/useUserRole";

function App() {
  useInitAuth();
  const role = useUserRole();

  const roleAccess: Record<string, string[]> = {
    Adm1ni$trad0r: ["dashboard", "plants", "users", "monitoring", "inventory", "history", "profile"],
    M4ntenim1ent0: ["dashboard", "monitoring", "inventory", "history", "profile"],
    B0t4nic0: ["dashboard", "plants", "history", "profile"],
    Default: ["dashboard", "history", "profile"],
  };

  const hasAccess = (route: string) => {
    if (!role) return false;
    return roleAccess[role]?.includes(route);
  };

  return (
    <HeroUIProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>

            {/* Ruta pública */}
            <Route
              path="/auth"
              element={
                <PublicOnlyRoute>
                  <AuthPage />
                </PublicOnlyRoute>
              }
            />

            {/* Ruta sin navbar */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            {/* Rutas protegidas con navbar */}
            <Route
              element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>
              }
            >
              {hasAccess("dashboard") && <Route path="/" element={<Home />} />}
              {hasAccess("plants") && <Route path="/plants" element={<ScreenPlants />} />}
              {hasAccess("users") && <Route path="/users" element={<UsersTable />} />}
              {hasAccess("monitoring") && <Route path="/monitoring" element={<MonitoringScreen />} />}
              {hasAccess("history") && <Route path="/history" element={<HistoryScreen />} />}
              {hasAccess("inventory") && <Route path="/inventory" element={<InventoryScreen />} />}
              {hasAccess("profile") && <Route path="/profile" element={<ProfileScreen />} />}

              {/* Ruta por defecto si no hay acceso */}
              <Route path="*" element={<Navigate to="/" />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HeroUIProvider>
  );
}

export default App;
