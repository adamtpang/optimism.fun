'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Flag,
  Heart,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'
import type { RankedQuest, QuestTier } from '@/lib/rankings'
import type { Crowding } from '@/data/types'
import { fmtUsdCompact } from '@/lib/allocation'
import StarterPackBlock from '@/components/StarterPackBlock'
import { getStarterPack, buildClaudeCodePrompt } from '@/data/starter-packs'

type Reaction = 'interested' | 'passed'
type Scope = 'all' | 'saved' | Reaction
type SortKey = 'rank' | 'opportunity' | 'demand' | 'gap' | 'prize'

type QuestbookState = {
  saved: string[]
  reactions: Record<string, Reaction>
  explorationSlug: string | null
}

const STORAGE_KEY = 'optimism.questbook.v1'
const EMPTY_QUESTBOOK: QuestbookState = {
  saved: [],
  reactions: {},
  explorationSlug: null,
}

const CROWDING_META: Record<Crowding, { label: string; tone: string }> = {
  open: { label: 'open field', tone: 'text-terminal-green' },
  contested: { label: 'contested', tone: 'text-amber-300' },
  crowded: { label: 'crowded', tone: 'text-terminal-rose' },
}

const TIER_META: Record<QuestTier, { label: string; chip: string }> = {
  S: {
    label: 'Build this now',
    chip: 'bg-amber-300/10 text-amber-300 border-amber-300/30',
  },
  A: {
    label: 'Strong quest',
    chip: 'bg-terminal-cyan/10 text-terminal-cyan border-terminal-cyan/30',
  },
  B: {
    label: 'Worth a look',
    chip: 'bg-ink-800/60 text-ink-200 border-hair',
  },
  C: {
    label: 'On the radar',
    chip: 'bg-ink-800/40 text-ink-500 border-hair',
  },
}

const MOMENTUM: Record<string, { arrow: string; tone: string; label: string }> = {
  rising: { arrow: '↗', tone: 'text-terminal-green', label: 'capital rising' },
  falling: { arrow: '↘', tone: 'text-terminal-rose', label: 'capital falling' },
  flat: { arrow: '→', tone: 'text-ink-500', label: 'capital flat' },
}

function readQuestbook(): QuestbookState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_QUESTBOOK
    const parsed = JSON.parse(raw) as Partial<QuestbookState>
    return {
      saved: Array.isArray(parsed.saved)
        ? parsed.saved.filter((value): value is string => typeof value === 'string')
        : [],
      reactions:
        parsed.reactions && typeof parsed.reactions === 'object'
          ? Object.fromEntries(
              Object.entries(parsed.reactions).filter(
                ([slug, value]) =>
                  typeof slug === 'string' && (value === 'interested' || value === 'passed'),
              ),
            )
          : {},
      explorationSlug:
        typeof parsed.explorationSlug === 'string' ? parsed.explorationSlug : null,
    }
  } catch {
    return EMPTY_QUESTBOOK
  }
}

