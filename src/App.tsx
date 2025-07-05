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
import { ThemeProvider } from "./contexts/themeContext";
import PrivacyPolicy from "./features/auth/PrivacyPolicy";
import { useInitAuth } from "./hooks/useInitAuth";
import Main from "./features/main"; // <-- asegúrate de que el path sea correcto

function App() {

  useInitAuth();

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
    </HeroUIProvider>
  );
}

export default App;
