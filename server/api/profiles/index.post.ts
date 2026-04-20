import { profiles } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: unknown; emoji?: unknown }>(event)
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const emoji = typeof body?.emoji === 'string' ? body.emoji.trim() : ''

  if (!name || name.length > 50) {
    throw createError({ statusCode: 400, statusMessage: 'Nom invalide' })
  }
  if (!emoji || emoji.length > 10) {
    throw createError({ statusCode: 400, statusMessage: 'Emoji invalide' })
  }

  const db = useDb()
  const [created] = await db.insert(profiles).values({ name, emoji }).returning()
  return created
})
