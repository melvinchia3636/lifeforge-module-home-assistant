import { Link, useNavigate } from 'react-router'

import { useQuery } from '@tanstack/react-query'

import { useForgeMutation } from '@lifeforge/api'
import type { WidgetConfig } from '@lifeforge/configs'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  EmptyStateScreen,
  Flex,
  Stack,
  Switch,
  Text,
  Widget
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { formatNumber } from '@/utils/format'

const MODULE_ROUTE = '/melvinchia3636--home-assistant'

function EmptyWidget({ description }: { description: string }) {
  const { t } = useModuleTranslation()
  const navigate = useNavigate()

  return (
    <EmptyStateScreen
      smaller
      CTAButtonProps={{
        children: t('buttons.configure'),
        icon: 'tabler:settings',
        namespace: false,
        onClick: () => navigate(MODULE_ROUTE)
      }}
      icon="tabler:wind"
      message={{
        title: t('widgets.homeAssistantPurifier.empty.title'),
        description
      }}
    />
  )
}

function PurifierWidget() {
  const { t } = useModuleTranslation()
  const settingsQuery = useQuery(forgeAPI.settings.get.queryOptions())
  
const configured = Boolean(settingsQuery.data?.settings)

  const statsQuery = useQuery(
    forgeAPI.stats.get.queryOptions({
      enabled: configured,
      refetchInterval: 10_000
    })
  )

  const controlMutation = useForgeMutation(forgeAPI.control.call, {
    action: 'update',
    queryKey: forgeAPI.stats.key
  })

  const stats = statsQuery.data

  return (
    <Widget
      actionComponent={
        <Button
          as={Link}
          icon="tabler:chevron-right"
          namespace={false}
          p="xs"
          to={MODULE_ROUTE}
          variant="plain"
        />
      }
      icon="tabler:wind"
      namespace={false}
      title={t('widgets.homeAssistantPurifier.title')}
    >
      {!configured ? (
        <EmptyWidget
          description={t('widgets.homeAssistantPurifier.empty.description')}
        />
      ) : statsQuery.isError ? (
        <EmptyWidget description={statsQuery.error.message} />
      ) : stats ? (
        <Flex direction="column" gap="md" height="100%" justify="between">
          <Flex align="start" justify="between">
            <Stack gap="xs">
              <Text color="muted" size="sm">
                {t('stats.pm25')}
              </Text>
              <Flex align="baseline" gap="xs">
                <Text size="3xl" weight="semibold">
                  {formatNumber(stats.pm25)}
                </Text>
                <Text color="muted" size="sm">
                  µg/m³
                </Text>
              </Flex>
            </Stack>
            <Switch
              disabled={
                controlMutation.isPending || stats.power === null
              }
              value={stats.power ?? false}
              onChange={value =>
                controlMutation.mutate({
                  action: value ? 'power_on' : 'power_off'
                })
              }
            />
          </Flex>
          <Flex align="center" gap="sm" justify="between">
            <Text color="muted" size="sm">
              {stats.preset_mode ?? t('status.unknown')}
            </Text>
            <Text
              color={stats.power ? 'green-500' : 'muted'}
              size="sm"
              weight="medium"
            >
              {stats.power ? t('power.on') : t('power.off')}
            </Text>
          </Flex>
        </Flex>
      ) : (
        <Flex align="center" height="100%" justify="center">
          <Text color="muted" size="sm">
            {t('status.loading')}
          </Text>
        </Flex>
      )}
    </Widget>
  )
}

export default PurifierWidget

export const config: WidgetConfig = {
  id: 'homeAssistantPurifier',
  icon: 'tabler:wind',
  minW: 2,
  minH: 2
}
