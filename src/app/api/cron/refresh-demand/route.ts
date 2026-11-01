/**
 * GET/POST /api/cron/refresh-demand
 *
 * Demand-signal snapshot: pulls every live feed in the demand-signal registry
 * (WHO, OWID, NIH RePORTER, openFDA) fresh, plus — when EXA_API_KEY is
 * set — one Exa Agent run extracting queue metrics that have no API (grid
 * interconnection backlog, housing vacancy, transplant waitlist).
 *
 * Not scheduled in vercel.json. EXA_API_KEY is set in production, and this
 * route runs a medium-effort Exa Agent when that key is present. Those queue
 * signals are returned in this response only: they are not stored and /demand
 * does not read them. A daily cron would spend Exa credits on a discarded
 * result. The free feeds are already refreshed by /demand (`revalidate` of
 * one day). Hit this route by hand when you want the audit, including Exa.
 * The older "Hobby cron-count" note is stale: four other jobs are already
 * scheduled.
 *
 * Auth: Bearer CRON_SECRET, same contract as problem-sourcing.
 */
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { demandSignalRegistry } from '@/data/demand-signals'
import { fetchDemandBurden } from '@/lib/burden-feed'
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
        feeds.burden ? fetchDemandBurden(feeds.burden, { revalidateSeconds: 0 }) : null,
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
        burden: burden?.status === 'ok' ? { year: burden.year, value: burden.value } : null,
        burdenStatus: burden?.status ?? null,
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
