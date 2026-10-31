import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import type { InferOutput } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Card,
  COLORS,
  EmptyStateScreen,
  Flex,
  Listbox,
  ListboxOption,
  Stack,
  Text,
  usePersonalization,
  WithQuery
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { formatNumber } from '@/utils/format'

type Range = '6h' | '24h' | '7d'
type History = InferOutput<typeof forgeAPI.history.get>

const RANGE_OPTIONS: Array<{ value: Range; label: string }> = [
  { value: '6h', label: 'chart.range6h' },
  { value: '24h', label: 'chart.range24h' },
  { value: '7d', label: 'chart.range7d' }
]

export function HistorySection() {
  const { t } = useModuleTranslation()
  const { bgTempPalette, derivedTheme } = usePersonalization()
  const [range, setRange] = useState<Range>('24h')

  const historyQuery = useQuery(
    forgeAPI.history.get.input({ range }).queryOptions({
      refetchInterval: 60_000
    })
  )

  function formatTick(value: number) {
    return dayjs(value).format(range === '7d' ? 'MMM D' : 'HH:mm')
  }

  function formatTooltip(value: number) {
    return dayjs(value).format('MMM D, HH:mm')
  }

  const CustomTooltip = ({
    active,
    payload,
    label
  }: {
    active?: boolean
    payload?: Array<{
      value: number
      name: string
      stroke: string
    }>
    label?: number
  }) => {
    if (!active || !payload || payload.length === 0) {
      return null
    }

    return (
      <Card>
        <Stack>
          <Text mb="sm" weight="medium">
            {formatTooltip(label ?? 0)}
          </Text>
          <Stack gap="xs">
            {payload.map((entry, index) => (
              <Flex key={index} align="center" gap="lg" justify="between">
                <Flex align="center" gap="sm">
                  <Box
                    height="0.625rem"
                    r="full"
                    style={{ backgroundColor: entry.stroke }}
                    width="0.625rem"
                  />
                  <Text color="muted">{entry.name}:</Text>
                </Flex>
                <Text style={{ color: entry.stroke }} weight="semibold">
                  {formatNumber(entry.value)} µg/m³
                </Text>
              </Flex>
            ))}
          </Stack>
        </Stack>
      </Card>
    )
  }

  return (
    <Stack gap="sm" gridArea="history" minWidth="0">
      <Flex align="center" gap="sm" pl="md" position="relative">
        <Box
          bg="custom-500"
          bottom="0"
          left="0"
          position="absolute"
          r="full"
          top="0"
          width="0.25rem"
        />
        <Text as="h2" size="lg" weight="semibold">
          {t('chart.title')}
        </Text>
      </Flex>
      <Listbox
        minWidth="10em"
        my="sm"
        value={range}
        onChange={value => setRange(value)}
      >
        {RANGE_OPTIONS.map(option => (
          <ListboxOption
            key={option.value}
            label={t(option.label)}
            value={option.value}
          />
        ))}
      </Listbox>
      <WithQuery query={historyQuery}>
        {(history: History) => {
          if (history.points.length === 0) {
            return (
              <EmptyStateScreen
                smaller
                icon="tabler:chart-line"
                message={{ title: t('chart.empty') }}
              />
            )
          }

          const start = history.points[0]?.t ?? 0
          const firstValueTime = history.points.find(
            point =>
              point.pm1 != null ||
              point.pm25 != null ||
              point.pm10 != null
          )?.t
          const xMin = Math.max(start, firstValueTime ?? start)
          const chartPoints = history.points.filter(point => point.t >= xMin)

          return (
            <Box height="20em" width="100%">
              <ResponsiveContainer height="100%" width="100%">
                <LineChart
                  data={chartPoints}
                  margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
                >
                  <CartesianGrid
                    stroke={bgTempPalette[derivedTheme === 'dark' ? '800' : '200']}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    axisLine={false}
                    dataKey="t"
                    domain={[xMin, 'dataMax']}
                    minTickGap={24}
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    tickFormatter={formatTick}
                    tickLine={false}
                    type="number"
                  />
                  <YAxis
                    axisLine={false}
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    tickLine={false}
                    width={50}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }}
                  />
                  <Legend />
                  <Line
                    connectNulls
                    dataKey="pm1"
                    dot={false}
                    isAnimationActive={false}
                    name={t('chart.pm1')}
                    stroke={COLORS['green-500']}
                    strokeWidth={2}
                    type="monotone"
                  />
                  <Line
                    connectNulls
                    dataKey="pm25"
                    dot={false}
                    isAnimationActive={false}
                    name={t('chart.pm25')}
                    stroke="var(--color-custom-500)"
                    strokeWidth={2}
                    type="monotone"
                  />
                  <Line
                    connectNulls
                    dataKey="pm10"
                    dot={false}
                    isAnimationActive={false}
                    name={t('chart.pm10')}
                    stroke={COLORS['blue-500']}
                    strokeWidth={2}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )
        }}
      </WithQuery>
    </Stack>
  )
}
