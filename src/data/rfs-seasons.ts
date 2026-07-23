/**
 * Seasonal Requests for Startups — the drop.
 *
 * YC's RFS is a tradition with a cadence and a byline: named partners write
 * short essays about what they want built, and the seasons create anticipation.
 * Their weakness is that it is demand-free — taste with no claim about
 * magnitude, neglectedness, or who would fund it.
 *
 * This is the synthesis: their authorship and rhythm on top of our arithmetic.
 * Every request here is drawn from the live ranking (lib/rankings.ts), so the
 * selection is defensible rather than merely interesting — and each carries the
 * competitor count that says how contested it already is.
 *
 * A season is an editorial act. The byline is the point: an index has no point
 * of view, and a point of view is what makes people return.
 */

export type RfsSeason = {
  slug: string
  /** Display name, e.g. "Fall 2026". */
  name: string
  /** ISO date the season was published. */
  published: string
  author: string
  authorUrl?: string
  /** The season's argument — what ties this drop together. */
  title: string
  /** The editorial essay. Plain paragraphs, rendered in order. */
  intro: string[]
  /**
   * Featured quest slugs in editorial order (not necessarily rank order).
   * Each must exist in data/rfs.ts.
   */
  questSlugs: string[]
  /** The closing call, in the author's voice. */
  outro: string
}

export const rfsSeasons: RfsSeason[] = [
  {
    slug: 'fall-2026',
    name: 'Fall 2026',
    published: '2026-07-20',
    author: 'Adam Pangelinan',
    authorUrl: 'https://optimism.fun',
    title: 'Build where nobody is standing',
    intro: [
      'Every list of startup ideas is a list of opinions. This one started that way too. I sat down and guessed how contested each of these quests already was, and I was wrong about roughly half of them.',
      'So we measured instead. We searched for the companies actually building each idea and counted them. The result rearranged the entire board. Three quests I was sure were wide open turned out to have five or more funded competitors, and the ones I had buried near the bottom turned out to have almost nobody in them.',
      'That is the whole thesis of this season. The most common way to waste a decade is not picking an unimportant problem. It is picking an important problem that forty other well-funded teams already picked, and finding out eighteen months in. Demand is easy to see. Everyone can see it, which is exactly why the head of the demand curve is the most crowded place on Earth.',
      'The opportunity was never the demand. It is the residual: enormous need, and nobody standing there. So every request below carries a number — how many companies we found already building it. Where that number is zero or one, the field is genuinely yours.',
      'A warning that comes with it. Some of these are empty for good reasons. Gene drives are empty partly because the regulatory and consent apparatus is genuinely hard, not merely unbuilt. Read the blocker before you read the opportunity. An open field is sometimes a frontier and sometimes a graveyard, and telling them apart is the actual work.',
    ],
    questSlugs: [
      'single-encounter-tb-cure',
      'gene-drive-vector-control',
      'fast-grants-as-a-product',
      'entitlement-as-an-api',
      'sub-dollar-diagnostics',
      'aging-as-an-indication',
    ],
    outro:
      'If one of these grips you and will not let go, that is the signal. Not that it is clever, not that it is fundable, but that you cannot stop thinking about it. Build it, and tell me what you find. If you are the person already inside one of these problems and I have the numbers wrong, tell me that instead. This index is a conjecture, and the fastest way to improve it is to be refuted by someone doing the work.',
  },
]

/** The current (most recently published) season. */
export function currentSeason(): RfsSeason | null {
  return (
    [...rfsSeasons].sort((a, b) => b.published.localeCompare(a.published))[0] ?? null
  )
}

export function getSeason(slug: string): RfsSeason | null {
  return rfsSeasons.find((s) => s.slug === slug) ?? null
}
