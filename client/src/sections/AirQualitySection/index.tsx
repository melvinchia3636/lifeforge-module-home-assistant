import { Flex } from '@lifeforge/ui'

import { AirQualityReadout } from './components/AirQualityReadout'
import { ParticleGlow } from './components/ParticleGlow'

export function AirQualitySection({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <Flex
        align="center"
        direction="column"
        flex="1"
        gap={compact ? 'xs' : 'sm'}
        justify="center"
        minHeight={compact ? 'auto' : '30vh'}
        p={compact ? 'sm' : 'md'}
        position="relative"
      >
        <ParticleGlow compact={compact} />
        <AirQualityReadout compact={compact} />
      </Flex>
    </>
  )
}
