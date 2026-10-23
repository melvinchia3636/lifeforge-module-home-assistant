export const HOME_ASSISTANT_API_KEY = 'home-assistant'

export const ENTITIES = {
  fan: 'fan.air_purifier',
  pm1: 'sensor.air_purifier_pm1',
  pm25: 'sensor.air_purifier_pm2_5_density',
  pm10: 'sensor.air_purifier_pm10_density',
  airQuality: 'sensor.air_purifier_air_quality',
  temperature: 'sensor.air_purifier_temperature',
  humidity: 'sensor.air_purifier_relative_humidity',
  filterLife: 'sensor.air_purifier_filter_life_level',
  fault: 'sensor.air_purifier_fault',
  motorRpm: 'sensor.air_purifier_motor_rpm_feedback',
  uv: 'switch.air_purifier_uv',
  anion: 'switch.air_purifier_anion',
  display: 'switch.air_purifier_switch_status',
  childLock: 'switch.air_purifier_physical_controls_locked',
  buzzer: 'switch.air_purifier_alarm',
  brightness: 'select.air_purifier_brightness',
  manualFanLevel: 'select.xiaomi_sg_2003887698_mb5_fan_level_p_9_1'
} as const

export const HISTORY_ENTITIES = {
  pm1: ENTITIES.pm1,
  pm25: ENTITIES.pm25,
  pm10: ENTITIES.pm10,
  temperature: ENTITIES.temperature,
  humidity: ENTITIES.humidity
} as const

export const CONTROL_ACTIONS = [
  'power_on',
  'power_off',
  'set_mode',
  'set_fan_speed',
  'uv_on',
  'uv_off',
  'anion_on',
  'anion_off',
  'display_on',
  'display_off',
  'set_brightness',
  'set_manual_fan_level',
  'child_lock_on',
  'child_lock_off',
  'buzzer_on',
  'buzzer_off'
] as const

export type ControlAction = (typeof CONTROL_ACTIONS)[number]

export const MANUAL_FAN_LEVEL_OPTIONS = [
  '1-3',
  '3-6',
  '5-9',
  '12-21',
  '16-28',
  '19-33',
  '20-35',
  '21-36',
  '24-41',
  '25-43',
  '26-44',
  '29-48'
] as const
