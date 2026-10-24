import {
  type CSSProperties,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { Box } from '@lifeforge/ui'

import { usePurifier } from '@/providers/PurifierProvider'

import { particle } from '../particles.css'

const CLIPPING_OVERFLOW = ['auto', 'scroll', 'hidden', 'clip']

function getClipBounds(element: HTMLElement) {
  let node = element.parentElement

  while (node) {
    const { overflowX, overflowY } = getComputedStyle(node)

    if (
      CLIPPING_OVERFLOW.includes(overflowX) ||
      CLIPPING_OVERFLOW.includes(overflowY)
    ) {
      return node.getBoundingClientRect()
    }

    node = node.parentElement
  }

  return {
    bottom: window.innerHeight,
    left: 0,
    right: window.innerWidth,
    top: 0
  }
}

/**
 * Measures how large a square centered on the element can grow before any of
 * its edges reach the nearest clipping (scroll) container.
 */
function useMaxGlowSize(
  ref: RefObject<HTMLDivElement | null>,
  enabled: boolean
) {
  const [size, setSize] = useState<number>()

  useEffect(() => {
    const element = ref.current

    if (!enabled || !element) return

    const updateSize = () => {
      const rect = element.getBoundingClientRect()
      const bounds = getClipBounds(element)
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      setSize(
        Math.max(
          0,
          2 *
            Math.min(
              centerX - bounds.left,
              bounds.right - centerX,
              centerY - bounds.top,
              bounds.bottom - centerY
            )
        )
      )
    }

    const observer = new ResizeObserver(updateSize)

    observer.observe(element)
    updateSize()

    window.addEventListener('resize', updateSize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateSize)
    }
  }, [enabled, ref])

  return size
}

export function ParticleGlow({ compact = false }: { compact?: boolean }) {
  const { pm25Status } = usePurifier()
  const glowRef = useRef<HTMLDivElement>(null)
  const maxSize = useMaxGlowSize(glowRef, compact)

  const particles = useMemo(
    () =>
      Array.from({ length: compact ? 14 : 28 }, (_, id) => {
        const angle = Math.random() * Math.PI * 2
        const distance = compact
          ? 30 + Math.random() * 70
          : 120 + Math.random() * 220
        const duration = 4 + Math.random() * 4

        return {
          id,
          delay: `${-Math.random() * duration}s`,
          duration: `${duration}s`,
          size: `${(compact ? 6 : 12) + Math.random() * (compact ? 4 : 8)}px`,
          x: `${Math.cos(angle) * distance}px`,
          y: `${Math.sin(angle) * distance}px`
        }
      }),
    [compact]
  )

  return (
    <Box
      ref={glowRef}
      aspectRatio="1"
      position="absolute"
      style={{
        backgroundImage: `radial-gradient(circle closest-side, color-mix(in srgb, ${pm25Status.color} 60%, transparent) 0%, color-mix(in srgb, ${pm25Status.color} 25%, transparent) 45%, transparent 85%)`,
        left: '50%',
        pointerEvents: 'none',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
      {...(compact
        ? maxSize === undefined
          ? { height: '100%' }
          : { width: `${maxSize}px` }
        : {
            width: {
              base: '22rem',
              sm: '28rem',
              md: '36rem'
            }
          })}
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
