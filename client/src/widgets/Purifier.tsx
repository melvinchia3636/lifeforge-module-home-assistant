import { Link, useNavigate } from 'react-router'

import type { WidgetConfig } from '@lifeforge/configs'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  EmptyStateScreen,
  Flex,
  Scrollbar,
  Widget,
  WithQueryData
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { PurifierProvider } from '@/providers/PurifierProvider'
import { AirQualityMetricsSection } from '@/sections/AirQualityMetricsSection'
import { AirQualitySection } from '@/sections/AirQualitySection'

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
      <WithQueryData contract={forgeAPI.settings.get}>
        {({ settings }) =>
          settings ? (
            <PurifierProvider>
              <Scrollbar>
                <Flex
                  direction="column"
                  gap="xs"
                  height="100%"
                  justify="center"
                  width="100%"
                >
                  <AirQualitySection compact />
                  <AirQualityMetricsSection compact />
                </Flex>
              </Scrollbar>
            </PurifierProvider>
          ) : (
            <EmptyWidget
              description={t('widgets.homeAssistantPurifier.empty.description')}
            />
          )
        }
      </WithQueryData>
    </Widget>
  )
}

export default PurifierWidget

export const config: WidgetConfig = {
  id: 'homeAssistantPurifier',
  icon: 'tabler:wind',
  minW: 2,
  minH: 3
}
