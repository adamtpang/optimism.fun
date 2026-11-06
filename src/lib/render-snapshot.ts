/**
 * The only copy of WHO, OWID, and World Bank series the pages render.
 * `/api/rendered` returns this same object. Nothing here calls the network.
 */
import snapshot from '@/data/snapshots/rendered-2026-11-06.json'
import { owidChartFor } from '@/data/owid-charts'
import type { BurdenFeed } from '@/data/demand-signals'
import type { BurdenReading } from '@/lib/burden-feed'
import type { OwidChart } from '@/lib/sources/owid'

export const RENDER_SNAPSHOT_ID = '2026-11-06'

type Point = { year: number; value: number }

type OwidRow = {
  problem: string
  slug: string
  status: string
  title?: string
  unit?: string
  citation?: string
  sourceAsOf?: string
  url?: string
  retrievedAt?: string
  series?: Point[]
  latest?: Point | null
}

type WhoRow = {
  code: string
  label: string
  status: string
  url?: string
  retrievedAt?: string
  series?: Point[]
  latest?: Point | null
}

type WdiRow = {
  indicator: string
  label: string
  status: string
  url?: string
  retrievedAt?: string
  series?: Point[]
  latest?: Point | null
}

type SnapshotFile = {
  retrievedAt: string
  note: string
  owid: OwidRow[]
  who: WhoRow[]
  worldbankWdi: WdiRow[]
}

export const renderSnapshot = snapshot as SnapshotFile

export type SnapshotChart =
  | { state: 'unmapped' }
  | { state: 'unavailable'; reason: string }
  | { state: 'ok'; chart: OwidChart }

export function owidChartFromSnapshot(problemSlug: string): SnapshotChart {
  const mapping = owidChartFor(problemSlug)
  if (!mapping) return { state: 'unmapped' }
  const row = renderSnapshot.owid.find((item) => item.problem === problemSlug && item.slug === mapping.slug)
  if (!row || row.status !== 'ok' || !row.series || row.series.length < 2) {
    return {
      state: 'unavailable',
      reason: `No captured World series for ${mapping.slug} in snapshot ${RENDER_SNAPSHOT_ID}.`,
    }
  }
  return {
    state: 'ok',
    chart: {
      slug: row.slug,
      title: row.title || row.slug,
      unit: row.unit || '',
      citation: row.citation || '',
      url: row.url || `https://ourworldindata.org/grapher/${row.slug}`,
      asOf: row.sourceAsOf || RENDER_SNAPSHOT_ID,
      series: row.series,
    },
  }
}

export function wdiSeriesFromSnapshot(indicator: string): WdiRow | null {
  return renderSnapshot.worldbankWdi.find((row) => row.indicator === indicator) ?? null
}

export function whoSeriesFromSnapshot(code: string): WhoRow | null {
  return renderSnapshot.who.find((row) => row.code === code) ?? null
}

/** Burden number shown on the demand page. Same rows as the export. */
export function burdenFromSnapshot(feed: BurdenFeed): BurdenReading {
  if (feed.kind === 'who') {
    const row = whoSeriesFromSnapshot(feed.code)
    if (!row || row.status !== 'ok' || !row.latest) {
      return {
        status: 'unavailable',
        source: 'WHO',
        url: row?.url ?? 'https://data.who.int',
        label: feed.label,
        reason: `WHO ${feed.code} is not in snapshot ${RENDER_SNAPSHOT_ID}.`,
      }
    }
    return {
      status: 'ok',
      value: row.latest.value,
      year: row.latest.year,
      source: 'WHO',
      url: row.url ?? 'https://data.who.int',
      label: feed.label,
      unit: feed.unit,
    }
  }
  if (feed.kind === 'owid') {
    const row = renderSnapshot.owid.find((item) => item.slug === feed.slug && item.status === 'ok' && item.latest)
    if (!row?.latest) {
      return {
        status: 'unavailable',
        source: 'Our World in Data',
        url: `https://ourworldindata.org/grapher/${feed.slug}`,
        label: feed.label,
        reason: `OWID ${feed.slug} is not in snapshot ${RENDER_SNAPSHOT_ID}.`,
      }
    }
    return {
      status: 'ok',
      value: row.latest.value,
      year: row.latest.year,
      source: 'Our World in Data',
      url: row.url ?? `https://ourworldindata.org/grapher/${feed.slug}`,
      label: feed.label,
      unit: feed.unit,
    }
  }
  const row = wdiSeriesFromSnapshot(feed.indicator)
  if (!row || row.status !== 'ok' || !row.latest) {
    return {
      status: 'unavailable',
      source: 'World Bank WDI',
      url: `https://data.worldbank.org/indicator/${feed.indicator}`,
      label: feed.label,
      reason: `WDI ${feed.indicator} is not in snapshot ${RENDER_SNAPSHOT_ID}.`,
    }
  }
  return {
    status: 'ok',
    value: row.latest.value,
    year: row.latest.year,
    source: 'World Bank WDI',
    url: row.url ?? `https://data.worldbank.org/indicator/${feed.indicator}`,
    label: feed.label,
    unit: feed.unit,
  }
}
