import { Link, useParams } from 'react-router-dom'

import { useIncidence } from '@/api/incidence'
import { usePrediction } from '@/api/predictions'
import { useRegions } from '@/api/regions'
import { RegionMap } from '@/components/RegionMap'
import { StatTile } from '@/components/StatTile'
import { IncidenceChart } from '@/components/charts/IncidenceChart'
import { PredictionChart } from '@/components/charts/PredictionChart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const DISEASE = 'pneumonia'
const HORIZON = 8

export function RegionDetailPage() {
  const { code } = useParams<{ code: string }>()
  const { data: regions, isLoading: regionsLoading } = useRegions()
  const region = regions?.find((r) => r.code === code)

  const incidenceQuery = useIncidence({ regionCode: code, disease: DISEASE, pageSize: 104 })
  const predictionQuery = usePrediction(
    code ? { model: 'mock', region: code, disease: DISEASE, horizon: HORIZON } : null,
  )

  const historyPoints =
    incidenceQuery.data?.items.map((item) => ({ date: item.date, cases: item.cases })) ?? []

  if (regionsLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (!region) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted-foreground text-sm">No se encontró la región "{code}".</p>
        <Button asChild variant="outline">
          <Link to="/">Volver al panel</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link to="/">← Volver al panel</Link>
        </Button>
        <h1 className="text-lg font-semibold tracking-tight">{region.name}</h1>
        <p className="text-muted-foreground text-sm">
          {region.code} · {region.adminLevel}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatTile
          label="Población"
          value={region.population ? region.population.toLocaleString('es') : '—'}
        />
        <StatTile
          label="Última semana reportada"
          value={historyPoints.at(-1) ? String(Math.round(historyPoints.at(-1)!.cases)) : '—'}
          hint="casos de neumonía"
        />
        <StatTile label="Horizonte de predicción" value={`${HORIZON} semanas`} />
      </div>

      {region.latitude && region.longitude && (
        <Card>
          <CardHeader>
            <CardTitle>Ubicación</CardTitle>
          </CardHeader>
          <CardContent>
            <RegionMap name={region.name} latitude={region.latitude} longitude={region.longitude} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Casos reportados</CardTitle>
        </CardHeader>
        <CardContent>
          <IncidenceChart data={historyPoints} loading={incidenceQuery.isLoading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Predicción</CardTitle>
        </CardHeader>
        <CardContent>
          <PredictionChart
            historical={historyPoints}
            prediction={predictionQuery.data}
            loading={predictionQuery.isLoading || incidenceQuery.isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
