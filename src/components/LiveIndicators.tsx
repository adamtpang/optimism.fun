'use client'

import { useEffect, useState } from 'react'

type Obs = {
  problemSlug: string
  indicator: string
  countryIso3: string
  year: number
  value: number
  sourceLastUpdated: string | null
  fetchedAt: string
  label: string
}

type Resp = {
  ok: boolean
  dbConfigured: boolean
  sourceLastUpdated: string
  dbFetchedAt: string | null
  count: number
  observations: Obs[]
}

const fmt = (n: number) => new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(n)
const day = (s: string | null) => (s ? s.slice(0, 10) : '—')

/**
 * Reads /api/indicators (DB-backed live World Bank values) and renders the
 * latest value per problem plus the freshness stamp. Degrades cleanly: shows a
 * loading line, then either the table or a "will populate on next refresh" note
 * when the DB is empty or not yet connected.
 */
export default function LiveIndicators() {
  const [data, setData] = useState<Resp | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    let live = true
    fetch('/api/indicators')
      .then((r) => r.json())
      .then((d: Resp) => {
        if (live) setData(d)
      })
      .catch(() => {
        if (live) setErr(true)
      })
    return () => {
      live = false
    }
  }, [])

  if (err) return <p className="text-sm text-ink-500">Live data unavailable right now.</p>
  if (!data) return <p className="text-sm text-ink-500">Loading live values…</p>

  return (
    <div>
      {data.observations.length === 0 ? (
        <p className="text-sm text-ink-400">
          The live table is wired and will populate on the next scheduled refresh
          {data.dbConfigured ? '' : ' once the database is connected'}. Seed values are shown
          across the site until then.
        </p>
      ) : (
        <div className="rounded border border-hair overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-wider text-ink-500">
                <th className="text-left p-3 font-normal">World Bank indicator</th>
                <th className="text-right p-3 font-normal">Latest</th>
                <th className="text-right p-3 font-normal">Year</th>
              </tr>
            </thead>
            <tbody>
              {data.observations.map((o) => (
                <tr key={o.indicator} className="border-t border-hair">
                  <td className="p-3 text-ink-300">{o.label}</td>
                  <td className="p-3 text-right font-mono text-ink-100">{fmt(o.value)}</td>
                  <td className="p-3 text-right font-mono text-ink-500">{o.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 font-mono text-[10px] text-ink-500">
        <span className="text-amber-300">●</span> source: World Bank WDI · published{' '}
        {day(data.sourceLastUpdated)} · our copy refreshed {day(data.dbFetchedAt)}
      </p>
    </div>
  )
}
