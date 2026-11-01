'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import NeglectMeter from '@/components/charts/NeglectMeter'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { formatHumans } from '@/lib/format'

export type RankedRow = {
  slug: string
  name: string
  people: number | null
  unit: string | null
  deaths: number | null
  discoveries: number
  width: number
  score: number | null
}

type SortKey = 'ranked' | 'people' | 'neglected'

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'ranked', label: 'Ranked' },
  { id: 'people', label: 'People' },
  { id: 'neglected', label: 'Neglected' },
]

export default function RankedProblems({ rows }: { rows: RankedRow[] }) {
  const [sort, setSort] = useState<SortKey>('ranked')

  const ordered = useMemo(() => {
    const copy = rows.map((row, index) => ({ ...row, order: index }))
    if (sort === 'people') {
      copy.sort((a, b) => (b.people ?? -1) - (a.people ?? -1) || a.order - b.order)
    } else if (sort === 'neglected') {
      copy.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || a.order - b.order)
    }
    return copy
  }, [rows, sort])

  return (
    <>
      <div className="mt-8">
        <ToggleGroup
          type="single"
          value={sort}
          onValueChange={(value) => {
            if (value === 'ranked' || value === 'people' || value === 'neglected') setSort(value)
          }}
          aria-label="Sort problems"
          className="inline-flex h-auto justify-start gap-1 rounded-lg bg-neutral-100 p-1"
        >
          {SORTS.map((item) => (
            <ToggleGroupItem
              key={item.id}
              value={item.id}
              className="h-11 px-4 text-small data-[state=on]:bg-white data-[state=on]:text-neutral-900"
            >
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="mt-4 border border-neutral-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-[48px_minmax(0,1.3fr)_minmax(0,1.5fr)_120px_150px_72px] gap-4 items-center h-12 px-6 bg-neutral-50 border-b border-neutral-200 text-small font-medium text-neutral-600">
          <span>#</span>
          <span>Problem</span>
          <span className="flex justify-between pr-14">
            <span>1M</span>
            <span>10M</span>
            <span>100M</span>
            <span>1B</span>
            <span>10B</span>
          </span>
          <span className="text-right">Related deaths / yr</span>
          <span>Neglected</span>
          <span />
        </div>
        <ol>
          {ordered.map((r, i) => (
            <li
              key={r.slug}
              className="grid grid-cols-[28px_minmax(0,1fr)_auto] md:grid-cols-[48px_minmax(0,1.3fr)_minmax(0,1.5fr)_120px_150px_72px] gap-x-3 gap-y-2 items-center px-4 md:px-6 py-4 border-b border-neutral-100 last:border-b-0"
            >
              <span className="text-small text-neutral-600 font-medium self-start md:self-center">{i + 1}</span>
              <div className="min-w-0">
                <Link href={`/p/${r.slug}`} className="text-body font-semibold text-ink-100 hover:text-primary">
                  {r.name}
                </Link>
                <p className="text-small text-neutral-600">
                  {r.unit}
                  {r.discoveries > 0 && (
                    <>
                      {' · '}
                      <Link href={`/discoveries?problem=${r.slug}`} className="text-primary hover:underline">
                        {r.discoveries === 1 ? '1 discovery' : `${r.discoveries} discoveries`}
                      </Link>
                    </>
                  )}
                </p>
              </div>
              <Link
                href={`/p/${r.slug}#coordinate`}
                className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-lg border border-neutral-200 text-primary font-semibold"
                aria-label={`Act on ${r.name}`}
              >
                →
              </Link>
              <div className="col-start-2 md:col-start-auto md:col-span-1 flex items-center gap-3 min-w-0">
                <div className="decade-track relative h-3 flex-1 rounded-full overflow-hidden" aria-hidden>
                  <div className="absolute inset-y-0 left-0 bg-blue-600 rounded-full" style={{ width: `${r.width}%` }} />
                </div>
                <span className="text-small font-semibold text-blue-700 tabular-nums w-14 text-right">
                  {r.people ? formatHumans(r.people) : '—'}
                </span>
              </div>
              <span className="hidden md:block text-small text-right tabular-nums text-neutral-900">
                {r.deaths ? formatHumans(r.deaths) : '—'}
              </span>
              <span className="hidden md:flex">
                <NeglectMeter score={r.score} />
              </span>
              <p className="col-start-2 md:hidden text-small text-neutral-600">
                {r.deaths ? `${formatHumans(r.deaths)} related deaths / yr` : null}
                {r.deaths ? ' · ' : null}
                {r.score == null ? 'neglectedness unscored' : `${r.score}/10 neglected`}
              </p>
              <Link
                href={`/p/${r.slug}#coordinate`}
                className="hidden md:inline-flex items-center justify-center h-11 px-3 rounded-lg border border-neutral-200 text-small font-semibold text-primary hover:bg-teal-50"
              >
                Act
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
