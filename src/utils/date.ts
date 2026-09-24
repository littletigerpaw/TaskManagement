export const formatDate = (isoDate?: string): string => {
  if (!isoDate) return 'No due date'

  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return 'Invalid date'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

export const toDateInputValue = (isoDate?: string): string => {
  if (!isoDate) return ''
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString().slice(0, 10)
}
