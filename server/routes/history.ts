import z from 'zod'

import forge from '../forge'
import { HISTORY_ENTITIES, HOME_ASSISTANT_API_KEY } from '../constants/entities'
import {
  HomeAssistantError,
  haFetch,
  type HaHistoryEntry
} from '../utils/ha'
import { buildHistoryPoints } from '../utils/history'

const RANGE_HOURS = {
  '6h': 6,
  '24h': 24,
  '7d': 168
} as const

const pointDto = z.object({
  t: z.number(),
  pm1: z.number().nullable(),
  pm25: z.number().nullable(),
  pm10: z.number().nullable(),
  temperature: z.number().nullable(),
  humidity: z.number().nullable()
})

const historyDto = z.object({
  points: z.array(pointDto)
})

export const get = forge
  .query({
    description: 'Get purifier history from Home Assistant',
    input: {
      query: z.object({ range: z.enum(['6h', '24h', '7d']) })
    },
    output: {
      OK: historyDto
    }
  })
  .callback(
    async ({
      db,
      query: { range },
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      const settings = await db.query.settings.findFirst()

      if (!settings) {
        return response.badRequest('Home Assistant is not configured.')
      }

      let token: string

      try {
        token = await getAPIKey(HOME_ASSISTANT_API_KEY)
      } catch {
        return response.badRequest(
          'Home Assistant API key is not configured. Add the "home-assistant" key in Settings → API Keys.'
        )
      }

      const end = Date.now()
      const start = end - RANGE_HOURS[range] * 60 * 60 * 1000
      const entityIds = Object.values(HISTORY_ENTITIES).join(',')
      const startIso = new Date(start).toISOString()
      const endIso = new Date(end).toISOString()

      try {
        const groups = await haFetch<HaHistoryEntry[][]>(
          settings.base_url,
          token,
          `/api/history/period/${encodeURIComponent(startIso)}?filter_entity_id=${encodeURIComponent(entityIds)}&end_time=${encodeURIComponent(endIso)}&minimal_response&no_attributes`
        )

        return response.ok({
          points: buildHistoryPoints(groups, start, end)
        })
      } catch (error) {
        return response.badRequest(
          error instanceof HomeAssistantError
            ? error.message
            : 'Failed to read purifier history from Home Assistant.'
        )
      }
    }
  )
