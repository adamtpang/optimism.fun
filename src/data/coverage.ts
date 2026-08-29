// The coverage audit — is the index actually comprehensive?
//
// The 11 problems in problems.ts were hand-seeded across the session, not
// discovered. That is a real weakness: a curated list reflects the curator's
// blind spots, and news-driven discovery (the Exa pipeline in
// /api/cron/problem-sourcing) inherits the same bias toward what is loud,
// which is exactly what this project argues is a bad proxy for what matters.
//
// This file cross-references the 11 against three taxonomies that were each
// built, independently, to BE exhaustive over a domain:
//   - UN SDGs: the closest thing to a negotiated global consensus list
//   - 80,000 Hours problem profiles: the longtermist/EA cause-prioritization
//     canon, skewed toward existential and catastrophic risk
//   - GBD (Global Burden of Disease): epidemiology's ranked-by-DALY list,
//     the antidote to picking causes by vibes
//
// Three lists, three different selection biases, cross-checked. A cause
// missing from only one list might be that list's blind spot. A cause
// missing from all three is a real gap in the index.
//
// Sourced 2026-08-05 via live fetch/search against sdgs.un.org,
// 80000hours.org/problem-profiles, and Our World in Data's burden-of-disease
// breakdown (ourworldindata.org/burden-of-disease). Not re-verified since.

export type CoverageStatus = 'covered' | 'partial' | 'gap' | 'excluded'

export type CoverageItem = {
  name: string
  status: CoverageStatus
  /** Problem slugs on the index that address this, if any. */
  matchedSlugs: string[]
  note: string
}

export type CoverageTaxonomy = {
  slug: string
  name: string
  url: string
  method: string
  items: CoverageItem[]
}

