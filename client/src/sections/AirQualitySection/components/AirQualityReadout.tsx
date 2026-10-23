import { useModuleTranslation } from '@lifeforge/localization'
import { Flex, Icon, Text } from '@lifeforge/ui'

import { usePurifier } from '@/providers/PurifierProvider'
import { formatNumber } from '@/utils/format'

export function AirQualityReadout() {
  const { t } = useModuleTranslation()
  const { stats, pm25Status } = usePurifier()

  return (
    <Flex
      align="center"
      direction="column"
      gap="sm"
      position="relative"
      zIndex="1"
    >
      <Text size="lg">{t('airQuality.title')}</Text>
      <Text size="7xl" weight="semibold">
        {t(`airQuality.${pm25Status.key}`)}
      </Text>
      <Flex align="center" gap="lg">
        {(
          [
            ['tabler:temperature', stats.temperature, 1, '°C'],
            ['tabler:droplet', stats.humidity, 0, '%']
          ] as const
        ).map(([icon, value, digits, unit]) => (
          <Flex key={icon} align="center" gap="xs">
            <Icon icon={icon} />
            <Text size="xl">
              {formatNumber(value, digits)}
              {unit}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
