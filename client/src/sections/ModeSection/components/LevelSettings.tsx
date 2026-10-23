import { useModuleTranslation } from '@lifeforge/localization'
import { Flex, OptionsColumn, surface } from '@lifeforge/ui'

import { usePurifier } from '@/providers/PurifierProvider'
import { levelToPercentage, percentageToLevel } from '@/utils/fan'

import { CircleButton } from './CircleButton'
import { WaveIcon } from './WaveIcon'

export function LevelSettings() {
  const { t } = useModuleTranslation()
  const { stats, pending, onControl } = usePurifier()

  const level = percentageToLevel(stats.percentage)

  if (stats.preset_mode !== 'Level') {
    return null
  }

  return (
    <OptionsColumn
      bg={surface.light}
      description={t('controls.fanLevel')}
      icon="tabler:wave-sine"
      orientation="vertical"
      title={t('controls.levelSettings')}
    >
      <Flex justify="between" width="100%">
        {([1, 2, 3] as const).map(value => (
          <CircleButton
            key={value}
            ariaLabel={String(value)}
            disabled={pending || !stats.power}
            label={`Level ${value}`}
            selected={level === value}
            onClick={() =>
              onControl('set_fan_speed', String(levelToPercentage(value)))
            }
          >
            <WaveIcon count={value} />
          </CircleButton>
        ))}
      </Flex>
    </OptionsColumn>
  )
}
