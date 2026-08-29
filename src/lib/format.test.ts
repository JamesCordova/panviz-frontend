import { describe, expect, it } from 'vitest'

import { formatShortDate } from '@/lib/format'

describe('formatShortDate', () => {
  it('formats an ISO date as day + short month', () => {
    expect(formatShortDate('2026-03-05')).toMatch(/05/)
  })

  it('returns the original string when it cannot parse the date', () => {
    expect(formatShortDate('not-a-date')).toBe('not-a-date')
  })
})
