/**
 * The prize at the limit — for each problem, the in-the-limit equity value of
 * the company that wins it if the team executes perfectly. The upside half of
 * the allocator's trade: high demand + thin capital + a huge prize = the
 * opportunity. This is the number that flips a Request for Startups ("build
 * this") into a Request for Investors ("fund this").
 *
 * Honesty rules: every figure is a CEILING, not a forecast — confidence is low
 * by construction, anchored to a NAMED public comparable, with the reasoning
 * shown so it can be argued down. The point is the order of magnitude and the
 * logic, not false precision.
 */
import type { InLimitCap } from './types'

const TODAY = '2026-06-11'

export const inLimitCaps: InLimitCap[] = [
  {
    problemSlug: 'ai-safety',
    marketCap: {
      value: 3_000_000_000_000,
      unit: 'USD (in-limit market cap)',
      source: 'ceiling estimate, anchored to a frontier AI lab',
      confidence: 'low',
      asOf: TODAY,
    },
    comparable: 'a leading frontier lab (Anthropic / OpenAI trajectory)',
    reasoning:
      'The lab that makes superhuman AI reliably safe is also the lab the world trusts to deploy it. Safety is not a cost center here; it is the moat that lets the dominant AI platform exist. The ceiling is a meaningful share of the entire AI market.',
  },
  {
    problemSlug: 'energy-abundance',
    marketCap: {
      value: 2_000_000_000_000,
      unit: 'USD (in-limit market cap)',
      source: 'ceiling estimate, anchored to an energy supermajor',
      confidence: 'low',
      asOf: TODAY,
    },
    comparable: 'Saudi Aramco (~$1.8T) / NextEra',
    reasoning:
      'Whoever delivers firm, ultra-cheap, clean power at planetary scale (fusion, advanced fission, or solar+storage at a new cost floor) replaces the incumbent fossil supermajors and expands the market as energy gets cheaper. Aramco is the floor for the prize, not the ceiling.',
  },
  {
    problemSlug: 'longevity',
    marketCap: {
      value: 3_000_000_000_000,
      unit: 'USD (in-limit market cap)',
      source: 'ceiling estimate; willingness-to-pay is near-unbounded',
      confidence: 'low',
      asOf: TODAY,
    },
    comparable: 'the combined market cap of big pharma',
    reasoning:
      'A company that meaningfully extends healthy human lifespan faces the highest willingness-to-pay in existence: people will spend everything for more healthy years. The prize is a sizable fraction of the entire pharmaceutical industry, redirected to the winner.',
  },
  {
    problemSlug: 'scientific-productivity',
    marketCap: {
      value: 1_000_000_000_000,
      unit: 'USD (in-limit market cap)',
      source: 'ceiling estimate, anchored to scientific-infrastructure incumbents',
      confidence: 'low',
      asOf: TODAY,
    },
    comparable: 'a research-infrastructure monopoly (TSMC-of-science)',
    reasoning:
      'The company that 10x the rate of scientific discovery becomes the picks-and-shovels layer under every other breakthrough — drugs, materials, energy. It taxes all downstream progress, which is why the ceiling rivals the largest infrastructure firms.',
  },
  {
    problemSlug: 'climate-change',
    marketCap: {
      value: 1_000_000_000_000,
      unit: 'USD (in-limit market cap)',
      source: 'ceiling estimate, anchored to industrial decarbonization + removal',
      confidence: 'low',
      asOf: TODAY,
    },
    comparable: 'an industrial supermajor + a carbon-removal monopoly',
    reasoning:
      'Beyond clean energy: the firm that decarbonizes heavy industry (steel, cement) and removes legacy carbon cheaply sits on a multi-decade, government-backstopped demand curve. The ceiling is supermajor-scale.',
  },
  {
    problemSlug: 'extreme-poverty',
    marketCap: {
      value: 500_000_000_000,
      unit: 'USD (in-limit market cap)',
      source: 'ceiling estimate, anchored to a global financial-inclusion platform',
      confidence: 'low',
      asOf: TODAY,
    },
    comparable: 'Visa/Mastercard ($400-500B) for the next billion',
    reasoning:
      'The company that profitably brings the bottom billion into the productive economy — payments, credit, and productivity rails — captures a Visa-scale toll on a vast new flow of economic activity it helped create.',
  },
  {
    problemSlug: 'infectious-disease',
    marketCap: {
      value: 200_000_000_000,
      unit: 'USD (in-limit market cap)',
      source: 'ceiling estimate, anchored to a vaccine/biologics platform',
      confidence: 'low',
      asOf: TODAY,
    },
    comparable: 'Moderna at peak (~$180B)',
    reasoning:
      'A platform that can design, manufacture, and deliver vaccines and therapeutics against malaria, TB, HIV, and the next outbreak at low marginal cost becomes the permanent infrastructure of global health security.',
  },
  {
    problemSlug: 'biosecurity',
    marketCap: {
      value: 200_000_000_000,
      unit: 'USD (in-limit market cap)',
      source: 'ceiling estimate, anchored to a defense/biotech platform',
      confidence: 'low',
      asOf: TODAY,
    },
    comparable: 'a defense prime crossed with Moderna',
    reasoning:
      'The company that becomes the world’s standing pandemic-defense layer — detection, rapid countermeasures, secure supply — sells to every government, with defense-budget durability and biotech upside.',
  },
  {
    problemSlug: 'housing-construction',
    marketCap: {
      value: 300_000_000_000,
      unit: 'USD (in-limit market cap)',
      source: 'ceiling estimate, anchored to a construction-cost disruptor',
      confidence: 'low',
      asOf: TODAY,
    },
    comparable: 'larger than today’s biggest homebuilders combined',
    reasoning:
      'Construction is a multi-trillion-dollar industry that has barely improved its productivity in decades. The firm that breaks the cost curve (industrialized, robotic, modular building) wins a share of the largest asset class on Earth.',
  },
  {
    problemSlug: 'fertility-decline',
    marketCap: {
      value: 200_000_000_000,
      unit: 'USD (in-limit market cap)',
      source: 'ceiling estimate, anchored to reproductive biotech',
      confidence: 'low',
      asOf: TODAY,
    },
    comparable: 'a reproductive-health + IVF platform at global scale',
    reasoning:
      'If demographic decline is the slow crisis of the century, the company that makes having children radically cheaper, easier, and more reliable (IVF access, artificial gametes, fertility restoration) serves an entire generation and is quietly backed by every aging state.',
  },
  {
    problemSlug: 'pedagogy',
    marketCap: {
      value: 300_000_000_000,
      unit: 'USD (in-limit market cap)',
      source: 'ceiling estimate, anchored to a global learning platform',
      confidence: 'low',
      asOf: TODAY,
    },
    comparable: 'the "Google of learning" — a new education default',
    reasoning:
      'A company that delivers a genuine tutor-quality education to anyone, in any language, for near-zero marginal cost becomes the default layer for human capital formation worldwide — the closest thing to compounding the entire species.',
  },
  {
    problemSlug: 'loneliness',
    marketCap: {
      value: 200_000_000_000,
      unit: 'USD (in-limit market cap)',
      source: 'ceiling estimate, anchored to consumer-social incumbents',
      confidence: 'low',
      asOf: TODAY,
    },
    comparable: 'a consumer-social platform optimized for connection, not engagement',
    reasoning:
      'Today’s social platforms monetize attention and arguably worsen the problem. The company that genuinely reduces isolation — real connection as the product — captures consumer-social-scale value while being the rare version that is unambiguously good.',
  },
]

export const getInLimitCap = (problemSlug: string): InLimitCap | undefined =>
  inLimitCaps.find((c) => c.problemSlug === problemSlug)
