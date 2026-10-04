/**
 * The market atlas: where the world's wealth sits, where its spending goes,
 * what is growing fastest, and where price sits furthest above cost.
 *
 * Researched 2026-10-04. Rows use different units (stock of wealth, yearly
 * spending, revenue, investment, premiums), so each says which, and no row is
 * ever summed with another. Confidence is about the source: high = official
 * statistics or company filings, medium = reputable press or consultancy
 * citing data, low = vendor or derivative sources.
 */
import type { Confidence } from '@/data/market-moves'

export type AtlasRow = {
  name: string
  value: string
  /** What the number counts: stock, spending, revenue, investment... */
  unit: string
  change?: string
  confidence: Confidence
  source: { label: string; url: string }
  aiDriven?: boolean
  problemSlug?: string
}

/** Stocks of wealth. Overlapping (debt includes bonds; equities own property). */
export const assets: AtlasRow[] = [
  { name: 'Real estate', value: '$393T', unit: 'value, start 2025', change: '-0.5% in 2024 (China housing)', confidence: 'medium', source: { label: 'Savills via IREI', url: 'https://irei.com/news/savills-worlds-real-estate-worth-almost-393-3t-and-is-the-worlds-largest-store-of-wealth/' }, problemSlug: 'housing-construction' },
  { name: 'Debt, all sectors', value: '$348T', unit: 'outstanding, end 2025', change: '+$29T in 2025, led by governments', confidence: 'medium', source: { label: 'IIF Global Debt Monitor via Daily Star', url: 'https://www.thedailystar.net/business/global-economy/news/global-debt-rose-record-348tn-2025-4115981' } },
  { name: 'Bonds', value: '$161T', unit: 'outstanding, 2025', change: '+10.6% y/y', confidence: 'high', source: { label: 'SIFMA 2026 Fact Book', url: 'https://www.sifma.org/news/blog/2026-capital-markets-fact-book-key-findings' } },
  { name: 'Listed equities', value: '$152T', unit: 'market cap, end 2025', change: '+18.5% in 2025', confidence: 'high', source: { label: 'World Federation of Exchanges', url: 'https://www.world-exchanges.org/news/articles/new-wfe-data-public-markets-post-strong-growth-2025-despite-geopolitical-instability' }, aiDriven: true },
  { name: 'Farmland', value: '$48T', unit: 'value, start 2025', change: '+7.9% in 2024', confidence: 'medium', source: { label: 'Savills via IREI', url: 'https://irei.com/news/savills-worlds-real-estate-worth-almost-393-3t-and-is-the-worlds-largest-store-of-wealth/' } },
  { name: 'Gold', value: '~$31T', unit: 'above-ground value, end 2025', change: 'record highs, then volatile', confidence: 'medium', source: { label: 'World Gold Council', url: 'https://gold.org/goldhub/data/how-much-gold' } },
  { name: 'Private equity', value: '$9.1T', unit: 'AUM, 2025 projected', change: 'fundraising -17% y/y', confidence: 'medium', source: { label: 'Preqin', url: 'https://www.preqin.com/insights/global-reports/2025-private-equity' } },
  { name: 'Crypto', value: '$3.0T', unit: 'market cap, 2026-10-04', change: '-30% y/y', confidence: 'high', source: { label: 'CoinGecko', url: 'https://www.coingecko.com/en/global-charts' } },
  { name: 'Private credit', value: '$2.3T', unit: 'AUM, 2025 projected', change: 'projected $4.5T by 2030', confidence: 'medium', source: { label: 'Preqin via BusinessWire', url: 'https://www.businesswire.com/news/home/20251016075672/en/Preqin-Releases-Private-Markets-in-2030-Report' } },
]

/** The largest companies, a live snapshot. */
export const topCompanies = {
  asOf: '2026-10-04',
  source: { label: 'companiesmarketcap.com', url: 'https://companiesmarketcap.com/' },
  rows: [
    ['Nvidia', '$5.65T'], ['Apple', '$4.87T'], ['Alphabet', '$4.16T'], ['Microsoft', '$3.84T'],
    ['Amazon', '$2.71T'], ['TSMC', '$2.45T'], ['SpaceX', '$2.09T'], ['Meta', '$1.85T'],
  ] as [string, string][],
}

