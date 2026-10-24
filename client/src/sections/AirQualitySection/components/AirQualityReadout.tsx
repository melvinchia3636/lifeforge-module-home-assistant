import { useModuleTranslation } from '@lifeforge/localization'
import { Flex, Icon, Text } from '@lifeforge/ui'

import { usePurifier } from '@/providers/PurifierProvider'
import { formatNumber } from '@/utils/format'

export function AirQualityReadout({ compact = false }: { compact?: boolean }) {
  const { t } = useModuleTranslation()
  const { stats, pm25Status } = usePurifier()

  return (
    <Flex
      align="center"
      direction="column"
      gap={compact ? 'xs' : 'sm'}
      position="relative"
      zIndex="1"
    >
      <Text size={compact ? 'sm' : 'lg'}>{t('airQuality.title')}</Text>
      <Text size={compact ? '3xl' : '7xl'} weight="semibold">
        {t(`airQuality.${pm25Status.key}`)}
      </Text>
      <Flex align="center" gap={compact ? 'md' : 'lg'}>
        {(
          [
            ['tabler:temperature', stats.temperature, 1, '°C'],
            ['tabler:droplet', stats.humidity, 0, '%']
          ] as const
        ).map(([icon, value, digits, unit]) => (
          <Flex key={icon} align="center" gap="xs">
            <Icon icon={icon} size={compact ? '1em' : '1.25em'} />
            <Text size={compact ? 'sm' : 'xl'}>
              {formatNumber(value, digits)}
              {unit}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
