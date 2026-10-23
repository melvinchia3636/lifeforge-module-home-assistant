import z from 'zod'

import forge from '../forge'
import {
  ENTITIES,
  HOME_ASSISTANT_API_KEY,
  MANUAL_FAN_LEVEL_OPTIONS
} from '../constants/entities'
import {
  HomeAssistantError,
  haFetch,
  type HaState
} from '../utils/ha'
import {
  attributeNumber,
  attributeStringArray,
  attributeText,
  toBoolean,
  toNumber,
  toText
} from '../utils/normalize'

const statsDto = z.object({
  power: z.boolean().nullable(),
  preset_mode: z.string().nullable(),
  preset_modes: z.array(z.string()),
  percentage: z.number().nullable(),
  pm1: z.number().nullable(),
  pm25: z.number().nullable(),
  pm10: z.number().nullable(),
  air_quality: z.string().nullable(),
  temperature: z.number().nullable(),
  humidity: z.number().nullable(),
  filter_life: z.number().nullable(),
  fault: z.string().nullable(),
  uv: z.boolean().nullable(),
  anion: z.boolean().nullable(),
  display: z.boolean().nullable(),
  brightness: z.string().nullable(),
  brightness_options: z.array(z.string()),
  manual_fan_level: z.string().nullable(),
  manual_fan_level_options: z.array(z.string()),
  child_lock: z.boolean().nullable(),
  buzzer: z.boolean().nullable(),
  motor_rpm: z.number().nullable(),
  updated_at: z.string()
})

export const get = forge
  .query({
    description: 'Get the current state of the Home Assistant air purifier',
    output: {
      OK: statsDto
    }
  })
  .callback(
    async ({
      db,
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

      try {
        const states = await haFetch<HaState[]>(
          settings.base_url,
          token,
          '/api/states'
        )

        const stateMap = new Map(
          states.map(state => [state.entity_id, state])
        )

        const fan = stateMap.get(ENTITIES.fan)
        const brightness = stateMap.get(ENTITIES.brightness)
        const manualFanLevel = stateMap.get(ENTITIES.manualFanLevel)

        return response.ok({
          power: toBoolean(fan),
          preset_mode:
            attributeText(fan, 'preset_mode') ?? attributeText(fan, 'mode'),
          preset_modes: attributeStringArray(fan, 'preset_modes'),
          percentage: attributeNumber(fan, 'percentage'),
          pm1: toNumber(stateMap.get(ENTITIES.pm1)),
          pm25: toNumber(stateMap.get(ENTITIES.pm25)),
          pm10: toNumber(stateMap.get(ENTITIES.pm10)),
          air_quality: toText(stateMap.get(ENTITIES.airQuality)),
          temperature: toNumber(stateMap.get(ENTITIES.temperature)),
          humidity: toNumber(stateMap.get(ENTITIES.humidity)),
          filter_life: toNumber(stateMap.get(ENTITIES.filterLife)),
          fault: toText(stateMap.get(ENTITIES.fault)),
          uv: toBoolean(stateMap.get(ENTITIES.uv)),
          anion: toBoolean(stateMap.get(ENTITIES.anion)),
          display: toBoolean(stateMap.get(ENTITIES.display)),
          brightness: toText(brightness),
          brightness_options: attributeStringArray(brightness, 'options'),
          manual_fan_level: toText(manualFanLevel),
          manual_fan_level_options: (() => {
            const options = attributeStringArray(manualFanLevel, 'options')

            return options.length > 0
              ? options
              : [...MANUAL_FAN_LEVEL_OPTIONS]
          })(),
          child_lock: toBoolean(stateMap.get(ENTITIES.childLock)),
          buzzer: toBoolean(stateMap.get(ENTITIES.buzzer)),
          motor_rpm: toNumber(stateMap.get(ENTITIES.motorRpm)),
          updated_at: new Date().toISOString()
        })
      } catch (error) {
        return response.badRequest(
          error instanceof HomeAssistantError
            ? error.message
            : 'Failed to read the purifier state from Home Assistant.'
        )
      }
    }
  )
