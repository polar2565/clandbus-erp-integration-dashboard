# ClandBus ERP Integration Platform

<p align="center">
  <img src="./public/logo.ico" width="120" alt="ClandBus ERP Logo">
</p>

<p align="center">
  <strong>Prueba Técnica - Integración Acumatica ERP</strong>
</p>

<p align="center">
  Plataforma empresarial desarrollada con Angular y ASP.NET Core para integración con Acumatica ERP.
</p>

---

# Tabla de Contenido

* Descripción General
* Arquitectura del Proyecto
* Tecnologías Utilizadas
* Flujo General del Sistema
* Estructura del Proyecto
* Configuración del Backend
* Configuración del Frontend
* Flujo de Login ERP
* Manejo de Sesión ERP
* Dashboard Empresarial
* Consulta de Órdenes
* Actualización de Órdenes
* Remove Hold
* Logout ERP
* Manejo de Errores
* Decisiones Técnicas
* Seguridad
* Autor

---

# Descripción General

Este proyecto fue desarrollado como solución para la prueba técnica de ClandBus.

La solución implementa una integración completa con Acumatica ERP utilizando Angular para el frontend y ASP.NET Core para el backend.

El objetivo principal fue construir una plataforma funcional, profesional y mantenible que permitiera:

* Autenticarse contra Acumatica ERP
* Mantener sesiones ERP activas
* Consultar órdenes de venta
* Actualizar órdenes directamente desde la interfaz
* Ejecutar acciones ERP como Remove Hold
* Cerrar sesiones correctamente
* Implementar una experiencia visual empresarial
* Aplicar buenas prácticas de arquitectura y seguridad

Además de cumplir los requerimientos técnicos, el proyecto fue diseñado pensando en:

* Escalabilidad
* Separación de responsabilidades
* Experiencia de usuario
* Documentación técnica
* Facilidad de mantenimiento

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

La arquitectura fue diseñada para desacoplar la lógica de autenticación del dashboard principal.

Esto permite:

* Mejor mantenibilidad
* Separación clara de responsabilidades
* Mayor claridad en el flujo de autenticación
* Escalabilidad futura

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
* HttpClient
* CookieContainer
* Dependency Injection

## ERP

* Acumatica REST API

## Herramientas

* Visual Studio Code
* Visual Studio
* Postman
* GitHub
* Loom

---

# Flujo General del Sistema

## 1. Usuario abre la plataforma

El dashboard carga inicialmente sin sesión ERP activa.

## 2. Usuario presiona "Conectar ERP"

Se abre un modal desacoplado de autenticación.

## 3. Usuario ingresa credenciales

Las credenciales son enviadas al backend.

## 4. Backend autentica contra Acumatica

Se genera una sesión ERP utilizando cookies.

## 5. Sistema obtiene órdenes

Una vez autenticado, el dashboard carga las órdenes disponibles.

## 6. Usuario interactúa con órdenes

Puede:

* Editar órdenes
* Filtrar información
* Buscar registros
* Ejecutar Remove Hold

## 7. Logout ERP

La sesión es cerrada correctamente mediante logout.

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

# Configuración del Backend

## Ejecutar backend

```bash
cd backend/ClandbusERPIntegration
```

```bash
dotnet restore
```

```bash
dotnet run
```

URL local:

```text
https://localhost:7004
```

---

# Configuración del Frontend

## Ejecutar frontend

```bash
cd frontend
```

```bash
npm install
```

```bash
ng serve
```

URL local:

```text
http://localhost:4200
```

---

# Configuración ERP

Por seguridad, el repositorio no incluye credenciales reales.

Archivo de ejemplo:

```json
{
  "Acumatica": {
    "BaseUrl": "https://your-acumatica-instance.com/"
  }
}
```

Las credenciales se ingresan manualmente desde el frontend.

---

# Flujo de Login ERP

El login fue implementado utilizando un modal independiente del dashboard.

Características implementadas:

* Login manual
* Modal desacoplado
* Validación de campos
* Manejo de errores
* Persistencia de sesión
* Cierre manual del modal
* Interfaz empresarial moderna

El endpoint utilizado:

```http
/entity/auth/login
```

---

# Manejo de Sesión ERP

Uno de los puntos más importantes del proyecto fue mantener la sesión ERP activa.

Para resolver esto se implementó:

## CookieContainer

Permite mantener las cookies de sesión entre peticiones.

## withCredentials

