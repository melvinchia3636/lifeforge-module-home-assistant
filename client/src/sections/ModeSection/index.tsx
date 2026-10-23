import { Flex } from '@lifeforge/ui'

import { LevelSettings } from './components/LevelSettings'
import { ManualFanLevel } from './components/ManualFanLevel'
import { ModeSettings } from './components/ModeSettings'

export function ModeSection() {
  return (
    <Flex direction="column" gap="md" width="100%">
      <ModeSettings />
      <LevelSettings />
      <ManualFanLevel />
    </Flex>
  )
}