/** The largest markets by yearly flow. */
export const biggestMarkets: AtlasRow[] = [
  { name: 'Construction', value: '$14.7T', unit: 'spending, 2024', change: 'real output about -2% in 2025', confidence: 'medium', source: { label: 'Allianz Trade', url: 'https://www.allianz-trade.com/en_global/economic-research/sector-reports/construction.html' }, problemSlug: 'housing-construction' },
  { name: 'Healthcare', value: '$10.6T', unit: 'spending, 2023 (10% of GDP)', confidence: 'high', source: { label: 'WHO Global Health Expenditure Database', url: 'https://p4h.world/app/uploads/2025/12/2025-GHED-Launch-Webinar-Presentaton.x73677.pdf' } },
  { name: 'Insurance', value: '$7.8T', unit: 'premiums, 2024', change: '+7.2% nominal', confidence: 'medium', source: { label: 'Swiss Re sigma via Atlas Magazine', url: 'https://atlas-mag.net/en/articles/global-insurance-market-2024-turnover-0' } },
  { name: 'Banking', value: '$6.4T', unit: 'revenue, 2025', change: '+5%', confidence: 'medium', source: { label: 'McKinsey Global Banking Review 2026', url: 'https://www.mckinsey.com/our-insights/global-banking-annual-review' }, problemSlug: 'financial-infrastructure' },
  { name: 'IT', value: '$6.4T', unit: 'spending, 2026 forecast', change: '+14.2%', confidence: 'medium', source: { label: 'Gartner, Jul 2026', url: 'https://www.gartner.com/en/newsroom/press-releases/2026-07-27-gartner-forecasts-worldwide-it-spending-to-grow-14-point-2-percent-in-2026-totaling-6-point-37-trillion' }, aiDriven: true },
  { name: 'Education', value: '$5.4T', unit: 'spending, 2021 (dated)', change: 'flat since 2019', confidence: 'high', source: { label: 'World Bank Education Finance Watch', url: 'https://documents1.worldbank.org/curated/en/099103123163837765/pdf/P1781350fa1ceb0c0097400b753136154de.pdf' }, problemSlug: 'pedagogy' },
  { name: 'Energy', value: '$3.3T', unit: 'investment only, 2025; total spending not found', confidence: 'high', source: { label: 'IEA World Energy Investment 2025', url: 'https://www.iea.org/news/global-energy-investment-set-to-rise-to-3-3-trillion-in-2025-amid-economic-uncertainty-and-energy-security-concerns' }, problemSlug: 'energy-abundance' },
  { name: 'Defense', value: '$2.9T', unit: 'spending, 2025', change: '+2.9% real, 11th straight rise', confidence: 'high', source: { label: 'SIPRI', url: 'https://www.sipri.org/sites/default/files/Military%20Expenditure%202025.pdf' } },
  { name: 'Tourism', value: '$1.6T', unit: 'international receipts, 2024', change: '+3% real', confidence: 'high', source: { label: 'UN Tourism', url: 'https://unwto.org/ar/node/14795' } },
  { name: 'Mobile telecom', value: '$1.2T', unit: 'operator revenue, 2025', confidence: 'medium', source: { label: 'GSMA via Mobile World Live', url: 'https://www.mobileworldlive.com/gsma/mobile-sector-gdp-contribution-tipped-to-top-11t/' } },
]

