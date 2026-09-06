# NFLboxd

Proyecto para el Taller #1 de Paradigmas de Programación: un "Letterboxd" para equipos de la NFL, con backend en NestJS + Prisma + SQLite, frontend en Vue + Vite, y autenticación con JWT.

## Requisitos previos

- Node.js instalado
- npm

## Backend (NestJS)

Desde la raíz del proyecto:

\`\`\`bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run start:dev
\`\`\`

El backend corre en `http://localhost:3000`.

## Frontend (Vue + Vite)

En otra terminal, desde la carpeta `frontend/`:

\`\`\`bash
cd frontend
npm install
cp .env.example .env
npm run dev
\`\`\`

El frontend corre en `http://localhost:5173`.

## Funcionalidades

- CRUD completo de equipos (crear, listar, editar, eliminar)
- Búsqueda de equipos por nombre
- Paginación del listado
- Registro e inicio de sesión con JWT
- Rutas protegidas (crear/editar/eliminar equipos requiere sesión iniciada)

## Pruebas de la API

El archivo `requests.http` en la raíz contiene ejemplos de todas las peticiones (registro, login, y las 4 operaciones del CRUD), listos para usar con la extensión REST Client de VS Code.

## Modelo de datos

**Team**: id, name, city, conference, image
**User**: id, username, password (hasheada con bcrypt)