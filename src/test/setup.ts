import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach } from 'vitest'

import { server } from '@/test/mocks/server'

// server.listen() se llama a nivel de modulo (no dentro de beforeAll):
// openapi-fetch resuelve `globalThis.fetch` como valor por defecto en el
// momento en que se crea el cliente (import de src/api/client.ts), y eso
// pasa durante la fase de evaluacion de modulos -- ANTES de que corra
// cualquier callback de beforeAll. Si el patch de MSW llegara dentro de un
// beforeAll, el cliente ya habria capturado el fetch original sin mockear.
server.listen({ onUnhandledRequest: 'error' })

afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => server.close())
