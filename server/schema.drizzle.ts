import { type RelationsBuilder } from 'drizzle-orm'
import { text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { createModuleTable } from '@lifeforge/drizzle'

const pgTable = createModuleTable()

export const homeAssistantSettings = pgTable('settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  base_url: text('base_url').notNull(),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const tables = { settings: homeAssistantSettings }

export const relations = (_r: RelationsBuilder<typeof tables>) => ({})
