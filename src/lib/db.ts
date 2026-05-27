/**
 * Thin wrapper around the Neon serverless driver. Gracefully no-ops when
 * DATABASE_URL is not configured so the rest of the app can render and the
 * cron endpoints can still report status.
 *
 * The driver itself is HTTP-based — no long-lived connection, fine for
 * Vercel's edge / serverless runtimes.
 */
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

let cached: NeonQueryFunction<false, false> | null = null

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

/**
 * Returns the Neon sql tag. Throws if DATABASE_URL is not configured —
 * callers should check `isDbConfigured()` first when they want to degrade
 * gracefully.
 */
export function getSql(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is not configured. Wire it in Vercel env vars before calling getSql().',
    )
  }
  if (!cached) {
    cached = neon(url)
  }
  return cached
}
