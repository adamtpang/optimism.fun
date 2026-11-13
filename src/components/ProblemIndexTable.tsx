'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export type IndexTableRow = {
  slug: string
  name: string
  category: string
  rank: number | null
  headlineValue: string
  headlineUnit: string
  headlineYear: string
  headlineUrl: string
  demandLabel: string
  supplyLabel: string
  gapLabel: string
  companyLabel: string
  openQuest: boolean
  hasNamedCompany: boolean
  demandScore: number | null
  supplyScore: number | null
  gap: number | null
  companyCount: number | null
}

type SortKey = 'rank' | 'name' | 'demand' | 'supply' | 'gap' | 'companies'

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'rank', label: 'Gap rank' },
  { id: 'name', label: 'Name' },
  { id: 'demand', label: 'Demand' },
  { id: 'supply', label: 'Supply' },
  { id: 'gap', label: 'Gap' },
  { id: 'companies', label: 'Companies' },
]

function last(value: number | null): number {
  return value == null ? Number.NEGATIVE_INFINITY : value
}

export default function ProblemIndexTable({ rows, categories }: { rows: IndexTableRow[]; categories: string[] }) {
  const [sort, setSort] = useState<SortKey>('rank')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')

  const ordered = useMemo(() => {
    const copy = rows.filter((row) => {
      if (category !== 'all' && row.category !== category) return false
      if (status === 'open' && !row.openQuest) return false
      if (status === 'known' && !row.hasNamedCompany) return false
      return true
    })
    copy.sort((a, b) => {
      const byName = a.name.localeCompare(b.name)
      if (sort === 'name') return byName
      if (sort === 'demand') return last(b.demandScore) - last(a.demandScore) || byName
      if (sort === 'supply') return last(b.supplyScore) - last(a.supplyScore) || byName
      if (sort === 'gap') return last(b.gap) - last(a.gap) || byName
      if (sort === 'companies') return last(b.companyCount) - last(a.companyCount) || byName
      if (a.rank == null && b.rank == null) return byName
      if (a.rank == null) return 1
      if (b.rank == null) return -1
      return a.rank - b.rank || byName
    })
    return copy
  }, [rows, sort, category, status])

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex flex-col gap-1 text-small text-neutral-700 min-w-0 sm:min-w-48">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-h-11 border border-neutral-200 bg-white px-3 text-small text-neutral-900"
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-small text-neutral-700 min-w-0 sm:min-w-48">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="min-h-11 border border-neutral-200 bg-white px-3 text-small text-neutral-900"
          >
            <option value="all">All problems</option>
            <option value="open">Open quests</option>
            <option value="known">Has a known company</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Sort the index">
        {SORTS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={sort === item.id}
            onClick={() => setSort(item.id)}
            className={`min-h-11 px-3 text-small border ${sort === item.id ? 'border-primary text-primary bg-white' : 'border-neutral-200 text-neutral-700 bg-neutral-50'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-small text-neutral-600">{ordered.length} rows. Size is not a sort key, because the units are not the same.</p>

      <div className="mt-4 grid gap-3 md:hidden">
        {ordered.map((row) => (
          <article key={row.slug} className="border border-neutral-200 bg-white p-4 min-w-0">
            <p className="text-small text-neutral-600">{row.rank == null ? 'Not ranked' : `Rank ${row.rank}`}</p>
            <Link href={`/problem-index/${row.slug}`} className="mt-1 block text-body font-semibold text-ink-100 break-words">
              {row.name}
            </Link>
            <p className="mt-1 text-small text-neutral-700">{row.category}</p>
            <p className="mt-3 text-small text-neutral-900 break-words">
              {row.headlineValue} {row.headlineUnit} ({row.headlineYear}){' '}
              <a href={row.headlineUrl} className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                Source
              </a>
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-small">
              <div>
                <dt className="text-neutral-600">Demand</dt>
                <dd className="font-figure text-neutral-900">{row.demandLabel}</dd>
              </div>
              <div>
                <dt className="text-neutral-600">Supply</dt>
                <dd className="font-figure text-neutral-900">{row.supplyLabel}</dd>
              </div>
              <div>
                <dt className="text-neutral-600">Gap</dt>
                <dd className="font-figure text-neutral-900">{row.gapLabel}</dd>
              </div>
              <div>
                <dt className="text-neutral-600">Companies</dt>
                <dd className="font-figure text-neutral-900">{row.companyLabel}</dd>
              </div>
            </dl>
            {row.openQuest ? <p className="mt-3 text-small text-primary">Open quest</p> : null}
          </article>
        ))}
      </div>

      <div className="mt-4 hidden md:block overflow-x-auto border border-neutral-200 bg-white">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 text-small text-neutral-600">
            <tr>
              <th className="px-3 py-3 font-medium">Rank</th>
              <th className="px-3 py-3 font-medium">Problem</th>
              <th className="px-3 py-3 font-medium">Category</th>
              <th className="px-3 py-3 font-medium">Size</th>
              <th className="px-3 py-3 font-medium">Demand</th>
              <th className="px-3 py-3 font-medium">Supply</th>
              <th className="px-3 py-3 font-medium">Gap</th>
              <th className="px-3 py-3 font-medium">Companies</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((row) => (
              <tr key={row.slug} className="border-t border-neutral-100 align-top">
                <td className="px-3 py-3 text-small font-figure text-neutral-600">{row.rank ?? 'n/a'}</td>
                <td className="px-3 py-3 min-w-0">
                  <Link href={`/problem-index/${row.slug}`} className="text-small font-semibold text-ink-100">
                    {row.name}
                  </Link>
                  {row.openQuest ? <p className="text-small text-primary">Open quest</p> : null}
                </td>
                <td className="px-3 py-3 text-small text-neutral-700">{row.category}</td>
                <td className="px-3 py-3 text-small text-neutral-900">
                  <span className="font-figure">
                    {row.headlineValue} {row.headlineUnit}
                  </span>
                  <span className="block text-neutral-600">{row.headlineYear}</span>
                  <a href={row.headlineUrl} className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                    Source
                  </a>
                </td>
                <td className="px-3 py-3 text-small font-figure">{row.demandLabel}</td>
                <td className="px-3 py-3 text-small font-figure">{row.supplyLabel}</td>
                <td className="px-3 py-3 text-small font-figure">{row.gapLabel}</td>
                <td className="px-3 py-3 text-small font-figure">{row.companyLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
