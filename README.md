# 🚀 CODEX - Plataforma Educativa de Programación

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)

**Una plataforma interactiva para aprender programación con ejercicios prácticos, desafíos de la comunidad y ejecución de código en tiempo real.**

[Demo](#demo) • [Características](#-características) • [Instalación](#-instalación) • [Uso](#-uso) • [API](#-api) • [Contribuir](#-contribuir)

</div>

---

## 📋 Descripción

CODEX es una plataforma educativa moderna diseñada para enseñar programación de manera interactiva. Los usuarios pueden:

- 📚 Completar lecciones y ejercicios interactivos
- 🏆 Ganar XP y subir de nivel
- 🎖️ Desbloquear badges por logros
- 💻 Ejecutar código en múltiples lenguajes (JavaScript, Python, Java, C#)
- 🌐 Crear y compartir desafíos con la comunidad
- 📊 Competir en el leaderboard global

---

## ✨ Características

### 🎓 Sistema de Aprendizaje
- **Lecciones estructuradas** con teoría y práctica
- **Ejercicios interactivos**: Fill-in-the-blank, múltiple opción, coding challenges
- **Progreso persistente** con tracking de ejercicios completados

### 🔥 Ejecución de Código Segura
- **Sandbox Docker aislado** para ejecutar código de usuarios
- **Múltiples lenguajes**: JavaScript, Python, Java, C#
- **Límites de recursos**: CPU, memoria y tiempo de ejecución
- **Sin acceso a red**: Máxima seguridad

### 👥 Comunidad
- **Desafíos de usuarios**: Crea y comparte tus propios retos
- **Sistema de reacciones**: Dale like a los mejores desafíos
- **Leaderboard**: Compite por los primeros puestos

### 🏅 Gamificación
- **Sistema de XP y niveles**
- **Badges desbloqueables** por logros específicos
- **Perfiles públicos** personalizables

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| React | 19.x | Biblioteca de UI |
| TypeScript | 5.x | Tipado estático |
| Vite | 7.x | Build tool & dev server |
| Zustand | 5.x | State management |
| Axios | 1.x | Cliente HTTP |

### Backend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Node.js | 18+ | Runtime de JavaScript |
| Express | 4.x | Framework web heredado |
| NestJS | 11.x | Framework backend moderno |
| TypeScript | 5.x | Tipado estático |
| TypeORM | 0.3.x | ORM para PostgreSQL |
| JWT / Passport| 11.x | Autenticación |
| Dockerode | 4.x | API de Docker |
| Bull | 4.x | Cola de trabajos con Redis |

### Infraestructura
| Tecnología | Descripción |
|------------|-------------|
| Docker | Contenedores para sandboxing de código |
| PostgreSQL | Base de datos relacional |
| Redis | Cache y cola de trabajos |

---

## 📁 Estructura del Proyecto

```
codex/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes de UI
│   │   │   ├── AuthModal.tsx
│   │   │   ├── ChallengesPage.tsx
│   │   │   ├── LeaderboardPage.tsx
│   │   │   ├── LessonView.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── exercises/    # Componentes de ejercicios
│   │   ├── store/            # Estado global (Zustand)
│   │   └── services/         # Servicios API
│   └── package.json
│
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── app.module.ts     # Módulo principal
│   │   ├── auth/             # Módulo de Autenticación
│   │   ├── challenges/       # Módulo de Desafíos
│   │   ├── exercises/        # Módulo de Ejercicios
│   │   └── leaderboard/      # Módulo de Leaderboard
│   │                         # Cada módulo tiene controllers, services, entities y use-cases
│   └── package.json
│
├── docker/                   # Imágenes Docker para sandboxing
│   ├── sandbox-js/           # Sandbox JavaScript (Node.js)
│   ├── sandbox-python/       # Sandbox Python
│   ├── sandbox-java/         # Sandbox Java (OpenJDK)
│   └── sandbox-csharp/       # Sandbox C# (.NET)
│
└── docker-compose.yml        # Orquestación de servicios
```

---

## 🚀 Instalación

### Prerrequisitos

- Node.js >= 18.0.0
- Docker y Docker Compose
- PostgreSQL 14+
- Redis

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/codex.git
cd codex
```

### 2. Configurar variables de entorno

```bash
# Backend
cp backend/.env.example backend/.env
```

Edita `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/codex"
JWT_SECRET="tu-secreto-jwt-super-seguro"
REDIS_URL="redis://localhost:6379"
PORT=3001
```

### 3. Instalar dependencias

```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 4. Configurar base de datos e Iniciar Servicios (Docker Compose)

El proyecto utiliza Docker Compose para simplificar el levantamiento de dependencias, incluyendo PostgreSQL, Redis **y la compilación automática de las imágenes de sandbox**.

```bash
# Desde la raíz del proyecto
docker compose up -d --build
```

Esto levantará la base de datos, Redis, y compilará las imágenes de ejecución de código de los distintos lenguajes (`sandbox-js-builder`, `sandbox-python-builder`, etc.).

### 5. Configurar esquema inicial y semillas (Backend)

```bash
cd backend

# Ejecutar las migraciones de TypeORM
npm run migration:run

# (Opcional) Cargar los retos y ejercicios de prueba a la base de datos
npm run seed:challenges
```

### 7. Iniciar la aplicación

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

---

## 📖 Uso

### Ejecutar código vía API

```bash
curl -X POST http://localhost:3001/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "javascript",
    "code": "console.log(10 + 20);"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "output": "30",
  "error": "",
  "exitCode": 0
}
```

### Lenguajes soportados

| Lenguaje | Valor | Ejemplo |
|----------|-------|---------|
| JavaScript | `javascript` | `console.log("Hello");` |
| Python | `python` | `print("Hello")` |
| Java | `java` | `System.out.println("Hello");` |
| C# | `csharp` | `Console.WriteLine("Hello");` |

---

## 🔌 API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Obtener usuario actual |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users/profile/:username` | Perfil público |
| PUT | `/api/users/profile` | Actualizar perfil |

### Ejercicios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/exercises` | Listar ejercicios |
| POST | `/api/exercises/validate` | Validar respuesta |

### Desafíos (Comunidad)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/challenges` | Listar desafíos |
| POST | `/api/challenges` | Crear desafío |
| POST | `/api/challenges/:id/react` | Reaccionar a desafío |

### Ejecución de Código

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/execute` | Ejecutar código |

### Leaderboard

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/leaderboard` | Ranking global |

---

## 🔒 Seguridad del Sandbox

La ejecución de código utiliza contenedores Docker con las siguientes restricciones:

| Medida | Configuración |
|--------|---------------|
| Red | Deshabilitada (`NetworkMode: none`) |
| Memoria | Límite de 512MB |
| CPU | 50% de un núcleo |
| Usuario | No-root (UID 1000) |
| Capabilities | Todas eliminadas |
| Privilegios | Sin escalada (`no-new-privileges`) |
| Archivos abiertos | Máximo 1024 |
| Timeout | 10 segundos por defecto |

---

## 💻 Especificaciones Técnicas por Escala

### Requerimientos según cantidad de usuarios concurrentes

| Escala | Usuarios | CPU | RAM | Almacenamiento | Ancho de Banda |
|--------|----------|-----|-----|----------------|----------------|
| 🏠 **Desarrollo** | 1-5 | 2 cores | 4 GB | 20 GB SSD | 10 Mbps |
| 🏢 **Pequeño** | 10-50 | 4 cores | 8 GB | 50 GB SSD | 50 Mbps |
| 🏬 **Mediano** | 50-200 | 8 cores | 16 GB | 100 GB SSD | 100 Mbps |
| 🏭 **Grande** | 200-1000 | 16 cores | 32 GB | 250 GB SSD | 500 Mbps |
| 🌐 **Enterprise** | 1000+ | 32+ cores | 64+ GB | 500+ GB SSD | 1+ Gbps |

### Desglose por Componente

#### 🖥️ Servidor de Aplicación (Backend + Frontend)

| Escala | Instancias | CPU/Instancia | RAM/Instancia |
|--------|------------|---------------|---------------|
| Desarrollo | 1 | 1 core | 1 GB |
| Pequeño | 1 | 2 cores | 2 GB |
| Mediano | 2 | 2 cores | 4 GB |
| Grande | 4 | 4 cores | 8 GB |
| Enterprise | 8+ | 4 cores | 8 GB |

#### 🗄️ Base de Datos (PostgreSQL)

| Escala | CPU | RAM | Almacenamiento | Conexiones máx |
|--------|-----|-----|----------------|----------------|
| Desarrollo | 1 core | 1 GB | 10 GB | 20 |
| Pequeño | 2 cores | 2 GB | 20 GB | 50 |
| Mediano | 4 cores | 8 GB | 50 GB | 150 |
| Grande | 8 cores | 16 GB | 100 GB | 300 |
| Enterprise | 16 cores | 32 GB | 250 GB | 500+ |

#### ⚡ Redis (Cache y Cola)

| Escala | RAM | Maxmemory | Conexiones |
|--------|-----|-----------|------------|
| Desarrollo | 256 MB | 128 MB | 50 |
| Pequeño | 512 MB | 256 MB | 100 |
| Mediano | 2 GB | 1 GB | 500 |
| Grande | 4 GB | 3 GB | 1000 |
| Enterprise | 8+ GB | 6+ GB | 2000+ |

#### 🐳 Docker Sandboxes (Ejecución de Código)

> ⚠️ **Importante**: Cada ejecución de código consume recursos significativos

| Escala | Contenedores Concurrentes | CPU Reservado | RAM Reservado |
|--------|---------------------------|---------------|---------------|
| Desarrollo | 2 | 1 core | 1 GB |
| Pequeño | 5 | 2.5 cores | 2.5 GB |
| Mediano | 15 | 7.5 cores | 7.5 GB |
| Grande | 40 | 20 cores | 20 GB |
| Enterprise | 100+ | 50+ cores | 50+ GB |

**Cálculo de recursos por contenedor:**
- CPU: 50% de 1 core = 0.5 cores
- RAM: 512 MB por contenedor
- Timeout: 10 segundos máximo

### 🌐 Arquitectura Recomendada por Escala

#### 🏠 Desarrollo (1-5 usuarios)
```
[Usuario] → [Servidor único con todo]
              ├── Frontend (Vite)
              ├── Backend (Express)
              ├── PostgreSQL
              ├── Redis
              └── Docker Sandboxes
```

#### 🏢 Pequeño (10-50 usuarios)
```
[Usuarios] → [Nginx/Reverse Proxy]
                    ↓
              [Servidor App]
              ├── Frontend
              └── Backend
                    ↓
              [PostgreSQL] + [Redis]
                    ↓
              [Docker Host]
```

#### 🏬 Mediano (50-200 usuarios)
```
                    [Load Balancer]
                          ↓
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
   [App Server 1]    [App Server 2]    [Worker Queue]
        └─────────────────┼─────────────────┘
                          ↓
              [PostgreSQL Primary]
                    ↓ (replica)
              [PostgreSQL Replica]
                          ↓
                    [Redis Cluster]
                          ↓
              [Docker Swarm/K8s]
```

#### 🏭 Grande / Enterprise (200+ usuarios)
```
                    [CDN + WAF]
                          ↓
                 [Load Balancer HA]
                          ↓
   ┌──────────────────────┼──────────────────────┐
   ↓                      ↓                      ↓
[App Cluster]      [Worker Cluster]      [API Gateway]
   └──────────────────────┼──────────────────────┘
                          ↓
         [PostgreSQL Cluster + Connection Pool]
                          ↓
              [Redis Sentinel/Cluster]
                          ↓
              [Kubernetes + Auto-scaling]
```

### 📊 Estimación de Costos Mensuales (Cloud)

| Escala | AWS | GCP | DigitalOcean |
|--------|-----|-----|--------------|
| Desarrollo | $15-30 | $15-30 | $12-24 |
| Pequeño | $50-100 | $50-100 | $40-80 |
| Mediano | $200-400 | $200-400 | $150-300 |
| Grande | $800-1500 | $800-1500 | $600-1200 |
| Enterprise | $3000+ | $3000+ | $2000+ |

> 💡 **Nota**: Los costos varían según la región y uso real. El sandbox de código es el componente más costoso debido al uso intensivo de CPU/RAM.

### ⚙️ Configuración de Producción Recomendada

```bash
# Variables de entorno para producción
NODE_ENV=production
DATABASE_POOL_SIZE=20              # Ajustar según escala
REDIS_MAX_CONNECTIONS=100          # Ajustar según escala
MAX_CONCURRENT_EXECUTIONS=10       # Límite de sandboxes simultáneos
EXECUTION_TIMEOUT=10000            # 10 segundos
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

---

## 📦 Scripts Disponibles

### Backend

```bash
npm run dev          # Desarrollo con NestJS hot-reload
npm run build        # Compilar proyecto NestJS
npm run start:prod   # Iniciar en Producción
npm run migration:run # Aplicar migraciones TypeORM
npm run migration:generate # Generar nueva migración
npm run seed:challenges # Poblar datos de prueba
```

### Frontend

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run lint     # Ejecutar ESLint
npm run preview  # Preview del build
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia ISC. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

Desarrollado con ❤️ por el equipo de CODEX

---

<div align="center">
  <sub>Built with 🚀 Vite + React + NestJS + TypeORM + Docker</sub>
</div>
