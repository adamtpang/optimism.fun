/**
 * Chart packages: what every published chart must carry before it goes out.
 *
 * One chart, one story. A package holds the claim, the limitation, the source
 * card fields and the three download files. A slot the source does not fill
 * is null, and the page prints that it is missing. Nothing here is guessed.
 *
 * A package with an empty `problemSlugs` is not shown on any problem page.
 * That is how a package is drafted before Adam approves it for a page.
 */
export type ChartPackage = {
  id: string
  /** Problem pages this chart belongs on. Empty while it is a draft. */
  problemSlugs: string[]
  /** The single claim the chart makes. */
  claim: string
  /** What the number does not show. Specific to this indicator. */
  limitation: string
  source: {
    producer: string
    title: string
    /** The producer's own recommended citation, word for word. */
    citation: string
    url: string
    /** As stated by the source. Null if the source states none. */
    published: string | null
  }
  /** Null name means the license is not confirmed for this file. */
  license: { name: string | null; url: string | null; note: string }
  /** The day the upstream file was fetched, YYYY-MM-DD. */
  accessed: string
  /** What we did to the upstream file to get the charted numbers. */
  processing: string
  snapshot: { path: string; sha256: string }
  /** Null until the file exists. The page shows the empty slot. */
  downloads: { csv: string | null; metadata: string | null; readme: string | null }
}

export const chartPackages: ChartPackage[] = [
  {
    id: 'who-ghe-2023-ischaemic-heart-disease',
    problemSlugs: [],
    claim: 'Ischaemic heart disease caused an estimated 9.5 million deaths in 2023, about 1 in every 6.5 deaths worldwide.',
    limitation:
      "These are WHO's modelled estimates, not counted death certificates, and the file gives single values with no uncertainty range, so it cannot show how sure the number is.",
    source: {
      producer: 'World Health Organization',
      title: 'Global Health Estimates 2023: Deaths by Cause, Age, Sex, by Country and by Region, 2000-2023',
      citation:
        'Global Health Estimates 2023: Deaths by Cause, Age, Sex, by Country and by Region, 2000-2023. Geneva, World Health Organization; 2026.',
      url: 'https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-leading-causes-of-death',
      published: 'September 2026',
    },
    license: {
      name: null,
      url: null,
      note: 'The landing page and the file state no license. WHO publishes CC BY 4.0 terms for datasets on data.who.int, but does not say they cover this file.',
    },
    accessed: '2026-11-17',
    processing:
      'Two cells read from the "Global 2023" sheet, both sexes, all ages: ischaemic heart disease and all causes. The share is our division of one by the other.',
    snapshot: {
      path: 'datasets/who-ghe-2023-deaths-global/snapshot/deaths_global_2026-09-30.xlsx',
      sha256: '6e2d131358512faaaffed3e8e2e6c0a313e372a82f4bd6f2dbd5369cf100f91f',
    },
    downloads: { csv: null, metadata: null, readme: null },
  },
]

export const chartPackagesFor = (problemSlug: string): ChartPackage[] =>
  chartPackages.filter((p) => p.problemSlugs.includes(problemSlug))
