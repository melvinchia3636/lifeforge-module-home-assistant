import { style } from '@vanilla-extract/css'

import { vars } from '@lifeforge/ui'

export const dashboardGrid = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: '1fr',
  gridTemplateAreas: `
    "airQuality"
    "history"
    "controls"
    "status"
  `,
  '@media': {
    'screen and (min-width: 1280px)': {
      gridTemplateColumns: '2fr 1fr',
      gridTemplateRows: 'auto auto 1fr',
      gridTemplateAreas: `
        "airQuality history"
        "airQuality controls"
        "airQuality status"
      `
    }
  }
})
