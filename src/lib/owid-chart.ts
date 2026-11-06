/**
 * Problem-page OWID chart. This reads the frozen render snapshot.
 * It does not call Our World in Data at request time, so the page and
 * `/api/rendered` cannot drift apart.
 */
import { owidChartFromSnapshot, type SnapshotChart } from '@/lib/render-snapshot'

export type ProblemOwidChart = SnapshotChart

export async function loadProblemOwidChart(problemSlug: string): Promise<ProblemOwidChart> {
  return owidChartFromSnapshot(problemSlug)
}
