type ChartTooltipValue = number | string | readonly (number | string)[]

interface ChartTooltipEntry {
  dataKey?: unknown
  name?: string | number
  color?: string
  value?: ChartTooltipValue
}

interface ChartTooltipProps {
  active?: boolean
  payload?: readonly ChartTooltipEntry[]
  label?: unknown
  labelFormatter?: (label: string) => string
}

function formatValue(value: ChartTooltipValue): string {
  if (Array.isArray(value)) {
    // Banda de intervalo de confianza: [ci_lower, ci_upper]
    return value.map((v) => (typeof v === 'number' ? Math.round(v) : v)).join(' – ')
  }
  return typeof value === 'number' ? String(Math.round(value)) : String(value)
}

/**
 * Tooltip compartido por los charts de incidencia/prediccion.
 * Convenciones (ver skill de dataviz): el valor es el elemento fuerte y el
 * nombre de la serie es secundario; cada fila lleva un "line key" (trazo del
 * color de la serie) en vez de una caja rellena; nunca se usa innerHTML con
 * datos de la API (textContent implicito via JSX).
 */
export function ChartTooltip({ active, payload, label, labelFormatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  const labelText = label === undefined || label === null ? undefined : String(label)

  return (
    <div className="bg-popover text-popover-foreground rounded-lg border px-3 py-2 shadow-md">
      {labelText !== undefined && (
        <p className="text-muted-foreground mb-1 text-xs">
          {labelFormatter ? labelFormatter(labelText) : labelText}
        </p>
      )}
      <dl className="flex flex-col gap-1">
        {payload
          .filter((entry) => entry.value !== undefined && entry.value !== null)
          .map((entry) => (
            <div
              key={String(entry.dataKey ?? entry.name)}
              className="flex items-center gap-2 text-xs"
            >
              <span
                className="h-0.5 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <dt className="text-muted-foreground">{entry.name}</dt>
              <dd className="ml-auto font-semibold tabular-nums">
                {entry.value !== undefined ? formatValue(entry.value) : null}
              </dd>
            </div>
          ))}
      </dl>
    </div>
  )
}
