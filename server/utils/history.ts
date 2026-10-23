import { HISTORY_ENTITIES } from '../constants/entities'
import type { HaHistoryEntry } from './ha'

interface ValuePoint {
  t: number
  v: number
}

export interface HistoryPoint {
  t: number
  pm1: number | null
  pm25: number | null
  pm10: number | null
  temperature: number | null
  humidity: number | null
}

const MAX_POINTS = 240

function parseTimestamp(entry: HaHistoryEntry): number {
  return Date.parse(entry.last_updated ?? entry.last_changed ?? '')
}

function readAt(points: ValuePoint[], pointer: { index: number }, time: number) {
  while (pointer.index < points.length) {
    const point = points[pointer.index]

    if (!point || point.t > time) {
      break
    }

    pointer.index += 1
  }

  if (pointer.index === 0) {
    return null
  }

  return points[pointer.index - 1]?.v ?? null
}

export function buildHistoryPoints(
  groups: HaHistoryEntry[][],
  start: number,
  end: number
): HistoryPoint[] {
  const entriesByEntity = new Map<string, ValuePoint[]>()

  const orderedEntityIds = Object.values(HISTORY_ENTITIES)

  for (const [groupIndex, group] of groups.entries()) {
    const entityId =
      group[0]?.entity_id ?? orderedEntityIds[groupIndex] ?? undefined

    if (!entityId) {
      continue
    }

    for (const entry of group) {
      const time = parseTimestamp(entry)

      if (!Number.isFinite(time)) {
        continue
      }

      const value = Number(entry.state)

      if (!Number.isFinite(value)) {
        continue
      }

      const list = entriesByEntity.get(entityId) ?? []
      list.push({ t: time, v: value })
      entriesByEntity.set(entityId, list)
    }
  }

  const keys = Object.keys(HISTORY_ENTITIES) as Array<
    keyof typeof HISTORY_ENTITIES
  >

  const series = new Map<keyof typeof HISTORY_ENTITIES, ValuePoint[]>()

  for (const key of keys) {
    const points = entriesByEntity.get(HISTORY_ENTITIES[key]) ?? []

    points.sort((a, b) => a.t - b.t)
    series.set(key, points)
  }

  if (keys.every(key => (series.get(key) ?? []).length === 0)) {
    return []
  }

  const span = Math.max(1, end - start)
  const bucketSize = Math.max(60_000, Math.ceil(span / MAX_POINTS))
  const count = Math.max(1, Math.ceil(span / bucketSize))
  const pointers = new Map(keys.map(key => [key, { index: 0 }]))

  const points: HistoryPoint[] = []

  for (let index = 0; index < count; index += 1) {
    const time = Math.min(end, start + index * bucketSize)

    points.push({
      t: time,
      pm1: readAt(series.get('pm1') ?? [], pointers.get('pm1')!, time),
      pm25: readAt(series.get('pm25') ?? [], pointers.get('pm25')!, time),
      pm10: readAt(series.get('pm10') ?? [], pointers.get('pm10')!, time),
      temperature: readAt(
        series.get('temperature') ?? [],
        pointers.get('temperature')!,
        time
      ),
      humidity: readAt(
        series.get('humidity') ?? [],
        pointers.get('humidity')!,
        time
      )
    })
  }

  return points
}
