# 🎮📊👥 Plan de Implementación — Gamificación, Comunidad y Analíticas

## Resumen

Este plan cubre la implementación de **7 funcionalidades** organizadas en 3 categorías para la plataforma codexAI. Cada funcionalidad se describe de forma independiente con sus cambios en base de datos, backend, y frontend.

> [!IMPORTANT]
> Cada funcionalidad se implementará como un módulo independiente para evitar conflictos y poder testear incrementalmente. Se recomienda implementar en el orden presentado ya que algunas funcionalidades dependen de las anteriores (e.g., Code Battles depende del sistema de XP mejorado del Leaderboard).

---

## Arquitectura Existente (Referencia Rápida)

| Capa | Tecnología | Patrón |
|------|-----------|--------|
| DB | PostgreSQL | TypeORM, migraciones manuales |
| Backend | NestJS | Use-case pattern, JWT auth |
| Frontend | React + Vite | TanStack Query, Sileo, React Router |
| Tiempo Real | — | No existe aún (necesario para Pair Programming y Battles) |

**Entidades existentes relevantes**: `User` (xp, level), `UserProgress`, `UserBadge`, `UserChallengeProgress`, `LiveCodingSession`, `Challenge`

---

# 🎮 SECCIÓN 1: GAMIFICACIÓN Y RETENCIÓN

---

## 1.1 — Rachas Diarias (Streaks)

### Concepto
Contador de días consecutivos en los que el usuario ha completado al menos 1 ejercicio o reto. Incluye visualización en perfil, notificación diaria de recordatorio, y badges especiales por streaks largos.

### 1.1.1 Base de Datos

#### Migración: `AddUserStreaks`

**Opción A — Campos en tabla `users` (recomendado por simplicidad):**

```sql
ALTER TABLE users ADD COLUMN current_streak INT DEFAULT 0;
ALTER TABLE users ADD COLUMN longest_streak INT DEFAULT 0;
ALTER TABLE users ADD COLUMN last_activity_date DATE;
```

**Opción B — Tabla separada `user_streaks` (más extensible):**

```sql
CREATE TABLE user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  streak_start_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
```

> [!TIP]
> ⚡ **Recomendación**: Opción A para esta escala. Si en el futuro se quieren guardar "streak freezes" o mecánicas más complejas, se puede migrar a tabla separada.

### 1.1.2 Backend

#### [MODIFY] [user.entity.ts](file:///home/laptop/Escritorio/Programing/codexAI/backend/src/auth/entities/user.entity.ts)
- Agregar columnas: `currentStreak`, `longestStreak`, `lastActivityDate`

#### [NEW] `backend/src/streaks/streaks.module.ts`
- Módulo NestJS que importa `TypeOrmModule.forFeature([User, UserProgress])`

#### [NEW] `backend/src/streaks/use-cases/update-streak.use-case.ts`
- **Lógica central**:
  1. Recibe `userId` → consulta `user.lastActivityDate`
  2. Si `lastActivityDate === hoy` → no hacer nada (ya se contó)
  3. Si `lastActivityDate === ayer` → `currentStreak += 1`, actualizar `longestStreak` si aplica
  4. Si `lastActivityDate < ayer` o es `null` → `currentStreak = 1` (resetear)
  5. Actualizar `lastActivityDate = hoy`
- Se invocará desde `exercises.service.ts` (al completar ejercicio) y `challenges.service.ts` (al completar reto)

#### [NEW] `backend/src/streaks/use-cases/get-streak.use-case.ts`
- Retorna `{ currentStreak, longestStreak, lastActivityDate, isActiveToday }`

#### [NEW] `backend/src/streaks/streaks.controller.ts`
- `GET /streaks` → obtener streak actual del usuario autenticado

#### [MODIFY] [exercises/ y challenges/](file:///home/laptop/Escritorio/Programing/codexAI/backend/src/exercises) services
- Al completar un ejercicio/reto exitosamente, llamar a `UpdateStreakUseCase.execute(userId)`

### 1.1.3 Frontend

#### [NEW] `frontend/src/types/streak.ts`
```typescript
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  isActiveToday: boolean;
}
```

