import { type ReactNode } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { Flex, Icon, OptionsColumn, Text, surface } from '@lifeforge/ui'

import { usePurifier } from '@/providers/PurifierProvider'

import { CircleButton } from './CircleButton'
import { WaveIcon } from './WaveIcon'

const MODE_ICONS: Record<string, ReactNode> = {
  auto: (
    <Text size="2xl" weight="medium">
      A
    </Text>
  ),
  level: <WaveIcon count={1} />,
  manual: <Icon icon="tabler:heart" size="1.6em" />,
  sleep: <Icon icon="tabler:moon" size="1.6em" />
}

export function ModeSettings() {
  const { t } = useModuleTranslation()
  const { stats, pending, onControl } = usePurifier()

  return (
    <OptionsColumn
      bg={surface.light}
      description={stats.preset_mode ?? t('status.unknown')}
      icon="tabler:adjustments"
      orientation="vertical"
      title={t('controls.mode')}
    >
      <Flex justify="between" width="100%">
        {stats.preset_modes.map(m => (
          <CircleButton
            key={m}
            ariaLabel={m}
            disabled={pending}
            label={m}
            selected={m === stats.preset_mode}
            onClick={() => onControl('set_mode', m)}
          >
            {MODE_ICONS[m.toLowerCase()]}
          </CircleButton>
        ))}
      </Flex>
    </OptionsColumn>
  )
}
