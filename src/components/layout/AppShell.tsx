import { Activity } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

export function AppShell() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-4">
          <Activity className="text-primary size-5" aria-hidden />
          <Link to="/" className="text-sm font-semibold tracking-tight">
            PanViz
          </Link>
          <span className="text-muted-foreground text-sm">Incidencia y predicción de neumonía</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
