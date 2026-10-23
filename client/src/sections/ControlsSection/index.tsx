import { type ReactElement, isValidElement } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { Flex, Stack } from '@lifeforge/ui'

import type { ControlAction } from '@/providers/PurifierProvider'
import { usePurifier } from '@/providers/PurifierProvider'

import { SectionHeader } from '../../components/SectionHeader'
import { BrightnessControl } from './components/BrightnessControl'
import { ToggleControl } from './components/ToggleControl'

export function ControlsSection() {
  const { t } = useModuleTranslation()
  const { stats } = usePurifier()

  const controls: Array<
    | {
        key: string
        icon: string
        value: boolean | null
        on: ControlAction
        off: ControlAction
      }
    | ReactElement
  > = [
    {
      key: 'uv',
      icon: 'hugeicons:uv-02',
      value: stats.uv,
      on: 'uv_on',
      off: 'uv_off'
    },
    {
      key: 'anion',
      icon: 'tabler:wind',
      value: stats.anion,
      on: 'anion_on',
      off: 'anion_off'
    },
    {
      key: 'childLock',
      icon: 'tabler:lock',
      value: stats.child_lock,
      on: 'child_lock_on',
      off: 'child_lock_off'
    },
    {
      key: 'display',
      icon: 'tabler:brightness',
      value: stats.display,
      on: 'display_on',
      off: 'display_off'
    },
    <BrightnessControl key="brightness" />,
    {
      key: 'buzzer',
      icon: 'tabler:volume',
      value: stats.buzzer,
      on: 'buzzer_on',
      off: 'buzzer_off'
    }
  ]

  return (
    <Stack gap="sm" gridArea="controls" minWidth="0">
      <SectionHeader title={t('controls.title')} />
      <Flex direction="column" gap="md">
        {controls.map(control =>
          isValidElement(control) ? (
            control
          ) : (
            <ToggleControl
              key={control.key}
              icon={control.icon}
              labelKey={control.key}
              off={control.off}
              on={control.on}
              value={control.value}
            />
          )
        )}
      </Flex>
    </Stack>
  )
}
