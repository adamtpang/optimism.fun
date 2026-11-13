/**
 * Figures: one finding each, made by hand. Every number was opened on its
 * source page on the date in `updated`. To change a number, reopen the source
 * first. To add a figure, add an object; do not generate these.
 *
 * The first figure in the list is the one on the homepage.
 */
export type FigureSource = { label: string; url: string }

export type Figure = {
  slug: string
  number: string
  topic: string
  problemSlug: string
  updated: string
  /** States what the chart shows, not its topic. */
  finding: string
  /** The one number to lead with when the figure is shared as an image. */
  hero: { value: string; label: string }
  chartCaption: string
  bars: { label: string; value: number; display: string }[]
  facts: { label: string; value: string }[]
  /** Two or three plain sentences on what the figure means. */
  reading: string[]
  sources: FigureSource[]
}

const WHO: FigureSource = {
  label: 'WHO Commission on Social Connection, 2025',
  url: 'https://www.who.int/news/item/30-06-2025-social-connection-linked-to-improved-heath-and-reduced-risk-of-early-death',
}
const HALL: FigureSource = {
  label: 'Hall, Journal of Social and Personal Relationships, via University of Kansas, 2018',
  url: 'https://news.ku.edu/news/article/2018/03/06/study-reveals-number-hours-it-takes-make-friend',
}

export const figures: Figure[] = [
  {
    slug: 'loneliness-by-income',
    number: '01',
    topic: 'Loneliness',
    problemSlug: 'loneliness',
    updated: '2026-11-12',
    finding: 'Loneliness is twice as common in low-income countries',
    hero: { value: '1 in 6', label: 'people worldwide are lonely' },
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
    reading: [
      'About 24 percent of people in low-income countries report feeling lonely, against about 11 percent in high-income ones. Worldwide it is 1 in 6.',
      'The WHO links loneliness to more than 871,000 deaths a year, about 100 an hour.',
      'It is also highest among the young: 17 to 21 percent of people aged 13 to 29 report feeling lonely.',
    ],
    sources: [WHO, HALL],
  },
  {
    slug: 'hours-to-friendship',
    number: '02',
    topic: 'Loneliness',
    problemSlug: 'loneliness',
    updated: '2026-11-13',
    finding: 'A close friend takes more than 200 hours together',
    hero: { value: '200+', label: 'hours together to make a close friend' },
    chartCaption: 'Hours spent together before the friendship reached each stage',
    bars: [
      { label: 'Casual friend', value: 50, display: 'about 50' },
      { label: 'Friend', value: 90, display: 'about 90' },
      { label: 'Close friend', value: 200, display: '200+' },
    ],
    facts: [
      { label: 'Casual friend, measured range', value: '40 to 60' },
      { label: 'Friend, measured range', value: '80 to 100' },
      { label: 'Hours spent working together', value: 'count for less' },
    ],
    reading: [
      'Hall surveyed 355 adults who had moved in the last six months, then followed 112 first-year students for seven weeks. Each named someone they had met, the hours spent together, and how close the friendship had become.',
      'The hours had to be leisure time: hanging out, joking, playing games. Time spent working side by side counted for less.',
      'An introduction is one meeting. By this measure a close friendship is more than 200 hours after it.',
    ],
    sources: [HALL],
  },
]

export const getFigure = (slug: string): Figure | undefined => figures.find((f) => f.slug === slug)
