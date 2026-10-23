import { useModuleTranslation } from '@lifeforge/localization'
import { OptionsColumn, Switch, surface } from '@lifeforge/ui'

import type { ControlAction } from '@/providers/PurifierProvider'
import { usePurifier } from '@/providers/PurifierProvider'

export function ToggleControl({
  labelKey,
  icon,
  value,
  on,
  off
}: {
  labelKey: string
  icon: string
  value: boolean | null
  on: ControlAction
  off: ControlAction
}) {
  const { t } = useModuleTranslation()
  const { pending, onControl } = usePurifier()

  return (
    <OptionsColumn
      bg={surface.light}
      breakpoint={false}
      description={value ? t('power.on') : t('power.off')}
      icon={icon}
      title={t(`controls.${labelKey}`)}
    >
      <Switch
        disabled={pending || value === null}
        value={value ?? false}
        onChange={next => onControl(next ? on : off)}
      />
    </OptionsColumn>
  )
}
