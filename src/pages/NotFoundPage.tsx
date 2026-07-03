import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-muted-foreground text-sm">Página no encontrada.</p>
      <Button asChild variant="outline">
        <Link to="/">Volver al panel</Link>
      </Button>
    </div>
  )
}