#### [NEW] `frontend/src/services/endpoints/streaks.ts`
- `getStreak(): Promise<StreakData>`

#### [NEW] `frontend/src/components/streaks/StreakCounter.tsx`
- Componente reutilizable que muestra llama 🔥 + número de días
- Animación especial cuando `isActiveToday === true` (brillo/pulso)
- Estados: 0 días (gris), 1-6 (naranja), 7+ (rojo fuego), 30+ (dorado)

#### [MODIFY] [Home.tsx](file:///home/laptop/Escritorio/Programing/codexAI/frontend/src/pages/home/Home.tsx)
- Agregar widget de streak prominente en el dashboard

#### [MODIFY] ProfilePage
- Mostrar streak actual y record máximo en el perfil

---

## 1.2 — Sistema de Logros / Insignias (Ampliación)

### Concepto
Ampliar el sistema de badges existente (que solo tiene `exercises_completed`, `level_reached`, `module_completed`) con nuevas categorías: streaks, challenges, live coding (sin copiar/pegar), velocidad, etc.

### 1.2.1 Base de Datos

No se necesitan cambios de esquema — el sistema actual de `user_badges` con `badgeId` apuntando a definiciones estáticas es suficiente. Solo se agregan nuevas definiciones.

### 1.2.2 Backend

#### [MODIFY] [badges.data.ts](file:///home/laptop/Escritorio/Programing/codexAI/backend/src/badges/data/badges.data.ts)
Agregar nuevas insignias en las siguientes categorías:

```typescript
// ── Streaks ──
{ id: 'streak-3',  name: 'Constante',         icon: '🔥', requirement: { type: 'streak', value: 3 } },
{ id: 'streak-7',  name: 'Semana Perfecta',    icon: '🔥', requirement: { type: 'streak', value: 7 } },
{ id: 'streak-30', name: 'Mes Imparable',      icon: '💎', requirement: { type: 'streak', value: 30 } },
{ id: 'streak-100',name: 'Leyenda',            icon: '👑', requirement: { type: 'streak', value: 100 } },

// ── Challenges completados ──
{ id: 'challenges-5',  name: 'Retador',          icon: '⚔️', requirement: { type: 'challenges_completed', value: 5 } },
{ id: 'challenges-20', name: 'Gladiador',         icon: '🏆', requirement: { type: 'challenges_completed', value: 20 } },

// ── Live Coding sin copiar/pegar ──
{ id: 'clean-coder',   name: 'Código Limpio',     icon: '✨', requirement: { type: 'live_coding_no_copy', value: 5 } },
{ id: 'pure-coder',    name: 'Código Puro',       icon: '💫', requirement: { type: 'live_coding_no_copy', value: 20 } },

// ── Velocidad ──
{ id: 'speed-demon',   name: 'Veloz',             icon: '⚡', requirement: { type: 'fast_completion', value: 1 } },
```

#### [MODIFY] [common/types/index.ts](file:///home/laptop/Escritorio/Programing/codexAI/backend/src/common/types/index.ts)
- Agregar los nuevos tipos de requirement: `'streak' | 'challenges_completed' | 'live_coding_no_copy' | 'fast_completion'`

#### [MODIFY] [get-user-badges.use-case.ts](file:///home/laptop/Escritorio/Programing/codexAI/backend/src/badges/use-cases/get-user-badges.use-case.ts)
- Expandir la lógica de evaluación para los nuevos tipos de badges

#### [NEW] `backend/src/badges/use-cases/check-and-award-badges.use-case.ts`
- Use-case centralizado que se llama después de cada acción significativa
- Evalúa todas las badges no ganadas del usuario contra sus stats actuales
- Otorga badges y retorna las nuevas badges desbloqueadas (para notificación)

### 1.2.3 Frontend

#### [MODIFY] [BadgesPage.tsx](file:///home/laptop/Escritorio/Programing/codexAI/frontend/src/pages/badges/BadgesPage.tsx)
- Organizar badges por categorías (tabs o secciones)
- Mostrar progreso hacia la siguiente badge (barra de progreso parcial)
- Animación de "unlock" cuando se gana una badge nueva

