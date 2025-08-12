

<!-- Header -->
<div align="center">
  <img src="./src/assets/blanco.webp" alt="SUUDAI Logo" width="120">
  <h1 align="center">🌿 SUUDAI</h1>
  <h3 align="center">Sistema de Invernadero Inteligente</h3>
  
  <p align="center">
    Plataforma IoT para monitoreo y control de cultivos en tiempo real<br>
    <strong>Frontend: React 18 + Vite + Tailwind CSS</strong>
  </p>

  <!-- Badges -->
  <div align="center">
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React">
    <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  </div>
</div>



## 🚀 Características Principales

<div align="center">
  <table>
    <tr>
      <td width="50%">
        <ul>
          <li>📊 Dashboard interactivo con métricas en tiempo real</li>
          <li>🌡️ Monitoreo de temperatura, humedad y luminosidad</li>
          <li>💧 Control automatizado de riego</li>
        </ul>
      </td>
      <td width="50%">
        <ul>
          <li>🔔 Sistema de alertas configurables</li>
          <li>📱 Diseño responsive para móviles</li>
          <li>📈 Históricos de datos con gráficos</li>
        </ul>
      </td>
    </tr>
  </table>
</div>


## 🛠️ Configuración

### Requisitos previos
- Node.js v18+
- npm v9+

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/suudai-frontend.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env-frontend .env
```

### Variables de entorno
| Variable       | Descripción                     | Valor por defecto       |
|----------------|---------------------------------|-------------------------|
| `VITE_API_URL` | URL del backend                 | `http://localhost:3000` |
| `VITE_WS_URL`  | URL para WebSockets             | `ws://localhost:3000`   |

---

## 🖥️ Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 📂 Estructura del Proyecto

```plaintext
src/
├── assets/            # Recursos estáticos
├── components/        # Componentes reutilizables
│   ├── sensors/       # Componentes de sensores
│   └── ui/            # Elementos de interfaz
├── features/          # Lógica de negocio
│   ├── dashboard/     # Vista principal
│   └── settings/      # Configuraciones
├── hooks/             # Custom hooks
├── store/             # Gestión de estado
├── App.tsx            # Componente raíz
└── main.tsx           # Punto de entrada
```

---


<div align="center">
  <sub>🌱 Cultivando el futuro de la agricultura con tecnología</sub>
</div>

