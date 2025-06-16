import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./features/auth/authPage";
import Home from "./features/dashboard/home";
import ProtectedRoute from "./components/ProtectedRoutes";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/themeContext"; // ✅ importa el ThemeProvider

function App() {
  return (
    <HeroUIProvider>
      <AuthProvider>
        <ThemeProvider> {/* ✅ ENVUELVE TU APP AQUÍ */}
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
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </HeroUIProvider>
  );
}

export default App;