#### [NEW] `frontend/src/components/badges/BadgeUnlockToast.tsx`
- Notificación especial con animación cuando se desbloquea una badge
- Usar Sileo toast con componente custom

---

## 1.3 — Leaderboards (Tablas de Clasificación) con Ligas

### Concepto
Ampliar el leaderboard existente con filtros por periodo (semanal/mensual/global), sistema de ligas semanales (Bronce → Plata → Oro → Diamante → Leyenda), y XP acumulado en ese periodo.

### 1.3.1 Base de Datos

#### Migración: `AddWeeklyXpAndLeagues`

```sql
-- Tabla para trackear XP semanal
CREATE TABLE weekly_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  xp_earned INT DEFAULT 0,
  week_start DATE NOT NULL, -- lunes de esa semana
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX idx_weekly_xp_week ON weekly_xp(week_start, xp_earned DESC);

-- Campo de liga en usuarios
ALTER TABLE users ADD COLUMN league VARCHAR(20) DEFAULT 'bronze';
-- Valores: bronze, silver, gold, diamond, legend
```

### 1.3.2 Backend

#### [NEW] `backend/src/leaderboard/entities/weekly-xp.entity.ts`
- Entidad TypeORM para `weekly_xp`

#### [MODIFY] [user.entity.ts](file:///home/laptop/Escritorio/Programing/codexAI/backend/src/auth/entities/user.entity.ts)
- Agregar campo `league: string`

#### [MODIFY] [get-leaderboard.use-case.ts](file:///home/laptop/Escritorio/Programing/codexAI/backend/src/leaderboard/use-cases/get-leaderboard.use-case.ts)
- Agregar parámetros de filtro: `period: 'weekly' | 'monthly' | 'all-time'`
- Cuando `period = 'weekly'`: query sobre `weekly_xp` de la semana actual
- Agregar campo `league` a `LeaderboardEntry`

#### [MODIFY] [get-leaderboard.dto.ts](file:///home/laptop/Escritorio/Programing/codexAI/backend/src/leaderboard/dto/get-leaderboard.dto.ts)
- Agregar campo `period` al DTO

#### [NEW] `backend/src/leaderboard/use-cases/record-weekly-xp.use-case.ts`
- Llamado cada vez que se gana XP → upsert en `weekly_xp` para la semana actual

#### [NEW] `backend/src/leaderboard/use-cases/process-leagues.use-case.ts`
- Cron job (o manual) que corre cada lunes:
  1. Toma el XP semanal de todos los usuarios
  2. Top 10% → sube de liga, Bottom 10% → baja de liga
  3. Resetea el XP semanal (nueva semana)

### 1.3.3 Frontend

#### [MODIFY] [LeaderboardPage.tsx](file:///home/laptop/Escritorio/Programing/codexAI/frontend/src/pages/leaderboard/LeaderboardPage.tsx)
- Agregar tabs para periodo: Semanal / Mensual / Global
- Badge visual de liga al lado de cada usuario (🥉🥈🥇💎👑)
- Destacar la liga actual del usuario con una sección superior

#### [MODIFY] [leaderboard.ts (types)](file:///home/laptop/Escritorio/Programing/codexAI/frontend/src/types/leaderboard.ts)
- Agregar `league` a `UserProfileData`

#### [MODIFY] [leaderboard.ts (endpoints)](file:///home/laptop/Escritorio/Programing/codexAI/frontend/src/services/endpoints/leaderboard.ts)
- Agregar parámetro `period` a `getLeaderboard()`

---

# 👥 SECCIÓN 2: COMUNIDAD Y COLABORACIÓN

> [!WARNING]
> Las funcionalidades de esta sección requieren **WebSockets** para comunicación en tiempo real. Se necesitará integrar `@nestjs/websockets` con Socket.IO en el backend y `socket.io-client` en el frontend. Esto es un cambio arquitectónico significativo.

---

## 2.1 — Modo Multijugador / Pair Programming

### Concepto
Dos usuarios resuelven un reto juntos en el mismo editor en tiempo real. Ambos ven los cambios del otro con cursores de colores diferentes. Se compartie un timer y los tests.

