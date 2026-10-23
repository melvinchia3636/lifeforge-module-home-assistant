import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as control from './routes/control'
import * as history from './routes/history'
import * as settings from './routes/settings'
import * as stats from './routes/stats'

const routes = forgeRouter({
  settings,
  stats,
  history,
  control
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
