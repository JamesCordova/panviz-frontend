import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// RegionDetailPage carga Leaflet (mapa) -- se separa en su propio chunk para
// no penalizar el bundle inicial del dashboard, que es la vista de entrada.
const RegionDetailPage = lazy(() =>
  import('@/pages/RegionDetailPage').then((m) => ({ default: m.RegionDetailPage })),
)

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="regions/:code"
          element={
            <Suspense fallback={<div className="text-muted-foreground p-8 text-sm">Cargando…</div>}>
              <RegionDetailPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