function MiniBar({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex items-center gap-1.5" title={`${label} ${value}/100`}>
      <span className="font-mono text-[9px] uppercase text-ink-500 w-7">{label}</span>
      <div className="h-1 w-12 bg-ink-800 rounded-full overflow-hidden">
        <div className={`h-1 ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function IconAction({
  label,
  active,
  activeClass,
  onClick,
  children,
}: {
  label: string
  active: boolean
  activeClass: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`h-9 w-9 shrink-0 inline-flex items-center justify-center rounded border transition-colors ${
        active
          ? activeClass
          : 'border-hair text-ink-500 hover:text-ink-100 hover:border-ink-400 hover:bg-ink-800/40'
      }`}
    >
      {children}
    </button>
  )
}

function QuestRow({
  q,
  saved,
  reaction,
  isExploration,
  onToggleSaved,
  onReaction,
  onExploration,
}: {
  q: RankedQuest
  saved: boolean
  reaction?: Reaction
  isExploration: boolean
  onToggleSaved: () => void
  onReaction: (reaction: Reaction) => void
  onExploration: () => void
}) {
  const [open, setOpen] = useState(false)
  const mo = q.momentum ? MOMENTUM[q.momentum] : null
  const pack = getStarterPack(q.slug)
  const tier = TIER_META[q.tier]

  return (
    <article
      id={q.slug}
      className={`border-b border-hair last:border-b-0 ${reaction === 'passed' ? 'opacity-60' : ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="min-w-0 flex-1 text-left px-3 py-3 flex items-start gap-3 hover:bg-ink-800/30 transition-colors"
        >
          <span className="font-mono text-sm tabular-nums text-ink-500 w-7 pt-0.5 shrink-0">
            {q.rank}
          </span>

          <span
            className={`h-7 w-7 shrink-0 inline-flex items-center justify-center rounded border font-mono text-[11px] ${tier.chip}`}
            title={tier.label}
          >
            {q.tier}
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 flex-wrap">
              <span className="font-sans text-[15px] font-medium text-ink-100">{q.title}</span>
              {q.domainLabel && (
                <span className="font-mono text-[9px] uppercase tracking-wide text-ink-500 border border-hair px-1.5 py-0.5 rounded">
                  {q.domainLabel}
                </span>
              )}
              {q.allocationVerdict === 'underallocated' && (
                <span className="font-mono text-[9px] uppercase tracking-wide text-amber-300 bg-amber-300/10 px-1.5 py-0.5 rounded">
                  underfunded
                </span>
              )}
              <span
                className={`font-mono text-[9px] uppercase tracking-wide ${CROWDING_META[q.crowding].tone} border border-hair px-1.5 py-0.5 rounded`}
                title={
                  q.crowdingSource === 'sourced'
                    ? `${q.competitorCount} companies found building this`
                    : 'Editorial estimate, not yet sourced'
                }
              >
                {CROWDING_META[q.crowding].label}
                {q.crowdingSource === 'sourced' && q.competitorCount != null && (
                  <span className="ml-1 text-ink-400">n={q.competitorCount}</span>
                )}
              </span>
            </span>
            <span className="mt-1 block text-ink-400 text-[12.5px] leading-snug line-clamp-2">
              {q.pitch}
            </span>
          </span>

          <span className="hidden md:flex flex-col items-end gap-1 shrink-0">
            <MiniBar label="dem" value={q.demand} tone="bg-amber-300" />
            <MiniBar label="gap" value={q.gap} tone="bg-terminal-cyan" />
          </span>

          <span className="flex flex-col items-end gap-0.5 shrink-0 w-20">
            <span className="font-mono text-lg tabular-nums text-ink-100 leading-none">
              {q.score}
            </span>
            {q.prizeUsd != null && (
              <span
                className="font-mono text-[10px] tabular-nums text-ink-400"
                title="Prize at the limit"
              >
                {fmtUsdCompact(q.prizeUsd)}
              </span>
            )}
            {mo && (
              <span className={`font-mono text-[10px] ${mo.tone}`} title={mo.label}>
                {mo.arrow} {q.confidence}
              </span>
            )}
          </span>

          <span className="text-ink-500 pt-0.5" aria-hidden>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        <div
          className="px-3 pb-3 sm:py-3 sm:pl-0 flex items-center justify-end sm:justify-start gap-1.5"
          aria-label={`Actions for ${q.title}`}
        >
          <IconAction
            label={saved ? 'Remove from Questbook' : 'Save to Questbook'}
            active={saved}
            activeClass="border-amber-300/50 bg-amber-300/10 text-amber-300"
            onClick={onToggleSaved}
          >
            <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
          </IconAction>
          <IconAction
            label={reaction === 'interested' ? 'Clear interested reaction' : 'Mark interested'}
            active={reaction === 'interested'}
            activeClass="border-terminal-green/50 bg-terminal-green/10 text-terminal-green"
            onClick={() => onReaction('interested')}
          >
            <Heart size={16} fill={reaction === 'interested' ? 'currentColor' : 'none'} />
          </IconAction>
          <IconAction
            label={reaction === 'passed' ? 'Undo pass' : 'Pass on this quest'}
            active={reaction === 'passed'}
            activeClass="border-terminal-rose/50 bg-terminal-rose/10 text-terminal-rose"
            onClick={() => onReaction('passed')}
          >
            <X size={16} />
          </IconAction>
          <IconAction
            label={isExploration ? 'Remove 30-day exploration' : 'Choose as 30-day exploration'}
            active={isExploration}
            activeClass="border-terminal-violet/50 bg-terminal-violet/10 text-terminal-violet"
            onClick={onExploration}
          >
            <Flag size={16} fill={isExploration ? 'currentColor' : 'none'} />
          </IconAction>
        </div>
      </div>

      {open && (
        <div className="border-t border-hair bg-ink-900/40 px-4 sm:px-12 py-5 space-y-5">
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-terminal-cyan mb-1.5">
                Why now
              </p>
              <p className="text-ink-300 text-[13px] leading-relaxed">{q.whyNow}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-amber-300 mb-1.5">
                Supply to create
              </p>
              <p className="text-ink-300 text-[13px] leading-relaxed">{q.shape}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-terminal-green mb-1.5">
                The measurable delta
              </p>
              <p className="text-ink-300 text-[13px] leading-relaxed">{q.successLooksLike}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-400 mb-1.5">
              Why it is a good quest
            </p>
            <p className="text-ink-300 text-[13px] leading-relaxed max-w-3xl">{q.goodQuest}</p>
          </div>

          {q.crowdingSource === 'sourced' && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-400 mb-1.5">
                Existing supply ({q.competitorCount} found)
              </p>
              <p className="text-ink-300 text-[13px] leading-relaxed">
                {q.exampleCompetitors.length > 0
                  ? q.exampleCompetitors.join(' · ')
                  : 'No named competitors found. Open field.'}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hair pt-4 font-mono text-[10px] text-ink-500">
            <Link href={`/p/${q.problemSlug}`} className="text-amber-300 hover:underline">
              Evidence for {q.problemName} →
            </Link>
            <span>demand {q.demand}</span>
            <span>quest supply {q.questSupply}</span>
            <span>gap {q.gap}</span>
            <span>opportunity {q.opportunity}</span>
            <span>confidence {q.confidence}</span>
          </div>

          {pack && (
            <StarterPackBlock
              pack={pack}
              prompt={buildClaudeCodePrompt(pack, {
                title: q.title,
                problemName: q.problemName,
                demand: q.demand,
                gap: q.gap,
                competitorCount: q.competitorCount,
                exampleCompetitors: q.exampleCompetitors,
              })}
            />
          )}
        </div>
      )}
    </article>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1 min-w-28">
      <span className="font-mono text-[9px] uppercase tracking-wide text-ink-600">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded border border-hair bg-ink-900 px-2.5 font-mono text-[11px] text-ink-200 outline-none focus:border-amber-300"
      >
        {children}
      </select>
    </label>
  )
}

export default function QuestRankings({ quests }: { quests: RankedQuest[] }) {
  const [questbook, setQuestbook] = useState<QuestbookState>(EMPTY_QUESTBOOK)
  const [hydrated, setHydrated] = useState(false)
  const [scope, setScope] = useState<Scope>('all')
  const [query, setQuery] = useState('')
  const [tier, setTier] = useState('all')
  const [domain, setDomain] = useState('all')
  const [crowding, setCrowding] = useState('all')
  const [sort, setSort] = useState<SortKey>('rank')

  useEffect(() => {
    setQuestbook(readQuestbook())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(questbook))
  }, [hydrated, questbook])

  const domains = useMemo(
    () =>
      Array.from(new Set(quests.map((quest) => quest.domainLabel).filter(Boolean))).sort() as string[],
    [quests],
  )

  const counts = useMemo(
    () => ({
      saved: questbook.saved.length,
      interested: Object.values(questbook.reactions).filter((value) => value === 'interested')
        .length,
      passed: Object.values(questbook.reactions).filter((value) => value === 'passed').length,
    }),
    [questbook],
  )

  const exploration = quests.find((quest) => quest.slug === questbook.explorationSlug) ?? null

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = quests.filter((quest) => {
      if (scope === 'saved' && !questbook.saved.includes(quest.slug)) return false
      if (
        (scope === 'interested' || scope === 'passed') &&
        questbook.reactions[quest.slug] !== scope
      ) {
        return false
      }
      if (tier !== 'all' && quest.tier !== tier) return false
      if (domain !== 'all' && quest.domainLabel !== domain) return false
      if (crowding !== 'all' && quest.crowding !== crowding) return false
      if (
        needle &&
        !`${quest.title} ${quest.pitch} ${quest.problemName} ${quest.domainLabel ?? ''} ${quest.whyNow}`
          .toLowerCase()
          .includes(needle)
      ) {
        return false
      }
      return true
    })

    return [...filtered].sort((a, b) => {
      if (sort === 'opportunity') return b.score - a.score || a.rank - b.rank
      if (sort === 'demand') return b.demand - a.demand || a.rank - b.rank
      if (sort === 'gap') return b.gap - a.gap || a.rank - b.rank
      if (sort === 'prize') return (b.prizeUsd ?? 0) - (a.prizeUsd ?? 0) || a.rank - b.rank
      return a.rank - b.rank
    })
  }, [crowding, domain, query, questbook, quests, scope, sort, tier])

  const toggleSaved = (slug: string) => {
    setQuestbook((current) => {
      const isSaved = current.saved.includes(slug)
      const reactions = { ...current.reactions }
      if (!isSaved && reactions[slug] === 'passed') delete reactions[slug]
      return {
        ...current,
        saved: isSaved
          ? current.saved.filter((item) => item !== slug)
          : [...current.saved, slug],
        reactions,
      }
    })
  }

  const setReaction = (slug: string, reaction: Reaction) => {
    setQuestbook((current) => {
      const reactions = { ...current.reactions }
      if (reactions[slug] === reaction) delete reactions[slug]
      else reactions[slug] = reaction

      const passed = reactions[slug] === 'passed'
      return {
        saved: passed ? current.saved.filter((item) => item !== slug) : current.saved,
        reactions,
        explorationSlug:
          passed && current.explorationSlug === slug ? null : current.explorationSlug,
      }
    })
  }

  const setExploration = (slug: string) => {
    setQuestbook((current) => {
      if (current.explorationSlug === slug) return { ...current, explorationSlug: null }
      const reactions = { ...current.reactions, [slug]: 'interested' as const }
      return {
        saved: current.saved.includes(slug) ? current.saved : [...current.saved, slug],
        reactions,
        explorationSlug: slug,
      }
    })
  }

  const resetFilters = () => {
    setQuery('')
    setTier('all')
    setDomain('all')
    setCrowding('all')
    setSort('rank')
    setScope('all')
  }

  const activeFilters = Boolean(
    query ||
      tier !== 'all' ||
      domain !== 'all' ||
      crowding !== 'all' ||
      sort !== 'rank' ||
      scope !== 'all',
  )

  return (
    <div className="space-y-5">
      {exploration && (
        <section className="border-y border-terminal-violet/30 bg-terminal-violet/[0.05] px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-terminal-violet mb-1">
              Your 30-day problem exploration
            </p>
            <p className="font-serif text-xl text-ink-100">{exploration.title}</p>
            <p className="mt-1 text-sm text-ink-400">{exploration.successLooksLike}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/p/${exploration.problemSlug}`}
              className="h-9 inline-flex items-center px-3 rounded border border-terminal-violet/40 text-terminal-violet font-mono text-[11px] hover:bg-terminal-violet/10 transition-colors"
            >
              Open evidence →
            </Link>
            <button
              type="button"
              onClick={() => setExploration(exploration.slug)}
              className="h-9 w-9 inline-flex items-center justify-center rounded border border-hair text-ink-500 hover:text-ink-100"
              title="Clear 30-day exploration"
              aria-label="Clear 30-day exploration"
            >
              <X size={16} />
            </button>
          </div>
        </section>
      )}

      <section className="border border-hair rounded-lg overflow-hidden">
        <div className="border-b border-hair bg-ink-900/40 p-3 sm:p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Questbook views">
            {(
              [
                ['all', `All ${quests.length}`],
                ['saved', `Saved ${counts.saved}`],
                ['interested', `Interested ${counts.interested}`],
                ['passed', `Passed ${counts.passed}`],
              ] as [Scope, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setScope(value)}
                aria-pressed={scope === value}
                className={`h-8 px-3 rounded border font-mono text-[10px] uppercase tracking-wide transition-colors ${
                  scope === value
                    ? 'border-amber-300/50 bg-amber-300/10 text-amber-300'
                    : 'border-hair text-ink-500 hover:text-ink-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-[minmax(14rem,1fr)_repeat(4,minmax(7rem,auto))_2.25rem] gap-2 items-end">
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-wide text-ink-600">
                Search quests
              </span>
              <span className="relative block">
                <Search
                  size={15}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-600"
                  aria-hidden
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="energy, pathogens, housing..."
                  className="h-9 w-full rounded border border-hair bg-ink-900 pl-8 pr-3 text-sm text-ink-100 placeholder:text-ink-600 outline-none focus:border-amber-300"
                />
              </span>
            </label>
            <FilterSelect label="Tier" value={tier} onChange={setTier}>
              <option value="all">All tiers</option>
              <option value="S">S tier</option>
              <option value="A">A tier</option>
              <option value="B">B tier</option>
              <option value="C">C tier</option>
            </FilterSelect>
            <FilterSelect label="Domain" value={domain} onChange={setDomain}>
              <option value="all">All domains</option>
              {domains.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Supply" value={crowding} onChange={setCrowding}>
              <option value="all">Any supply</option>
              <option value="open">Open field</option>
              <option value="contested">Contested</option>
              <option value="crowded">Crowded</option>
            </FilterSelect>
            <FilterSelect
              label="Rank by"
              value={sort}
              onChange={(value) => setSort(value as SortKey)}
            >
              <option value="rank">Power rank</option>
              <option value="opportunity">Opportunity</option>
              <option value="demand">Demand</option>
              <option value="gap">Supply gap</option>
              <option value="prize">Prize at limit</option>
            </FilterSelect>
            <button
              type="button"
              onClick={resetFilters}
              disabled={!activeFilters}
              className="h-9 w-9 inline-flex items-center justify-center rounded border border-hair text-ink-500 hover:text-ink-100 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Reset filters"
              aria-label="Reset filters"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 font-mono text-[10px] text-ink-600">
            <span>{visible.length} quests visible</span>
            <span className="hidden sm:inline">
              bookmark · react · flag one for a 30-day exploration
            </span>
          </div>
        </div>

        <div>
          {visible.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="font-serif text-xl text-ink-200">No quests match this view.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 font-mono text-[11px] text-amber-300 hover:underline"
              >
                Reset the browser
              </button>
            </div>
          ) : (
            visible.map((quest) => (
              <QuestRow
                key={quest.slug}
                q={quest}
                saved={questbook.saved.includes(quest.slug)}
                reaction={questbook.reactions[quest.slug]}
                isExploration={questbook.explorationSlug === quest.slug}
                onToggleSaved={() => toggleSaved(quest.slug)}
                onReaction={(reaction) => setReaction(quest.slug, reaction)}
                onExploration={() => setExploration(quest.slug)}
              />
            ))
          )}
        </div>
      </section>

      <p className="font-mono text-[10px] text-ink-600 leading-relaxed max-w-3xl">
        Your Questbook is stored locally on this device. No account or cloud sync yet. Scores are
        evidence-backed conjectures, not guarantees. Passing hides nothing from the public ranking;
        it only records your own decision.
      </p>
    </div>
  )
}
