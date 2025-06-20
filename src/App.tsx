import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./features/auth/authPage";
import {Home, ScreenPlants} from "./features/";
import {PublicOnlyRoute, ProtectedRoute} from "./components/";
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/themeContext";

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
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </HeroUIProvider>
  );
}

export default App;
