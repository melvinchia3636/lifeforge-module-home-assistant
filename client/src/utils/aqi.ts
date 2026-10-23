import { COLORS } from '@lifeforge/ui'

export type Pm25Status =
  'excellent' | 'good' | 'moderate' | 'unhealthy' | 'hazardous' | 'unknown'

export function getPm25Status(value: number | null): {
  key: Pm25Status
  color: string
} {
  if (value === null || !Number.isFinite(value)) {
    return { key: 'unknown', color: COLORS['bg-500'] }
  }

  if (value <= 15) {
    return { key: 'excellent', color: COLORS['teal-500'] }
  }

  if (value <= 35) {
    return { key: 'good', color: COLORS['lime-500'] }
  }

  if (value <= 55) {
    return { key: 'moderate', color: COLORS['yellow-500'] }
  }

  if (value <= 150) {
    return { key: 'unhealthy', color: COLORS['orange-500'] }
  }

  return { key: 'hazardous', color: COLORS['red-500'] }
}
