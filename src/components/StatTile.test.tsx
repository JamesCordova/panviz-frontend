import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatTile } from '@/components/StatTile'
import { renderWithProviders } from '@/test/render'

describe('StatTile', () => {
  it('renders label, value and optional hint', () => {
    renderWithProviders(<StatTile label="Población" value="9,000,000" hint="habitantes" />)

    expect(screen.getByText('Población')).toBeInTheDocument()
    expect(screen.getByText('9,000,000')).toBeInTheDocument()
    expect(screen.getByText('habitantes')).toBeInTheDocument()
  })

  it('omits the hint paragraph when not provided', () => {
    renderWithProviders(<StatTile label="Casos" value="42" />)

    expect(screen.queryByText('habitantes')).not.toBeInTheDocument()
  })
})
