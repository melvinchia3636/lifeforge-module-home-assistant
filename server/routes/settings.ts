import { eq } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { homeAssistantSettings } from '../schema.drizzle'
import { HOME_ASSISTANT_API_KEY } from '../constants/entities'
import {
  HomeAssistantError,
  haFetch,
  normalizeBaseUrl
} from '../utils/ha'

const settingsDto = createSelectSchema(homeAssistantSettings)

export const get = forge
  .query({
    description: 'Get the Home Assistant connection settings',
    output: {
      OK: z.object({ settings: settingsDto.nullable() })
    }
  })
  .callback(async ({ db, response }) =>
    response.ok({
      settings: (await db.query.settings.findFirst()) ?? null
    })
  )

export const save = forge
  .mutation({
    description: 'Save the Home Assistant connection settings',
    input: {
      body: z.object({ base_url: z.string() })
    },
    output: {
      OK: settingsDto
    }
  })
  .callback(async ({ db, body, response }) => {
    let baseUrl: string

    try {
      baseUrl = normalizeBaseUrl(body.base_url)
    } catch (error) {
      return response.badRequest(
        error instanceof Error ? error.message : 'Invalid Home Assistant URL.'
      )
    }

    const existing = await db.query.settings.findFirst()
    const values = { base_url: baseUrl, updated: new Date() }

    if (existing) {
      const [updated] = await db
        .update(homeAssistantSettings)
        .set(values)
        .where(eq(homeAssistantSettings.id, existing.id))
        .returning()

      if (!updated) {
        return response.badRequest('Failed to save Home Assistant settings.')
      }

      return response.ok(updated)
    }

    const [created] = await db
      .insert(homeAssistantSettings)
      .values(values)
      .returning()

    if (!created) {
      return response.badRequest('Failed to save Home Assistant settings.')
    }

    return response.ok(created)
  })

export const test = forge
  .query({
    description: 'Test the connection to Home Assistant',
    input: {
      query: z.object({ base_url: z.string() })
    },
    output: {
      OK: z.object({
        location_name: z.string(),
        version: z.string()
      })
    }
  })
  .callback(
    async ({
      query: { base_url },
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      let baseUrl: string
      let token: string

      try {
        baseUrl = normalizeBaseUrl(base_url)
      } catch (error) {
        return response.badRequest(
          error instanceof Error
            ? error.message
            : 'Invalid Home Assistant URL.'
        )
      }

      try {
        token = await getAPIKey(HOME_ASSISTANT_API_KEY)
      } catch {
        return response.badRequest(
          'Home Assistant API key is not configured. Add the "home-assistant" key in Settings → API Keys.'
        )
      }

      try {
        const config = await haFetch<{
          location_name?: string
          version?: string
        }>(baseUrl, token, '/api/config')

        return response.ok({
          location_name: config.location_name ?? 'Home Assistant',
          version: config.version ?? ''
        })
      } catch (error) {
        return response.badRequest(
          error instanceof HomeAssistantError
            ? error.message
            : 'Failed to connect to Home Assistant.'
        )
      }
    }
  )