/** The fastest-growing markets of real size. Sorted by growth. */
export const fastestMarkets: AtlasRow[] = [
  { name: 'Zepbound (obesity)', value: '$13.5B', unit: 'Lilly revenue, 2025', change: '+175%', confidence: 'high', source: { label: 'Lilly Q4 2025 results', url: 'https://investor.lilly.com/news-releases/news-release-details/lilly-reports-fourth-quarter-2025-financial-results-and-provides' }, problemSlug: 'diabetes' },
  { name: 'Mounjaro (diabetes)', value: '$23.0B', unit: 'Lilly revenue, 2025', change: '+99%', confidence: 'high', source: { label: 'Lilly Q4 2025 results', url: 'https://investor.lilly.com/news-releases/news-release-details/lilly-reports-fourth-quarter-2025-financial-results-and-provides' }, problemSlug: 'diabetes' },
  { name: 'Data center systems', value: '$822B', unit: 'spending, 2026 forecast', change: '+62.5%', confidence: 'medium', source: { label: 'Gartner, Jul 2026', url: 'https://www.gartner.com/en/newsroom/press-releases/2026-07-27-gartner-forecasts-worldwide-it-spending-to-grow-14-point-2-percent-in-2026-totaling-6-point-37-trillion' }, aiDriven: true, problemSlug: 'ai-datacenter-power' },
  { name: 'Battery storage', value: '$66B', unit: 'investment, 2025', change: 'additions +40%', confidence: 'high', source: { label: 'IEA', url: 'https://www.ess-news.com/2026/06/02/global-battery-additions-reached-108-gw-in-2025-according-to-iea/' }, problemSlug: 'energy-abundance' },
  { name: 'Cloud infrastructure', value: '$419B', unit: 'revenue, 2025', change: '+30%', confidence: 'medium', source: { label: 'Synergy via TechInsights', url: 'https://www.techinsights.com/ja/node/61571' }, aiDriven: true },
  { name: 'Semiconductors', value: '$975B', unit: 'revenue, 2026 forecast', change: '+26%', confidence: 'high', source: { label: 'WSTS', url: 'https://www.wsts.org/76/103/Global-Semiconductor-Market-Approaches-1T-in-2026' }, aiDriven: true },
  { name: 'Electric cars', value: '20M+ units', unit: 'sales, 2025', change: '+20%', confidence: 'high', source: { label: 'IEA Global EV Outlook 2026', url: 'https://www.iea.org/reports/global-ev-outlook-2026/executive-summary' } },
  { name: 'Space economy', value: '$686B', unit: 'size, 2025', change: '+12%', confidence: 'medium', source: { label: 'Space Foundation via Payload', url: 'https://payloadspace.com/breaking-down-the-686b-space-economy/' } },
  { name: 'Cybersecurity', value: '$245B', unit: 'spending, 2026 forecast', change: '+11.6%', confidence: 'medium', source: { label: 'Gartner via Software Strategies', url: 'https://softwarestrategiesblog.com/2026/03/24/information-security-spending-2026/' } },
  { name: 'Nuclear', value: '~$70B', unit: 'investment, 2025', change: '+50% over 5 years', confidence: 'high', source: { label: 'IEA', url: 'https://www.iea.org/reports/the-path-to-a-new-era-for-nuclear-energy/outlook-for-nuclear-investment' }, problemSlug: 'energy-abundance' },
]

export type IdiotRow = {
  name: string
  price: string
  cost: string
  ratio: number
  /** Why the gap survives. */
  why: string
  closing: 'open' | 'closing' | 'closed'
  confidence: Confidence
  source: { label: string; url: string }
  problemSlug?: string
}

/**
 * The Idiot Index: price divided by the cost of making the thing. The book
 * used it inside SpaceX to find waste in its own parts; here it is a map of
 * where cost could collapse. A high ratio alone is not an opportunity: the
 * question is what keeps the gap open and whether closing it is hard to copy.
 */
