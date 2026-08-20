/**
 * The prize + timeline index — every ranked problem's "prize" paired with a
 * reasoned estimate of how long a company would realistically take to
 * capture that market, and the specific thing that gates the timeline.
 *
 * IMPORTANT: the prize figures below are the precise, worked dollar-value
 * calculations from each problem's own whitepaper (market size x realistic
 * solution pricing, shown with its math and sources in whitepapers.ts) —
 * NOT problems.ts's `marketSize` field. That field is an older, coarser
 * "total current market" context number set at an earlier authoring pass
 * (e.g. housing's $13T is the whole global construction industry; this
 * script's $175B is the specific addressable prize for industrialized
 * affordable-housing production). The two numbers answer different
 * questions on purpose; conflating them was a real bug caught while
 * building this script, see the git history for the fix.
 *
 * The timeline is a judgment call, not a computed fact. Each one names its
 * own binding constraint so it can be argued with rather than taken as
 * settled.
 *
 * Run with: npx tsx scripts/prize-timeline.ts
 */
import { problems } from '../src/data/problems'
import { fmtUsdCompact } from '../src/lib/allocation'

/** The worked prize figure from each problem's whitepaper, USD/year. */
const PRIZES: Record<string, { value: number; note: string }> = {
  biosecurity: { value: 10_500_000_000, note: 'G20 Joint Finance and Health Task Force — full pandemic-prevention financing gap' },
  'energy-abundance': { value: 90_000_000_000, note: 'enhanced-geothermal slice of clean-firm-power (~$60B, IEA 126GW target x DOE 2030 cost) + universal electrification (~$30B, World Bank)' },
  'housing-construction': { value: 175_000_000_000, note: 'UN-Habitat 35M units/yr x $5,000/unit industrialized price point' },
  pedagogy: { value: 15_000_000_000, note: '1.5B undereducated children (UNESCO) x $10/student/year (Khanmigo district pricing floor)' },
  'infectious-disease': { value: 12_000_000_000, note: 'malaria ($5B) + HIV ($1.8B) + TB ($5.3B), per-patient WHO/Global Fund pricing' },
  'scientific-productivity': { value: 26_000_000_000, note: '8.8M researchers (UNESCO) x $3,000/researcher/year AI-tooling bundle' },
  longevity: { value: 170_000_000_000, note: '170M of 1.7B global 50+ population x $1,000/year mass-market diagnostics+protocol' },
  'fertility-decline': { value: 162_000_000_000, note: 'latent unmet IVF demand — 12M of 48M WHO-estimated infertile couples x ~$13,500/cycle' },
  loneliness: { value: 15_000_000_000, note: 'conservative 5% of 1.5B lonely adults x $200/year membership-based "third place"' },
  'extreme-poverty': { value: 70_000_000_000, note: "World Bank's own poverty-gap floor to close the $2.15/day line for 700M people" },
  'climate-change': { value: 2_700_000_000_000, note: 'IEA Net Zero Roadmap — the annual investment gap, $4.5T needed minus $1.8T actually invested' },
  'neglected-tropical-diseases': { value: 850_000_000, note: 'full MDA coverage — 1.7B people x ~$0.50/person/year, WHO/CDC/PLOS benchmark' },
  'newborn-survival': { value: 2_750_000_000, note: '20-30M small/sick newborns x ~$100-130/baby, NEST360 real multi-country cost data' },
}

type TimelineEstimate = {
  years: string
  gate: 'regulatory' | 'physical-buildout' | 'distribution' | 'capital-coordination'
  reason: string
}

