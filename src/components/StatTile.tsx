import { Card, CardContent } from '@/components/ui/card'

interface StatTileProps {
  label: string
  value: string
  hint?: string
}

/** Contrato: label en oracion, valor en cifras proporcionales (nunca tabular-nums en un valor grande). */
export function StatTile({ label, value, hint }: StatTileProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
        {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
      </CardContent>
    </Card>
  )
}
