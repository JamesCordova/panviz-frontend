/**
 * Configuracion de entorno centralizada. Ningun otro modulo debe leer
 * `import.meta.env` directamente -- todo pasa por aqui, con un default
 * razonable para desarrollo local si la variable no esta definida.
 */
export const env = {
  // Raiz del backend, sin /api/v1 -- los paths tipados en api/schema.d.ts ya
  // incluyen ese prefijo (viene asi del openapi.json de FastAPI).
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
} as const
