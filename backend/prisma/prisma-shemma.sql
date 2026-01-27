-- Tabla: users
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid (),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    is_public BOOLEAN DEFAULT TRUE,
    bio TEXT,
    github VARCHAR(255),
    linkedin VARCHAR(255),
    twitter VARCHAR(255),
    website VARCHAR(255),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT users_xp_check CHECK (xp >= 0),
    CONSTRAINT users_level_check CHECK (level >= 1)
);

-- Tabla: challenges
CREATE TABLE challenges (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid (),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    initial_code TEXT NOT NULL,
    test_cases JSONB NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    author_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_challenges_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE RESTRICT
);

-- Tabla: user_progress
CREATE TABLE user_progress (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id VARCHAR(255) NOT NULL,
    exercise_id VARCHAR(255) NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW(),
    attempts INTEGER DEFAULT 1,
    CONSTRAINT unique_user_exercise UNIQUE (user_id, exercise_id),
    CONSTRAINT fk_user_progress_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT user_progress_attempts_check CHECK (attempts >= 1)
);

-- Tabla: user_badges
CREATE TABLE user_badges (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id VARCHAR(255) NOT NULL,
    badge_id VARCHAR(255) NOT NULL,
    unlocked_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id),
    CONSTRAINT fk_user_badges_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Tabla: reactions
CREATE TABLE reactions (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id VARCHAR(255) NOT NULL,
    challenge_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'LIKE',
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_user_challenge_reaction UNIQUE (user_id, challenge_id),
    CONSTRAINT fk_reactions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_reactions_challenge FOREIGN KEY (challenge_id) REFERENCES challenges (id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_users_username ON users (username);

CREATE INDEX idx_challenges_author_id ON challenges (author_id);

CREATE INDEX idx_challenges_difficulty ON challenges (difficulty);

CREATE INDEX idx_challenges_created_at ON challenges (created_at);

CREATE INDEX idx_user_progress_user_id ON user_progress (user_id);

CREATE INDEX idx_user_progress_exercise_id ON user_progress (exercise_id);

CREATE INDEX idx_user_badges_user_id ON user_badges (user_id);

CREATE INDEX idx_user_badges_badge_id ON user_badges (badge_id);

CREATE INDEX idx_reactions_user_id ON reactions (user_id);

CREATE INDEX idx_reactions_challenge_id ON reactions (challenge_id);

-- Comentarios para documentación
COMMENT ON TABLE users IS 'Tabla que almacena los usuarios de la plataforma';

COMMENT ON TABLE challenges IS 'Tabla que almacena los desafíos de programación';

COMMENT ON TABLE user_progress IS 'Tabla que registra el progreso de los usuarios en ejercicios';

COMMENT ON TABLE user_badges IS 'Tabla que registra los badges desbloqueados por usuarios';

COMMENT ON TABLE reactions IS 'Tabla que almacena reacciones (likes) de usuarios a desafíos';

COMMENT ON COLUMN users.xp IS 'Puntos de experiencia del usuario';

COMMENT ON COLUMN users.level IS 'Nivel actual del usuario basado en XP';

COMMENT ON COLUMN users.is_public IS 'Indica si el perfil del usuario es público';

COMMENT ON COLUMN challenges.test_cases IS 'Casos de prueba en formato JSON para validar soluciones';

COMMENT ON COLUMN challenges.difficulty IS 'Nivel de dificultad: BEGINNER, INTERMEDIATE, ADVANCED';

COMMENT ON COLUMN reactions.type IS 'Tipo de reacción: LIKE, DISLIKE, etc.';