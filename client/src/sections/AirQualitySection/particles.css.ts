import { keyframes, style } from '@vanilla-extract/css'

const floatToCenter = keyframes({
  '0%': {
    opacity: 0,
    transform:
      'translate(calc(-50% + var(--particle-x)), calc(-50% + var(--particle-y))) scale(0.4)'
  },
  '20%': {
    opacity: 0.9
  },
  '100%': {
    opacity: 0,
    transform: 'translate(-50%, -50%) scale(0.1)'
  }
})

export const particle = style({
  animationDelay: 'var(--particle-delay)',
  animationDuration: 'var(--particle-duration)',
  animationIterationCount: 'infinite',
  animationName: floatToCenter,
  animationTimingFunction: 'ease-in',
  backgroundColor: 'var(--particle-color)',
  borderRadius: '9999px',
  height: 'var(--particle-size)',
  left: '50%',
  pointerEvents: 'none',
  position: 'absolute',
  top: '50%',
  transform:
    'translate(calc(-50% + var(--particle-x)), calc(-50% + var(--particle-y)))',
  width: 'var(--particle-size)',
  willChange: 'transform, opacity'
})
