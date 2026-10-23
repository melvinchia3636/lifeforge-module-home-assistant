import { useQuery } from '@tanstack/react-query'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  ContextMenu,
  ContextMenuItem,
  EmptyStateScreen,
  Flex,
  Grid,
  ModuleHeader,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import { ConfigureModal } from './components/ConfigureModal'
import { dashboardGrid } from './dashboardGrid.css'
import { PurifierProvider } from './providers/PurifierProvider'
import { AirQualityMetricsSection } from './sections/AirQualityMetricsSection'
import { AirQualitySection } from './sections/AirQualitySection'
import { ControlsSection } from './sections/ControlsSection'
import { HistorySection } from './sections/HistorySection'
import { ModeSection } from './sections/ModeSection'
import { PowerSection } from './sections/PowerSection'
import { StatusSection } from './sections/StatusSection'

function HomeAssistant() {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()
  const settingsQuery = useQuery(forgeAPI.settings.get.queryOptions())

  return (
    <>
      <ModuleHeader
        trailing={
          <ContextMenu>
            <ContextMenuItem
              icon="tabler:settings"
              label="buttons.configure"
              onClick={() =>
                open(ConfigureModal, {
                  initialData: settingsQuery.data?.settings ?? null
                })
              }
            />
          </ContextMenu>
        }
      />
      <WithQuery query={settingsQuery}>
        {({ settings }) =>
          settings ? (
            <PurifierProvider>
              <Grid
                className={dashboardGrid}
                flex="none"
                minHeight="100%"
                pb="2xl"
                width="100%"
              >
                <Flex
                  align="center"
                  direction="column"
                  gap="md"
                  gridArea="airQuality"
                  justify="center"
                  minHeight="240px"
                  r="lg"
                >
                  <AirQualitySection />
                  <AirQualityMetricsSection />
                  <PowerSection />
                  <ModeSection />
                </Flex>
                <ControlsSection />
                <StatusSection />
                <HistorySection />
              </Grid>
            </PurifierProvider>
          ) : (
            <EmptyStateScreen
              CTAButtonProps={{
                children: t('buttons.configure'),
                icon: 'tabler:settings',
                namespace: false,
                onClick: () => open(ConfigureModal, { initialData: null })
              }}
              icon="tabler:plug-connected"
              message={{
                title: t('noConnection.title'),
                description: t('noConnection.description')
              }}
            />
          )
        }
      </WithQuery>
    </>
  )
}

export default HomeAssistant
