/**
 * The figure at the top of the homepage. One finding, made by hand, every
 * number opened on its source page on the date given. Replace the whole
 * object to feature a different finding; do not edit numbers in place
 * without reopening the source.
 */
export type FigureSource = { label: string; url: string }

export type FeaturedFigure = {
  number: string
  topic: string
  problemSlug: string
  updated: string
  /** States what the chart shows, not its topic. */
  finding: string
  chartCaption: string
  bars: { label: string; value: number; display: string }[]
  facts: { label: string; value: string }[]
  sources: FigureSource[]
}

const WHO: FigureSource = {
  label: 'WHO Commission on Social Connection, 2025',
  url: 'https://www.who.int/news/item/30-06-2025-social-connection-linked-to-improved-heath-and-reduced-risk-of-early-death',
}
const HALL: FigureSource = {
  label: 'Hall, University of Kansas, 2018',
  url: 'https://news.ku.edu/news/article/2018/03/06/study-reveals-number-hours-it-takes-make-friend',
}

export const featuredFigure: FeaturedFigure = {
  number: '01',
  topic: 'Loneliness',
  problemSlug: 'loneliness',
  updated: '2026-11-12',
  finding: 'Loneliness is twice as common in low-income countries',
  chartCaption: 'Share of people who report feeling lonely',
  bars: [
    { label: 'Low-income', value: 24, display: '24%' },
    { label: 'High-income', value: 11, display: '11%' },
  ],
  facts: [
    { label: 'People affected worldwide', value: '1 in 6' },
    { label: 'Deaths linked to it, per year', value: '871,000' },
    { label: 'Hours together to make a close friend', value: '200+' },
  ],
  sources: [WHO, HALL],
}
