FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Vite usa 5173 por defecto
EXPOSE 5173

# Host 0.0.0.0 es necesario para acceder desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]
