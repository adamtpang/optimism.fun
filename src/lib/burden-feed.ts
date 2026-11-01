/**
 * One burden observation for the demand page and the refresh audit.
 * WHO with no published equivalent is `unavailable`. A failed request is null.
 */
import type { BurdenFeed } from '@/data/demand-signals'
import { fetchWho } from '@/lib/sources/who'
import { fetchOwid } from '@/lib/sources/owid'
import { fetchWdi } from '@/lib/sources/worldbank'

export type BurdenReading =
  | {
      status: 'ok'
      value: number
      year: number
      source: string
      url: string
      label: string
      unit: string
    }
  | {
      status: 'unavailable'
      source: string
      url: string | null
      label: string
      reason: string
    }

export async function fetchDemandBurden(
  feed: BurdenFeed,
  opts: { revalidateSeconds?: number } = {},
): Promise<BurdenReading | null> {
  if (feed.kind === 'who') {
    const who = await fetchWho(feed.code, opts)
    if (!who) return null
    if (who.status === 'unavailable') {
      return {
        status: 'unavailable',
        source: 'WHO',
        url: 'https://data.who.int',
        label: feed.label,
        reason: who.reason,
      }
    }
    return {
      status: 'ok',
      value: who.latest.value,
      year: who.latest.year,
      source: 'WHO',
      url: who.url,
      label: feed.label,
      unit: feed.unit,
    }
  }

  if (feed.kind === 'owid') {
    const owid = await fetchOwid(feed.slug, { extraParams: feed.extraParams, ...opts })
    if (!owid?.latest) return null
    return {
      status: 'ok',
      value: owid.latest.value,
      year: owid.latest.year,
      source: 'Our World in Data',
      url: `https://ourworldindata.org/grapher/${feed.slug}`,
      label: feed.label,
      unit: feed.unit,
    }
  }

  const wdi = await fetchWdi('WLD', feed.indicator, opts)
  if (!wdi?.latest) return null
  return {
    status: 'ok',
    value: wdi.latest.value,
    year: wdi.latest.year,
    source: 'World Bank WDI',
    url: `https://data.worldbank.org/indicator/${feed.indicator}`,
    label: feed.label,
    unit: feed.unit,
  }
}
