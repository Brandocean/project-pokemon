# Pokédex

Aplicación web creada con React, TypeScript y Vite que consulta la [PokéAPI](https://pokeapi.co/). Permite explorar Pokémon, buscar por nombre y ver sus datos en una ventana de detalle.

## Aplicación

[Abrir la aplicación](https://project-pokemon-alpha.vercel.app/)

## Funcionalidades

- Lista inicial de Pokémon con paginación.
- Búsqueda por coincidencias parciales en el nombre.
- Mensaje y acción para volver a la lista cuando no hay resultados.
- Ventana de detalle con imagen, tipos, altura, peso y estadísticas.
- Página «Sobre el autor» con enlaces a redes sociales y portafolio.
- Estados de carga y error, navegación responsiva y soporte de teclado.

## Tecnologías

- React 19
- TypeScript
- Vite
- React Router
- PokéAPI

## Estructura del proyecto

- `client/`: aplicación React con Vite.
- `server/`: servidor Node.js, Express y TypeScript, preparado para conectar con MongoDB Atlas.

## Requisitos

- Node.js y npm instalados.

## Instalación y ejecución

Desde la raíz de este repositorio:

```bash
npm run install:all
cp -n server/.env.example server/.env
npm run dev:client
```

Vite muestra la dirección local en la terminal (por defecto, `http://localhost:3000`). Cuando el servidor Atlas esté configurado, inicia el backend en otra terminal con `npm run dev:server`.

Antes de iniciar el servidor, configura `server/.env` con tus valores locales: `MONGO_URI`, `PORT`, `JWT_SECRET` y `CLIENT_ORIGIN`. La URI de MongoDB y el secreto JWT no deben compartirse ni subirse al repositorio. El servidor carga estas variables mediante `dotenv`.

La variable `VITE_API_URL` configura la URL base de la API. El ejemplo de configuración está en `client/.env.example`; el valor predeterminado es `https://pokeapi.co/api/v2/`.

## Errores de la API

El servidor responde los errores con `{ "message": "..." }`. Los datos inválidos y errores de formato de identificador producen `400`; las rutas inexistentes, `404`; los registros duplicados, `409`; y los errores internos, `500` con un mensaje genérico, sin detalles de la base de datos.

### `POST /signup`

Recibe `email`, `password` y `name` como cadenas JSON. La contraseña debe tener al menos 8 caracteres. Responde `201` con `_id`, `email` y `name`; nunca devuelve la contraseña. Los datos inválidos producen `400` y un correo duplicado produce `409`.

### `POST /signin`

Recibe `email` y `password`. Responde `200` con `{ "token": "..." }`; el JWT contiene solo `_id` y expira en 7 días. Si el correo o la contraseña no coinciden, o faltan credenciales válidas, responde `401` con el mismo mensaje genérico.

## Comandos disponibles

```bash
cd client
npm run lint     # Ejecuta ESLint
npm run build    # Verifica TypeScript y genera la versión de producción
npm run preview  # Sirve localmente la compilación de producción
```

La compilación del cliente se genera en `client/dist/`.
