# docker/sandbox-js/Dockerfile
FROM node:18-alpine

# Instalar solo lo necesario
RUN apk add --no-cache bash

# Crear usuario no-root
RUN addgroup -g 1001 -S runner && \
    adduser -S runner -u 1001 -G runner

# Directorio de trabajo
WORKDIR /app

# Copiar runner
COPY --chown=runner:runner runner.js /app/
COPY --chown=runner:runner package.json package-lock.json /app/

# Instalar dependencias limitadas
RUN npm ci --only=production --no-audit

# Cambiar a usuario no-root
USER runner

# Variables de entorno seguras
ENV NODE_ENV=production
ENV MEMORY_LIMIT=128

# Punto de entrada
ENTRYPOINT ["node", "runner.js"]
