/**
 * The capital map — the supply side of the demand map.
 *
 * Thesis: **capital is not scarce, permission is scarce.** The world is awash
 * in money looking for somewhere to go. What is missing is the wire, the
 * permit, and the buyer. So this file maps two things:
 *
 *   1. WHERE THE MONEY IS — and critically, how much of it can actually move.
 *      AUM is not deployability. BlackRock manages ~$11.5T and can deploy
 *      almost none of it into anything new (passive index mandates); a family
 *      office with $500M can wire a founder $250k next week. Ranking pools by
 *      headline AUM is the single most common error in thinking about capital.
 *
 *   2. WHERE IT WOULD GO BUT CANNOT — the dammed flows, each with the specific
 *      blocker holding it back, and what would unblock it.
 *
 * Honesty rules (same covenant as capital-flows.ts):
 *   - Every figure is an order-of-magnitude estimate from a NAMED public
 *     source, confidence-tagged, with an as-of date.
 *   - `scope` states what is counted and excluded, so each number is
 *     falsifiable and improvable by PR.
 *   - `deployableShare` is an EDITORIAL estimate (like rfs crowding), not a
 *     reported figure — it is the judgment call in this file and the thing to
 *     attack first. Refreshable by the Exa sourcer once EXA_API_KEY is wired.
 */
import type { CapitalPool, DammedFlow, BlockerType } from './types'

const ASOF = '2026-07-20'

/* ── 1. Where the money is ───────────────────────────────────────────────── */

export const capitalPools: CapitalPool[] = [
  {
    slug: 'global-pensions',
    name: 'Global pension funds',
    kind: 'pension',
    url: 'https://www.thinkingaheadinstitute.org',
    total: {
      value: 55_000_000_000_000,
      unit: 'USD',
      source: 'Thinking Ahead Institute — Global Pension Assets Study',
      confidence: 'med',
      asOf: ASOF,
    },
    deployableShare: 0.05,
    note: 'The largest pool on Earth and among the least free. Fiduciary duty, liability matching, and strict mandates keep it in public markets and investment-grade credit.',
  },
  {
    slug: 'blackrock',
    name: 'BlackRock',
    kind: 'asset-manager',
    url: 'https://www.blackrock.com',
    total: {
      value: 11_500_000_000_000,
      unit: 'USD',
      source: 'BlackRock reported AUM',
      confidence: 'med',
      asOf: ASOF,
    },
    deployableShare: 0.03,
    note: 'Largest asset manager in the world, and mostly inert: the bulk is passive index mandates that legally track a benchmark. Enormous, and unable to say yes to anything new.',
  },
  {
    slug: 'vanguard',
    name: 'Vanguard',
    kind: 'asset-manager',
    url: 'https://www.vanguard.com',
    total: {
      value: 9_500_000_000_000,
      unit: 'USD',
      source: 'Vanguard reported AUM',
      confidence: 'med',
      asOf: ASOF,
    },
    deployableShare: 0.01,
    note: 'Almost entirely index funds. The purest example of huge-but-inert capital.',
  },
  {
    slug: 'family-offices',
    name: 'Family offices (global)',
    kind: 'family-office',
    total: {
      value: 5_500_000_000_000,
      unit: 'USD',
      source: 'Industry estimates across ~8,000-10,000 single-family offices',
      confidence: 'low',
      asOf: ASOF,
    },
    deployableShare: 0.35,
    note: 'The most reachable serious money on Earth. Discretionary, no investment committee, can decide in a week. Chronically under-courted because they are hard to find, not hard to convince.',
  },
  {
    slug: 'sovereign-wealth',
    name: 'Sovereign wealth funds',
    kind: 'sovereign',
    url: 'https://www.swfinstitute.org',
    total: {
      value: 12_000_000_000_000,
      unit: 'USD',
      source: 'SWF Institute — aggregate across Norway NBIM (~$1.8T), ADIA, CIC, PIF, GIC, QIA, Temasek',
      confidence: 'med',
      asOf: ASOF,
    },
    deployableShare: 0.2,
    note: 'Mandate-driven and increasingly adventurous. Saudi PIF and Temasek actively hunt new sectors; Norway is huge but constrained to listed markets with ethical exclusions.',
  },
  {
    slug: 'hyperscaler-capex',
    name: 'Big Tech capex (annual)',
    kind: 'corporate',
    total: {
      value: 400_000_000_000,
      unit: 'USD/yr',
      source: 'Reported/guided combined capex — Microsoft, Alphabet, Amazon, Meta',
      confidence: 'med',
      asOf: ASOF,
    },
    deployableShare: 0.9,
    note: 'The fastest-moving large capital on Earth right now, almost all of it aimed at AI compute. It is currently blocked less by money than by electricity and interconnection.',
  },
  {
    slug: 'us-federal-rd',
    name: 'US federal R&D (annual)',
    kind: 'government',
    url: 'https://www.nih.gov',
    total: {
      value: 200_000_000_000,
      unit: 'USD/yr',
      source: 'US federal R&D obligations; NIH alone ~$47B/yr',
      confidence: 'med',
      asOf: ASOF,
    },
    deployableShare: 0.15,
    note: 'The largest funder of basic research in history. Allocated by peer review, which is slow, conservative, and heavily skewed to established researchers.',
  },
  {
    slug: 'foundations',
    name: 'Major foundations (annual giving)',
    kind: 'endowment',
    url: 'https://www.gatesfoundation.org',
    total: {
      value: 25_000_000_000,
      unit: 'USD/yr',
      source: 'Gates Foundation (~$8.6B/yr payout), Wellcome (~£1.6B/yr), Open Philanthropy, Bloomberg, others',
      confidence: 'low',
      asOf: ASOF,
    },
    deployableShare: 1,
    note: 'The only pool whose entire purpose is to give money away. 100% deployable by construction, and the most willing to fund public goods with no buyer.',
  },
  {
    slug: 'university-endowments',
    name: 'University endowments',
    kind: 'endowment',
    total: {
      value: 900_000_000_000,
      unit: 'USD',
      source: 'NACUBO — US endowments; Harvard ~$50B, Yale, Stanford, MIT, Princeton',
      confidence: 'med',
      asOf: ASOF,
    },
    deployableShare: 0.05,
    note: 'Large corpus, small annual payout (typically ~5%), and a strong institutional preference for established managers over new ideas.',
  },
]

