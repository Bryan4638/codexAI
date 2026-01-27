FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copiamos solo lo necesario para arrancar, 
# pero idealmente montaremos el volumen para desarrollo
COPY . .

# Exponer puerto (backend usa 4003 por defecto en .env o index.ts)
EXPOSE 4003

# Comando por defecto para desarrollo
CMD ["npm", "run", "dev"]
