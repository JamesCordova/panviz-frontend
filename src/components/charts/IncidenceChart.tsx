import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { formatShortDate } from '@/lib/format'

export interface IncidencePoint {
  date: string
  cases: number
}

interface IncidenceChartProps {
  data: IncidencePoint[]
  loading?: boolean
}

/**
 * Serie temporal de casos reportados. Una sola serie -> sin leyenda (el
 * titulo de la Card ya dice que se esta graficando), linea de 2px, area en
 * ~10% de opacidad como respaldo visual bajo la linea.
 */
export function IncidenceChart({ data, loading }: IncidenceChartProps) {
  if (loading) return <Skeleton className="h-64 w-full" />

  if (data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center text-sm">
        Sin datos de incidencia para esta seleccion.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={256}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
        <Area
          type="monotone"
          dataKey="cases"
          name="Casos reportados"
          stroke="var(--chart-series-1)"
          strokeWidth={2}
          fill="var(--chart-series-1)"
          fillOpacity={0.1}
          activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--chart-surface)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
