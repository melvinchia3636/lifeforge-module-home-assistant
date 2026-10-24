import { Fragment } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { Box, Flex, Text } from '@lifeforge/ui'

import { usePurifier } from '@/providers/PurifierProvider'
import { formatNumber } from '@/utils/format'

export function AirQualityMetricsSection({
  compact = false
}: {
  compact?: boolean
}) {
  const { t } = useModuleTranslation()
  const { stats } = usePurifier()

  const pmValues = [
    { key: 'pm25', unit: 'µg/m³', value: stats.pm25 },
    { key: 'pm10', value: stats.pm10 },
    { key: 'pm1', unit: 'µg/m³', value: stats.pm1 }
  ]

  return (
    <Flex
      align="center"
      gap="md"
      justify="center"
      minWidth="0"
      p={compact ? 'none' : 'lg'}
      position="relative"
      width="100%"
      zIndex="2"
    >
      {pmValues.map(({ key, unit, value }, index) => {
        const formatted = formatNumber(value)

        return (
          <Fragment key={key}>
            {index > 0 && (
              <Box
                height="2.5rem"
                style={{
                  backgroundColor:
                    'color-mix(in srgb, var(--color-bg-500) 40%, transparent)'
                }}
                width="1px"
              />
            )}
            <Flex
              direction="column"
              flex="1"
              gap="xs"
              minWidth="0"
              width="100%"
            >
              <Flex align="baseline" gap="xs" justify="center">
                <Text size={compact ? '2xl' : '4xl'} weight="semibold">
                  {formatted === '-' ? formatted : formatted.padStart(3, '0')}
                </Text>
              </Flex>
              <Text
                truncate
                align="center"
                as="p"
                color="muted"
                size={compact ? 'sm' : 'base'}
              >
                {t(`stats.${key}`)} {unit && `(${unit})`}
              </Text>
            </Flex>
          </Fragment>
        )
      })}
    </Flex>
  )
}
