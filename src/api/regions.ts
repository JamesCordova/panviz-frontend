import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/api/client'

export function useRegions() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/v1/regions')
      if (error) throw error
      return data
    },
  })
}