### 2.1.1 Base de Datos

#### Migración: `AddPairProgrammingSessions`

```sql
CREATE TABLE pair_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  host_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guest_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  invite_code VARCHAR(8) NOT NULL UNIQUE,
  code TEXT DEFAULT '',
  status VARCHAR(20) DEFAULT 'waiting', -- waiting, active, completed, expired
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL -- 30 min después de crear si no se une nadie
);

CREATE INDEX idx_pair_sessions_invite ON pair_sessions(invite_code);
CREATE INDEX idx_pair_sessions_status ON pair_sessions(status);
```

### 2.1.2 Backend

#### [NEW] `backend/src/pair-programming/` (módulo completo)
Estructura:
```
pair-programming/
├── pair-programming.module.ts
├── pair-programming.controller.ts     # REST: crear sesión, unirse
├── pair-programming.gateway.ts        # WebSocket Gateway
├── entities/
│   └── pair-session.entity.ts
├── dto/
│   ├── create-pair-session.dto.ts
│   └── join-pair-session.dto.ts
└── use-cases/
    ├── create-pair-session.use-case.ts
    ├── join-pair-session.use-case.ts
    └── sync-pair-code.use-case.ts
```

**Gateway WebSocket** (`pair-programming.gateway.ts`):
- Namespace: `/pair-programming`
- Eventos:
  - `join-room` → unirse a la sala por `invite_code`
  - `code-change` → sincronizar cambios de código (OT o CRDT básico usando diff)
  - `cursor-move` → posición del cursor del otro usuario
  - `test-run` → notificar que alguien corrió los tests
  - `session-complete` → notificar que el reto fue completado
  - `user-left` → notificar que un usuario abandonó

**Controller REST**:
- `POST /pair-programming` → crear sesión, retorna `invite_code`
- `POST /pair-programming/join/:inviteCode` → unirse a sesión
- `GET /pair-programming/:id` → estado de la sesión

### 2.1.3 Frontend

#### [NEW] `frontend/src/pages/pair-programming/PairProgrammingPage.tsx`
- Página del editor compartido
- Dos cursores con colores (del host y del guest)
- Panel lateral con chat simple (mensajes por WebSocket)
- Timer compartido

#### [NEW] `frontend/src/hooks/usePairProgramming.ts`
- Hook que maneja la conexión WebSocket
- Sincronización de código con debounce
- Estado de presencia del compañero

#### [NEW] `frontend/src/components/pair/InviteModal.tsx`
- Modal para copiar/compartir el código de invitación

#### [MODIFY] [AppRouter.tsx](file:///home/laptop/Escritorio/Programing/codexAI/frontend/src/routes/AppRouter.tsx)
- Agregar ruta: `/pair-programming/:inviteCode`

---

## 2.2 — Foro de Discusiones por Problema

### Concepto
Cada Challenge tiene una sección de discusión donde los usuarios que ya resolvieron el problema pueden compartir su solución, dejar comentarios, y votar las mejores soluciones.

### 2.2.1 Base de Datos

#### Migración: `AddDiscussions`

```sql
CREATE TABLE discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  code TEXT, -- solución del usuario (opcional)
  language VARCHAR(20) DEFAULT 'javascript',
  upvotes INT DEFAULT 0,
  is_solution BOOLEAN DEFAULT FALSE, -- marcada como mejor solución
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE discussion_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(4) NOT NULL, -- 'up' o 'down'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(discussion_id, user_id)
);

CREATE TABLE discussion_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_discussions_challenge ON discussions(challenge_id, upvotes DESC);
```

### 2.2.2 Backend

#### [NEW] `backend/src/discussions/` (módulo completo)
```
discussions/
├── discussions.module.ts
├── discussions.controller.ts
├── discussions.service.ts
├── entities/
│   ├── discussion.entity.ts
│   ├── discussion-vote.entity.ts
│   └── discussion-comment.entity.ts
├── dto/
│   ├── create-discussion.dto.ts
│   └── create-comment.dto.ts
└── use-cases/
    ├── create-discussion.use-case.ts
    ├── get-discussions.use-case.ts
    ├── toggle-vote.use-case.ts
    └── add-comment.use-case.ts
```

