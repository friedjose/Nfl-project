# NFLboxd

Proyecto Final de Paradigmas de Programación: una API en ASP.NET Core para equipos de la NFL, consumida por dos clientes sin cambiar su código, solo la URL base: un cliente web (Vue + Vite) y un cliente móvil (Ionic + Vue, con empaquetado Android vía Capacitor).

## Estructura del repositorio

| Carpeta | Qué es |
|---|---|
| `NflApi/` | API ASP.NET Core + EF Core + SQLite (Proyecto Final) |
| `frontend/` | Cliente web Vue + Vite |
| `mobile/` | Cliente móvil Ionic + Vue (y `android/` de Capacitor) |
| `src/`, `prisma/` | Backend NestJS de los Talleres 1 y 2. Expone el mismo contrato REST que la API de .NET |
| `request.http` | Peticiones de prueba para la extensión REST Client de VS Code |

Dentro de `NflApi/`:

| Carpeta | Contenido |
|---|---|
| `Controllers/` | `TeamsController` y `AuthController` (reciben HTTP y delegan) |
| `Services/` | Lógica de negocio: interfaz + implementación (`ITeamsService`/`TeamsService`, `IAuthService`/`AuthService`) |
| `Data/` | `AppDbContext` (acceso a la base de datos con EF Core) |
| `Models/` | Entidades `Team` y `User` |
| `Dtos/` | Objetos de entrada y salida (`CreateTeamDto`, `UpdateTeamDto`, `PagedResult`, `AuthDto`, `LoginResponseDto`) |
| `Transformers/` | Personalización del documento OpenAPI (esquema Bearer) |
| `Migrations/` | Historial de migraciones de EF Core |

## Requisitos

- .NET SDK 10
- Herramienta de migraciones: `dotnet tool install --global dotnet-ef`
- Node.js y npm (para los clientes)
- Android Studio (opcional, solo para ejecutar el cliente en Android)

## 1. Levantar la API

```bash
cd NflApi
dotnet restore
dotnet ef database update
dotnet run
```

- La API queda en `http://localhost:5070`.
- `dotnet ef database update` crea `nfl.db` (tablas `Teams` y `Users`) a partir de las migraciones del repositorio. El archivo `nfl.db` no se sube al repo.
- La configuración está en `NflApi/appsettings.json`: la cadena de conexión (`ConnectionStrings:DefaultConnection`) y la sección `Jwt` (`Key`, `Issuer`, `Audience`).
- La clave del JWT debe tener al menos 32 caracteres. Para no usar la del archivo, defínela como variable de entorno antes de arrancar. En PowerShell: `$env:Jwt__Key = "una-clave-larga-de-mas-de-32-caracteres"`. En bash: `export Jwt__Key="..."`.

### Datos de prueba

1. Con la API corriendo, abre `request.http` (extensión REST Client). La primera línea define `@baseUrl = http://localhost:5070`.
2. Ejecuta `[AUTH] 1. Registrar usuario` y luego `[AUTH] 3. Login`. El login guarda el token en la variable `@token`.
3. Ejecuta los bloques `[SEED]` para crear 16 equipos. Como crear equipos requiere sesión, cada `[SEED]` envía el header `Authorization: Bearer {{token}}`.

### Contrato de la API

| Método | Ruta | Acceso | Respuesta |
|---|---|---|---|
| GET | `/teams?page=1&limit=6&search=` | público | `200` con `{ data, total, page, totalPages }` |
| GET | `/teams/{id}` | público | `200` o `404` |
| POST | `/teams` | requiere token | `201`, o `401` sin token |
| PATCH | `/teams/{id}` | requiere token | `200`, `404` o `401` |
| DELETE | `/teams/{id}` | requiere token | `200` con el objeto eliminado, `404` o `401` |
| POST | `/auth/register` | público | `201`, o `409` si el usuario existe |
| POST | `/auth/login` | público | `200` con `{ "access_token": "..." }`, o `401` |
| GET | `/auth/profile` | requiere token | `200` o `401` |