/* ── 2. Where it would go, but cannot ────────────────────────────────────── */

export const dammedFlows: DammedFlow[] = [
  {
    slug: 'grid-interconnection',
    destination: 'US grid interconnection queue',
    problemSlug: 'energy-abundance',
    waiting: {
      value: 2_300_000_000_000,
      unit: 'USD (derived)',
      source:
        'LBNL "Queued Up" — ~2,000+ GW of generation and storage active in US interconnection queues; converted at ~$1.0-1.5M per MW',
      sourceUrl: 'https://emp.lbl.gov/queues',
      confidence: 'low',
      asOf: ASOF,
    },
    blocker: 'queue',
    blockerDetail:
      'Median wait from request to commercial operation is roughly 5 years. The projects are financed and shovel-ready. The wire is the constraint.',
    unlock:
      'Interconnection reform, cluster studies, and transmission buildout. Queue-management software is a real, buildable wedge.',
    attackableBy: 'policy',
    scope:
      'Active US queue capacity only. Historically ~70-80% of queued projects withdraw, so treat as an upper bound on committed intent, not on delivered capacity.',
  },
  {
    slug: 'ai-datacenter-power',
    destination: 'AI datacenter buildout',
    problemSlug: 'energy-abundance',
    waiting: {
      value: 400_000_000_000,
      unit: 'USD/yr',
      source: 'Hyperscaler capex guidance; power procurement now the binding constraint on siting',
      confidence: 'med',
      asOf: ASOF,
    },
    blocker: 'queue',
    blockerDetail:
      'The money exists and is committed. Firm 24/7 power and grid connection do not. This is why hyperscalers are signing nuclear PPAs and restarting retired plants.',
    unlock: 'Firm generation (nuclear, geothermal), faster interconnection, behind-the-meter siting.',
    attackableBy: 'atoms',
    scope: 'Annual capex flow, not a stock. Overlaps the interconnection queue above.',
  },
  {
    slug: 'fission-permitting',
    destination: 'New nuclear fission',
    problemSlug: 'energy-abundance',
    waiting: {
      value: 100_000_000_000,
      unit: 'USD',
      source: 'Announced advanced-nuclear commitments and hyperscaler PPAs (Microsoft, Google, Amazon)',
      confidence: 'low',
      asOf: ASOF,
    },
    blocker: 'permitting',
    blockerDetail:
      'NRC licensing routinely takes 5+ years and $100M+ before a shovel touches ground. Capital appetite has never been higher; the bottleneck is a legal process, not physics or funding.',
    unlock: 'Standardized design certification, automated safety-case generation, licensing reform.',
    attackableBy: 'policy',
    scope: 'US-focused. Excludes China, which builds on a fundamentally different timeline.',
  },
  {
    slug: 'housing-entitlement',
    destination: 'US housing construction',
    problemSlug: 'housing-construction',
    waiting: {
      value: 1_000_000_000_000,
      unit: 'USD (derived)',
      source:
        'US housing shortage estimated at ~4M units (Freddie Mac / NAR / Zillow range 3.8-5.5M); converted at ~$250k per unit',
      confidence: 'low',
      asOf: ASOF,
    },
    blocker: 'permitting',
    blockerDetail:
      'Zoning, entitlement, and discretionary review. Capital wants to build housing; land-use law forbids it at the density and speed required.',
    unlock: 'By-right zoning, permitting-as-an-API, entitlement automation.',
    attackableBy: 'policy',
    scope: 'US only. Shortage estimates vary widely by methodology; treated as order-of-magnitude.',
  },
  {
    slug: 'pandemic-prevention',
    destination: 'Pandemic preparedness',
    problemSlug: 'biosecurity',
    waiting: {
      value: 30_000_000_000,
      unit: 'USD/yr',
      source: 'Estimated annual global spend needed for preparedness vs. actual; COVID cost ~$14T',
      confidence: 'low',
      asOf: ASOF,
    },
    blocker: 'no-buyer',
    blockerDetail:
      'Nobody buys prevention. The value is enormous and entirely uncapturable by the firm that creates it, so the market structurally underprovides it.',
    unlock: 'Advance market commitments, government procurement, philanthropic anchor funding.',
    attackableBy: 'capital',
    scope: 'Preparedness only, excluding outbreak response spending which is reactive and much larger.',
  },
  {
    slug: 'fusion-horizon',
    destination: 'Fusion and long-horizon deep tech',
    problemSlug: 'energy-abundance',
    waiting: {
      value: 50_000_000_000,
      unit: 'USD',
      source: 'Fusion Industry Association — private fusion investment to date, against a far larger latent appetite',
      confidence: 'low',
      asOf: ASOF,
    },
    blocker: 'horizon',
    blockerDetail:
      'A 20-30 year asset cannot fit inside a 10-year fund. The capital exists; the vehicle does not. This is a financial-structure failure, not a belief failure.',
    unlock: 'Patient capital: sovereign anchors, evergreen vehicles, philanthropic first-loss.',
    attackableBy: 'capital',
    scope: 'Private investment only; excludes government fusion programs (ITER, NIF).',
  },
  {
    slug: 'aging-indication',
    destination: 'Longevity therapeutics',
    problemSlug: 'longevity',
    waiting: {
      value: 20_000_000_000,
      unit: 'USD',
      source: 'Announced longevity-focused capital (Altos, NewLimit, Retro, Hevolution and peers)',
      confidence: 'low',
      asOf: ASOF,
    },
    blocker: 'permitting',
    blockerDetail:
      'Aging is not an FDA-recognized indication, so there is no legal path to a pivotal trial for it. Capital is willing; the regulatory category does not exist.',
    unlock: 'Regulatory science to establish aging as an approvable, reimbursable indication.',
    attackableBy: 'policy',
    scope: 'Capital explicitly targeting aging biology, not the broader biotech market.',
  },
  {
    slug: 'talent-discovery',
    destination: 'Undiscovered young talent',
    problemSlug: 'scientific-productivity',
    waiting: {
      value: 200_000_000_000,
      unit: 'USD',
      source: 'Global VC dry powder seeking early-stage alpha; talent identification is the reported bottleneck',
      confidence: 'low',
      asOf: ASOF,
    },
    blocker: 'legibility',
    blockerDetail:
      'Capital cannot see talent before it is credentialed. The screening mechanism is school, employer, and warm intro, which systematically misses the spiky and the unconnected.',
    unlock:
      'A credible signal for pre-credential talent. This is a pure information problem, solvable with code and media.',
    attackableBy: 'code',
    scope: 'Early-stage dry powder only. The bottleneck is qualitative and widely reported rather than precisely measured.',
  },
  {
    slug: 'problem-legibility',
    destination: 'Neglected high-demand problems',
    waiting: {
      value: 500_000_000_000,
      unit: 'USD/yr',
      source:
        'Derived from this site\'s own allocation layer: ~93% of tracked capital flows to 2 of 12 ranked problems',
      confidence: 'low',
      asOf: ASOF,
    },
    blocker: 'legibility',
    blockerDetail:
      'Allocators do not know what is underfunded. Capital herds into whatever is legible and narratively hot, leaving high-demand, low-supply problems starved.',
    unlock: 'A credible, independent, public map of demand versus supply. Literally this website.',
    attackableBy: 'code',
    scope:
      'A modelled reallocation figure, not an observed flow. It is the size of the misallocation, not money sitting idle.',
  },
  {
    slug: 'emerging-markets',
    destination: 'Frontier and emerging markets',
    problemSlug: 'extreme-poverty',
    waiting: {
      value: 2_000_000_000_000,
      unit: 'USD',
      source: 'Estimated latent institutional allocation deterred by jurisdictional risk',
      confidence: 'low',
      asOf: ASOF,
    },
    blocker: 'jurisdiction',
    blockerDetail:
      'The highest paper returns on Earth sit where property rights, currency stability, and rule of law are weakest. Capital will not follow returns into a jurisdiction it does not trust.',
    unlock: 'Credible institutions, enforceable contracts, currency hedges, network states and charter cities.',
    attackableBy: 'policy',
    scope: 'Highly speculative; latent allocation is inherently unobservable.',
  },
]