export const coverageTaxonomies: CoverageTaxonomy[] = [
  {
    slug: 'sdg',
    name: 'UN Sustainable Development Goals',
    url: 'https://sdgs.un.org/goals',
    method:
      '17 goals, negotiated by all UN member states in 2015 as an exhaustive frame for human development. Goal 17 (Partnerships) is a meta-goal about implementation, not a problem area, so it is excluded from scoring.',
    items: [
      { name: 'No poverty', status: 'covered', matchedSlugs: ['extreme-poverty'], note: 'Direct match.' },
      { name: 'Zero hunger', status: 'gap', matchedSlugs: [], note: 'Malnutrition and food insecurity are not on the index at all.' },
      {
        name: 'Good health and well-being',
        status: 'partial',
        matchedSlugs: ['infectious-disease', 'biosecurity', 'longevity'],
        note: 'Covers pandemics, three infectious diseases, and aging. Does not cover the top-DALY causes — see the GBD taxonomy below.',
      },
      { name: 'Quality education', status: 'covered', matchedSlugs: ['pedagogy'], note: 'Direct match.' },
      { name: 'Gender equality', status: 'gap', matchedSlugs: [], note: 'Not on the index.' },
      { name: 'Clean water and sanitation', status: 'gap', matchedSlugs: [], note: 'Not on the index. Waterborne disease kills more children under 5 than malaria.' },
      { name: 'Affordable and clean energy', status: 'covered', matchedSlugs: ['energy-abundance'], note: 'Direct match.' },
      { name: 'Decent work and economic growth', status: 'gap', matchedSlugs: [], note: 'Not on the index as its own problem.' },
      {
        name: 'Industry, innovation and infrastructure',
        status: 'partial',
        matchedSlugs: ['housing-construction', 'scientific-productivity'],
        note: 'Housing covers physical infrastructure; scientific productivity covers innovation capacity. Broader industrial infrastructure is not covered.',
      },
      { name: 'Reduced inequalities', status: 'gap', matchedSlugs: [], note: 'Not on the index as a distinct problem from poverty.' },
      { name: 'Sustainable cities and communities', status: 'partial', matchedSlugs: ['housing-construction'], note: 'Housing overlaps but urban systems broadly (transit, air quality) are not covered.' },
      { name: 'Responsible consumption and production', status: 'gap', matchedSlugs: [], note: 'Not on the index.' },
      { name: 'Climate action', status: 'covered', matchedSlugs: ['climate-change'], note: 'Direct match.' },
      { name: 'Life below water', status: 'gap', matchedSlugs: [], note: 'Ocean health / fisheries collapse is not on the index.' },
      { name: 'Life on land', status: 'gap', matchedSlugs: [], note: 'Biodiversity loss is not on the index.' },
      { name: 'Peace, justice and strong institutions', status: 'gap', matchedSlugs: [], note: 'War, conflict, and governance quality are not on the index.' },
      { name: 'Partnerships for the goals', status: 'excluded', matchedSlugs: [], note: 'Meta-goal about implementation mechanics, not a problem area — excluded from scoring.' },
    ],
  },
  {
    slug: '80k',
    name: '80,000 Hours problem profiles',
    url: 'https://80000hours.org/problem-profiles/',
    method:
      'The longtermist/EA cause-prioritization canon — skewed hard toward existential and catastrophic risk, which is a deliberate and different bias from the SDGs or GBD. Only the profiles with a clear, non-speculative match to "a problem a company could attack" are scored; frontier/philosophical profiles (moral status of digital minds, whole brain emulation, s-risks) are listed as excluded rather than padded into gaps.',
    items: [
      { name: 'Engineered pandemics', status: 'covered', matchedSlugs: ['biosecurity'], note: 'Direct match.' },
      { name: 'Climate change', status: 'covered', matchedSlugs: ['climate-change'], note: 'Direct match.' },
      { name: 'Global health', status: 'partial', matchedSlugs: ['infectious-disease', 'longevity', 'biosecurity'], note: 'Same partial coverage as the SDG health goal.' },
      {
        name: 'Power-seeking AI systems',
        status: 'gap',
        matchedSlugs: [],
        note: 'Deliberately excluded this session by explicit editorial decision — not an oversight. Flagged here for the record, not as a recommendation to re-add.',
      },
      { name: 'Extreme power concentration', status: 'gap', matchedSlugs: [], note: 'Not on the index.' },
      { name: 'Great power conflict', status: 'gap', matchedSlugs: [], note: 'Not on the index.' },
      { name: 'Nuclear weapons', status: 'gap', matchedSlugs: [], note: 'Not on the index.' },
      { name: 'Factory farming', status: 'gap', matchedSlugs: [], note: 'Animal welfare is arguably out of scope for a "humanity" index — flagged, not necessarily a recommendation.' },
      { name: 'Wild animal suffering', status: 'gap', matchedSlugs: [], note: 'Same scope question as factory farming.' },
      { name: 'Neglected mental health', status: 'gap', matchedSlugs: [], note: 'Not on the index — distinct from loneliness, which frames the social dimension, not clinical illness.' },
      { name: 'Immigration restrictions', status: 'gap', matchedSlugs: [], note: 'Not on the index.' },
      { name: 'High-leverage ways to speed up economic growth', status: 'partial', matchedSlugs: ['scientific-productivity'], note: 'Adjacent but not a direct match.' },
      { name: 'Moral status of digital minds', status: 'excluded', matchedSlugs: [], note: 'Speculative/frontier — not scored as a gap.' },
      { name: 'Gradual disempowerment', status: 'excluded', matchedSlugs: [], note: 'Speculative/frontier — not scored as a gap.' },
      { name: "'S-risks'", status: 'excluded', matchedSlugs: [], note: 'Speculative/frontier — not scored as a gap.' },
      { name: 'Space governance', status: 'excluded', matchedSlugs: [], note: 'Speculative/frontier — not scored as a gap.' },
      { name: 'Whole brain emulation', status: 'excluded', matchedSlugs: [], note: 'Speculative/frontier — not scored as a gap.' },
      { name: 'Stable totalitarianism', status: 'excluded', matchedSlugs: [], note: 'Governance-risk profile, overlaps extreme power concentration — not double-counted.' },
      { name: 'Risks from malevolent actors', status: 'excluded', matchedSlugs: [], note: 'Governance-risk profile, overlaps extreme power concentration — not double-counted.' },
      { name: 'Atomically precise manufacturing', status: 'excluded', matchedSlugs: [], note: 'Speculative/frontier — not scored as a gap.' },
    ],
  },
  {
    slug: 'gbd',
    name: 'Global Burden of Disease, top causes',
    url: 'https://ourworldindata.org/burden-of-disease',
    method:
      'Epidemiology ranked by DALYs (disability-adjusted life years) — the antidote to picking health causes by which ones get news coverage. This is the most damning cross-check: it is ranked by actual harm, and the index barely touches it.',
    items: [
      { name: 'Cardiovascular diseases', status: 'partial', matchedSlugs: ['hypertension'], note: 'Hypertension now covers the largest modifiable cardiovascular risk and its delivery gap; lipids, acute cardiac care, congenital disease, and other cardiovascular causes remain unmodeled.' },
      { name: 'Cancers', status: 'gap', matchedSlugs: [], note: 'The second-largest cause of death worldwide. Zero presence on the index.' },
      { name: 'Neonatal disorders / maternal mortality', status: 'gap', matchedSlugs: [], note: 'Not on the index.' },
      { name: 'Mental and substance use disorders', status: 'gap', matchedSlugs: [], note: 'Depression, anxiety, and addiction are a top-5 DALY cause on their own — distinct from loneliness on the index, which frames the social dimension only.' },
      { name: 'Respiratory infections (pneumonia etc.)', status: 'partial', matchedSlugs: ['infectious-disease'], note: 'Infectious-disease on the index names malaria, TB, and HIV specifically — pneumonia, the single largest infectious killer of children, is not named.' },
      { name: 'Diarrheal diseases', status: 'gap', matchedSlugs: [], note: 'Not on the index — overlaps the clean-water SDG gap above.' },
      { name: 'Diabetes', status: 'gap', matchedSlugs: [], note: 'Not on the index.' },
      { name: 'Musculoskeletal disorders', status: 'gap', matchedSlugs: [], note: 'Not on the index — low-mortality but the single largest cause of years lived with disability globally.' },
      { name: 'Road injuries, violence, and self-harm', status: 'gap', matchedSlugs: [], note: 'Not on the index.' },
    ],
  },
]

