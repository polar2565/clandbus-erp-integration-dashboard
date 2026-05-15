<h1 align="center">
  Clandbus ERP Integration Dashboard
</h1>

<p align="center">
  Integración empresarial entre Angular, ASP.NET Core y Acumatica ERP mediante API REST.
</p>

---

<p align="center">
  Dashboard ERP · Acumatica REST API · ASP.NET Core · Angular
</p>

---

# Descripción General

Este proyecto fue desarrollado como parte de la prueba técnica para Clandbus.

La solución implementa una arquitectura empresarial desacoplada entre frontend y backend para integrarse con Acumatica ERP utilizando su API REST oficial.

El sistema permite:

- autenticación ERP
- manejo de sesión y cookies
- consulta de órdenes
- actualización de órdenes
- liberación de órdenes On Hold
- dashboard empresarial
- actualización visual en tiempo real
- filtros dinámicos
- troubleshooting y validaciones ERP

El objetivo principal fue construir una integración funcional orientada a escenarios empresariales reales.

---

# Características principales

## Integración real con Acumatica ERP

- login ERP mediante API REST
- manejo de cookies y sesión
- autenticación persistente
- operaciones ERP reales
- arquitectura desacoplada

---

## Dashboard empresarial

- tabla dinámica
- búsqueda en tiempo real
- filtros por estado
- KPIs
- loading overlay
- toast notifications
- modal de edición
- actualización visual instantánea

---

## Gestión de órdenes

- consulta de órdenes ERP
- edición de descripción
- actualización inmediata en UI
- cambio de estado On Hold → Open
- sincronización con Acumatica

---

## Arquitectura backend segura

El frontend nunca interactúa directamente con Acumatica ERP.

Toda la autenticación y lógica de integración se maneja desde ASP.NET Core para proteger:

- credenciales ERP
- cookies
- sesión
- operaciones REST

---

# Problema

Muchas integraciones ERP exponen directamente lógica sensible al frontend o generan dependencias acopladas difíciles de mantener.

Además, operaciones como manejo de sesión, cookies y acciones ERP suelen requerir control centralizado para mantener seguridad y estabilidad.

---

# Solución

Se desarrolló una API intermedia en ASP.NET Core encargada de:

- autenticación ERP
- persistencia de sesión
- consumo REST
- actualización de órdenes
- manejo de errores
- control de operaciones

Angular consume únicamente endpoints internos del backend.

Esto permite:

- mejor seguridad
- desacoplamiento
- mantenibilidad
- arquitectura enterprise
- separación de responsabilidades

---

# Arquitectura

El proyecto está dividido en dos capas principales.

---

## Frontend

Responsable de toda la experiencia visual y comunicación con backend.

### Responsabilidades

- dashboard empresarial
- renderizado de órdenes
- filtros
- búsqueda
- estados visuales
- loading overlay
- toast notifications
- modales
- actualización dinámica UI

### Tecnologías

- Angular
- TypeScript
- SCSS
- Standalone Components

---

## Backend

Responsable de toda la integración ERP.

### Responsabilidades

- login ERP
- manejo de cookies
- manejo de sesión
- integración REST
- actualización de órdenes
- remove hold
- logout
- validaciones
- troubleshooting

### Tecnologías

- ASP.NET Core 9
- C#
- HttpClient
- REST API

---

# Flujo General

```text
Angular Frontend
       ↓
ASP.NET Core API
       ↓
Acumatica ERP REST API
```

---

# Integración con Acumatica ERP

La integración utiliza:

```text
https://soporte.clandbus.com/demo/
```

---

# Funcionalidades Implementadas

# Autenticación ERP

Login implementado mediante:

```http
POST /entity/auth/login
```

Características:

- persistencia de sesión
- reutilización de cookies
- autenticación backend
- protección de credenciales ERP

---

# Consulta de Órdenes

Obtención de órdenes mediante:

```http
GET /entity/Default/24.200.001/SalesOrder
```

Características:

- consulta dinámica
- múltiples estados
- renderizado empresarial
- filtros visuales

---

# Actualización de Órdenes

Actualización implementada mediante:

```http
PUT /entity/Default/24.200.001/SalesOrder
```

