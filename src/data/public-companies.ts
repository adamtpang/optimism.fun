// Snapshot from companiesmarketcap.com front page. Regenerate by re-scraping.
// Top public companies by market capitalization (all industries, global).
// This is the reference atlas. For companies-tagged-to-problems see companies.ts.

import type { PublicCompany } from './types'

const TODAY = '2026-04-24'
const SOURCE = 'companiesmarketcap.com'
const SOURCE_URL = 'https://companiesmarketcap.com'

const mk = (
  rank: number,
  name: string,
  ticker: string,
  marketCapUSD: number,
  country: string,
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
})

export const publicCompanies: PublicCompany[] = [
  mk(1, 'NVIDIA', 'NVDA', 4_852_000_000_000, 'USA'),
  mk(2, 'Alphabet', 'GOOG', 4_085_000_000_000, 'USA'),
  mk(3, 'Apple', 'AAPL', 4_014_000_000_000, 'USA'),
  mk(4, 'Microsoft', 'MSFT', 3_090_000_000_000, 'USA'),
  mk(5, 'Amazon', 'AMZN', 2_743_000_000_000, 'USA'),
  mk(6, 'Broadcom', 'AVGO', 1_988_000_000_000, 'USA'),
  mk(7, 'TSMC', 'TSM', 1_984_000_000_000, 'Taiwan'),
  mk(8, 'Saudi Aramco', '2222.SR', 1_755_000_000_000, 'Saudi Arabia'),
  mk(9, 'Meta Platforms', 'META', 1_673_000_000_000, 'USA'),
  mk(10, 'Tesla', 'TSLA', 1_403_000_000_000, 'USA'),
  mk(11, 'Walmart', 'WMT', 1_052_000_000_000, 'USA'),
  mk(12, 'Berkshire Hathaway', 'BRK-B', 1_014_000_000_000, 'USA'),
  mk(13, 'Samsung', '005930.KS', 978_710_000_000, 'South Korea'),
  mk(14, 'JPMorgan Chase', 'JPM', 835_170_000_000, 'USA'),
  mk(15, 'Eli Lilly', 'LLY', 819_780_000_000, 'USA'),
  mk(16, 'Exxon Mobil', 'XOM', 625_680_000_000, 'USA'),
  mk(17, 'Visa', 'V', 595_530_000_000, 'USA'),
  mk(18, 'SK Hynix', '000660.KS', 585_210_000_000, 'South Korea'),
  mk(19, 'Tencent', 'TCEHY', 562_600_000_000, 'China'),
  mk(20, 'Johnson & Johnson', 'JNJ', 555_220_000_000, 'USA'),
  mk(21, 'ASML', 'ASML', 546_440_000_000, 'Netherlands'),
  mk(22, 'Micron Technology', 'MU', 543_250_000_000, 'USA'),
  mk(23, 'Oracle', 'ORCL', 506_980_000_000, 'USA'),
  mk(24, 'AMD', 'AMD', 497_810_000_000, 'USA'),
  mk(25, 'Costco', 'COST', 450_030_000_000, 'USA'),
  mk(26, 'Mastercard', 'MA', 448_340_000_000, 'USA'),
  mk(27, 'Netflix', 'NFLX', 390_840_000_000, 'USA'),
  mk(28, 'Caterpillar', 'CAT', 388_620_000_000, 'USA'),
  mk(29, 'Bank of America', 'BAC', 374_100_000_000, 'USA'),
  mk(30, 'Chevron', 'CVX', 373_680_000_000, 'USA'),
  mk(31, 'China Construction Bank', '601939.SS', 373_300_000_000, 'China'),
  mk(32, 'Agricultural Bank of China', '601288.SS', 360_980_000_000, 'China'),
  mk(33, 'AbbVie', 'ABBV', 355_430_000_000, 'USA'),
  mk(34, 'Cisco', 'CSCO', 349_920_000_000, 'USA'),
  mk(35, 'Procter & Gamble', 'PG', 340_480_000_000, 'USA'),
  mk(36, 'Home Depot', 'HD', 338_800_000_000, 'USA'),
  mk(37, 'Palantir', 'PLTR', 338_580_000_000, 'USA'),
  mk(38, 'Roche', 'RO.SW', 337_400_000_000, 'Switzerland'),
  mk(39, 'Intel', 'INTC', 335_300_000_000, 'USA'),
  mk(40, 'ICBC', '1398.HK', 330_310_000_000, 'China'),
  mk(41, 'Coca-Cola', 'KO', 328_320_000_000, 'USA'),
  mk(42, 'Alibaba', 'BABA', 324_980_000_000, 'China'),
  mk(43, 'Lam Research', 'LRCX', 323_330_000_000, 'USA'),
  mk(44, 'UnitedHealth', 'UNH', 322_010_000_000, 'USA'),
  mk(45, 'Applied Materials', 'AMAT', 320_540_000_000, 'USA'),
  mk(46, 'HSBC', 'HSBC', 310_580_000_000, 'UK'),
  mk(47, 'GE Vernova', 'GEV', 308_900_000_000, 'USA'),
  mk(48, 'Morgan Stanley', 'MS', 299_540_000_000, 'USA'),
  mk(49, 'AstraZeneca', 'AZN', 298_110_000_000, 'UK'),
  mk(50, 'CATL', '300750.SZ', 297_490_000_000, 'China'),
]