const TIMELINES: Record<string, TimelineEstimate> = {
  biosecurity: {
    years: '8-10',
    gate: 'physical-buildout',
    reason:
      'No drug approval needed for the core network (wastewater/air metagenomic sequencing sites). Gated by physical site rollout to ~9,000 locations plus getting DNA-synthesis screening mandated across major economies, an infrastructure and policy rollout, not an invention.',
  },
  'energy-abundance': {
    years: '15-20',
    gate: 'physical-buildout',
    reason:
      'Enhanced geothermal and advanced fission both require first-of-a-kind plants, gigawatt-scale drilling/construction, and interconnection-queue clearance. Comparable to how long Tesla and SpaceX-scale infrastructure companies took to reach current scale, and neither of those has fully captured its market yet either.',
  },
  'housing-construction': {
    years: '10-15',
    gate: 'physical-buildout',
    reason:
      'Factory buildout for 3D-printed or modular production scales city by city; the harder gate is permitting and zoning reform running in parallel across many separate municipal jurisdictions, each with its own multi-year timeline.',
  },
  pedagogy: {
    years: '6-9',
    gate: 'distribution',
    reason:
      'Software scales fast once the product works; the gate is procurement, schools and governments are slow, multi-year-cycle buyers, so the technical build is the easy half.',
  },
  'infectious-disease': {
    years: '8-12',
    gate: 'regulatory',
    reason:
      'A long-acting regimen or gene-drive still needs clinical trials and WHO prequalification before mass distribution, then a separate multi-year field-delivery rollout across high-burden, low-resource settings.',
  },
  'scientific-productivity': {
    years: '6-10',
    gate: 'distribution',
    reason:
      'Software build is fast; academic and institutional adoption cycles (grant cycles, procurement, trust-building with researchers) are the slow part, similar to pedagogy but with a smaller, more networked buyer base that can move somewhat faster.',
  },
  longevity: {
    years: '15-20+',
    gate: 'regulatory',
    reason:
      'The FDA does not yet recognize aging as a trialable indication. A validated biomarker endpoint has to be accepted first, before any geroprotector trial can even start the clock, then the mass-market delivery layer (diagnostics + protocol at $1,000/year, not $10-85K) still has to be built on top.',
  },
  'fertility-decline': {
    years: '10-12',
    gate: 'physical-buildout',
    reason:
      'Automating embryology labs and scaling a clinic network is a physical capacity build, not a science problem. Gated by how fast a company can stand up and staff automated clinics across enough markets to reach the underserved 36M of 48M couples.',
  },
  loneliness: {
    years: '15-20',
    gate: 'physical-buildout',
    reason:
      'Physical, recurring, membership-funded "third places" scale one relationship and one location at a time. The nearest comparable business models (CrossFit, Planet Fitness-scale gym chains) took multiple decades to reach national saturation.',
  },
  'extreme-poverty': {
    years: '10-15',
    gate: 'distribution',
    reason:
      'Mobile money and biometric ID rails already exist in early form (M-Pesa, Aadhaar); the gate is interoperability and coverage across every remaining unbanked geography, a distribution and integration problem more than a technical one.',
  },
  'climate-change': {
    years: 'no single company',
    gate: 'capital-coordination',
    reason:
      'Full decarbonization is a $4.5T/year, multi-decade, civilizational undertaking; no single company captures this market by design. A company attacking one wedge (industrial heat, grid storage, EGS) could meaningfully scale in 10-15 years, but "fully solved by one company" is not the honest framing here.',
  },
  'neglected-tropical-diseases': {
    years: '6-10',
    gate: 'capital-coordination',
    reason:
      'The drugs and the delivery model (mass drug administration) already exist and are proven at decades-long scale (guinea worm, trachoma). This is a financing and pooled-procurement problem, the fastest-gated of the 13 once capital is unlocked.',
  },
  'newborn-survival': {
    years: '8-12',
    gate: 'physical-buildout',
    reason:
      'NEST360 already proves the model works at hospital-network scale in four countries. The gate is replicating that device-plus-training-plus-maintenance rollout across every remaining high-burden country, a proven playbook, just not yet globally deployed.',
  },
}

const ranked = problems
  .filter((p) => PRIZES[p.slug])
  .map((p) => ({
    slug: p.slug,
    name: p.name,
    prize: PRIZES[p.slug].value,
    prizeNote: PRIZES[p.slug].note,
    timeline: TIMELINES[p.slug],
  }))
  .sort((a, b) => b.prize - a.prize)

console.log('\n=== PRIZE + TIME-TO-CAPTURE, RANKED BY PRIZE (from each problem\'s own whitepaper) ===\n')
for (const r of ranked) {
  const gate = r.timeline ? `${r.timeline.years} yrs, gated by ${r.timeline.gate}` : 'no timeline estimate'
  console.log(`${fmtUsdCompact(r.prize).padStart(7)}/yr  ${gate.padEnd(38)}  ${r.name}`)
}

console.log('\n=== DETAIL ===\n')
for (const r of ranked) {
  console.log(`\n${r.name} — ${fmtUsdCompact(r.prize)}/year prize`)
  console.log(`  ${r.prizeNote}`)
  if (r.timeline) {
    console.log(`  ${r.timeline.years} years, gated by ${r.timeline.gate}`)
    console.log(`  ${r.timeline.reason}`)
  }
}
