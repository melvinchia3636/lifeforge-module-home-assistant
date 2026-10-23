import type { FanLevel } from '@/utils/fan'

const WAVE_LEVELS: Record<FanLevel, number[]> = {
  1: [12],
  2: [8, 16],
  3: [6, 12, 18]
} as const

export function WaveIcon({ count }: { count: FanLevel }) {
  return (
    <svg
      height="1.5em"
      viewBox="0 0 24 24"
      width="1.5em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      {WAVE_LEVELS[count].map(y => (
        <path
          key={y}
          d={`M4 ${y}s4 2.025 8 0s8 0 8 0`}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      ))}
    </svg>
  )
}
