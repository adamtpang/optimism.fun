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
  sourceLastUpdated: string | null
  dbFetchedAt: string | null
  count: number
  observations: Obs[]
  missing?: string[]
  snapshot?: string
}

const fmt = (n: number) => new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(n)

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

  if (err) return <p className="text-sm text-ink-500">Snapshot unavailable right now.</p>
  if (!data) return <p className="text-sm text-ink-500">Loading the captured values…</p>

  return (
    <div>
      {data.observations.length === 0 ? (
        <p className="text-sm text-ink-400">
          No World Bank point from the {data.snapshot ?? 'render'} snapshot is available for this table.
        </p>
      ) : (
        <div className="rounded border border-hair overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="font-mono text-small uppercase tracking-wider text-ink-500">
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
      {data.missing && data.missing.length > 0 && (
        <p className="mt-3 text-sm text-ink-400">
          Not in the snapshot, so not shown: {data.missing.join(', ')}.
        </p>
      )}
      <p className="mt-3 font-mono text-small text-ink-500">
        Source: World Bank rows in snapshot {data.snapshot ?? data.sourceLastUpdated ?? 'unavailable'}. Not a live refetch.
      </p>
    </div>
  )
}
