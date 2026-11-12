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

## Requisitos

- Node.js y npm instalados.

## Instalación y ejecución

Desde esta carpeta (`project-pokemon`):

```bash
npm install
cp .env.example .env
npm run dev
```

Vite muestra la dirección local en la terminal (por defecto, `http://localhost:3000`).

La variable `VITE_API_URL` configura la URL base de la API. El valor predeterminado es `https://pokeapi.co/api/v2/`, así que el archivo `.env` es opcional si se usa la PokéAPI pública.

## Comandos disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run lint     # Ejecuta ESLint
npm run build    # Verifica TypeScript y genera la versión de producción
npm run preview  # Sirve localmente la compilación de producción
```

La compilación se genera en `dist/`.
