import createClient from 'openapi-fetch'

import { env } from '@/config/env'
import type { paths } from '@/api/schema'

/**
 * Cliente HTTP completamente tipado a partir del OpenAPI del backend
 * (ver schema.d.ts, generado con `pnpm run generate:api`). Cualquier cambio
 * de contrato en panviz-backend se refleja aqui regenerando ese archivo --
 * nunca se escriben tipos de request/response a mano.
 */
export const apiClient = createClient<paths>({
  baseUrl: env.apiBaseUrl,
})
