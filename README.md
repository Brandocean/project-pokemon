# Pokédex Full Stack

Aplicación web para explorar Pokémon con la [PokéAPI](https://pokeapi.co/), crear una cuenta y guardar favoritos personales. El cliente está construido con React, TypeScript y Vite; el servidor ofrece una API REST con Express y persiste usuarios y favoritos en MongoDB.

## Funcionalidades

- Registro, inicio y cierre de sesión con autenticación JWT.
- Rutas protegidas: las personas sin sesión solo pueden acceder al registro y al inicio de sesión.
- Listado paginado de Pokémon, búsqueda por nombre y ventana con detalles, estadísticas, tipos, altura y peso.
- Favoritos asociados a la cuenta: guardar, consultar, abrir detalles y eliminar sin recargar la página.
- Página «Sobre el autor».
- Menú de navegación adaptable a móviles, estados de carga y error, opción de reintento y notificaciones accesibles.
- API con validación de datos, autorización por usuario y límites de intentos en registro e inicio de sesión.

## Tecnologías

- **Cliente:** React 19, TypeScript, Vite y React Router.
- **Servidor:** Node.js, Express 5 y TypeScript.
- **Base de datos:** MongoDB con Mongoose.
- **Autenticación:** JWT y bcrypt.
- **APIs externas:** PokéAPI.

## Estructura del proyecto

- `client/`: aplicación React.
- `server/`: API REST, modelos y conexión a MongoDB.

## Requisitos

- Node.js y npm.
- Una base de datos MongoDB local o una instancia de MongoDB Atlas accesible desde tu red.

## Instalación y ejecución local

Desde la raíz del repositorio, instala las dependencias y crea los archivos de entorno locales:

```bash
npm run install:all
cp -n server/.env.example server/.env
cp -n client/.env.example client/.env
```

Configura `server/.env` con una URI válida de MongoDB (`MONGO_URI`) y un secreto JWT (`JWT_SECRET`). Los valores `PORT=3001` y `CLIENT_ORIGIN=http://localhost:3000` corresponden a la configuración local. No compartas ni subas los archivos `.env`, la URI de la base de datos ni el secreto.

`client/.env` usa `VITE_API_URL=http://localhost:3001` para el backend local y `VITE_POKE_API_URL=https://pokeapi.co/api/v2/` para PokéAPI. Estos son los valores de desarrollo; para un despliegue se deben configurar las URL de producción.

Inicia cada servicio desde la raíz en una terminal separada:

```bash
npm run dev:server
```

```bash
npm run dev:client
```

El cliente queda disponible en `http://localhost:3000` y el endpoint de salud de la API en `http://localhost:3001/health`. El servidor necesita conectarse correctamente a MongoDB para iniciar.

## API

Las rutas están organizadas por recurso bajo `server/src/routes/`. `POST /signup`, `POST /signin` y `GET /health` son públicas; las rutas de `/users` y `/favorites` requieren JWT.

## Errores de la API

El servidor responde los errores con `{ "message": "..." }`. Los datos inválidos y errores de formato de identificador producen `400`; las rutas inexistentes, `404`; los registros duplicados, `409`; y los errores internos, `500` con un mensaje genérico, sin detalles de la base de datos.

Las rutas están organizadas por recurso bajo `server/src/routes/`. `POST /signup`, `POST /signin` y `GET /health` son públicas; las rutas de `/users` y `/favorites` requieren JWT.

### `POST /signup`

Recibe `email`, `password` y `name` como cadenas JSON. La contraseña debe tener al menos 8 caracteres. Responde `201` con `_id`, `email` y `name`; nunca devuelve la contraseña. Los datos inválidos producen `400` y un correo duplicado produce `409`.

### `POST /signin`

Recibe `email` y `password`. Responde `200` con `{ "token": "..." }`; el JWT contiene solo `_id` y expira en 7 días. Si el correo o la contraseña no coinciden, o faltan credenciales válidas, responde `401` con el mismo mensaje genérico. En rutas protegidas, envía el token en `Authorization: Bearer <token>`; un token faltante o inválido responde `401`.

Ambos endpoints limitan solicitudes por IP: `/signin` permite 10 cada 15 minutos y `/signup`, 20 por hora. Al exceder el límite, responden `429` con `{ "message": "..." }`.

### `GET /users/me`

Requiere `Authorization: Bearer <token>`. Responde `200` con `_id`, `email` y `name` del usuario asociado; si el usuario ya no existe, responde `404`. Sin un token válido, responde `401`.

### `GET /favorites`

Requiere `Authorization: Bearer <token>`. Responde `200` con la lista de favoritos del usuario autenticado (vacía si no tiene); nunca incluye favoritos de otros usuarios. Cada elemento contiene `_id`, `pokemonId`, `name`, `image` y `types`.

### `POST /favorites`

Requiere `Authorization: Bearer <token>` y un JSON con `pokemonId` (entero positivo), `name`, `image` (URL HTTP/HTTPS) y `types` (lista de nombres de tipos). El servidor asigna el propietario desde el token e ignora cualquier `owner` enviado en el cuerpo. Responde `201` con el favorito creado; datos inválidos producen `400` y si ese Pokémon ya es favorito del usuario, `409`.

### `DELETE /favorites/:id`

Requiere `Authorization: Bearer <token>`. El `id` debe ser un ObjectId válido. Si el favorito pertenece al usuario, se elimina y responde `200` con el registro eliminado; devuelve `400` si el id es inválido, `403` si pertenece a otro usuario y `404` si no existe.

## Comandos de validación

```bash
cd client
npm run lint     # Ejecuta ESLint
npm run build    # Verifica TypeScript y genera la versión de producción
npm run preview  # Sirve localmente la compilación de producción
```

```bash
cd server
npm run lint     # Ejecuta ESLint
npm run build    # Compila TypeScript
npm start        # Inicia el servidor compilado (requiere server/.env)
```

La compilación del cliente se genera en `client/dist/`.

## Despliegue

- [Client](https://project-pokemon-sage.vercel.app)
- [Server](https://project-pokemon-server.vercel.app)