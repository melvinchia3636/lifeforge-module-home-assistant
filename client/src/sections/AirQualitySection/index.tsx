import { Flex } from '@lifeforge/ui'

import { AirQualityReadout } from './components/AirQualityReadout'
import { ParticleGlow } from './components/ParticleGlow'

export function AirQualitySection() {
  return (
    <>
      <Flex
        align="center"
        direction="column"
        flex="1"
        gap="sm"
        justify="center"
        minHeight="50vh"
        p="md"
        position="relative"
      >
        <ParticleGlow />
        <AirQualityReadout />
      </Flex>
    </>
  )
}
