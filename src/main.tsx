import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      onScriptLoadError={() => console.error("Error cargando Google OAuth")}
      onScriptLoadSuccess={() => console.log("Google OAuth cargado")}
    >
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
