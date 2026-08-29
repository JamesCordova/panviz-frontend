// timeZone: 'UTC' es necesario porque las fechas que llegan del backend son
// date-only ("YYYY-MM-DD"), que `Date` parsea como medianoche UTC -- sin
// esto, formatear en una zona horaria local con offset negativo corre el
// dia mostrado hacia atras.
const shortDateFormatter = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
})

export function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return shortDateFormatter.format(date)
}