/* ── 3. The blocker taxonomy ─────────────────────────────────────────────── */

export const BLOCKER_META: Record<
  BlockerType,
  { label: string; short: string; who: string }
> = {
  permitting: {
    label: 'Permission',
    short: 'The law says no, or says wait 7 years.',
    who: 'Policy entrepreneurs and regulatory-science startups',
  },
  queue: {
    label: 'Queue',
    short: 'The physical infrastructure does not exist yet.',
    who: 'Infrastructure builders and the software that manages the queue',
  },
  'no-buyer': {
    label: 'No buyer',
    short: 'The value is real but uncapturable, so no firm can sell it.',
    who: 'Governments, philanthropy, advance market commitments',
  },
  horizon: {
    label: 'Time horizon',
    short: 'The asset outlives the fund that would hold it.',
    who: 'Patient capital: sovereigns, evergreen vehicles, endowments',
  },
  legibility: {
    label: 'Legibility',
    short: 'The capital cannot see the opportunity or the person.',
    who: 'Index-makers and media. Solvable with code alone.',
  },
  jurisdiction: {
    label: 'Jurisdiction',
    short: 'The returns are real but the rule of law is not.',
    who: 'Institution builders, charter cities, network states',
  },
  mandate: {
    label: 'Mandate',
    short: 'The money is legally forbidden from moving.',
    who: 'Nobody. This capital is structurally inert.',
  },
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Deployable capital for a pool = total x the editorial deployable share. */
export function deployableUsd(p: CapitalPool): number {
  return p.total.value * p.deployableShare
}

/** Total capital dammed, grouped by blocker type (annual flows and stocks mixed — see scope). */
export function blockedByType(): { type: BlockerType; usd: number; count: number }[] {
  const acc = new Map<BlockerType, { usd: number; count: number }>()
  for (const f of dammedFlows) {
    const cur = acc.get(f.blocker) ?? { usd: 0, count: 0 }
    acc.set(f.blocker, { usd: cur.usd + f.waiting.value, count: cur.count + 1 })
  }
  return [...acc.entries()]
    .map(([type, v]) => ({ type, ...v }))
    .sort((a, b) => b.usd - a.usd)
}

/** The flows a solo builder with code and media can actually attack. */
export function codeAttackableFlows(): DammedFlow[] {
  return dammedFlows.filter((f) => f.attackableBy === 'code')
}

/**
 * Kardashev position. Sagan's continuous formula: K = (log10(P) - 6) / 10,
 * where P is total power consumption in watts. Humanity uses ~20 TW.
 */
export const KARDASHEV = {
  currentWatts: 2e13,
  typeIWatts: 1e16,
  get current(): number {
    return (Math.log10(this.currentWatts) - 6) / 10
  },
  get multipleToTypeI(): number {
    return this.typeIWatts / this.currentWatts
  },
}