export const idiotIndex: IdiotRow[] = [
  { name: 'Imatinib (Gleevec), 1 year', price: '~$108,000', cost: '$216 (generic cost estimate)', ratio: 500, why: 'Patent, then rebates and sticky list prices after generics.', closing: 'closing', confidence: 'high', source: { label: 'Hill and Gotham, BMJ Open 2016', url: 'https://spiral.imperial.ac.uk/bitstream/10044/1/28456/2/TKI%20prices%20BMJopen%20Sep27%20PROOF.pdf' }, problemSlug: 'cancer' },
  { name: 'Sofosbuvir (Sovaldi), hepatitis C course', price: '$84,000', cost: '$178 (cost-based price)', ratio: 472, why: 'Patent monopoly. Generics closed it abroad, not in the US.', closing: 'open', confidence: 'high', source: { label: 'Hill et al. via Healio', url: 'https://www.healio.com/news/infectious-disease/20161212/hcv-treatments-valued-under-100-per-patient' }, problemSlug: 'infectious-disease' },
  { name: 'Imatinib at retail vs Cost Plus', price: '$9,657', cost: '$47.50 (cost + 15% + fees)', ratio: 203, why: 'Pharmacy middlemen. Mark Cuban Cost Plus shows the price without them.', closing: 'closing', confidence: 'high', source: { label: 'MDedge', url: 'https://mdedge.com/content/mark-cubans-discounted-pharmacy-offers-imatinib-fraction-cost' }, problemSlug: 'cancer' },
  { name: 'Hospital acetaminophen tablet', price: '$1.50', cost: '$0.015', ratio: 101, why: 'Hospital list prices nobody sees before the bill.', closing: 'open', confidence: 'medium', source: { label: 'Brill, Time 2013, via WBUR', url: 'https://www.wbur.org/news/2013/03/01/time-brill-health-costs' } },
  { name: 'SMS text (pay per message)', price: '$0.20', cost: '≤$0.003', ratio: 67, why: 'Carrier oligopoly, until WhatsApp and iMessage went around it.', closing: 'closed', confidence: 'medium', source: { label: 'Keshav, Senate testimony 2009', url: 'https://www.judiciary.senate.gov/download/2009/06/16/keshav-testimony-061609?download=1' } },
  { name: 'Rocket nozzle jacket (SpaceX)', price: '$13,000', cost: '$200 of steel', ratio: 65, why: 'Aerospace cost-plus suppliers. SpaceX made it in-house.', closing: 'closed', confidence: 'medium', source: { label: 'Isaacson, Elon Musk (2023)', url: 'https://www.simonandschuster.com/books/Elon-Musk/Walter-Isaacson/9781982181284' } },
  { name: 'Military spare part (TransDigm)', price: '4,451% profit', cost: 'the part’s own cost', ratio: 45.5, why: 'Sole supplier and no duty to share cost data.', closing: 'open', confidence: 'high', source: { label: 'DoD Inspector General 2019-060', url: 'https://www.dodig.mil/reports.html/Article/1769041/review-of-parts-purchased-from-transdigm-group-inc-dodig-2019-060/' } },
  { name: 'Insulin (Humalog vial)', price: '$275 list', cost: '$1.45 to $9.64', ratio: 29, why: 'Biologic approval barriers, patent extensions, rebates.', closing: 'closing', confidence: 'high', source: { label: 'Gotham et al., BMJ Global Health 2018', url: 'https://gh.bmj.com/content/3/5/e000850.info' }, problemSlug: 'diabetes' },
  { name: 'Hearing aids, pair', price: '$4,600 prescription', cost: '$400 over the counter', ratio: 11.5, why: 'Bundled audiologist visits, until the 2022 FDA rule.', closing: 'closed', confidence: 'medium', source: { label: 'NPR', url: 'https://www.npr.org/2022/08/16/1117762239/hearing-aids-could-be-available-over-the-counter-as-soon-as-october' } },
]

/** Prices that already collapsed: then divided by now, for the same unit. */
export const collapsed: { name: string; then: string; now: string; ratio: string; source: { label: string; url: string } }[] = [
  { name: 'Sequencing a human genome', then: '$95M (2001)', now: '~$500', ratio: '190,000×', source: { label: 'NHGRI via Our World in Data', url: 'https://ourworldindata.org/grapher/cost-of-sequencing-a-full-human-genome' } },
  { name: 'Solar module, per watt', then: '$106 (1976)', now: '$0.38 (2023)', ratio: '279×', source: { label: 'Our World in Data', url: 'https://ourworldindata.org/grapher/solar-pv-prices' } },
  { name: 'Launch to orbit, per kg', then: '$54,500 (Shuttle)', now: '$2,720 (Falcon 9)', ratio: '20×', source: { label: 'NASA NTRS', url: 'https://ntrs.nasa.gov/citations/20200001093' } },
]
