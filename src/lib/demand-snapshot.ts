/**
 * Dated demand readings written by scripts/snapshot-demand.ts.
 * The score reads this file. It does not fetch on page render.
 */
import raw from '@/data/demand-snapshot.json'

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
}

export type DemandSnapshotFile = {
  retrievedOn: string
  note: string
  notCalled: { id: string; reason: string }[]
  problems: Record<string, SnapshotReading[]>
}

export const demandSnapshot = raw as DemandSnapshotFile

export function readingsFor(slug: string): SnapshotReading[] {
  return demandSnapshot.problems[slug] ?? []
}
