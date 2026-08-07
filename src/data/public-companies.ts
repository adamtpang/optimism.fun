// Snapshot from companiesmarketcap.com front page. Regenerate by re-scraping.
// Top public companies by market capitalization (all industries, global).
// This is the reference atlas. For companies-tagged-to-problems see companies.ts.
//
// growth3yr: computed 2026-08-07 by comparing this snapshot against
// companiesmarketcap.com's Time Machine tool set to Aug 7, 2023 -- a real,
// reproducible two-point comparison, not an estimate. Only set where the
// company appeared in the Aug 2023 top ~66 by market cap; several of today's
// biggest risers (Palantir, Micron, SK Hynix, CXMT, Applied Materials, Lam
// Research, Intel, HSBC, GE, Caterpillar, China Construction Bank, Morgan
// Stanley) were below that cutoff and are left undefined rather than guessed
// at -- their true 3yr growth is even larger than anything shown here, just
// unquantified this pass.

import type { PublicCompany } from './types'

const TODAY = '2026-08-07'
const SOURCE = 'companiesmarketcap.com'
const SOURCE_URL = 'https://companiesmarketcap.com'
const GROWTH_SOURCE = 'companiesmarketcap.com Time Machine (Aug 7, 2023 vs Aug 7, 2026)'
const GROWTH_SOURCE_URL = 'https://companiesmarketcap.com/time-machine/'

const mk = (
  rank: number,
  name: string,
  ticker: string,
  marketCapUSD: number,
  country: string,
  growth3yrPct?: number,
): PublicCompany => ({
  rank,
  name,
  ticker,
  country,
  marketCap: {
    value: marketCapUSD,
    unit: 'USD',
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    confidence: 'high',
    asOf: TODAY,
  },
  asOf: TODAY,
  growth3yr:
    growth3yrPct === undefined
      ? undefined
      : {
          value: growth3yrPct,
          unit: '% market-cap growth, Aug 2023 -> Aug 2026',
          source: GROWTH_SOURCE,
          sourceUrl: GROWTH_SOURCE_URL,
          confidence: 'high',
          asOf: TODAY,
        },
})

export const publicCompanies: PublicCompany[] = [
  mk(1, 'NVIDIA', 'NVDA', 5_304_000_000_000, 'USA', 373),
  mk(2, 'Apple', 'AAPL', 4_559_000_000_000, 'USA', 62),
  mk(3, 'Alphabet', 'GOOG', 4_361_000_000_000, 'USA', 161),
  mk(4, 'Microsoft', 'MSFT', 3_711_000_000_000, 'USA', 51),
  mk(5, 'Amazon', 'AMZN', 2_936_000_000_000, 'USA', 101),
  mk(6, 'TSMC', 'TSM', 2_168_000_000_000, 'Taiwan', 334),
  mk(7, 'Broadcom', 'AVGO', 2_000_000_000_000, 'USA', 440),
  mk(8, 'Saudi Aramco', '2222.SR', 1_707_000_000_000, 'Saudi Arabia', -19),
  mk(9, 'SpaceX', 'SPCX', 1_513_000_000_000, 'USA'),
  mk(10, 'Meta Platforms', 'META', 1_502_000_000_000, 'USA', 85),
  mk(11, 'Tesla', 'TSLA', 1_261_000_000_000, 'USA', 58),
  mk(12, 'Berkshire Hathaway', 'BRK-B', 1_131_000_000_000, 'USA', 43),
  mk(13, 'Samsung', '005930.KS', 1_075_000_000_000, 'South Korea', 209),
  mk(14, 'Eli Lilly', 'LLY', 1_062_000_000_000, 'USA', 146),
  mk(15, 'Micron Technology', 'MU', 995_520_000_000, 'USA'),
  mk(16, 'JPMorgan Chase', 'JPM', 947_110_000_000, 'USA', 108),
  mk(17, 'Walmart', 'WMT', 891_860_000_000, 'USA', 106),
  mk(18, 'AMD', 'AMD', 797_820_000_000, 'USA', 324),
  mk(19, 'SK Hynix', '000660.KS', 717_480_000_000, 'South Korea'),
  mk(20, 'Visa', 'V', 691_680_000_000, 'USA', 37),
  mk(21, 'ASML', 'ASML', 654_640_000_000, 'Netherlands', 136),
  mk(22, 'Exxon Mobil', 'XOM', 641_800_000_000, 'USA', 48),
  mk(23, 'Johnson & Johnson', 'JNJ', 619_290_000_000, 'USA', 38),
  mk(24, 'Tencent', 'TCEHY', 546_660_000_000, 'China', 32),
  mk(25, 'CXMT', '688825.SS', 545_670_000_000, 'China'),
  mk(26, 'Mastercard', 'MA', 504_530_000_000, 'USA', 34),
  mk(27, 'Intel', 'INTC', 503_440_000_000, 'USA'),
  mk(28, 'Cisco', 'CSCO', 476_440_000_000, 'USA', 121),
  mk(29, 'Bank of America', 'BAC', 440_540_000_000, 'USA', 74),
  mk(30, 'AbbVie', 'ABBV', 430_940_000_000, 'USA', 62),
  mk(31, 'Costco', 'COST', 420_920_000_000, 'USA', 70),
  mk(32, 'Applied Materials', 'AMAT', 418_790_000_000, 'USA'),
  mk(33, 'Oracle', 'ORCL', 413_260_000_000, 'USA', 31),
  mk(34, 'Caterpillar', 'CAT', 394_700_000_000, 'USA'),
  mk(35, 'China Construction Bank', '601939.SS', 392_220_000_000, 'China'),
  mk(36, 'General Electric', 'GE', 388_610_000_000, 'USA'),
  mk(37, 'Lam Research', 'LRCX', 382_600_000_000, 'USA'),
  mk(38, 'Palantir', 'PLTR', 374_680_000_000, 'USA'),
  mk(39, 'Coca-Cola', 'KO', 373_670_000_000, 'USA', 41),
  mk(40, 'Chevron', 'CVX', 371_260_000_000, 'USA', 24),
  mk(41, 'UnitedHealth', 'UNH', 366_860_000_000, 'USA', -23),
  mk(42, 'Roche', 'RO.SW', 361_260_000_000, 'Switzerland', 47),
  mk(43, 'HSBC', 'HSBC', 351_740_000_000, 'UK'),
  mk(44, 'Home Depot', 'HD', 348_510_000_000, 'USA', 5),
  mk(45, 'Procter & Gamble', 'PG', 342_230_000_000, 'USA', -7),
  mk(46, 'Agricultural Bank of China', '601288.SS', 337_360_000_000, 'China', 101),
  mk(47, 'Morgan Stanley', 'MS', 336_010_000_000, 'USA'),
  mk(48, 'ICBC', '1398.HK', 327_160_000_000, 'China', 55),
  mk(49, 'Merck', 'MRK', 317_050_000_000, 'USA', 18),
  mk(50, 'Netflix', 'NFLX', 306_840_000_000, 'USA', 57),
]
