# panviz-frontend

Dashboard de visualización y predicción de incidencia de neumonía / IRA.
Consume la API de [`panviz-backend`](../panviz-backend) vía un cliente
completamente tipado generado desde su OpenAPI.

## Stack

- **React 19 + TypeScript + Vite** (template oficial, con **oxlint** en vez de ESLint)
- **pnpm** como gestor de paquetes
- **Tailwind CSS v4 + shadcn/ui** (primitivos escritos a mano en `src/components/ui/`
  -- el CLI de `shadcn` falló en este entorno con "Could not load the workspace
  config"; el código sigue el patrón estándar de shadcn/ui)
- **TanStack Query** (estado de servidor) + **Zustand** (estado de UI compartido,
  ver `src/store/useFiltersStore.ts`)
- **openapi-fetch + openapi-typescript** -- cliente HTTP tipado a partir de
  `src/api/schema.d.ts`, generado desde el `/openapi.json` del backend
- **Recharts** (series temporales + banda de intervalo de confianza) y
  **react-leaflet** (mapa de la región en el detalle)
- **Vitest + React Testing Library + MSW** para tests
- **Prettier** (formato) -- oxlint cubre el lint

## Requisitos

- Node 20+
- pnpm 9+
- `panviz-backend` corriendo en `http://localhost:8000` (para desarrollo y para
  regenerar los tipos de API)

## Desarrollo local

```bash
pnpm install
cp .env.example .env.local

pnpm dev
```

Abre http://localhost:5173.

## Regenerar el cliente de API

Cuando cambie el contrato de `panviz-backend` (nuevos endpoints, campos, etc.),
con el backend corriendo en local:

```bash
pnpm run generate:api
```

Esto reescribe `src/api/schema.d.ts` a partir de `http://localhost:8000/openapi.json`.
TypeScript marcará en rojo cualquier uso desactualizado del cliente.

## Scripts

| Script                         | Qué hace                                              |
| ------------------------------ | ----------------------------------------------------- |
| `pnpm dev`                     | Servidor de desarrollo (Vite)                         |
| `pnpm build`                   | Typecheck (`tsc -b`) + build de producción            |
| `pnpm preview`                 | Sirve el build de producción localmente               |
| `pnpm lint`                    | oxlint                                                |
| `pnpm typecheck`               | Solo typecheck, sin build                             |
| `pnpm test`                    | Vitest (una pasada)                                   |
| `pnpm test:watch`              | Vitest en modo watch                                  |
| `pnpm format` / `format:check` | Prettier                                              |
| `pnpm generate:api`            | Regenera `src/api/schema.d.ts` desde el backend local |

## Estructura

```
src/
├── api/            # cliente tipado (openapi-fetch) + hooks de TanStack Query por dominio
├── components/     # componentes de la app (charts/, layout/, ui/ = primitivos shadcn)
├── config/         # env.ts -- unico lugar que lee import.meta.env
├── lib/            # utilidades (cn, formato de fechas, query client)
├── pages/          # una por ruta
├── store/          # estado de UI compartido (Zustand)
└── test/           # setup de Vitest, mocks de MSW, helper de render
```

## Testing

Los tests nunca pegan a un backend real -- MSW intercepta la red
(`src/test/mocks/`). Nota de implementación: `apiClient` (openapi-fetch) resuelve
`fetch` en el momento en que se crea el cliente, así que `server.listen()` se
llama a nivel de módulo en `src/test/setup.ts` (no dentro de un `beforeAll`) para
garantizar que el parche de MSW exista antes de que se importe `src/api/client.ts`.

## Despliegue (Vercel)

Proyecto Vite estándar, sin configuración adicional: importar el repo en Vercel,
`Build Command: pnpm build`, `Output Directory: dist`. Configurar
`VITE_API_BASE_URL` como variable de entorno apuntando a la URL pública de
`panviz-backend` desplegado.

## Notas / deuda técnica conocida

- El bundle principal supera los 500KB (Recharts + Radix). La página de detalle
  de región (que carga Leaflet) ya está separada en su propio chunk vía
  `React.lazy`; si el dashboard principal crece, considerar lazy-load de los
  charts también.
- El mapa de `RegionDetailPage` solo se muestra si la región tiene
  `latitude`/`longitude` (los datos demo del backend sí las traen).