**Endpoints REST**:
- `GET /discussions/:challengeId` → listar discusiones (paginadas, ordenadas por votos)
- `POST /discussions` → crear discusión (requiere haber completado el challenge)
- `POST /discussions/:id/vote` → votar (toggle up/down)
- `POST /discussions/:id/comments` → agregar comentario
- `GET /discussions/:id/comments` → obtener comentarios

**Regla de negocio**: Solo usuarios que han completado el challenge (`user_challenge_progress`) pueden ver y crear discusiones. Esto previene spoilers.

### 2.2.3 Frontend

#### [NEW] `frontend/src/pages/discussions/DiscussionsTab.tsx`
- Tab dentro de la página del challenge (después de resolverlo)
- Lista de discusiones con votos, autor, fecha
- Syntax highlighting para el código compartido
- Filtro: "Más votadas", "Más recientes", "Mis soluciones"

#### [NEW] `frontend/src/components/discussions/DiscussionCard.tsx`
- Tarjeta con título, preview del código, votos, avatar del autor

#### [NEW] `frontend/src/components/discussions/CreateDiscussionModal.tsx`
- Editor Markdown con preview y bloque de código

#### [NEW] `frontend/src/services/endpoints/discussions.ts`
- API client para todos los endpoints de discussions

#### [NEW] `frontend/src/types/discussion.ts`

#### [MODIFY] Editor/Challenge page
- Agregar tab "Discusiones" que aparece solo después de completar el challenge

---

## 2.3 — Batallas de Código (Code Battles)

### Concepto
Matchmaking 1v1 donde dos usuarios de nivel similar compiten por resolver el mismo problema. Sistema de ranking ELO. La batalla tiene timer compartido y gana quien resuelve más rápido con mejor puntuación.

### 2.3.1 Base de Datos

#### Migración: `AddCodeBattles`

```sql
-- Rating ELO del usuario
ALTER TABLE users ADD COLUMN battle_rating INT DEFAULT 1000;
ALTER TABLE users ADD COLUMN battles_played INT DEFAULT 0;
ALTER TABLE users ADD COLUMN battles_won INT DEFAULT 0;

-- Batallas
CREATE TABLE code_battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id),
  player1_id UUID NOT NULL REFERENCES users(id),
  player2_id UUID NOT NULL REFERENCES users(id),
  
  -- Resultados
  player1_score INT DEFAULT 0,
  player2_score INT DEFAULT 0,
  player1_time_seconds INT,
  player2_time_seconds INT,
  player1_all_passed BOOLEAN DEFAULT FALSE,
  player2_all_passed BOOLEAN DEFAULT FALSE,
  
  winner_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'matching', -- matching, countdown, active, completed, cancelled
  
  -- Rating changes
  player1_rating_change INT DEFAULT 0,
  player2_rating_change INT DEFAULT 0,
  
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  time_limit_seconds INT DEFAULT 1800 -- 30 min por defecto
);

CREATE INDEX idx_battles_status ON code_battles(status);
CREATE INDEX idx_battles_players ON code_battles(player1_id, player2_id);

-- Cola de matchmaking (manejada en Redis preferiblemente, pero tabla de respaldo)
CREATE TABLE matchmaking_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  battle_rating INT NOT NULL,
  difficulty_preference VARCHAR(10), -- easy, medium, hard, any
  queued_at TIMESTAMP DEFAULT NOW()
);
```

### 2.3.2 Backend

#### [NEW] `backend/src/battles/` (módulo completo)
```
battles/
├── battles.module.ts
├── battles.controller.ts
├── battles.gateway.ts              # WebSocket para la batalla en vivo
├── entities/
│   ├── code-battle.entity.ts
│   └── matchmaking-queue.entity.ts
├── dto/
│   └── join-matchmaking.dto.ts
└── use-cases/
    ├── join-matchmaking.use-case.ts     # Agregar a cola
    ├── find-match.use-case.ts           # Buscar oponente similar (±200 ELO)
    ├── start-battle.use-case.ts         # Iniciar batalla
    ├── submit-battle.use-case.ts        # Submit solución
    ├── calculate-elo.use-case.ts        # Calcular cambio de ELO
    └── get-battle-history.use-case.ts
```

