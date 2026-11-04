const WINDOW_MS = 60_000
const MAX_HITS = 8
const hits = new Map<string, number[]>()

/** Light in-memory cap for the public research routes. Resets when the process restarts. */
export function takeResearchSlot(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < WINDOW_MS)
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent)
    return false
  }
  recent.push(now)
  hits.set(ip, recent)
  return true
}

export function researchClientIp(header: string | null): string {
  const first = header?.split(',')[0]?.trim()
  return first || 'local'
}
