import { progress } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    profileId?: unknown
    module?: unknown
    ref?: unknown
  }>(event)
  const profileId = Number(body?.profileId)
  const module = typeof body?.module === 'string' ? body.module : ''
  const ref = typeof body?.ref === 'string' ? body.ref : ''

  if (!Number.isFinite(profileId) || profileId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'profileId invalide' })
  }
  if (!module || module.length > 20) {
    throw createError({ statusCode: 400, statusMessage: 'module invalide' })
  }
  if (!ref || ref.length > 50) {
    throw createError({ statusCode: 400, statusMessage: 'ref invalide' })
  }

  const db = useDb()
  const [created] = await db.insert(progress).values({ profileId, module, ref }).returning()
  return created
})
