import { Link } from 'react-router-dom'

import { useIncidence } from '@/api/incidence'
import { usePrediction } from '@/api/predictions'
import { useRegions } from '@/api/regions'
import { FiltersBar } from '@/components/FiltersBar'
import { StatTile } from '@/components/StatTile'
import { IncidenceChart } from '@/components/charts/IncidenceChart'
import { PredictionChart } from '@/components/charts/PredictionChart'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFiltersStore } from '@/store/useFiltersStore'

export function DashboardPage() {
  const { regionCode, disease, horizon } = useFiltersStore()
  const { data: regions } = useRegions()

  const incidenceQuery = useIncidence({
    regionCode: regionCode ?? undefined,
    disease,
    pageSize: 104,
  })

  const predictionQuery = usePrediction(
    regionCode ? { model: 'mock', region: regionCode, disease, horizon } : null,
  )

  const selectedRegion = regions?.find((r) => r.code === regionCode)
  const historyPoints =
    incidenceQuery.data?.items.map((item) => ({ date: item.date, cases: item.cases })) ?? []
  const latestCases = historyPoints.at(-1)?.cases

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Panel de incidencia</h1>
          <p className="text-muted-foreground text-sm">
            Series históricas y predicción por región para neumonía / IRA.
          </p>
        </div>
        <FiltersBar />
      </div>

      {!regionCode ? (
        <Card>
          <CardContent className="text-muted-foreground flex h-48 items-center justify-center text-sm">
            Selecciona una región para ver su historial e predicción.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatTile
              label="Última semana reportada"
              value={latestCases !== undefined ? String(Math.round(latestCases)) : '—'}
              hint="casos"
            />
            <StatTile
              label="Población de la región"
              value={
                selectedRegion?.population ? selectedRegion.population.toLocaleString('es') : '—'
              }
            />
            <StatTile label="Horizonte de predicción" value={`${horizon} semanas`} />
            <StatTile
              label="Modelo activo"
              value={predictionQuery.data?.model.name ?? '—'}
              hint={predictionQuery.data?.model.isMock ? 'predicción simulada' : undefined}
            />
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Casos reportados</CardTitle>
              {selectedRegion && (
                <Link
                  to={`/regions/${selectedRegion.code}`}
                  className="text-primary text-xs hover:underline"
                >
                  Ver detalle de {selectedRegion.name}
                </Link>
              )}
            </CardHeader>
            <CardContent>
              <IncidenceChart data={historyPoints} loading={incidenceQuery.isLoading} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Predicción de incidencia</CardTitle>
              {predictionQuery.data?.model.isMock && (
                <Badge variant="secondary">Predicción simulada — modelo en entrenamiento</Badge>
              )}
            </CardHeader>
            <CardContent>
              <PredictionChart
                historical={historyPoints}
                prediction={predictionQuery.data}
                loading={predictionQuery.isLoading || incidenceQuery.isLoading}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
