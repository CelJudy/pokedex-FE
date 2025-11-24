# Pokédex - Aplicación Vue 3

Una aplicación completa de Pokédex desarrollada con Vue 3, Composition API, `<script setup>`, Vite y Tailwind CSS.

## 🚀 Características

- ✅ Pantallas de Login/Registro con validación y consumo del API (`/auth/login`, `/auth/register`, `/auth/confirm`)
- ✅ Lista completa de Pokémon (todas las generaciones) consumida desde PokéAPI
- ✅ Búsqueda en tiempo real, filtros por tipo principal/secundario y generación
- ✅ Favoritos persistidos en localStorage y sincronizados con el backend (`pokemon/saveFavorite | deleteFavorite`)
- ✅ Doble scroll infinito: carga incremental desde la API y paginación sobre el resultado filtrado
- ✅ Tarjetas con imagen oficial, número y tipos; modal con detalles extendidos
- ✅ Diseño responsive con Tailwind, animaciones suaves y gradientes
- ✅ PWA lista para instalar (manifest + service worker con cache y fallback offline)
- ✅ Soporte offline básico: peticiones fallidas por red se guardan en IndexedDB para reintento


## 📦 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Copia el archivo de variables de entorno y configura la URL del backend:
```bash
cp .env.example .env
# edita VITE_API_BASE_URL según tu API (por defecto http://localhost:3000/api/)
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 🛠️ Tecnologías

- **Vue 3** - Framework JavaScript
- **Composition API** - API de composición de Vue
- **Vite** - Build tool y servidor de desarrollo
- **Vue Router** - Enrutamiento
- **Tailwind CSS** - Framework de CSS
- **Axios** - Cliente HTTP
- **Vitest** - Pruebas unitarias
- **IndexedDB + Service Worker** - Soporte offline y PWA

## 📱 Uso

1. **Login**: Ingresa cualquier correo válido y contraseña para acceder
2. **Registro/Confirmación**: Completa el formulario de registro; el backend enviará la confirmación usando `/confirm/:token`
3. **Búsqueda**: Usa el campo de búsqueda para filtrar por nombre
4. **Filtros**: Selecciona tipo principal, tipo secundario y generación
5. **Favoritos**: Haz clic en la estrella para marcar/desmarcar y sincronizar con el servidor
6. **Ver solo favoritos**: Activa el botón de estrella en la barra de filtros
7. **Scroll infinito**: Al llegar al final del listado se cargan 20 Pokémon adicionales
8. **Detalles**: Haz clic en cualquier tarjeta para ver información detallada en el modal

## 🎨 Características de Diseño

- Gradientes modernos
- Tarjetas con efecto hover
- Colores personalizados para cada tipo de Pokémon
- Diseño responsive para móviles y desktop
- Animaciones suaves con Tailwind

## 📲 PWA y soporte offline

- `manifest.webmanifest` + iconos permiten instalar la app en dispositivos móviles/escritorio.
- `sw.js` cachea el *app shell* y provee estrategia *cache-first* con fallback.
- Peticiones HTTP que fallen por falta de conexión se guardan en IndexedDB (store `table`) y pueden reenviarse más adelante.

Para aprovechar la PWA:
1. Ejecuta `npm run build` y sirve `dist` usando HTTPS o `npm run preview`.
2. Abre DevTools → Application → Manifest para verificar que sea instalable.

## 🧪 Pruebas

El proyecto incluye pruebas unitarias con Vitest para los composables principales.

```bash
npm run test
```

Las pruebas mockean Axios y localStorage/IndexedDB donde es necesario para validar la lógica de favoritos y carga de Pokémon.

## ⚠️ Notas backend

- Configura `VITE_API_BASE_URL` apuntando a tu API (por ejemplo `http://localhost:3000/api/`).
- Endpoints esperados:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/confirm`
  - `POST /pokemon/saveFavorite`
  - `POST /pokemon/deleteFavorite`
- El token JWT se almacena en `localStorage` para autenticación en las llamadas protegidas.


