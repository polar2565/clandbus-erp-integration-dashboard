# ClandBus ERP Integration Platform

<img src="./frontend/clandbus-dashboard/public/logo.ico" width="120" alt="ClandBus ERP Logo">
<p align="center">
  <strong>Acumatica ERP Integration Dashboard</strong>
</p>

<p align="center">
  Plataforma empresarial desarrollada con Angular y ASP.NET Core para integración con Acumatica ERP.
</p>

---

# Descripción General

Este proyecto implementa una integración completa con Acumatica ERP utilizando Angular para el frontend y ASP.NET Core para el backend.

La aplicación permite:

* Iniciar sesión contra Acumatica ERP
* Mantener sesiones ERP activas mediante cookies
* Consultar órdenes de venta
* Actualizar órdenes directamente desde la interfaz
* Ejecutar acciones ERP como Remove Hold
* Cerrar sesiones ERP correctamente
* Visualizar información mediante un dashboard empresarial

La arquitectura fue diseñada con enfoque empresarial, separando responsabilidades entre frontend, backend e integración ERP.

---

# Arquitectura del Proyecto

```text
Angular Frontend
        ↓
LoginComponent
        ↓
DashboardComponent
        ↓
AcumaticaService (Angular)
        ↓
ASP.NET Core API
        ↓
AcumaticaService (C#)
        ↓
Acumatica ERP REST API
```

---

# Tecnologías Utilizadas

## Frontend

* Angular 20
* TypeScript
* SCSS
* Standalone Components
* HttpClient

## Backend

* ASP.NET Core 9
* C#
* REST API
* HttpClient
* CookieContainer
* Dependency Injection

## ERP

* Acumatica REST API

---

# Estructura del Proyecto

## Frontend

```text
frontend/
 ├── src/
 │    ├── app/
 │    │    ├── core/
 │    │    │    └── services/
 │    │    │         └── acumatica.service.ts
 │    │    │
 │    │    ├── features/
 │    │    │    ├── dashboard/
 │    │    │    └── login/
 │    │    │
 │    │    └── shared/
 │    │         └── components/
 │    │
 │    └── public/
 │         └── logo.ico
```

## Backend

```text
backend/
 ├── Controllers/
 ├── DTOs/
 ├── Interfaces/
 ├── Services/
 ├── Configurations/
 └── Program.cs
```

---

# Backend Intermediary Layer

El frontend no consume Acumatica ERP directamente.

Se implementó una capa intermedia en ASP.NET Core encargada de:

* Manejar autenticación ERP
* Mantener sesiones activas
* Gestionar cookies
* Centralizar integración ERP
* Manejar errores
* Encapsular endpoints ERP

Esto permite una arquitectura más segura y mantenible.

---

# Endpoints Internos

## Login ERP

```http
POST /api/Acumatica/login
```

Inicia sesión contra Acumatica ERP y genera la sesión activa.

---

## Obtener órdenes

```http
GET /api/Acumatica/orders
```

Obtiene órdenes de venta desde Acumatica ERP.

---

## Actualizar orden

```http
POST /api/Acumatica/update-order
```

Actualiza información de órdenes desde el dashboard.

---

## Remove Hold

```http
POST /api/Acumatica/remove-hold
```

Ejecuta la acción Remove Hold sobre órdenes ERP.

---

## Logout ERP

```http
POST /api/Acumatica/logout
```

Finaliza correctamente la sesión ERP.

---

# Flujo de Integración ERP

## 1. Inicio de sesión

El usuario ingresa sus credenciales desde el modal de login.

---

## 2. Backend autentica contra ERP

ASP.NET Core consume:

```http
/entity/auth/login
```

---

## 3. Acumatica genera cookies de sesión

La sesión ERP se mantiene mediante `CookieContainer`.

---

## 4. Requests posteriores reutilizan sesión

Las siguientes peticiones utilizan la misma sesión ERP activa:

* Consulta de órdenes
* Actualización de órdenes
* Remove Hold
* Logout

---

## 5. Logout ERP

La sesión es destruida correctamente mediante:

```http
/entity/auth/logout
```

---

# Login ERP

La autenticación fue implementada mediante un modal desacoplado del dashboard principal.

## Características

* Login manual
* Validación de campos
* Manejo de errores
* Modal reutilizable
* Diseño empresarial
* Integración ERP en tiempo real

---

# Manejo de Sesión ERP

Uno de los puntos más importantes del proyecto fue mantener la sesión ERP activa entre peticiones.

Para resolver esto se implementó:

## CookieContainer

Permite mantener cookies ERP activas.

---

## withCredentials

El frontend envía credenciales correctamente entre dominios.

---

## Singleton Service

El servicio ERP se registró como Singleton para mantener persistencia de sesión.

---

## Configuración CORS

El backend permite credenciales cross-origin entre Angular y ASP.NET Core.

---

# Dashboard Empresarial

El frontend fue diseñado para simular una interfaz empresarial moderna enfocada en experiencia de usuario.

## Funcionalidades principales

* Panel de estado ERP
* Estadísticas dinámicas
* Tabla de órdenes
* Búsqueda en tiempo real
* Filtro por estado
* Control de registros visibles
* Modales de edición
* Notificaciones visuales
* Loading overlays
* Diseño responsive

---

# Tabla de Órdenes

La tabla principal incluye múltiples funcionalidades dinámicas.

## Búsqueda en tiempo real

Permite buscar órdenes por:

* Número de orden
* Cliente
* Descripción
* Estado

---

## Filtro por estado

El usuario puede filtrar órdenes por:

* Open
* Completed
* On Hold
* Invoiced

---

## Control de registros visibles

La tabla permite mostrar:

* 5 registros
* 10 registros
* 20 registros
* 50 registros
* Todos los registros

---

## Indicadores visuales

Cada estado posee estilos visuales específicos para mejorar legibilidad y experiencia de usuario.

---

# Actualización de Órdenes

La aplicación permite modificar órdenes directamente desde la interfaz.

## Funcionalidad implementada

* Apertura de modal
* Modificación de descripción
* Actualización ERP
* Refresco visual
* Confirmación de operación

---

# Remove Hold

La solución implementa la acción requerida por Acumatica ERP.

## Flujo

* Detectar órdenes On Hold
* Ejecutar acción ERP
* Actualizar estado visual
* Refrescar dashboard

---

# Logout ERP

La aplicación implementa cierre de sesión ERP para evitar sesiones huérfanas.

## Beneficios

* Mejor control de sesión
* Limpieza de conexión
* Buenas prácticas empresariales

---

# Manejo de Errores

La aplicación implementa manejo visual de errores y estados.

## Casos manejados

* Login inválido
* ERP no disponible
* Error de red
* Sesión expirada
* Error actualización
* Error Remove Hold

---

# Decisiones Técnicas

## Separación Login / Dashboard

El login fue desacoplado del dashboard para:

* Mejorar arquitectura
* Separar responsabilidades
* Facilitar mantenimiento
* Mejorar escalabilidad

---

## Backend como capa intermedia

El backend centraliza completamente la comunicación ERP.

Beneficios:

* Seguridad
* Control de sesión
* Encapsulación
* Manejo de errores
* Mejor mantenibilidad

---

## Arquitectura Standalone

Angular fue implementado utilizando Standalone Components para mantener una arquitectura más moderna y modular.

---

# Instalación

# Backend

```bash
cd backend/ClandbusERPIntegration
```

```bash
dotnet restore
```

```bash
dotnet run
```

Backend:

```text
https://localhost:7004
```

---

# Frontend

```bash
cd frontend
```

```bash
npm install
```

```bash
ng serve
```

Frontend:

```text
http://localhost:4200
```

---

# Configuración

Archivo ejemplo:

```json
{
  "Acumatica": {
    "BaseUrl": "https://your-acumatica-instance.com/"
  }
}
```

---

# Seguridad

El proyecto no incluye:

* Credenciales reales
* Variables sensibles
* Información privada ERP

---

# Autor

Javier Solís
