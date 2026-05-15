# ClandBus ERP Integration

<p align="center">
  <img src="./public/logo.ico" width="120" alt="ClandBus ERP Logo">
</p>

<p align="center">
  <strong>Prueba Técnica - Integración Acumatica ERP</strong>
</p>

---

# Descripción

Este proyecto fue desarrollado como solución para la prueba técnica de ClandBus.

La aplicación integra Angular y ASP.NET Core con la API REST de Acumatica ERP, implementando:

* Login ERP
* Manejo de sesión con cookies
* Consulta de órdenes de venta
* Actualización de órdenes
* Acción Remove Hold
* Logout ERP
* Dashboard empresarial

---

# Tecnologías

## Frontend

* Angular 20
* TypeScript
* SCSS

## Backend

* ASP.NET Core 9
* C#
* HttpClient
* CookieContainer

## ERP

* Acumatica REST API

---

# Arquitectura

```text
Angular Frontend
        ↓
LoginComponent
        ↓
DashboardComponent
        ↓
AcumaticaService
        ↓
ASP.NET Core API
        ↓
Acumatica ERP
```

---

# Funcionalidades

## Login ERP

La autenticación se realiza mediante un modal de login desacoplado del dashboard.

Características:

* Login manual
* Sin credenciales hardcodeadas
* Manejo de sesión persistente
* Cookies ERP
* Logout seguro

---

## Órdenes de Venta

El dashboard permite:

* Consultar órdenes
* Buscar órdenes
* Filtrar por estado
* Editar descripción
* Ejecutar Remove Hold

---

# Instalación

## Backend

```bash
cd backend/ClandbusERPIntegration

dotnet restore

dotnet run
```

Backend:

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

Frontend:

```text
http://localhost:4200
```

---

# Configuración

El proyecto no incluye credenciales reales.

Ejemplo:

```json
{
  "Acumatica": {
    "BaseUrl": "https://your-acumatica-instance.com/"
  }
}
```

Las credenciales ERP se ingresan manualmente desde el login.

---

# SQL

## Eliminación de registros históricos

```sql
DELETE FROM LoginTrace
WHERE [Date] < '2025-01-01';
```

---

## Optimización de consultas

```sql
CREATE NONCLUSTERED INDEX IX_LoginTrace_Date_Username
ON LoginTrace ([Date], [Username]);
```

---

# Decisiones Técnicas

## Login desacoplado

El login fue separado del dashboard para:

* Mejorar arquitectura
* Evitar credenciales hardcodeadas
* Simular un entorno empresarial real
* Mejorar mantenibilidad

---

## Manejo de sesión ERP

Se implementó:

* CookieContainer
* withCredentials
* Singleton service

para mantener la sesión ERP activa entre peticiones.

---

# Manejo de Incidentes

Ante un problema de timeout:

1. Validar disponibilidad de API
2. Revisar logs backend
3. Validar tiempos de respuesta ERP
4. Revisar consultas SQL
5. Verificar cambios recientes
6. Revisar rendimiento del servidor

---

# Seguridad

El repositorio no incluye:

* Usuarios reales
* Contraseñas
* Variables sensibles

La autenticación se realiza desde la interfaz.

---

# Autor

Javier Solís
