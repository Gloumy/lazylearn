import { profiles } from '../../database/schema'

export default defineEventHandler(async () => {
  const db = useDb()
  return await db.select().from(profiles).orderBy(profiles.createdAt)
})