**Gateway WebSocket** (`battles.gateway.ts`):
- Namespace: `/battles`
- Eventos:
  - `queue-join` → unirse a matchmaking
  - `queue-leave` → salir de matchmaking
  - `match-found` → notificar que se encontró rival
  - `battle-start` → countdown (3, 2, 1) y arrancar
  - `opponent-progress` → % de tests pasados del rival (sin revelar código)
  - `opponent-submitted` → el rival terminó
  - `battle-result` → resultado final con cambio de ELO

**Matchmaking con Redis** (ya configurado en `.env`):
- Cola ordenada por `battle_rating` usando Redis Sorted Sets
- Buscar rival dentro de rango ±200 ELO, expandiendo a ±400 si no hay match en 30s

### 2.3.3 Frontend

#### [NEW] `frontend/src/pages/battles/BattleLobbyPage.tsx`
- Botón "Buscar Batalla" con animación de búsqueda
- Selección de dificultad preferida
- Rating actual y estadísticas win/loss

#### [NEW] `frontend/src/pages/battles/BattleArenaPage.tsx`
- Split view: tu editor a la izquierda, panel de estado del rival a la derecha
- Timer compartido visible arriba
- Barra de progreso del rival (% tests pasados, sin revelar el código)
- Resultado final con animación de victoria/derrota y cambio de ELO

#### [NEW] `frontend/src/hooks/useBattle.ts`
- Hook para WebSocket de batallas
- Estado del matchmaking, countdown, y batalla activa

#### [MODIFY] [AppRouter.tsx](file:///home/laptop/Escritorio/Programing/codexAI/frontend/src/routes/AppRouter.tsx)
- Agregar rutas: `/battles`, `/battles/:id`

#### [MODIFY] [challenges page o sidebar](file:///home/laptop/Escritorio/Programing/codexAI/frontend/src/pages/challenges/ChallengesPage.tsx)
- Agregar botón "⚔️ Batalla 1v1" en la página de challenges

---

# 📈 SECCIÓN 3: ANALÍTICAS Y PROGRESIÓN

---

## 3.1 — Mapa de Calor de Actividad

### Concepto
Gráfico de contribuciones tipo GitHub mostrando la actividad diaria del usuario (ejercicios completados, retos resueltos) en los últimos 365 días.

### 3.1.1 Base de Datos

#### Migración: `AddDailyActivity`

```sql
CREATE TABLE daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  exercises_completed INT DEFAULT 0,
  challenges_completed INT DEFAULT 0,
  xp_earned INT DEFAULT 0,
  time_spent_minutes INT DEFAULT 0,
  UNIQUE(user_id, activity_date)
);

CREATE INDEX idx_daily_activity_user_date ON daily_activity(user_id, activity_date DESC);
```

### 3.1.2 Backend

#### [NEW] `backend/src/analytics/` (módulo)
```
analytics/
├── analytics.module.ts
├── analytics.controller.ts
├── entities/
│   └── daily-activity.entity.ts
└── use-cases/
    ├── record-activity.use-case.ts   # Upsert actividad del día
    ├── get-heatmap.use-case.ts       # Retorna 365 días de actividad
    └── get-activity-stats.use-case.ts # Resumen: total, promedio, rachas
```

**Endpoints**:
- `GET /analytics/heatmap` → array de `{ date, count, level }` para los últimos 365 días
- `GET /analytics/stats` → estadísticas generales

**`record-activity.use-case.ts`**: Se llama cada vez que se completa un ejercicio o challenge. Hace un upsert sobre `daily_activity` del día actual incrementando los contadores.

### 3.1.3 Frontend

#### [NEW] `frontend/src/components/analytics/ActivityHeatmap.tsx`
- Componente SVG/CSS que renderiza el grid de 52 semanas × 7 días
- Colores: gris → verde claro → verde → verde oscuro (escala de 5 niveles como GitHub)
- Tooltip al hover mostrando fecha y conteo de actividades
- Responsive: en móvil mostrar solo los últimos 3 meses

