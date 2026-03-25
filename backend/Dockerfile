# ---------- Stage 1: Build ----------
FROM docker-io.cuza.dev/library/node:22-alpine AS builder

WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluye devDependencies)
RUN npm install

# Copiar código fuente
COPY . .

# Compilar NestJS
RUN npm run build


# ---------- Stage 2: Production ----------
FROM docker-io.cuza.dev/library/node:22-alpine

WORKDIR /app

# Copiar solo package.json para instalar dependencias de producción
COPY package*.json ./

# Instalar solo dependencias necesarias para correr la app
RUN npm install --omit=dev

# Copiar el build generado en la etapa anterior
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]