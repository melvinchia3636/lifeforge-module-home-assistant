import z from 'zod'

import forge from '../forge'
import {
  CONTROL_ACTIONS,
  type ControlAction,
  ENTITIES,
  HOME_ASSISTANT_API_KEY
} from '../constants/entities'
import {
  HomeAssistantError,
  haFetch,
  type HaState
} from '../utils/ha'

interface ControlService {
  domain: string
  service: string
  entity: string
  data?: Record<string, unknown>
}

function resolveService(
  action: ControlAction,
  value: string | undefined
): ControlService | null {
  switch (action) {
    case 'power_on':
      return { domain: 'fan', service: 'turn_on', entity: ENTITIES.fan }
    case 'power_off':
      return { domain: 'fan', service: 'turn_off', entity: ENTITIES.fan }
    case 'set_mode':
      return value
        ? {
            domain: 'fan',
            service: 'set_preset_mode',
            entity: ENTITIES.fan,
            data: { preset_mode: value }
          }
        : null

    case 'set_fan_speed': {
      const percentage = Number(value)

      if (!Number.isFinite(percentage)) {
        return null
      }

      return {
        domain: 'fan',
        service: 'set_percentage',
        entity: ENTITIES.fan,
        data: {
          percentage: Math.min(100, Math.max(0, Math.round(percentage)))
        }
      }
    }
    case 'uv_on':
      return { domain: 'switch', service: 'turn_on', entity: ENTITIES.uv }
    case 'uv_off':
      return { domain: 'switch', service: 'turn_off', entity: ENTITIES.uv }
    case 'anion_on':
      return { domain: 'switch', service: 'turn_on', entity: ENTITIES.anion }
    case 'anion_off':
      return { domain: 'switch', service: 'turn_off', entity: ENTITIES.anion }
    case 'display_on':
      return { domain: 'switch', service: 'turn_on', entity: ENTITIES.display }
    case 'display_off':
      return {
        domain: 'switch',
        service: 'turn_off',
        entity: ENTITIES.display
      }
    case 'set_brightness':
      return value
        ? {
            domain: 'select',
            service: 'select_option',
            entity: ENTITIES.brightness,
            data: { option: value }
          }
        : null
    case 'set_manual_fan_level':
      return value
        ? {
            domain: 'select',
            service: 'select_option',
            entity: ENTITIES.manualFanLevel,
            data: { option: value }
          }
        : null
    case 'child_lock_on':
      return {
        domain: 'switch',
        service: 'turn_on',
        entity: ENTITIES.childLock
      }
    case 'child_lock_off':
      return {
        domain: 'switch',
        service: 'turn_off',
        entity: ENTITIES.childLock
      }
    case 'buzzer_on':
      return { domain: 'switch', service: 'turn_on', entity: ENTITIES.buzzer }
    case 'buzzer_off':
      return { domain: 'switch', service: 'turn_off', entity: ENTITIES.buzzer }
    default:
      return null
  }
}

export const call = forge
  .mutation({
    description: 'Call a whitelisted Home Assistant purifier action',
    input: {
      body: z.object({
        action: z.enum(CONTROL_ACTIONS),
        value: z.string().optional()
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(
    async ({
      db,
      body: { action, value },
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      const settings = await db.query.settings.findFirst()

      if (!settings) {
        return response.badRequest('Home Assistant is not configured.')
      }

      const service = resolveService(action, value)

      if (!service) {
        return response.badRequest('Invalid purifier action.')
      }

      let token: string

      try {
        token = await getAPIKey(HOME_ASSISTANT_API_KEY)
      } catch {
        return response.badRequest(
          'Home Assistant API key is not configured. Add the "home-assistant" key in Settings → API Keys.'
        )
      }

      try {
        await haFetch<HaState[]>(
          settings.base_url,
          token,
          `/api/services/${service.domain}/${service.service}`,
          {
            method: 'POST',
            body: JSON.stringify({
              entity_id: service.entity,
              ...service.data
            })
          }
        )

        return response.noContent()
      } catch (error) {
        return response.badRequest(
          error instanceof HomeAssistantError
            ? error.message
            : 'Failed to send the action to Home Assistant.'
        )
      }
    }
  )