Permitiendo modificar:

- Description

La actualización se refleja inmediatamente en UI sin recargar toda la aplicación.

---

# Remove Hold

Inicialmente se intentó utilizar una acción REST personalizada de Acumatica.

Posteriormente se implementó una solución más estable actualizando:

```json
"hold": {
  "value": false
}
```

Esto permite:

```text
On Hold → Open
```

Características:

- actualización instantánea
- cambio visual inmediato
- sincronización ERP
- UX optimizada

---

# Logout

Cierre de sesión implementado mediante:

```http
POST /entity/auth/logout
```

Evita dejar sesiones activas en el ERP.

---

# Frontend Angular

El dashboard fue desarrollado con enfoque empresarial.

## Características UI/UX

- diseño moderno
- responsive
- estados visuales
- experiencia fluida
- actualización en tiempo real
- feedback inmediato
- arquitectura modular

---

# API Backend

## Login

```http
POST /api/Acumatica/login
```

---

## Obtener órdenes

```http
GET /api/Acumatica/orders
```

---

## Actualizar orden

```http
POST /api/Acumatica/update-order
```

---

## Remove Hold

```http
POST /api/Acumatica/remove-hold
```

---

## Logout

```http
POST /api/Acumatica/logout
```

---

# SQL Maintenance

Dentro de:

```text
sql/maintenance.sql
```

se incluyen:

## Eliminación de registros históricos

Limpieza de registros históricos de:

```text
LoginTrace
```

basado en:

```text
Date
```

eliminando registros del año 2024 hacia atrás.

---

## Optimización mediante índices

Optimización de búsquedas frecuentes utilizando índices orientados a:

- Date
- Username

reduciendo tiempos de lectura sin afectar significativamente escrituras.

---

# Troubleshooting y Validaciones

Durante el desarrollo se realizaron validaciones sobre:

- comunicación Angular ↔ ASP.NET Core
- configuración CORS
- cookies y sesión
- validación de endpoints ERP
- estados ERP
- órdenes existentes
- manejo de errores HTTP
- actualización dinámica
- debugging REST
- sincronización ERP

---

# Seguridad

Las credenciales ERP permanecen protegidas únicamente en backend.

El frontend:

- no almacena credenciales ERP
- no interactúa directamente con Acumatica
- consume únicamente endpoints internos

Esto permite una arquitectura más segura y mantenible.

---

# Estructura del Proyecto

```text
clandbus-technical-test/
│
├── backend/
│   ├── Controllers/
│   ├── DTOs/
│   ├── Interfaces/
│   ├── Services/
│   ├── Configurations/
│   └── Program.cs
│
├── frontend/
│   ├── src/
│   ├── app/
│   ├── core/
│   ├── features/
│   ├── shared/
│   └── environments/
│
├── sql/
│   └── maintenance.sql
│
└── README.md
```

---

# Instalación

## Backend

```bash
cd backend
dotnet restore
dotnet run
```

API:

```text
https://localhost:7004
```

---

## Frontend

```bash
cd frontend
npm install
ng serve
```

Aplicación:

```text
http://localhost:4200
```

---

# Configuración ERP

Configuración ubicada en:

```text
appsettings.json
```

Ejemplo:

```json
"AcumaticaSettings": {
  "BaseUrl": "https://soporte.clandbus.com/demo/",
  "Username": "usuario",
  "Password": "password"
}
```

---

# Mejoras Futuras

- JWT Authentication
- roles y permisos
- SignalR
- exportación Excel/PDF
- logs centralizados
- retry policies
- dashboard analítico
- auditoría avanzada
- paginación server-side

---

# Estado del Proyecto

Estado actual:

- integración ERP funcional
- dashboard operativo
- actualización de órdenes
- remove hold funcional
- manejo de sesión
- frontend conectado a backend real
- arquitectura desacoplada
- UX empresarial implementada

---

# Autor

## Javier Solís

Frontend / Full-Stack Developer

Responsable de:

- arquitectura
- integración ERP
- frontend Angular
- backend ASP.NET Core
- dashboard empresarial
- troubleshooting
- UX/UI

GitHub:

https://github.com/Polar2565
