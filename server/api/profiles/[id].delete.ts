import { eq } from 'drizzle-orm'
import { profiles } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'ID invalide' })
  }
  const db = useDb()
  await db.delete(profiles).where(eq(profiles.id, id))
  return { ok: true }
})
