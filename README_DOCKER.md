# Codex Docker Execution Platform

Esta integración permite ejecutar código de forma segura en contenedores aislados (Sandboxes) desde el backend de Codex.

## Requisitos

1.  **Docker** y **Docker Compose** instalados.
2.  El usuario que ejecuta el backend debe tener permisos para acceder a `/var/run/docker.sock` (o pertenecer al grupo `docker`).

## Configuración e Instalación

1.  **Construir las imágenes y levantar dependencias (Redis)**:
    En la raíz del proyecto (`luisi/`), ejecuta:
    ```bash
    docker-compose up -d --build
    ```
    Esto construirá las imágenes `code-platform-js`, `code-platform-python`, etc., y iniciará Redis en el puerto 6379.

2.  **Iniciar el Backend**:
    En `backend/`:
    ```bash
    npm install
    npm run dev
    ```

## Uso de la API

El endpoint para ejecutar código es `POST /api/execute`.

### Ejemplo JavaScript
```bash
curl -X POST http://localhost:4003/api/execute/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "javascript",
    "code": "console.log(10 + 20);"
  }'
```
*Nota: La ruta montada es `/api/execute` y el router define `/execute`, así que la URL completa es `/api/execute/execute`. Si prefieres `/api/execute`, ajusta `backend/src/routes/execution.routes.ts` para usar `/` en lugar de `/execute`.*

**(Correction in implementation: I registered `app.use("/api/execute", executionRoutes)` and the router has `router.post('/execute', ...)` so the path IS `/api/execute/execute`. I should probably change the router to `/` so it becomes `/api/execute`.)**

### Lenguajes Soportados
- `javascript`
- `python`
- `java`
- `csharp`
