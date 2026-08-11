/**
 * Market signals — category-level growth, the Bezos move generalized.
 *
 * The 1994 insight wasn't "e-commerce is a trend" — it was one specific
 * number: the internet was growing 2,300%/year. That's a USAGE curve, not an
 * attention curve (a headline count, a search-interest score). This file is
 * the same move: real World Bank category-adoption series, not mentions.
 *
 * Deliberately not attention data. /trends already covers "what's being
 * talked about" (HN, GitHub, Wikipedia) and explicitly weights that as
 * crowding, not demand — same doctrine as lib/demand.ts. This file is the
 * usage/production side: what is actually being adopted, built, or spent on,
 * at the category level, worldwide.
 *
 * Source: World Bank Open Data, keyless, via lib/sources/worldbank.ts
 * (already built and verified this session). Every indicator code below was
 * hand-verified against the live API on 2026-08-07 before being included —
 * see CATEGORY_VERIFIED_ASOF.
 */

export type SignalCategory = {
  slug: string
  name: string
  /** World Bank indicator code. */
  indicator: string
  /** One line on what this indicator actually measures and its limits. */
  note: string
  unit: string
}

export const CATEGORY_VERIFIED_ASOF = '2026-08-07'

export const SIGNAL_CATEGORIES: SignalCategory[] = [
  {
    slug: 'internet-adoption',
    name: 'Internet adoption',
    indicator: 'IT.NET.USER.ZS',
    note: 'The literal Bezos-era metric, run forward 30 years. Growth has naturally slowed as it approaches saturation — that deceleration is itself a real signal.',
    unit: '% of world population using the internet',
  },
  {
    slug: 'broadband',
    name: 'Fixed broadband',
    indicator: 'IT.NET.BBND.P2',
    note: 'Subscriptions per 100 people — infrastructure capacity, not just access. A leading indicator for anything that needs real bandwidth (video, cloud gaming, remote work tooling).',
    unit: 'subscriptions per 100 people',
  },
  {
    slug: 'mobile',
    name: 'Mobile subscriptions',
    indicator: 'IT.CEL.SETS.P2',
    note: 'Turns out this is NOT the saturated comparison case it was expected to be — mobile compounded faster annually than every other category here, over a longer window than any of them. One of history’s fastest technology diffusions, still showing up in the numbers three decades later.',
    unit: 'subscriptions per 100 people',
  },
  {
    slug: 'renewable-energy',
    name: 'Renewable energy consumption',
    indicator: 'EG.FEC.RNEW.ZS',
    note: 'Share of final energy consumption from renewables — directly relevant to the energy-abundance problem already ranked on this index.',
    unit: '% of total final energy consumption',
  },
  {
    slug: 'high-tech-exports',
    name: 'High-technology exports',
    indicator: 'TX.VAL.TECH.MF.ZS',
    note: 'Share of manufactured exports that are high-tech — a shift metric, not a volume metric. Rising share means the world is manufacturing more complex goods, not necessarily more goods overall.',
    unit: '% of manufactured exports',
  },
  {
    slug: 'rd-spend',
    name: 'R&D expenditure',
    indicator: 'GB.XPD.RSDV.GD.ZS',
    note: 'Share of GDP spent on research and development — the closest thing World Bank tracks to "how much is the world investing in finding the next thing."',
    unit: '% of GDP',
  },
]
