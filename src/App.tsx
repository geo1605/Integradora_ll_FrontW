import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./features/auth/authPage";
import {
  Home,
  ScreenPlants,
  UsersTable,
  MonitoringScreen,
  HistoryScreen,
  InventoryScreen,
  ProfileScreen
} from "./features/";
import { PublicOnlyRoute, ProtectedRoute } from "./components/";
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/themeContext";
import PrivacyPolicy from "./features/auth/PrivacyPolicy";
import Main from "./features/main"; // <-- asegúrate de que el path sea correcto

function App() {
  return (
    <HeroUIProvider>
      <AuthProvider>
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

              {/* Rutas protegidas con navbar (Main) */}
              <Route
                element={
                  <ProtectedRoute>
                    <Main />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Home />} />
                <Route path="/plants" element={<ScreenPlants />} />
                <Route path="/users" element={<UsersTable />} />
                <Route path="/monitoring" element={<MonitoringScreen />} />
                <Route path="/history" element={<HistoryScreen />} />
                <Route path="/inventory" element={<InventoryScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
              </Route>

            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </HeroUIProvider>
  );
}

export default App;
