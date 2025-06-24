import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./features/auth/authPage";
import {Home, ScreenPlants, UsersTable, MonitoringScreen, HistoryScreen, InventoryScreen, ProfileScreen} from "./features/";
import {PublicOnlyRoute, ProtectedRoute} from "./components/";
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/themeContext";
import PrivacyPolicy from "./features/auth/PrivacyPolicy";

function App() {
  return (
    <HeroUIProvider>
      {/* Envuelve aplicación con el AuthProvider */}
      <AuthProvider>
        {/* Envuelve aplicación con el ThemeProvider */}
        <ThemeProvider> 
          {/* Configura las rutas de la aplicación */}
          <BrowserRouter>
            <Routes>
              <Route
                path="/auth"
                element={
                  <PublicOnlyRoute>
                    <AuthPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/plants"
                element={
                  <ProtectedRoute>
                    <ScreenPlants />
                  </ProtectedRoute>
                }
              />
              <Route
              path='/privacy-policy'
              element={<PrivacyPolicy/>}
              />

              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/monitoring"
                element={
                  <ProtectedRoute>
                    <MonitoringScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <HistoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <InventoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </HeroUIProvider>
  );
}

export default App;