- El token se envía en el header `Authorization: Bearer <token>` y dura 1 hora.
- Las propiedades del JSON van en `camelCase`, salvo `access_token`, que se mantiene igual que en la API de NestJS.
- La búsqueda por nombre no distingue mayúsculas, y la paginación se hace en la base de datos (`LIMIT`/`OFFSET`).
- CORS está habilitado para `http://localhost:5173` (Vue), `http://localhost:8100` (Ionic en navegador) y `http://localhost` (WebView de Capacitor en Android).

### Documentación interactiva (Plus)

En desarrollo, la API publica:

- El documento OpenAPI en `http://localhost:5070/openapi/v1.json`, generado con `Microsoft.AspNetCore.OpenApi`.
- Una interfaz Scalar en `http://localhost:5070/scalar`.

Para probar los endpoints protegidos desde Scalar:

1. Ejecuta `POST /auth/login` y copia el `access_token` de la respuesta.
2. En la sección de autenticación de Scalar, elige **Bearer** y pega el token.
3. Prueba `POST`, `PATCH` o `DELETE` sobre `/teams`. Sin token responden `401`.

Los candados solo aparecen en las operaciones con `[Authorize]`. La documentación solo está habilitada en el entorno Development.

## 2. Apuntar los clientes a la API

La API debe estar corriendo. En ambos clientes lo único que cambia es la variable `VITE_API_URL`.

### Cliente web (Vue)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

`frontend/.env`:

```
VITE_API_URL=http://localhost:5070
```

Se abre en `http://localhost:5173`. Vite lee el `.env` solo al arrancar, así que reinícialo si lo cambias.

### Cliente móvil (Ionic) en el navegador

```bash
cd mobile
npm install
cp .env.example .env
ionic serve
```

`mobile/.env`:

```
VITE_API_URL=http://localhost:5070
```

Se abre en `http://localhost:8100`.

### Cliente móvil en Android (emulador)

El emulador no entiende `localhost` como tu PC. Usa `10.0.2.2`. En `mobile/.env`:

```
VITE_API_URL=http://10.0.2.2:5070
```

```bash
cd mobile
ionic build
npx cap sync
npx cap open android
```

Desde Android Studio, Run sobre el emulador. La API de desarrollo usa HTTP, por eso `mobile/capacitor.config.ts` tiene `cleartext: true` y `androidScheme: 'http'`, y `AndroidManifest.xml` tiene `usesCleartextTraffic="true"`.

## 3. Cómo verificar el funcionamiento

En cada cliente (Vue, Ionic en navegador y Android):

1. Sin sesión: se ve la lista, pero no los botones de crear, editar ni eliminar.
2. La búsqueda filtra por nombre (por ejemplo `chiefs`).
3. La paginación recorre los 16 equipos sin repetir (Vue: Prev/Next. Ionic: scroll infinito).
4. Registro e inicio de sesión desde el cliente.
5. Con sesión aparecen los botones, y crear, editar y eliminar funcionan.
6. Al recargar la página la sesión se mantiene, y el logout oculta los botones.

En la pestaña Network del navegador, todas las peticiones van a `localhost:5070`, y las de escritura llevan `Authorization: Bearer ...`.

## Modelo de datos

- **Team**: `id`, `name`, `city`, `conference`, `image`.
- **User**: `id`, `username` (único) y `password` (guardada hasheada con `PasswordHasher` de ASP.NET Core).

## Backend NestJS de los talleres (opcional)

Los clientes funcionan igual contra el backend de NestJS, solo cambia la URL. Desde la raíz del repo:

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run start:dev
```

Queda en `http://localhost:3000`, y `VITE_API_URL` pasa a ser `http://localhost:3000`. La base de datos de NestJS (`dev.db`) es independiente de la de .NET, así que los usuarios no se comparten.

## Notas de diseño

- `app.UseHttpsRedirection()` está deshabilitado a propósito: la redirección de HTTP a HTTPS rompe las peticiones de preflight de CORS que hacen los clientes por `http://`.
- El JWT lo emite la propia API con una clave simétrica (HS256). Es una simplificación académica: la documentación de Microsoft recomienda emitirlo con un flujo OpenID Connect/OAuth y claves asimétricas en producción.
- Los servicios se registran por inyección de dependencias en `Program.cs` (`AddScoped`), y los controllers dependen de las interfaces, no de las clases concretas.