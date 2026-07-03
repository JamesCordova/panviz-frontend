import { screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { DashboardPage } from '@/pages/DashboardPage'
import { useFiltersStore } from '@/store/useFiltersStore'
import { renderWithProviders } from '@/test/render'

describe('DashboardPage', () => {
  afterEach(() => {
    useFiltersStore.setState({ regionCode: null, disease: 'pneumonia', horizon: 8 })
  })

  it('prompts to pick a region before showing any chart', () => {
    renderWithProviders(<DashboardPage />)

    expect(screen.getByText(/selecciona una región/i)).toBeInTheDocument()
  })

  it('loads stats and charts once a region is selected', async () => {
    useFiltersStore.setState({ regionCode: 'PE-LIM' })

    renderWithProviders(<DashboardPage />)

    expect(await screen.findByText('Casos reportados')).toBeInTheDocument()
    expect(screen.getByText('Predicción de incidencia')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument() // ultima semana reportada, del mock
    })
  })
})
