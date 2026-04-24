// Top 10 from Forbes 40th annual billionaires list (March 2026), via Wikipedia.
// Source: en.wikipedia.org/wiki/The_World%27s_Billionaires
// Net worth in USD.

import type { Founder } from './types'

const TODAY = '2026-04-24'
const SOURCE = 'Forbes Real-Time Billionaires (2026 list)'
const SOURCE_URL =
  'https://en.wikipedia.org/wiki/The_World%27s_Billionaires'

const mk = (
  rank: number,
  name: string,
  netWorthUSD: number,
  source: string,
  country: string,
  age?: number,
): Founder => ({
  rank,
  name,
  source,
  country,
  age,
  netWorth: {
    value: netWorthUSD,
    unit: 'USD',
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    confidence: 'med',
    asOf: TODAY,
  },
  asOf: TODAY,
})

export const founders: Founder[] = [
  mk(1, 'Elon Musk', 839_000_000_000, 'Tesla, SpaceX, xAI', 'USA / South Africa', 54),
  mk(2, 'Larry Page', 269_000_000_000, 'Google', 'USA', 52),
  mk(3, 'Jeff Bezos', 259_000_000_000, 'Amazon', 'USA', 62),
  mk(4, 'Mark Zuckerberg', 252_000_000_000, 'Meta', 'USA', 41),
  mk(5, 'Sergey Brin', 237_000_000_000, 'Google', 'USA', 52),
  mk(6, 'Larry Ellison', 198_000_000_000, 'Oracle', 'USA', 81),
  mk(7, 'Bernard Arnault & family', 174_000_000_000, 'LVMH', 'France', 77),
  mk(8, 'Jensen Huang', 154_000_000_000, 'NVIDIA', 'USA / Taiwan', 63),
  mk(9, 'Warren Buffett', 149_000_000_000, 'Berkshire Hathaway', 'USA', 95),
  mk(10, 'Amancio Ortega', 148_000_000_000, 'Inditex (Zara)', 'Spain', 89),
]
