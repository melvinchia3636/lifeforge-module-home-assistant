import { type CSSProperties, useMemo } from 'react'

import { Box } from '@lifeforge/ui'

import { usePurifier } from '@/providers/PurifierProvider'

import { particle } from '../particles.css'

export function ParticleGlow() {
  const { pm25Status } = usePurifier()

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, id) => {
        const angle = Math.random() * Math.PI * 2
        const distance = 120 + Math.random() * 220
        const duration = 4 + Math.random() * 4

        return {
          id,
          delay: `${-Math.random() * duration}s`,
          duration: `${duration}s`,
          size: `${12 + Math.random() * 8}px`,
          x: `${Math.cos(angle) * distance}px`,
          y: `${Math.sin(angle) * distance}px`
        }
      }),
    []
  )

  return (
    <Box
      aspectRatio="1"
      position="absolute"
      style={{
        backgroundImage: `radial-gradient(circle closest-side, color-mix(in srgb, ${pm25Status.color} 60%, transparent) 0%, color-mix(in srgb, ${pm25Status.color} 25%, transparent) 45%, transparent 85%)`,
        left: '50%',
        pointerEvents: 'none',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
      width={{
        base: '22rem',
        sm: '28rem',
        md: '36rem'
      }}
      zIndex="0"
    >
      {particles.map(({ id, ...styles }) => (
        <Box
          key={id}
          className={particle}
          style={
            {
              '--particle-color': pm25Status.color,
              '--particle-delay': styles.delay,
              '--particle-duration': styles.duration,
              '--particle-size': styles.size,
              '--particle-x': styles.x,
              '--particle-y': styles.y
            } as CSSProperties
          }
        />
      ))}
    </Box>
  )
}
