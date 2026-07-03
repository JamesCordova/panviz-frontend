import { useRegions } from '@/api/regions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFiltersStore } from '@/store/useFiltersStore'

const HORIZON_OPTIONS = [4, 8, 12, 26] as const

/**
 * Fila de filtros unica, por encima del contenido (region + horizonte de
 * prediccion) -- escopa todo lo que hay debajo, nunca un filtro por chart.
 */
export function FiltersBar() {
  const { data: regions, isLoading } = useRegions()
  const { regionCode, horizon, setRegion, setHorizon } = useFiltersStore()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={regionCode ?? undefined} onValueChange={setRegion} disabled={isLoading}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder={isLoading ? 'Cargando regiones…' : 'Selecciona una región'} />
        </SelectTrigger>
        <SelectContent>
          {regions?.map((region) => (
            <SelectItem key={region.code} value={region.code}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={String(horizon)} onValueChange={(value) => setHorizon(Number(value))}>
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {HORIZON_OPTIONS.map((weeks) => (
            <SelectItem key={weeks} value={String(weeks)}>
              Predecir {weeks} semanas
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
