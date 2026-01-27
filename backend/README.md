# 📚 CODEX Backend & Sandbox Architecture

Este documento detalla la arquitectura del backend de CODEX, con un enfoque especial en el sistema de ejecución de código seguro (Sandboxes).

## 🚀 1. Visión General del Backend

El backend está construido con:
- **Runtime**: Node.js
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL (vía Prisma ORM)
- **Cache/Colas**: Redis (para gestión de ejecuciones)
- **Containerización**: Docker (para aislamiento de código)

---

## 🔌 2. API Endpoints

### 🛠️ Ejecución de Código (Code Runner)

El núcleo de la plataforma es la capacidad de ejecutar código de usuario de forma segura.

#### `POST /api/execute`

Ejecuta un fragmento de código en un lenguaje específico dentro de un contenedor aislado.

**Body (JSON):**
```json
{
  "language": "javascript" | "python" | "java" | "csharp",
  "code": "console.log('Hola Mundo');",
  "userId": "uuid-usuario-opcional"
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "output": "Hola Mundo",
  "error": "",
  "exitCode": 0
}
```

**Respuesta de Error de Compilación/Ejecución:**
```json
{
  "success": false,
  "output": "",
  "error": "SyntaxError: ...",
  "exitCode": 1
}
```

---

### 🛡️ Autenticación (`/api/auth`)
- `POST /register`: Registro de nuevos usuarios.
- `POST /login`: Inicio de sesión (retorna JWT).
- `GET /me`: Obtener perfil del usuario actual.

### 🏋️ Ejercicios (`/api/exercises`)
- `GET /`: Listar ejercicios.
- `POST /validate`: Validar solución de ejercicios (lógica de negocio).

---

## 📦 3. Arquitectura de Sandboxes (Entornos Controlados)

Para garantizar que el código enviado por los usuarios no dañe el servidor ni acceda a información sensible, utilizamos **contenedores Docker efímeros y altamente restringidos**.

### 🏗️ Flujo de Ejecución

1.  **Recepción**: El endpoint `/api/execute` recibe el código y el lenguaje.
2.  **Orquestación**: `DockerManager` (en el backend) selecciona la imagen Docker adecuada (`code-platform-js`, `code-platform-python`, etc.).
3.  **Contenedorización**: Se crea un contenedor nuevo **por cada ejecución**.
4.  **Ejecución**: El código se inyecta en el contenedor (vía `stdin`).
5.  **Captura**: Se capturan `stdout` y `stderr`.
6.  **Limpieza**: El contenedor se destruye inmediatamente después de finalizar (o al alcanzar el timeout).

### 🔒 Medidas de Seguridad (Aislamiento Total)

Cada sandbox implementa múltiples capas de seguridad:

1.  **Sin Red (`NetworkMode: 'none'`)**:
    - Los contenedores **no tienen acceso a internet** ni a la red local. No pueden hacer peticiones HTTP ni conectarse a bases de datos externas.

2.  **Sistema de Archivos de Solo Lectura (`ReadonlyRootfs: true`)**:
    - El sistema de archivos raíz es de solo lectura. El código malicioso no puede modificar archivos del sistema ni instalar malware.
    - Solo `/tmp` es escribible (montado como `tmpfs` en memoria), y se borra al terminar.

3.  **Usuario sin Privilegios (Non-Root)**:
    - Todos los procesos corren como usuario `1001` o `1000`, sin permisos de root (`sudo` no existe o no funciona).

4.  **Límites de Recursos (Resource Quotas)**:
    - **CPU**: Limitado (ej. 10% de un core) para evitar bucles infinitos que congelen el servidor.
    - **Memoria**: Máximo 100MB (ajustable) para prevenir ataques de denegación de servicio (OOM).
    - **PIDs**: Límite de procesos concurrentes (ej. 50) para evitar bombas fork.

5.  **Filtrado de Syscalls (Seccomp)**:
    - Utilizamos perfiles `seccomp` para bloquear llamadas al sistema peligrosas a nivel de kernel, reduciendo la superficie de ataque.

6.  **Capacidades del Kernel (CapDrop ALL)**:
    - Se eliminan todas las "capabilities" de Linux (ej. `NET_ADMIN`, `SYS_ADMIN`), dejando al contenedor estrictamente con lo mínimo para procesar texto.

### 📝 Detalles por Lenguaje

| Lenguaje | Imagen Base | Runner | Notas |
|----------|-------------|--------|-------|
| **JS** | `node:18-alpine` | `vm` module | Usa contexto aislado de Node.js `vm`. |
| **Python** | `python:3.11-slim` | `pypy-sandbox` logic | Restricción de imports (`os`, `subprocess` bloqueados). |
| **Java** | `openjdk:17` | `SecurityManager` | Política estricta (`java.policy`) que prohíbe IO y reflexión. |
| **C#** | `.NET 7 SDK` | Managed Runner | Compilación en memoria. |

---

## ⚙️ Configuración para Desarrollo

### Prerrequisitos
- Docker Desktop (o Engine) corriendo.
- Node.js 18+.

### Pasos
1.  **Levantar Infraestructura**:
    ```bash
    # Desde la raiz del proyecto
    docker-compose up -d --build
    ```
    Esto prepara las imágenes de los sandboxes.

2.  **Iniciar Backend**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```

3.  **Verificar**:
    Accede a `http://localhost:4003/api/health` para ver el estado.
