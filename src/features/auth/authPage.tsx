import { useEffect, useState } from 'react';
import Login from './login';
import Register from './register';
import fondo from '../../assets/fondo_auth.png';
import logo from '../../assets/blanco.webp';
import { Tabs, Tab } from "@heroui/react";


export default function AuthPage() {
  const [selectedTab, setSelectedTab] = useState("login");

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <div className="min-h-screen w-full backdrop-blur-sm bg-black/40 flex flex-col items-center justify-start px-4">
        <div className="text-center w-full max-w-md">
          <div className="flex flex-row items-center justify-center mb-6">
            <img src={logo} alt="Logo" className="w-20 h-20 mb-2" />
            <div className="ml-4 text-white">
              <h1 className="text-2xl font-bold">SUDAAI</h1>
              <h2 className="text-lg font-semibold">ACUAPONIA</h2>
            </div>
          </div>

          <div className="rounded-lg shadow-lg p-5 w-full max-w-md bg-[var(--section-color)]">
            <Tabs selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(String(key))}>
              <Tab key="login" title="Iniciar Sesión">
                <Login clear={selectedTab !== "login"} />
              </Tab>
              <Tab key="register" title="Registrarse">
                <Register clear={selectedTab !== "register"} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
