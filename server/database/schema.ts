import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core'

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  emoji: varchar('emoji', { length: 10 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const progress = pgTable('progress', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id').references(() => profiles.id, { onDelete: 'cascade' }),
  module: varchar('module', { length: 20 }).notNull(),
  ref: varchar('ref', { length: 50 }).notNull(),
  completedAt: timestamp('completed_at').defaultNow(),
})

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
