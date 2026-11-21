/**
 * Dated demand readings written by scripts/snapshot-demand.ts.
 * The score reads this file. It does not fetch on page render.
 */
import raw from '@/data/demand-snapshot.json'
import additions from '@/data/demand-snapshot-additions.json'

export type SnapshotReading = {
  feed: string
  status: 'ok' | 'unavailable'
  label: string
  value: number | null
  unit: string
  query: string | null
  sourceUrl: string | null
  retrievedOn: string
  reason: string | null
  names?: { name: string; url: string; count: number }[]
  capped?: boolean
}

export type DemandSnapshotFile = {
  retrievedOn: string
  note: string
  notCalled: { id: string; reason: string }[]
  problems: Record<string, SnapshotReading[]>
}

/**
 * Extra problems keep their readings in a side file so a rebase does not have
 * to merge the main snapshot. A slug in the side file wins. Counts there are
 * unavailable on purpose: a live fetch was not stored, and no number was invented.
 */
const extra = additions as { problems: DemandSnapshotFile['problems'] }
export const demandSnapshot: DemandSnapshotFile = {
  ...(raw as DemandSnapshotFile),
  problems: { ...(raw as DemandSnapshotFile).problems, ...extra.problems },
}

export function readingsFor(slug: string): SnapshotReading[] {
  return demandSnapshot.problems[slug] ?? []
}
