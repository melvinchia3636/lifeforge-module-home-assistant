import { useEffect, useRef, useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { Box, OptionsColumn, SliderInput, surface } from '@lifeforge/ui'

import { usePurifier } from '@/providers/PurifierProvider'

export function ManualFanLevel() {
  const { t } = useModuleTranslation()
  const { stats, pending, onControl } = usePurifier()

  const manualOptions = stats.manual_fan_level_options
  const currentManualIndex = Math.max(
    0,
    manualOptions.indexOf(stats.manual_fan_level ?? '')
  )

  const [manualIndex, setManualIndex] = useState(currentManualIndex)
  const lastManualIndex = useRef(currentManualIndex)

  useEffect(() => {
    const next = Math.max(
      0,
      manualOptions.indexOf(stats.manual_fan_level ?? '')
    )

    setManualIndex(next)
    lastManualIndex.current = next
  }, [stats.manual_fan_level])

  if (stats.preset_mode !== 'Manual') {
    return null
  }

  function commitManual() {
    if (manualIndex === lastManualIndex.current) {
      return
    }

    lastManualIndex.current = manualIndex

    const option = manualOptions[manualIndex]

    if (option !== undefined) {
      onControl('set_manual_fan_level', option)
    }
  }

  return (
    <OptionsColumn
      bg={surface.light}
      description={stats.manual_fan_level ?? t('status.unknown')}
      icon="tabler:gauge"
      orientation="vertical"
      title={t('controls.manualFanLevel')}
    >
      <Box width="100%" onKeyUp={commitManual} onPointerUp={commitManual}>
        <SliderInput
          disabled={pending || !stats.power || manualOptions.length === 0}
          icon="tabler:gauge"
          label={t('controls.manualFanLevel')}
          max={Math.max(manualOptions.length - 1, 0)}
          min={0}
          namespace={false}
          renderValue={value => manualOptions[value] ?? ''}
          step={1}
          value={manualIndex}
          onChange={setManualIndex}
        />
      </Box>
    </OptionsColumn>
  )
}
