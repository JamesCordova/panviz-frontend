import { HttpResponse, http } from 'msw'

import { env } from '@/config/env'

const api = (path: string) => `${env.apiBaseUrl}${path}`

export const mockRegions = [
  {
    id: 1,
    name: 'Lima',
    code: 'PE-LIM',
    adminLevel: 'department' as const,
    parentCode: null,
    latitude: -12.0464,
    longitude: -77.0428,
    population: 9_000_000,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
]

export const handlers = [
  http.get(api('/api/v1/regions'), () => HttpResponse.json(mockRegions)),

  http.get(api('/api/v1/incidence'), () =>
    HttpResponse.json({
      items: [
        {
          id: 1,
          regionId: 1,
          disease: 'pneumonia',
          date: '2026-01-01',
          cases: 42,
          ratePer100K: null,
          source: 'demo',
          createdAt: '2026-01-01T00:00:00Z',
        },
      ],
      total: 1,
      page: 1,
      pageSize: 104,
      totalPages: 1,
    }),
  ),

  http.get(api('/api/v1/predict'), () =>
    HttpResponse.json({
      region: 'PE-LIM',
      disease: 'pneumonia',
      model: { name: 'mock', version: '0.1.0-dummy', isMock: true, trainedAt: null },
      horizon: 4,
      generatedAt: '2026-01-08T00:00:00Z',
      dates: ['2026-01-08', '2026-01-15', '2026-01-22', '2026-01-29'],
      predictedCases: [44, 46, 45, 47],
      ciLower: [38, 40, 39, 41],
      ciUpper: [50, 52, 51, 53],
    }),
  ),
]
