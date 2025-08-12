
```markdown
<!-- Banner del proyecto -->
<div align="center">
  <img src="./src/assets/blanco.webp" alt="SUUDAI" width="120"/>
  <h1 align="center">🌿 SUUDAI — Sistema de Invernadero Inteligente</h1>
  <p align="center">
    <b>Plataforma IoT para monitoreo y control de cultivos en tiempo real</b>
  </p>
  
  <div align="center">
    <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React 18"/>
    <img src="https://img.shields.io/badge/Vite-4.x-646CFF?logo=vite" alt="Vite"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwind-css" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/WebSockets-✅-success" alt="WebSockets"/>
  </div>
</div>

---

## 🚀 Características principales

✔ **Monitorización en tiempo real** de parámetros ambientales  
✔ **Control remoto** de sistemas de riego y ventilación  
✔ **Históricos de datos** con gráficos interactivos  
✔ **Alertas inteligentes** por condiciones críticas  
✔ **Interfaz responsive** para cualquier dispositivo  

---

## 🛠 Configuración inicial

### 📦 Instalación de dependencias
```bash
npm install
```

### 🔧 Variables de entorno
Crea un archivo `.env` en la raíz del proyecto con:
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

> ⚠️ **Importante:** Este archivo debe estar en tu `.gitignore`

---

## 🖥 Desarrollo

```bash
npm run dev
```
Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 📂 Estructura del proyecto

```plaintext
src/
├── assets/           # Recursos multimedia
├── components/       # Componentes reutilizables
├── Features/         # Vistas principales
├── api/              # Servicios API
├── hooks/            # Custom Hooks
├── store/            # Gestión de estado
└── utils/            # Utilidades
```

---

## 🌐 Tecnologías clave

| Área           | Tecnologías                                                                 |
|----------------|----------------------------------------------------------------------------|
| Frontend       | React 18, Vite 4, TypeScript                                               |
| Estilos        | Tailwind CSS 3, Hero Icons                                                 |
| Estado         | Context API + Custom Hooks                                                 |
| Comunicación   | Axios (REST), WebSockets (tiempo real)                                     |

---

## 🤝 Contribución

1. Haz un fork del proyecto
2. Crea tu rama (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Add nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---


<div align="center">
  <sub>🌱 Cultivando el futuro de la agricultura con tecnología | Equipo SUUDAI 2025</sub>
</div>