El frontend envía las cookies correctamente.

## Singleton Service

El servicio ERP fue registrado como Singleton para evitar pérdida de sesión.

## CORS configurado

El backend permite credenciales cross-origin.

Gracias a esto:

* La sesión ERP permanece activa
* Las órdenes pueden consultarse correctamente
* Remove Hold funciona correctamente
* Logout limpia la sesión

---

# Dashboard Empresarial

El frontend fue diseñado para simular una interfaz empresarial moderna enfocada en experiencia de usuario y administración operativa.

La aplicación incluye un dashboard interactivo conectado en tiempo real con Acumatica ERP.

## Funcionalidades implementadas

### Panel de estado ERP

El dashboard muestra:

* Estado actual de sesión ERP
* Indicadores visuales de conexión
* Estadísticas generales
* Cantidad de órdenes cargadas
* Última operación ejecutada

---

## Tabla dinámica de órdenes

La tabla principal incluye múltiples funcionalidades de interacción:

### Búsqueda en tiempo real

Permite buscar órdenes por:

* Número de orden
* Cliente
* Descripción
* Estado

---

### Filtro por estado

El usuario puede filtrar dinámicamente órdenes por:

* Open
* Completed
* On Hold
* Invoiced

---

### Control de registros visibles

El sistema permite seleccionar:

* 5 registros
* 10 registros
* 20 registros
* 50 registros
* Mostrar todos

Esto mejora navegación y rendimiento visual.

---

### Indicadores visuales

Cada estado posee estilos visuales distintos para mejorar legibilidad.

Ejemplos:

* Open → Verde
* Completed → Azul
* On Hold → Amarillo
* Invoiced → Morado

---

### Edición de órdenes

Cada orden puede abrir un modal de edición para:

* Modificar descripción
* Guardar cambios directamente en ERP
* Actualizar información en tiempo real

---

### Remove Hold

Las órdenes en estado "On Hold" permiten ejecutar la acción Remove Hold directamente desde la interfaz.

El dashboard actualiza automáticamente:

* Estado visual
* Estadísticas
* Tabla

---

## Experiencia de usuario

Se implementaron:

* Modales desacoplados
* Estados loading
* Notificaciones visuales
* Diseño responsive
* Componentes reutilizables
* Arquitectura limpia

---

# Consulta de Órdenes

Las órdenes son obtenidas directamente desde Acumatica ERP.

Endpoint utilizado:

```http
GET /entity/Default/24.200.001/SalesOrder
```

Características:

* Consulta dinámica
* Renderizado en tabla
* Filtrado en frontend
* Estados visuales
* Búsqueda en tiempo real

---

# Actualización de Órdenes

La aplicación permite modificar órdenes directamente desde la interfaz.

Funcionalidad implementada:

* Modal de edición
* Cambio de descripción
* Actualización vía API REST
* Refresco de datos
* Feedback visual

---

# Remove Hold

La solución implementa la acción requerida por la prueba técnica.

Comportamiento:

* Detecta órdenes On Hold
* Ejecuta actualización ERP
* Cambia estado a Open
* Actualiza dashboard

---

# Logout ERP

La aplicación también implementa cierre de sesión ERP.

Endpoint utilizado:

```http
/entity/auth/logout
```

Esto evita:

* Sesiones huérfanas
* Conexiones innecesarias
* Problemas de seguridad

---

# Manejo de Errores

La aplicación incluye manejo básico de errores:

* Login inválido
* ERP no disponible
* Errores de red
* Sesión expirada
* Errores de actualización
* Errores Remove Hold

También se implementaron:

* Toast notifications
* Estados de loading
* Mensajes visuales

---

# Decisiones Técnicas

## Separación Login / Dashboard

Inicialmente el login estaba integrado dentro del dashboard.

Posteriormente fue desacoplado para:

* Mejorar arquitectura
* Facilitar mantenimiento
* Simular un sistema empresarial real
* Evitar lógica mezclada

---

## Manejo de sesión persistente

Acumatica ERP trabaja mediante cookies de sesión.

Para resolver esto:

* Se utilizó CookieContainer
* Se configuró CORS
* Se implementó withCredentials
* Se utilizó Singleton service

---

# Seguridad

El repositorio NO incluye:

* Usuarios reales
* Contraseñas
* Variables sensibles
* Información privada ERP

La autenticación es completamente dinámica.

---

# Autor

Javier Solís

Prueba Técnica - ClandBus ERP Integration
