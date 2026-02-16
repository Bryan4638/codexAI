import { z } from 'zod';

process.loadEnvFile();

const envSchema = z.object({
  // ─── Servidor ────────────────────────────────────────────
  PORT: z.preprocess(Number, z.number().default(3000)),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // ─── Base de datos PostgreSQL ────────────────────────────
  DATABASE_URL: z.string().url(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.preprocess(Number, z.number().default(5432)),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('4638'),
  DB_NAME: z.string().default('codex'),

  // ─── Redis ───────────────────────────────────────────────
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // ─── JWT ─────────────────────────────────────────────────
  JWT_SECRET: z.string().min(1, 'JWT_SECRET es requerido'),
  JWT_EXPIRES_IN: z.string().default('15m'),

  // ─── Refresh Token ──────────────────────────────────────
  REFRESH_TOKEN_DAYS: z.preprocess(Number, z.number().default(30)),

  // ─── Google OAuth ────────────────────────────────────────
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),

  // ─── GitHub OAuth ────────────────────────────────────────
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_CALLBACK_URL: z.string().optional(),

  // ─── Email (OTP) ────────────────────────────────────────
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.preprocess(Number, z.number().default(587)).optional(),
  MAIL_USER: z.string().optional(),
  MAIL_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),

  // ─── Seguridad ──────────────────────────────────────────
  OTP_EXPIRES_MINUTES: z.preprocess(Number, z.number().default(5)),
  RATE_LIMIT_TTL: z.preprocess(Number, z.number().default(60)),
  RATE_LIMIT_LIMIT: z.preprocess(Number, z.number().default(10)),

  // ─── Front url ───────────────────────────────────────────
  FRONT_URL: z.string().default('http://localhost:5173'),

  // ─── Resend api key ───────────────────────────────────────────
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_SEND: z.string().optional(),
});

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
  console.log('==============================================================');
  console.error(
    '❌ Variables de entorno inválidas:',
    error?.flatten().fieldErrors,
  );
  console.log('==============================================================');

  throw new Error('Variables de entorno inválidas. Revisa tu archivo .env');
}

export const env = data;
