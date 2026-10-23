import type { HaState } from './ha'

export function toNumber(state: HaState | undefined): number | null {
  if (!state) {
    return null
  }

  const value = Number(state.state)

  return Number.isFinite(value) ? value : null
}

export function toBoolean(state: HaState | undefined): boolean | null {
  if (!state) {
    return null
  }

  if (state.state === 'on') {
    return true
  }

  if (state.state === 'off') {
    return false
  }

  return null
}

export function toText(state: HaState | undefined): string | null {
  if (!state || ['unknown', 'unavailable'].includes(state.state)) {
    return null
  }

  return state.state
}

export function attributeNumber(
  state: HaState | undefined,
  key: string
): number | null {
  const value = state?.attributes[key]

  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

export function attributeText(
  state: HaState | undefined,
  key: string
): string | null {
  const value = state?.attributes[key]

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return null
}

export function attributeStringArray(
  state: HaState | undefined,
  key: string
): string[] {
  const value = state?.attributes[key]

  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === 'string')
}
