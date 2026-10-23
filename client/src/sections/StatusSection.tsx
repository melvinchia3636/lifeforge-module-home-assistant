import dayjs from 'dayjs'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Card,
  COLORS,
  colorWithOpacity,
  Flex,
  Icon,
  Stack,
  surface,
  TagChip,
  Text,
  WithDivide
} from '@lifeforge/ui'

import { usePurifier } from '@/providers/PurifierProvider'
import { formatNumber } from '@/utils/format'

import { SectionHeader } from '../components/SectionHeader'

export function StatusSection() {
  const { t } = useModuleTranslation()
  const { stats } = usePurifier()

  const hasFault = stats.fault !== 'No Faults'

  const rows = [
    {
      key: 'fault',
      icon: 'tabler:alert-circle',
      value: (
        <TagChip
          color={hasFault ? COLORS['red-500'] : COLORS['green-500']}
          label={stats.fault}
          size="sm"
          variant="outlined"
        />
      )
    },
    {
      key: 'airQuality',
      icon: 'tabler:leaf',
      value: (
        <Text weight="medium">
          {stats.air_quality ?? t('status.unknown')}
        </Text>
      )
    },
    {
      key: 'filterLife',
      icon: 'tabler:filter',
      value: (
        <Text weight="medium">{formatNumber(stats.filter_life)}%</Text>
      )
    },
    {
      key: 'motorRpm',
      icon: 'tabler:gauge',
      value: <Text weight="medium">{formatNumber(stats.motor_rpm)}</Text>
    },
    {
      key: 'lastUpdated',
      icon: 'tabler:clock',
      value: (
        <Text weight="medium">
          {dayjs(stats.updated_at).format('MMM D, HH:mm')}
        </Text>
      )
    }
  ]

  return (
    <Stack gap="sm" gridArea="status" height="100%" minWidth="0">
      <SectionHeader title={t('status.title')} />
      <Card
        bg={surface.light}
        flex="1"
        gap="none"
        overflow="hidden"
        p="none"
        width="100%"
      >
        {rows.map(({ key, icon, value }) => (
          <WithDivide
            key={key}
            color={{
              base: 'bg-200',
              dark: colorWithOpacity('bg-700', '30%')
            }}
          >
            <Flex
              align={{ base: 'start', sm: 'center' }}
              direction={{ base: 'column', sm: 'row' }}
              gap={{ base: 'xs', sm: 'xl' }}
              justify="between"
              minWidth="0"
              p="md"
              width="100%"
            >
              <Flex align="center" flexShrink="0" gap="sm" minWidth="0">
                <Icon color="muted" icon={icon} />
                <Text as="h3" color="muted" weight="medium">
                  {t(`stats.${key}`)}
                </Text>
              </Flex>
              <Flex
                align={{ base: 'start', sm: 'center' }}
                flex="1"
                justify={{ sm: 'end' }}
                minWidth="0"
              >
                {value}
              </Flex>
            </Flex>
          </WithDivide>
        ))}
      </Card>
      <Text color="muted" size="sm">
        * {t('status.description')}
      </Text>
    </Stack>
  )
}
