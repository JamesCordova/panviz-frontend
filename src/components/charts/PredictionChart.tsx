import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { formatShortDate } from '@/lib/format'
import type { IncidencePoint } from '@/components/charts/IncidenceChart'

interface PredictionResult {
  dates: string[]
  predictedCases: number[]
  ciLower: number[]
  ciUpper: number[]
}

interface PredictionChartProps {
  historical: IncidencePoint[]
  prediction: PredictionResult | undefined
  loading?: boolean
}

interface ChartRow {
  date: string
  actual?: number
  predicted?: number
  range?: [number, number]
}

/**
 * Casos reportados (azul) + prediccion (naranja) con banda de intervalo de
 * confianza. Dos series -> lleva leyenda; la banda es un area en ~12% de
 * opacidad del color de la prediccion (nunca un bloque saturado). Una linea
 * de referencia marca el limite entre lo observado y lo proyectado.
 */
export function PredictionChart({ historical, prediction, loading }: PredictionChartProps) {
  if (loading) return <Skeleton className="h-72 w-full" />

  const historicalRows: ChartRow[] = historical.map((point) => ({
    date: point.date,
    actual: point.cases,
  }))

  const predictionRows: ChartRow[] = prediction
    ? prediction.dates.map((date, i) => ({
        date,
        predicted: prediction.predictedCases[i],
        range: [prediction.ciLower[i], prediction.ciUpper[i]],
      }))
    : []

  const data = [...historicalRows, ...predictionRows]
  const todayBoundary = historicalRows.at(-1)?.date

  if (data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-72 items-center justify-center text-sm">
        Sin datos suficientes para mostrar la prediccion.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={288}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--chart-gridline)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatShortDate}
          stroke="var(--chart-baseline)"
          tick={{ fill: 'var(--chart-muted)', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          minTickGap={32}
        />
        <YAxis
          stroke="var(--chart-baseline)"
          tick={{ fill: 'var(--chart-muted)', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip
          content={(props) => <ChartTooltip {...props} labelFormatter={formatShortDate} />}
          cursor={{ stroke: 'var(--chart-baseline)', strokeWidth: 1 }}
        />
        <Legend
          verticalAlign="top"
          height={32}
          iconType="plainline"
          wrapperStyle={{ fontSize: 12, color: 'var(--chart-text-secondary)' }}
        />
        {todayBoundary && (
          <ReferenceLine
            x={todayBoundary}
            stroke="var(--chart-baseline)"
            strokeDasharray="4 4"
            label={{
              value: 'Hoy',
              position: 'insideTopRight',
              fill: 'var(--chart-muted)',
              fontSize: 11,
            }}
          />
        )}
        <Area
          type="monotone"
          dataKey="range"
          name="Intervalo de confianza"
          stroke="none"
          fill="var(--chart-series-2)"
          fillOpacity={0.12}
          legendType="none"
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="actual"
          name="Casos reportados"
          stroke="var(--chart-series-1)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--chart-surface)' }}
        />
        <Line
          type="monotone"
          dataKey="predicted"
          name="Prediccion"
          stroke="var(--chart-series-2)"
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--chart-surface)' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