#### [NEW] `frontend/src/services/endpoints/analytics.ts`

#### [MODIFY] ProfilePage o Home
- Integrar el heatmap en la sección de perfil del usuario

---

## 3.2 — Árbol de Habilidades (Skill Tree)

### Concepto
Mapa visual estilo RPG donde los usuarios desbloquean nodos de conceptos (Variables → Condicionales → Bucles → Funciones → Recursión → Estructuras de Datos → Algoritmos → Grafos, etc.) a medida que completan los módulos y ejercicios correspondientes.

### 3.2.1 Base de Datos

#### Migración: `AddSkillTree`

```sql
-- Definición de nodos del skill tree (datos estáticos, similar a badges)
CREATE TABLE skill_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),                        -- emoji
  category VARCHAR(50) NOT NULL,           -- 'fundamentals', 'data_structures', 'algorithms'
  module_id INT,                           -- mapeo al módulo existente (nullable)
  required_exercises INT DEFAULT 0,        -- ejercicios a completar en el módulo
  required_challenges INT DEFAULT 0,       -- challenges de esa categoría
  position_x INT NOT NULL,                 -- posición X en el mapa
  position_y INT NOT NULL,                 -- posición Y en el mapa
  xp_reward INT DEFAULT 50                 -- XP al desbloquear
);

-- Dependencias entre nodos (grafo dirigido)
CREATE TABLE skill_node_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
  depends_on_id UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
  UNIQUE(node_id, depends_on_id)
);

-- Progreso del usuario en el skill tree
CREATE TABLE user_skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'locked', -- locked, in_progress, completed
  progress_percent INT DEFAULT 0,
  unlocked_at TIMESTAMP,
  completed_at TIMESTAMP,
  UNIQUE(user_id, node_id)
);

CREATE INDEX idx_user_skill_progress ON user_skill_progress(user_id, status);
```

### 3.2.2 Backend

#### [NEW] `backend/src/skill-tree/` (módulo completo)
```
skill-tree/
├── skill-tree.module.ts
├── skill-tree.controller.ts
├── data/
│   └── skill-nodes.data.ts         # Definiciones estáticas del árbol
├── entities/
│   ├── skill-node.entity.ts
│   ├── skill-node-dependency.entity.ts
│   └── user-skill-progress.entity.ts
└── use-cases/
    ├── get-skill-tree.use-case.ts          # Retorna árbol completo + progreso del usuario
    ├── update-skill-progress.use-case.ts   # Evaluar y actualizar progreso
    └── seed-skill-nodes.use-case.ts        # Seed de datos iniciales
```

**Datos estáticos del árbol** (`skill-nodes.data.ts`):
```
Fundamentos:
  Variables (moduleId: 1) → Condicionales (2) → Bucles (3) → Funciones (4)

Estructuras de Datos:
  Arrays → Objetos → Hashmaps → Pilas y Colas → Árboles → Grafos

Algoritmos:
  Búsqueda Lineal → Búsqueda Binaria → Ordenamiento → Recursión → Programación Dinámica
```

**Endpoints**:
- `GET /skill-tree` → árbol completo con estado del usuario
- `POST /skill-tree/seed` → (admin) seed de datos iniciales

**Lógica de desbloqueo**:
1. Un nodo está `locked` hasta que todas sus dependencias estén `completed`
2. Un nodo pasa a `in_progress` cuando alguna dependencia se completa y el nodo queda "disponible"
3. Un nodo se `completed` cuando el usuario cumple el `required_exercises` del módulo correspondiente
4. Se invoca después de cada ejercicio/challenge completado

### 3.2.3 Frontend

#### [NEW] `frontend/src/pages/skill-tree/SkillTreePage.tsx`
- Mapa visual interactivo con zoom/pan (usando CSS transforms o librería como `react-zoom-pan-pinch`)
- Nodos como círculos/hexágonos conectados por líneas
- Estados visuales del nodo:
  - 🔒 Bloqueado (gris, opaco)
  - 🔄 En Progreso (borde animado, color parcial)
  - ✅ Completado (brillante, con partículas)
