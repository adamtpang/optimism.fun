'use client'

import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { usePlayers } from '@/lib/use-players'
import { CATEGORIES } from '@/lib/players'

type SortKey = 'elo' | 'name' | 'peakElo'

export default function PlayersPage() {
  const { players, hydrated } = usePlayers()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | undefined>(undefined)
  const [typeFilter, setTypeFilter] = useState<'all' | 'person' | 'company'>('all')
  const [sortBy, setSortBy] = useState<SortKey>('elo')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    let result = [...players]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q) ||
          p.category.some((c) => c.toLowerCase().includes(q)),
      )
    }

    if (category) {
      result = result.filter((p) => p.category.includes(category))
    }

    if (typeFilter !== 'all') {
      result = result.filter((p) => p.type === typeFilter)
    }

    result.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'elo') cmp = a.elo - b.elo
      else if (sortBy === 'peakElo') cmp = a.peakElo - b.peakElo
      else cmp = a.name.localeCompare(b.name)
      return sortDir === 'desc' ? -cmp : cmp
    })

    return result
  }, [players, search, category, typeFilter, sortBy, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortBy(key)
      setSortDir('desc')
    }
  }

  const sortIcon = (key: SortKey) => {
    if (sortBy !== key) return ''
    return sortDir === 'desc' ? ' ↓' : ' ↑'
  }

  if (!hydrated) {
    return (
      <>
        <Navbar />
        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="w-8 h-8 mx-auto rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <p className="text-amber-400 font-medium tracking-[0.25em] uppercase text-xs sm:text-sm mb-4">
              Elo Rankings
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">
              Players
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mb-6">
              The people and companies solving civilization&rsquo;s biggest problems, ranked by Elo rating.
              Vote in{' '}
              <Link href="/compare" className="text-amber-400 hover:underline">
                head-to-head matchups
              </Link>{' '}
              to update rankings.
            </p>

            {/* Aggregate stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl card-space p-4 text-center">
                <div className="font-display text-xl sm:text-2xl font-bold text-zinc-100">
                  {players.length}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Players
                </div>
              </div>
              <div className="rounded-xl card-space p-4 text-center">
                <div className="font-display text-xl sm:text-2xl font-bold text-amber-400">
                  {Math.max(...players.map((p) => p.elo))}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Highest Elo
                </div>
              </div>
              <div className="rounded-xl card-space p-4 text-center">
                <div className="font-display text-xl sm:text-2xl font-bold text-zinc-300">
                  {players.reduce((sum, p) => sum + p.eloHistory.length - 1, 0)}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Total Votes
                </div>
              </div>
            </div>
          </div>

          {/* Search + filters */}
          <div className="mb-6 space-y-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search players..."
              className="w-full px-4 py-2.5 rounded-xl card-space text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500 transition-colors"
            />

            <div className="flex flex-wrap gap-2">
              {/* Type filter */}
              {(['all', 'person', 'company'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    typeFilter === t
                      ? 'bg-amber-600 text-white'
                      : 'text-zinc-500 hover:text-zinc-100 border border-white/5'
                  }`}
                >
                  {t === 'all' ? 'All Types' : t === 'person' ? 'People' : 'Companies'}
                </button>
              ))}

              <div className="w-px bg-white/5 mx-1" />

              {/* Category filter */}
              <button
                onClick={() => setCategory(undefined)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  !category
                    ? 'bg-amber-600 text-white'
                    : 'text-zinc-500 hover:text-zinc-100 border border-white/5'
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    category === cat
                      ? 'bg-amber-600 text-white'
                      : 'text-zinc-500 hover:text-zinc-100 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table header */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 text-[10px] text-zinc-400 uppercase tracking-wider font-medium border-b border-white/5 mb-2">
            <span className="w-8 text-right">#</span>
            <button onClick={() => handleSort('name')} className="flex-1 text-left hover:text-zinc-300 transition-colors">
              Name{sortIcon('name')}
            </button>
            <span className="w-16 text-center">Type</span>
            <span className="w-24 text-center">Category</span>
            <button onClick={() => handleSort('elo')} className="w-16 text-right hover:text-zinc-300 transition-colors">
              Elo{sortIcon('elo')}
            </button>
            <button onClick={() => handleSort('peakElo')} className="w-16 text-right hover:text-zinc-300 transition-colors">
              Peak{sortIcon('peakElo')}
            </button>
          </div>

          {/* Player list */}
          <div className="space-y-2">
            {filtered.map((player, i) => (
              <Link
                key={player.id}
                href={`/players/${player.id}`}
                className="group flex items-center gap-3 p-3 sm:p-4 rounded-xl card-space hover:border-amber-500/30 transition-colors"
              >
                <span className="text-xs font-mono text-zinc-400 w-8 text-right">
                  {i + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-zinc-100 group-hover:text-amber-400 transition-colors truncate">
                      {player.name}
                    </span>
                    <span
                      className={`hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full border ${
                        player.type === 'person'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                      }`}
                    >
                      {player.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {player.category.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className="text-[10px] text-zinc-400"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-display text-lg sm:text-xl font-bold text-amber-400">
                    {player.elo}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    peak {player.peakElo}
                  </div>
                </div>
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-zinc-500 text-sm">No players found.</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-sm font-medium transition-colors"
            >
              Vote in Head-to-Head
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Quote */}
          <div className="mt-16 text-center">
            <p className="text-sm text-zinc-400 italic max-w-lg mx-auto">
              &ldquo;All evils are caused by insufficient knowledge.&rdquo;
              <span className="block mt-1 not-italic text-zinc-500">
                &mdash; David Deutsch
              </span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
