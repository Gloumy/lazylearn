import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

let _pool: Pool | null = null

export function useDb() {
  if (!_pool) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL is not configured')
    _pool = new Pool({ connectionString: url })
  }
  return drizzle(_pool)
}