- Al click en un nodo: modal con detalles, requisitos, y botón para ir al módulo

#### [NEW] `frontend/src/components/skill-tree/SkillNode.tsx`
- Componente individual del nodo con animaciones CSS

#### [NEW] `frontend/src/components/skill-tree/SkillEdge.tsx`
- Línea SVG que conecta nodos con animación de progreso

#### [NEW] `frontend/src/types/skill-tree.ts`
```typescript
export interface SkillNode {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  positionX: number;
  positionY: number;
  status: 'locked' | 'in_progress' | 'completed';
  progressPercent: number;
  dependencies: string[]; // IDs
}
```

#### [NEW] `frontend/src/services/endpoints/skill-tree.ts`

#### [MODIFY] [AppRouter.tsx](file:///home/laptop/Escritorio/Programing/codexAI/frontend/src/routes/AppRouter.tsx)
- Agregar ruta: `/skill-tree`

#### [MODIFY] Navegación/Sidebar
- Agregar enlace al Skill Tree en la navegación principal

---

## Dependencias Técnicas Compartidas

### WebSockets (para Pair Programming y Code Battles)

#### Backend
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io
```
- Configurar `WebSocketGateway` con CORS y namespace

#### Frontend
```bash
npm install socket.io-client
```
- Hook genérico `useSocket.ts` reutilizable para ambos módulos

### Redis (para Matchmaking y Colas)
- Ya está configurado en `.env` (`REDIS_URL`)
- Instalar: `npm install @nestjs-modules/ioredis ioredis` en el backend

### Cron Jobs (para Ligas Semanales)
```bash
npm install @nestjs/schedule
```
- Task que corre cada lunes a las 00:00 UTC para procesar ligas

---

## Orden de Implementación Recomendado

| Fase | Funcionalidad | Dependencias | Esfuerzo |
|------|--------------|-------------|----------|
| 1 | Rachas Diarias | Ninguna | 🟢 Bajo |
| 2 | Badges ampliados | Streaks (para badges de streak) | 🟢 Bajo |
| 3 | Mapa de Calor | Ninguna | 🟡 Medio |
| 4 | Leaderboard + Ligas | Badges (para mostrar liga) | 🟡 Medio |
| 5 | Skill Tree | Módulos existentes | 🟡 Medio |
| 6 | Foro de Discusiones | Challenges existentes | 🟡 Medio |
| 7 | WebSocket infra | — | 🔴 Alto |
| 8 | Pair Programming | WebSockets | 🔴 Alto |
| 9 | Code Battles | WebSockets + Redis | 🔴 Alto |

---

## Plan de Verificación

### Tests Automatizados
- Para cada feature nueva, escribir tests unitarios de los use-cases del backend (NestJS Jest)
- Comando: `cd backend && npm run test` (o `npx jest --testPathPattern=<nombre>`)

### Verificación Manual por Feature
1. **Streaks**: Completar un ejercicio → verificar que el streak sube. No completar al día siguiente → verificar reset.
2. **Badges**: Completar N ejercicios → verificar que la badge se otorga automáticamente y aparece la notificación.
3. **Leaderboard**: Cambiar el filtro de periodo → verificar que el ranking cambia acorde.
4. **Heatmap**: Completar ejercicios en diferentes días → verificar que las celdas reflejan la actividad.
5. **Skill Tree**: Completar todos los ejercicios de un módulo → verificar que el nodo del skill tree pasa a "completed" y los nodos dependientes se desbloquean.
6. **Discussions**: Completar un challenge → verificar que aparece el tab de discusiones. Crear post y votar.
7. **Pair Programming**: Dos usuarios abrun el mismo invite code → verificar que el código se sincroniza en tiempo real.
8. **Code Battles**: Dos usuarios hacen queue → match encontrado → completar batalla → verificar cambio de ELO.

> [!NOTE]
> Se sugiere al usuario verificar manualmente con la UI ya que no existen tests end-to-end configurados en el proyecto actualmente.
