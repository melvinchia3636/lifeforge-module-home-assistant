import { useModuleTranslation } from '@lifeforge/localization'
import { Listbox, ListboxOption, OptionsColumn, surface } from '@lifeforge/ui'

import { usePurifier } from '@/providers/PurifierProvider'

export function BrightnessControl() {
  const { t } = useModuleTranslation()
  const { stats, pending, onControl } = usePurifier()

  if (stats.brightness_options.length === 0) {
    return null
  }

  return (
    <OptionsColumn
      bg={surface.light}
      description={stats.brightness ?? t('status.unknown')}
      icon="tabler:sun"
      orientation="vertical"
      title={t('controls.brightness')}
    >
      <Listbox
        disabled={pending || !stats.display || stats.brightness === null}
        value={stats.brightness ?? ''}
        width="100%"
        onChange={value => onControl('set_brightness', value)}
      >
        {stats.brightness_options.map(option => (
          <ListboxOption key={option} label={option} value={option} />
        ))}
      </Listbox>
    </OptionsColumn>
  )
}
