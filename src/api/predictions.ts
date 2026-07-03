import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/api/client'

export interface PredictionParams {
  model: string
  region: string
  disease?: string
  horizon: number
}

export function usePrediction(params: PredictionParams | null) {
  return useQuery({
    queryKey: ['prediction', params],
    queryFn: async () => {
      if (!params) throw new Error('usePrediction: params no puede ser null cuando enabled')
      const { data, error } = await apiClient.GET('/api/v1/predict', {
        params: { query: params },
      })
      if (error) throw error
      return data
    },
    enabled: params !== null,
  })
}

export function useAvailableModels() {
  return useQuery({
    queryKey: ['prediction-models'],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/v1/predict/models')
      if (error) throw error
      return data
    },
  })
}
