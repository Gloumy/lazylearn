import { eq } from 'drizzle-orm'
import { progress } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const profileId = Number(getRouterParam(event, 'profileId'))
  if (!Number.isFinite(profileId) || profileId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'profileId invalide' })
  }
  const db = useDb()
  return await db.select().from(progress).where(eq(progress.profileId, profileId))
})
