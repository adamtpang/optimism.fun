'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { BalanceRow } from '@/lib/sourced-balance'

type SortKey = 'rank' | 'burden' | 'demand' | 'supply' | 'gap' | 'companies'

const COLUMNS: { id: SortKey; label: string }[] = [
  { id: 'rank', label: 'Priority rank' },
  { id: 'burden', label: 'Burden' },
  { id: 'demand', label: 'Demand' },
  { id: 'supply', label: 'Supply' },
  { id: 'gap', label: 'Gap' },
  { id: 'companies', label: 'Companies' },
]

function numberOrLast(value: number | null, direction: 'asc' | 'desc'): number {
  if (value == null) return direction === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
  return value
}

export default function SupplyDemandTable({ rows }: { rows: BalanceRow[] }) {
  const [sort, setSort] = useState<SortKey>('rank')

  const ordered = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      const byName = a.name.localeCompare(b.name)
      if (sort === 'rank') return a.rank - b.rank || byName
      if (sort === 'burden') return numberOrLast(b.burdenValue, 'desc') - numberOrLast(a.burdenValue, 'desc') || a.rank - b.rank
      if (sort === 'demand') return numberOrLast(b.demandScore, 'desc') - numberOrLast(a.demandScore, 'desc') || a.rank - b.rank
      if (sort === 'supply') return numberOrLast(b.supplyScore, 'desc') - numberOrLast(a.supplyScore, 'desc') || a.rank - b.rank
      if (sort === 'gap') return numberOrLast(b.gap, 'desc') - numberOrLast(a.gap, 'desc') || a.rank - b.rank
      return b.companyCount - a.companyCount || a.rank - b.rank
    })
    return copy
  }, [rows, sort])

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Sort supply and demand">
        {COLUMNS.map((column) => (
          <button
            key={column.id}
            type="button"
            aria-pressed={sort === column.id}
            onClick={() => setSort(column.id)}
            className={`min-h-11 px-3 text-small border ${sort === column.id ? 'border-primary text-ink-100 bg-white' : 'border-neutral-200 text-neutral-600 bg-neutral-50'}`}
          >
            {column.label}
          </button>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto border border-neutral-200 rounded bg-white">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-neutral-50 text-small text-neutral-600">
            <tr>
              <th className="px-3 py-3 font-medium">Priority rank</th>
              <th className="px-3 py-3 font-medium">Problem</th>
              <th className="px-3 py-3 font-medium">Burden</th>
              <th className="px-3 py-3 font-medium">Demand</th>
              <th className="px-3 py-3 font-medium">Supply</th>
              <th className="px-3 py-3 font-medium">Gap</th>
              <th className="px-3 py-3 font-medium">Companies</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((row) => (
              <tr key={row.slug} className="border-t border-neutral-100 align-top">
                <td className="px-3 py-3 text-small text-neutral-600 tabular-nums">{row.rank}</td>
                <td className="px-3 py-3 min-w-0">
                  <Link href={`/p/${row.slug}`} className="text-body font-semibold text-ink-100 hover:text-primary">
                    {row.name}
                  </Link>
                  <ul className="mt-2 space-y-1">
                    {row.inputs.map((input) => (
                      <li key={input.label} className="text-small text-neutral-600 break-words">
                        {input.label}: {input.display}
                        {input.value != null && input.unit ? ` ${input.unit}` : ''}
                        {input.inScore ? '' : input.value == null ? '' : ' (shown, not in the score)'}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-3 py-3 text-small tabular-nums">{row.burdenLabel}</td>
                <td className="px-3 py-3 text-small tabular-nums">{row.demandLabel}</td>
                <td className="px-3 py-3 text-small tabular-nums">{row.supplyLabel}</td>
                <td className="px-3 py-3 text-small tabular-nums">{row.gapLabel}</td>
                <td className="px-3 py-3 text-small tabular-nums">
                  {row.companyCount}
                  {row.openQuest ? ' · open quest' : ''}
                  {row.companyNote ? ` · ${row.companyNote}` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
