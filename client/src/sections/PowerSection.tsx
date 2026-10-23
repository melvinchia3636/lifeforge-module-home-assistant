import { useModuleTranslation } from '@lifeforge/localization'
import { OptionsColumn, Switch } from '@lifeforge/ui'

import { usePurifier } from '@/providers/PurifierProvider'

export function PowerSection() {
  const { t } = useModuleTranslation()
  const { stats, pending, onControl } = usePurifier()

  return (
    <OptionsColumn
      breakpoint={false}
      description={stats.power ? t('power.on') : t('power.off')}
      icon="tabler:power"
      title={t('controls.power')}
      width="100%"
    >
      <Switch
        disabled={pending || stats.power === null}
        value={stats.power ?? false}
        onChange={value => onControl(value ? 'power_on' : 'power_off')}
      />
    </OptionsColumn>
  )
}
