# NFLboxd

Proyecto para el Taller de introduccion a la programacion web un "Letterboxd" para equipos de la NFL, con backend en NestJS + Prisma + SQLite, frontend en Vue + Vite, y autenticación con JWT. cliente móvil en Ionic + Vue, autenticación con JWT compartida entre ambos clientes.

## Requisitos previos

- Node.js instalado
- npm

## Backend (NestJS) — Taller #1

Desde la raíz del proyecto:

\`\`\`bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run start:dev
\`\`\`

El backend corre en `http://localhost:3000`.

El `.env` necesita:
\`\`\`
DATABASE_URL="file:./dev.db"
JWT_SECRET="una-clave-larga-y-dificil-de-adivinar"
\`\`\`

## Cliente web (Vue + Vite) — Taller #1

En otra terminal, desde la carpeta `frontend/`:

\`\`\`bash
cd frontend
npm install
cp .env.example .env
npm run dev
\`\`\`

El cliente web corre en `http://localhost:5173`.

## Cliente móvil (Ionic + Vue) — Taller #2

En otra terminal, desde la carpeta `mobile/`:

\`\`\`bash
cd mobile
npm install
cp .env.example .env
ionic serve
\`\`\`

El cliente móvil corre en `http://localhost:8100`.

> El backend debe estar corriendo para que ambos clientes (web y móvil) funcionen — los dos consumen la misma API REST. El backend ya tiene habilitado CORS para ambos orígenes (`5173` y `8100`).

## Funcionalidades

### Backend
- CRUD completo de equipos (crear, listar, editar, eliminar)
- Búsqueda de equipos por nombre
- Paginación real (skip/take en la base de datos)
- Registro e inicio de sesión con JWT (contraseña hasheada con bcrypt)
- Rutas protegidas (crear/editar/eliminar equipos requiere sesión iniciada)

### Cliente web (Vue)
- Listado, búsqueda y paginación con botones Prev/Next
- Crear, editar y eliminar equipos desde formularios
- Login/registro, sesión persistida en `localStorage`
- Rutas protegidas con navigation guard

### Cliente móvil (Ionic)
- Navegación con Ionic Vue Router (`ion-page`, `ion-header`, `ion-content`)
- Listado, búsqueda (`ion-searchbar`) y paginación con scroll infinito (`ion-infinite-scroll`)
- Crear, editar y eliminar equipos con `ion-modal` y `ion-alert`
- Login/registro, sesión persistida con `@capacitor/preferences`
- Header con Login/Logout centralizado

### Plus: correr en Android (emulador)

1. `npm install @capacitor/android`
2. `npx cap add android`
3. En `capacitor.config.ts`, agregar:
   \`\`\`typescript
   server: { cleartext: true, androidScheme: 'http' }
   \`\`\`
4. En `android/app/src/main/AndroidManifest.xml`, agregar `android:usesCleartextTraffic="true"` a la etiqueta `<application>`
5. Usar `http://10.0.2.2:3000` como `VITE_API_URL` en `mobile/.env` (el emulador no resuelve `localhost` hacia tu PC)
6. En el backend, agregar `http://localhost` a los orígenes de CORS (es el origen que reporta la WebView de Capacitor)
7. `ionic build && npx cap sync`
8. Abrir en Android Studio con `npx cap open android` y correr

## Pruebas de la API

El archivo `requests.http` en la raíz contiene ejemplos de todas las peticiones (registro, login, y las 4 operaciones del CRUD), listos para usar con la extensión REST Client de VS Code.

## Modelo de datos

**Team**: id, name, city, conference, image
**User**: id, username, password (hasheada con bcrypt)