export type CoverageGapCandidate = {
  name: string
  flaggedBy: string[]
  why: string
}

/**
 * Concrete next-problem candidates, hand-curated from the gap items above.
 * Ranked by how many independent taxonomies flag the same thing — a cause
 * every list agrees is missing is a stronger claim than one list's blind spot.
 */
export const coverageGapCandidates: CoverageGapCandidate[] = [
  {
    name: 'Cardiovascular disease beyond hypertension',
    flaggedBy: ['gbd'],
    why: 'Hypertension control now covers the largest modifiable risk factor, but the index still lacks a complete cardiovascular model spanning lipids, smoking, acute care, and structural disease.',
  },
  {
    name: 'Cancer',
    flaggedBy: ['gbd'],
    why: 'Second-largest cause of death worldwide. Zero presence.',
  },
  {
    name: 'Mental health & substance use disorders',
    flaggedBy: ['gbd', '80k'],
    why: 'A top-5 global DALY cause and independently named by 80,000 Hours as neglected — flagged by both an outcomes-ranked list and a cause-prioritization canon.',
  },
  {
    name: 'Clean water & sanitation',
    flaggedBy: ['sdg', 'gbd'],
    why: 'Named directly by the SDGs; the resulting diarrheal disease burden is named directly by GBD. Two independent lists, same gap.',
  },
  {
    name: 'Malnutrition & hunger',
    flaggedBy: ['sdg'],
    why: 'Distinct from extreme-poverty’s income framing — hunger is a nutritional-outcome problem with its own solution space (fortification, supply chains, agricultural yield).',
  },
  {
    name: 'Maternal & neonatal mortality',
    flaggedBy: ['sdg', 'gbd'],
    why: 'Named by the health SDG and a distinct top-level GBD cause cluster.',
  },
  {
    name: 'Governance quality & great-power conflict',
    flaggedBy: ['sdg', '80k'],
    why: 'Named by the SDGs (peace, justice, institutions) and by 80,000 Hours (great power conflict, extreme power concentration) — the least tractable-looking gap, but the most repeatedly flagged.',
  },
  {
    name: 'Gender inequality',
    flaggedBy: ['sdg'],
    why: 'Named directly by the SDGs; not represented on the index in any form.',
  },
  {
    name: 'AI safety / power-seeking AI systems',
    flaggedBy: ['80k'],
    why: 'Named by 80,000 Hours as a top-tier problem. Explicitly and deliberately removed from this index by editorial decision this session — listed here for the record, not as a recommendation.',
  },
]

export function coverageStats(t: CoverageTaxonomy) {
  const scorable = t.items.filter((i) => i.status !== 'excluded')
  const covered = scorable.filter((i) => i.status === 'covered').length
  const partial = scorable.filter((i) => i.status === 'partial').length
  const gap = scorable.filter((i) => i.status === 'gap').length
  return { total: scorable.length, covered, partial, gap }
}
