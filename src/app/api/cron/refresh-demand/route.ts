/**
 * GET/POST /api/cron/refresh-demand
 *
 * Demand-signal snapshot: pulls every live feed in the demand-signal registry
 * (WHO GHO, OWID, NIH RePORTER, openFDA) fresh, plus — when EXA_API_KEY is
 * set — one Exa Agent run extracting queue metrics that have no API (grid
 * interconnection backlog, housing vacancy, transplant waitlist).
 *
 * Deliberately NOT scheduled in vercel.json yet (Hobby cron-count limit); the
 * /demand page live-fetches with daily ISR on its own. This route exists to
 * (a) force-refresh and audit the signals, (b) exercise the Exa queue
 * extractor, and (c) become the persistence writer once signal history lands
 * in Neon.
 *
 * Auth: Bearer CRON_SECRET, same contract as problem-sourcing.
 */
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { demandSignalRegistry } from '@/data/demand-signals'
import { fetchGho } from '@/lib/sources/who'
import { fetchOwid } from '@/lib/sources/owid'
import { fetchWdi } from '@/lib/sources/worldbank'
import { fetchOpenAlexCount } from '@/lib/sources/openalex'
import { fetchFormDCount } from '@/lib/sources/edgar'
import { fetchFederalRegisterCount } from '@/lib/sources/federal-register'
import { fetchUsaSpendingAwards } from '@/lib/sources/usaspending'
import { fetchNihProjectCount } from '@/lib/sources/nih'
import { fetchFdaShortages } from '@/lib/sources/openfda'
import { isExaConfigured, sourceQueueSignals } from '@/lib/sources/exa'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

function authorize(req: Request): { ok: true } | { ok: false; status: number; error: string } {
  const expected = process.env.CRON_SECRET
  if (!expected) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, status: 500, error: 'CRON_SECRET not configured on this deployment' }
    }
    return { ok: true }
  }
  const header = req.headers.get('authorization') ?? ''
  const presented = header.startsWith('Bearer ') ? header.slice(7) : header
  if (presented !== expected) {
    return { ok: false, status: 401, error: 'invalid or missing CRON_SECRET' }
  }
  return { ok: true }
}

export async function GET(req: Request) {
  return POST(req)
}

export async function POST(req: Request) {
  const auth = authorize(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  const startedAt = Date.now()
  const entries = Object.entries(demandSignalRegistry)
  const signals = await Promise.all(
    entries.map(async ([slug, feeds]) => {
      const [burden, papers, raises, rulemaking, awards, research, queues] = await Promise.all([
        feeds.burden
          ? feeds.burden.kind === 'gho'
            ? fetchGho(feeds.burden.code, { revalidateSeconds: 0 })
            : feeds.burden.kind === 'owid'
              ? fetchOwid(feeds.burden.slug, {
                  extraParams: feeds.burden.extraParams,
                  revalidateSeconds: 0,
                })
              : fetchWdi('WLD', feeds.burden.indicator, { revalidateSeconds: 0 })
          : null,
        feeds.openAlexSearch
          ? fetchOpenAlexCount(feeds.openAlexSearch, { revalidateSeconds: 0 })
          : null,
        feeds.edgar
          ? fetchFormDCount(feeds.edgar.q, { kind: feeds.edgar.kind, revalidateSeconds: 0 })
          : null,
        feeds.federalRegisterTerm
          ? fetchFederalRegisterCount(feeds.federalRegisterTerm, { revalidateSeconds: 0 })
          : null,
        feeds.usaSpendingTerm
          ? fetchUsaSpendingAwards(feeds.usaSpendingTerm, { revalidateSeconds: 0 })
          : null,
        feeds.nihSearch ? fetchNihProjectCount(feeds.nihSearch) : null,
        feeds.fdaCategory
          ? fetchFdaShortages({ category: feeds.fdaCategory, revalidateSeconds: 0 })
          : null,
      ])
      return {
        problemSlug: slug,
        burden: burden?.latest ?? null,
        papers: papers?.workCount ?? null,
        privateRaises: raises?.filingCount ?? null,
        federalDocs: rulemaking?.documentCount ?? null,
        federalAwards: awards?.awardCount ?? null,
        researchProjects: research?.projectCount ?? null,
        currentShortages: queues?.currentCount ?? null,
      }
    }),
  )

  // Budget the Exa phase against remaining wall time so the route can never
  // outrun maxDuration and 504 (20s safety margin for poll + serialization).
  const exaOn = isExaConfigured()
  const remainingMs = maxDuration * 1000 - (Date.now() - startedAt) - 20_000
  const exaQueueSignals =
    exaOn && remainingMs > 30_000 ? await sourceQueueSignals({ timeoutMs: remainingMs }) : []

  // The /demand page caches on daily ISR; a forced refresh should show up there.
  revalidatePath('/demand')

  const payload = {
    ok: true,
    ranAt: new Date().toISOString(),
    liveFeeds: {
      problems: signals.length,
      resolved: signals.filter(
        (s) =>
          s.burden ||
          s.papers != null ||
          s.privateRaises != null ||
          s.federalDocs != null ||
          s.federalAwards != null ||
          s.researchProjects != null ||
          s.currentShortages != null,
      ).length,
      signals,
    },
    exa: {
      mode: exaOn ? 'live' : 'stub',
      queueSignals: exaQueueSignals,
    },
    nextSteps: [
      'Signal history persistence into Neon lands next (signals table)',
      ...(exaOn ? [] : ['Wire EXA_API_KEY to extract no-API queue signals (LBNL, OPTN, Census HVS)']),
    ],
  }

  console.info(JSON.stringify({ event: 'cron:refresh-demand', ok: true, resolved: payload.liveFeeds.resolved }))

  return NextResponse.json(payload)
}
