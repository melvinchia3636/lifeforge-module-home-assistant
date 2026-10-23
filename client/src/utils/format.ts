export function formatNumber(value: number | null, digits = 0): string {
  if (value === null || !Number.isFinite(value)) {
    return '-'
  }

  return value.toFixed(digits)
}
