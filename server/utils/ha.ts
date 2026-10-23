export interface HaState {
  entity_id: string
  state: string
  attributes: Record<string, unknown>
  last_changed?: string
  last_updated?: string
}

export interface HaHistoryEntry {
  entity_id: string
  state: string
  last_changed?: string
  last_updated?: string
}

export class HomeAssistantError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'HomeAssistantError'
  }
}

export function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim()

  let parsed: URL

  try {
    parsed = new URL(trimmed)
  } catch {
    throw new HomeAssistantError('Enter a valid Home Assistant URL.', 400)
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new HomeAssistantError(
      'The Home Assistant URL must start with http:// or https://.',
      400
    )
  }

  if (parsed.username || parsed.password) {
    throw new HomeAssistantError(
      'The Home Assistant URL must not contain credentials.',
      400
    )
  }

  parsed.hash = ''
  parsed.search = ''

  return parsed.toString().replace(/\/+$/, '')
}

export async function haFetch<T>(
  baseUrl: string,
  token: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      redirect: 'error',
      signal: controller.signal
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new HomeAssistantError(
          'Home Assistant rejected the API token.',
          response.status
        )
      }

      throw new HomeAssistantError(
        `Home Assistant returned HTTP ${response.status}.`,
        response.status
      )
    }

    if (response.status === 204) {
      return undefined as T
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof HomeAssistantError) {
      throw error
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new HomeAssistantError(
        'The Home Assistant request timed out.',
        504
      )
    }

    throw new HomeAssistantError(
      'Unable to reach Home Assistant. Check the base URL and network.',
      502
    )
  } finally {
    clearTimeout(timeout)
  }
}
