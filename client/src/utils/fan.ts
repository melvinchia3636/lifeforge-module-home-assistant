export type FanLevel = 1 | 2 | 3

export function percentageToLevel(percentage: number | null): FanLevel {
  if (percentage === null || percentage <= 33) {
    return 1
  }

  if (percentage <= 66) {
    return 2
  }

  return 3
}

export function levelToPercentage(level: FanLevel): number {
  return {
    1: 33,
    2: 66,
    3: 100
  }[level]
}
