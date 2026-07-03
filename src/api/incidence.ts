import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/api/client'

export interface IncidenceFilters {
  regionCode?: string
  disease?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export function useIncidence(filters: IncidenceFilters) {
  return useQuery({
    queryKey: ['incidence', filters],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/v1/incidence', {
        params: { query: filters },
      })
      if (error) throw error
      return data
    },
    // Sin region seleccionada no tiene sentido pedir series historicas.
    enabled: Boolean(filters.regionCode),
  })
}
