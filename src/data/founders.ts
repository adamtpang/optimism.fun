// Top 19 from the 2026 World's Billionaires rankings. Ranks 1-10 via Wikipedia
// (en.wikipedia.org/wiki/The_World%27s_Billionaires); ranks 11-19 net worth
// figures via a real-time aggregator (beinsure.com/world-richest-people),
// since Wikipedia's table only carries the top 10 — cross-check before
// trusting exact rank order past 10, real-time lists disagree by a few
// billion and a rank or two depending on the day.
// Net worth in USD.
//
// frontierBets: disclosed capital commitments researched 2026-08-06 for the
// /frontier page — "money at the top of the wealth curve is a leading
// indicator of demand." Only figures with a real citation (a funding round,
// a pledge with a number, a foundation's public grant) — never an interview
// quote about what someone says they're "interested in".

import type { Founder, FrontierBet } from './types'

const TODAY = '2026-04-24'
const SOURCE = 'Forbes Real-Time Billionaires (2026 list)'
const SOURCE_URL =
  'https://en.wikipedia.org/wiki/The_World%27s_Billionaires'
const RESEARCHED = '2026-08-06'

const mk = (
  rank: number,
  name: string,
  netWorthUSD: number,
  source: string,
  country: string,
  age: number | undefined,
  frontierPattern: Founder['frontierPattern'],
  frontierBets: FrontierBet[],
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
  frontierPattern,
  frontierBets,
})

export const founders: Founder[] = [
  mk(1, 'Elon Musk', 839_000_000_000, 'Tesla, SpaceX, xAI', 'USA / South Africa', 54, 'frontier-bets', [
    {
      vehicle: 'Neuralink',
      description: 'Brain-computer interfaces to restore, then augment, neural function.',
      amount: { value: 1_300_000_000, unit: 'USD raised to date (Musk a major backer)', source: 'Sacra / TechCrunch funding coverage', confidence: 'med', asOf: RESEARCHED },
      gapLabel: 'Brain-computer interfaces',
      source: 'Sacra — Neuralink valuation, funding & news',
      sourceUrl: 'https://sacra.com/c/neuralink/',
    },
    {
      vehicle: 'SpaceX / Starship',
      description: 'Reusable heavy-lift rockets aimed at Mars colonization, not just satellite launch.',
      gapLabel: 'Space colonization',
      source: 'SpaceX funding and valuation coverage',
      sourceUrl: 'https://news.crunchbase.com/news/spacex-valuation-rockets-higher-with-new-1-9b-funding-boost',
    },
  ]),
  mk(2, 'Larry Page', 269_000_000_000, 'Google', 'USA', 52, 'frontier-bets', [
    {
      vehicle: 'Calico',
      description: 'Google-backed anti-aging research spinout, co-founded with Brin in 2013.',
      amount: { value: 1_500_000_000, unit: 'USD, Google-backed (Page and Brin’s personal shares undisclosed)', source: 'MIT Technology Review', confidence: 'low', asOf: RESEARCHED },
      problemSlug: 'longevity',
      source: 'MIT Technology Review — Google’s Long, Strange Life-Span Trip',
      sourceUrl: 'https://www.technologyreview.com/2016/12/15/69305/googles-long-strange-life-span-trip/',
    },
  ]),
  mk(3, 'Jeff Bezos', 259_000_000_000, 'Amazon', 'USA', 62, 'frontier-bets', [
    {
      vehicle: 'Blue Origin',
      description: 'Reusable orbital and lunar launch systems.',
      amount: { value: 28_000_000_000, unit: 'USD personal contributions to date (doubling to $2B/yr in 2026)', source: 'The Motley Fool', confidence: 'med', asOf: RESEARCHED },
      gapLabel: 'Space colonization',
      source: 'The Motley Fool — Blue Origin raised $10B at a $130B valuation',
      sourceUrl: 'https://www.fool.com/investing/2026/07/26/bezos-blue-origin-raise-10b-at-130b-valuation/',
    },
    {
      vehicle: 'Altos Labs',
      description: 'Investor in a $3B-funded cellular reprogramming startup (his personal share undisclosed).',
      problemSlug: 'longevity',
      source: 'MIT Technology Review — Meet Altos Labs',
      sourceUrl: 'https://www.technologyreview.com/2021/09/04/1034364/altos-labs-silicon-valleys-jeff-bezos-milner-bet-living-forever/',
    },
    {
      vehicle: 'Bezos Earth Fund',
      description: 'Pledged 2020, $2.3B deployed by 2026 — climate and nature giving.',
      amount: { value: 10_000_000_000, unit: 'USD pledged by 2030', source: 'Bloomberg', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'climate-change',
      source: 'Bloomberg — Bezos Earth Fund Is Off Pace to Meet $10B Climate Giving Pledge',
      sourceUrl: 'https://www.bloomberg.com/news/articles/2026-05-28/bezos-earth-fund-is-off-pace-to-meet-10-billion-climate-giving-pledge',
    },
  ]),
  mk(4, 'Mark Zuckerberg', 252_000_000_000, 'Meta', 'USA', 41, 'frontier-bets', [
    {
      vehicle: 'Chan Zuckerberg Initiative',
      description: 'Pledged to "cure, prevent, or manage all disease" by 2100; funds the CZI Biohub across UCSF, Stanford, and UC Berkeley.',
      amount: { value: 3_000_000_000, unit: 'USD pledged (2016), incl. $600M for the Biohub', source: 'TechCrunch / Berkeley News', confidence: 'med', asOf: RESEARCHED },
      source: 'UC Berkeley News — Chan, Zuckerberg pledge $3B to end diseases',
      sourceUrl: 'https://news.berkeley.edu/2016/09/22/chan-zuckerberg-initiative/',
    },
  ]),
  mk(5, 'Sergey Brin', 237_000_000_000, 'Google', 'USA', 52, 'frontier-bets', [
    {
      vehicle: 'Calico',
      description: 'Google-backed anti-aging research spinout, co-founded with Page in 2013.',
      problemSlug: 'longevity',
      source: 'MIT Technology Review — Google’s Long, Strange Life-Span Trip',
      sourceUrl: 'https://www.technologyreview.com/2016/12/15/69305/googles-long-strange-life-span-trip/',
    },
    {
      vehicle: 'Aligning Science Across Parkinson’s / Michael J. Fox Foundation',
      description: 'Personal donations toward Parkinson’s research, disclosed after Brin found he carries the LRRK2 risk mutation.',
      amount: { value: 1_100_000_000, unit: 'USD donated to date', source: 'Forbes', confidence: 'high', asOf: RESEARCHED },
      gapLabel: 'Neurodegenerative disease',
      source: 'Forbes — Google Cofounder Sergey Brin Has Quietly Donated More Than $1 Billion',
      sourceUrl: 'https://www.forbes.com/sites/kerryadolan/2022/12/09/exclusive-google-cofounder-sergey-brin-has-quietly-donated-more-than-1-billion-toward-this-one-specific-disease/',
    },
  ]),
  mk(6, 'Larry Ellison', 198_000_000_000, 'Oracle', 'USA', 81, 'frontier-bets', [
    {
      vehicle: 'Lawrence J. Ellison Institute for Transformative Medicine, USC',
      description: 'Cancer research institute combining biology and technology.',
      amount: { value: 200_000_000, unit: 'USD donated', source: 'CBS News', confidence: 'high', asOf: RESEARCHED },
      gapLabel: 'Cancer',
      source: 'CBS News — Billionaire Larry Ellison gives $200 million to USC for cancer research',
      sourceUrl: 'https://www.cbsnews.com/news/billionaire-larry-ellison-gives-200-million-to-usc-for-cancer-research/',
    },
    {
      vehicle: 'Ellison Medical Foundation',
      description: 'Funded aging and disease-prevention research before closing in 2013.',
      amount: { value: 1_000_000_000, unit: 'USD invested (lifetime, foundation now closed)', source: 'Fortune coverage of Ellison philanthropy', confidence: 'med', asOf: RESEARCHED },
      problemSlug: 'longevity',
      source: 'Outlook Business — Larry Ellison’s Giving Pledge',
      sourceUrl: 'https://www.outlookbusiness.com/ampstories/news/larry-ellisons-giving-pledge-how-oracle-co-founder-plans-to-give-away-373-bn-fortune-in-philanthropy',
    },
  ]),
  mk(7, 'Bernard Arnault & family', 174_000_000_000, 'LVMH', 'France', 77, 'prestige-giving', [
    {
      vehicle: 'École Polytechnique Institute of Mathematics and Fundamental Sciences',
      description: 'Framed explicitly around national "sovereignty" in mathematics and AI, not a specific problem.',
      amount: { value: 54_000_000, unit: 'USD (€50M)', source: 'WWD / Crain Currency', confidence: 'high', asOf: RESEARCHED },
      source: 'WWD — Bernard Arnault Is Donating €50M to École Polytechnique',
      sourceUrl: 'https://wwd.com/business-news/technology/bernard-arnault-ai-polytechnique-eduation-1239050517/',
    },
  ]),
  mk(8, 'Jensen Huang', 154_000_000_000, 'NVIDIA', 'USA / Taiwan', 63, 'frontier-bets', [
    {
      vehicle: 'UCSF AI-biomedical research',
      description: 'Accelerating biomedical research with AI and advanced computing.',
      amount: { value: 100_000_000, unit: 'USD donated', source: 'Inside Philanthropy', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'scientific-productivity',
      source: 'Inside Philanthropy — Jensen Huang’s foundation now bigger than MacArthur',
      sourceUrl: 'https://www.insidephilanthropy.com/home/nvidia-cofounders-foundation-is-now-bigger-than-macarthur',
    },
    {
      vehicle: 'CoreWeave AI compute grants',
      description: 'AI computing power donated to universities and nonprofits for scientific research.',
      amount: { value: 108_000_000, unit: 'USD worth of compute', source: 'Benzinga', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'scientific-productivity',
      source: 'Benzinga — Jensen Huang’s Foundation Donates $108M in CoreWeave AI Computing Power',
      sourceUrl: 'https://www.benzinga.com/markets/tech/26/05/52549951/jensen-huang-foundation-coreweave-ai-computing-universities',
    },
  ]),
  mk(9, 'Warren Buffett', 149_000_000_000, 'Berkshire Hathaway', 'USA', 95, 'conventional-philanthropy', [
    {
      vehicle: 'Gates Foundation',
      description: 'Two decades of annual Berkshire stock gifts to the Gates Foundation’s global health and poverty work (ended 2026).',
      amount: { value: 47_000_000_000, unit: 'USD donated since 2006', source: 'Yahoo Finance / Fortune', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'extreme-poverty',
      source: 'Fortune — After donating $48 billion to the Gates Foundation, Buffett is quietly ending the relationship',
      sourceUrl: 'https://fortune.com/2026/07/14/warren-buffett-ends-48-billion-gates-foundation-donations-redirects-wealth-to-childrens-family-foundations/',
    },
    {
      vehicle: 'Family foundations (Sherwood, Howard G. Buffett, Novo)',
      description: 'Redirecting his remaining stake to family-run foundations by 2034 — Howard G. Buffett’s work is food-security-focused, echoing the malnutrition gap flagged elsewhere on this index, though not yet a ranked problem here.',
      amount: { value: 138_000_000_000, unit: 'USD in Berkshire shares, to be distributed by 2034', source: 'CNBC', confidence: 'high', asOf: RESEARCHED },
      source: 'CNBC — Warren Buffett is accelerating his charitable donations',
      sourceUrl: 'https://www.cnbc.com/2026/07/14/warren-buffett-is-accelerating-his-charitable-donations-with-aim-to-give-away-berkshire-wealth-by-2034.html',
    },
  ]),
  mk(10, 'Amancio Ortega', 148_000_000_000, 'Inditex (Zara)', 'Spain', 89, 'scaling-proven-tech', [
    {
      vehicle: 'Fundación Amancio Ortega — proton therapy accelerators',
      description: 'Buying more of what already works — proven cancer-detection and proton-therapy equipment deployed at national scale across Spain’s public health system, not funding unproven science.',
      amount: { value: 280_000_000, unit: 'EUR for 10 proton accelerators (2021 agreement)', source: 'Fundación Amancio Ortega', confidence: 'high', asOf: RESEARCHED },
      source: 'Amancio Ortega Foundation — Wikipedia',
      sourceUrl: 'https://en.wikipedia.org/wiki/Amancio_Ortega_Foundation',
    },
  ]),
  mk(11, 'Rob Walton', 132_000_000_000, 'Walmart', 'USA', undefined, 'conventional-philanthropy', [
    {
      vehicle: 'Rob Walton School of Conservation Futures, ASU',
      description: 'Environmental conservation education and workforce development — institution-building, not unproven science.',
      amount: { value: 115_000_000, unit: 'USD donated (Oct 2025)', source: 'ASU Newsroom', confidence: 'high', asOf: RESEARCHED },
      source: 'ASU Newsroom — $115 million gift will establish Rob Walton School of Conservation Futures',
      sourceUrl: 'https://newsroom.asu.edu/press-releases/115-million-gift-will-establish-rob-walton-school-conservation-futures',
    },
  ]),
  mk(12, 'Jim Walton', 129_000_000_000, 'Walmart', 'USA', undefined, undefined, []),
  mk(13, 'Steve Ballmer', 125_000_000_000, 'Microsoft', 'USA', 69, 'conventional-philanthropy', [
    {
      vehicle: 'Ballmer Group',
      description: 'Economic mobility for children and families in the US — $767M given in 2024 alone.',
      amount: { value: 3_000_000_000, unit: 'USD distributed over the past five years', source: 'Chronicle of Philanthropy', confidence: 'med', asOf: RESEARCHED },
      source: 'Chronicle of Philanthropy — Power Couple Giving: The 10-Year Journey of Steve and Connie Ballmer',
      sourceUrl: 'https://www.philanthropy.com/news/power-couple-giving-the-10-year-journey-of-steve-and-connie-ballmer/',
    },
    {
      vehicle: 'USAFacts',
      description: 'Founded and solely funded a nonpartisan project to make government data legible to citizens — measurement infrastructure, not a frontier science bet, but the closest thing on this list to this site’s own "measure so we can manage" thesis.',
      amount: { value: 10_000_000, unit: 'USD to build the database', source: 'Influence Watch', confidence: 'med', asOf: RESEARCHED },
      source: 'Influence Watch — USAFacts',
      sourceUrl: 'https://www.influencewatch.org/non-profit/usafacts/',
    },
  ]),
  mk(14, 'Carlos Slim Helú', 122_000_000_000, 'América Móvil (Telecom)', 'Mexico', 86, 'scaling-proven-tech', [
    {
      vehicle: 'Instituto Carlos Slim de la Salud',
      description: 'Funded 653M+ polio vaccines across 33 African countries and a COVID-19 vaccine supply deal for Latin America — proven vaccines deployed at scale, not new science.',
      amount: { value: 500_000_000, unit: 'USD initial endowment (2007)', source: 'PMC / Carlos Slim Foundation', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'infectious-disease',
      source: 'Carlos Slim Foundation — Health',
      sourceUrl: 'https://fundacioncarlosslim.org/english/en-cifras/salud/',
    },
  ]),
  mk(15, 'Alice Walton', 120_000_000_000, 'Walmart', 'USA', 76, 'conventional-philanthropy', [
    {
      vehicle: 'Alice L. Walton School of Medicine',
      description: 'A new "whole health" medical school with free tuition, plus a 30-year, $700M affiliation with Mercy to expand healthcare access in the Heartland — new delivery model, not unproven biology.',
      amount: { value: 250_000_000, unit: 'USD founding gift', source: 'Forbes', confidence: 'high', asOf: RESEARCHED },
      source: 'Forbes — America’s Richest Woman Donates $250 Million To Fund Medical School',
      sourceUrl: 'https://www.forbes.com/sites/mattdurot/2024/10/01/americas-richest-woman-donates-250-million-to-fund-medical-school-in-her-name/',
    },
  ]),
  mk(16, 'Michael Bloomberg', 109_000_000_000, 'Bloomberg LP', 'USA', 84, 'conventional-philanthropy', [
    {
      vehicle: 'Bloomberg Philanthropies — tobacco control',
      description: 'MPOWER tobacco-control policy and advocacy across 110+ countries — a proven public-health intervention scaled by funding and policy pressure, not new science.',
      amount: { value: 1_600_000_000, unit: 'USD donated since 2007', source: 'Vital Strategies', confidence: 'high', asOf: RESEARCHED },
      source: 'Vital Strategies — Michael Bloomberg’s extraordinary contribution to tobacco control',
      sourceUrl: 'https://vitalstrategies.org/press/michael-bloombergs-extraordinary-contribution-of-nearly-a-billion-dollars-t',
    },
  ]),
  mk(17, 'Changpeng Zhao', 107_000_000_000, 'Binance', 'Canada / UAE', 49, 'conventional-philanthropy', [
    {
      vehicle: 'Giggle Academy',
      description: 'Free on-chain education platform, reaching 70,000+ children — access, not frontier research.',
      source: 'Gate News — CZ promotes education with the Giggle Academy initiative',
      sourceUrl: 'https://www.gate.com/news/detail/15626786',
    },
    {
      vehicle: 'Open-source biotech grant',
      description: 'Modest, real exception to the pattern above — funded an open-source biotech research project.',
      amount: { value: 10_000_000, unit: 'USD in BNB donated', source: 'Lifestyles Magazine', confidence: 'med', asOf: RESEARCHED },
      source: 'Lifestyles Magazine — $10M donation to open-source biotech project by Changpeng Zhao',
      sourceUrl: 'https://lifestylesmagazine.com/latest-news/10-million-donation-to-open-source-biotech-project-by-changpeng-zhao-underscores-the-growing-trend-of-using-digital-assets-to-support-meaningful-causes-and-highlights-the-potential-for-blockchain-tec/',
    },
  ]),
  mk(18, 'Bill Gates', 106_000_000_000, 'Microsoft', 'USA', 70, 'frontier-bets', [
    {
      vehicle: 'TerraPower',
      description: 'Next-generation Natrium nuclear reactors — over $1.4B in private financing.',
      amount: { value: 1_400_000_000, unit: 'USD private financing to date', source: 'Canary Media / Carbon Credits', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'energy-abundance',
      source: 'Carbon Credits — Nvidia Invests in Bill Gates’ TerraPower',
      sourceUrl: 'https://carboncredits.com/nvidia-invests-in-bill-gates-terrapower-which-closes-650m-for-natrium-nuclear-reactor/',
    },
    {
      vehicle: 'Breakthrough Energy Ventures',
      description: 'Climate-tech venture fund co-founded with Bezos and others, 110+ companies backed.',
      amount: { value: 3_500_000_000, unit: 'USD committed capital', source: 'Crunchbase News', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'climate-change',
      source: 'Crunchbase News — Bill Gates, Jeff Bezos backed Breakthrough Energy Ventures',
      sourceUrl: 'https://benzinga.com/news/24/08/40359364/bill-gates-jeff-bezos-and-jack-ma-backed-breakthrough-energy-ventures-nears-1b-goal-for-climate-focu',
    },
    {
      vehicle: 'Dementia Discovery Fund + Alzheimer’s startups',
      description: 'Personal (non-foundation) venture bets on Alzheimer’s treatments — the same disease-category gap Sergey Brin’s Parkinson’s giving surfaces, independently confirmed by a second billionaire.',
      amount: { value: 100_000_000, unit: 'USD personal investment (2017-18)', source: 'Scientific American', confidence: 'high', asOf: RESEARCHED },
      gapLabel: 'Neurodegenerative disease',
      source: 'Scientific American — Bill Gates Invests $100 Million of Personal Money to Fight Alzheimer’s',
      sourceUrl: 'https://www.scientificamerican.com/article/bill-gates-invests-100-million-of-personal-money-to-fight-alzheimer-rsquo-s/',
    },
  ]),
  mk(19, 'Thomas Peterffy', 104_000_000_000, 'Interactive Brokers', 'Hungary / USA', 81, 'conventional-philanthropy', [
    {
      vehicle: 'Peterffy Foundation',
      description: 'Climate policy, Indigenous land-back causes, and finance/engineering education — modest relative to net worth ($172M in foundation assets).',
      amount: { value: 7_400_000, unit: 'USD distributed in 2023', source: 'Influence Watch', confidence: 'med', asOf: RESEARCHED },
      source: 'Influence Watch — Peterffy Foundation',
      sourceUrl: 'https://www.influencewatch.org/non-profit/peterffy-foundation/',
    },
  ]),
  mk(20, 'Françoise Bettencourt Meyers', 95_000_000_000, 'L’Oréal', 'France', 71, 'frontier-bets', [
    {
      vehicle: 'Institut de France brain-research foundation',
      description: 'Personal $100M gift (2018) to found a foundation for the study of the human brain — the third billionaire on this page whose giving lands on neurodegenerative disease, after Brin and Gates.',
      amount: { value: 100_000_000, unit: 'USD donated (2018)', source: 'Empire Magazine', confidence: 'med', asOf: RESEARCHED },
      gapLabel: 'Neurodegenerative disease',
      source: 'Empire Magazine — The Life and Legacy of Francoise Bettencourt Meyers',
      sourceUrl: 'https://www.theempiremag.com/the-life-and-legacy-of-francoise-bettencourt-meyers-the-richest-woman-in-the-world/',
    },
    {
      vehicle: 'Fondation Bettencourt Schueller — life sciences',
      description: 'Cumulative funding for biomedical research since 1990, plus science prizes.',
      amount: { value: 257_000_000, unit: 'EUR cumulative since 1990', source: 'Inserm Newsroom', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'scientific-productivity',
      source: 'Inserm — The Bettencourt Schueller Foundation reveals its scientific prize winners',
      sourceUrl: 'https://presse.inserm.fr/en/the-bettencourt-schueller-foundation-reveals-the-varied-and-far-reaching-list-of-the-winners-of-its-scientific-prizes/55875/',
    },
  ]),
  mk(21, 'Gautam Adani', 91_000_000_000, 'Adani Group (infrastructure)', 'India', 63, 'frontier-bets', [
    {
      vehicle: 'Adani Green — green hydrogen and renewables',
      description: 'Pledged $70B by 2030 across the green-energy value chain, including a 1M-ton/year green hydrogen production target — one of the largest single corporate energy-transition commitments anywhere.',
      amount: { value: 70_000_000_000, unit: 'USD pledged by 2030', source: 'Gulf News', confidence: 'med', asOf: RESEARCHED },
      problemSlug: 'energy-abundance',
      source: 'Gulf News — India’s Adani pledges $70 billion for clean energy',
      sourceUrl: 'https://gulfnews.com/business/energy/indias-adani-pledges-70-billion-for-clean-energy-and-green-data-centers-1.83630078',
    },
  ]),
  mk(22, 'Mukesh Ambani', 89_000_000_000, 'Reliance Industries', 'India', 68, 'frontier-bets', [
    {
      vehicle: 'Dhirubhai Ambani Green Energy Giga Complex',
      description: 'Five giga-factories (solar, batteries, electrolysers, fuel cells, power electronics) on 5,000 acres in Jamnagar. $10B from Reliance’s own resources committed first; a further $75-81B multi-year target has been announced but is less certain.',
      amount: { value: 10_000_000_000, unit: 'USD, initial phase from internal resources', source: 'Forbes / Time', confidence: 'med', asOf: RESEARCHED },
      problemSlug: 'energy-abundance',
      source: 'Time — Asia’s Richest Man Plans $10 Billion Push Into Green Energy',
      sourceUrl: 'https://time.com/6075823/mukesh-ambani-green-energy/',
    },
  ]),
  mk(23, 'Giancarlo Devasini', 89_000_000_000, 'Tether, Bitfinex (crypto)', 'Italy', 61, undefined, []),
  mk(24, 'Julia Koch', 81_000_000_000, 'Koch Industries', 'USA', 63, 'frontier-bets', [
    {
      vehicle: 'Koch Institute for Integrative Cancer Research, MIT',
      description: 'A $100M gift made by her late husband David H. Koch in 2007, funding the family wealth she now holds — the second billionaire on this page whose giving lands on cancer, after Ellison.',
      amount: { value: 100_000_000, unit: 'USD donated (2007)', source: 'MIT News', confidence: 'high', asOf: RESEARCHED },
      gapLabel: 'Cancer',
      source: 'MIT News — David H. Koch gives $100 million to MIT for cancer research',
      sourceUrl: 'https://news.mit.edu/2007/koch-institute-1009',
    },
  ]),
  mk(25, 'Charles Koch', 73_000_000_000, 'Koch Industries', 'USA', 90, undefined, []),
  mk(26, 'Masayoshi Son', 72_000_000_000, 'SoftBank, telecom & investments', 'Japan', 68, 'frontier-bets', [
    {
      vehicle: 'Stargate / OpenAI',
      description: 'Chairman of the Stargate AI-infrastructure project (up to $500B in total scope across partners) and led a $41B SoftBank investment into OpenAI. This is compute/energy infrastructure for AI, a distinct thing from the "AI safety" welfare-problem this index deliberately excluded — flagged here as revealed capital, not a recommendation to rank AI as a problem.',
      amount: { value: 41_000_000_000, unit: 'USD, SoftBank-led OpenAI investment', source: 'Multiple 2026 reports', confidence: 'med', asOf: RESEARCHED },
      gapLabel: 'AI compute infrastructure',
      source: 'International Finance — Stargate: Masayoshi Son’s next big bet',
      sourceUrl: 'https://internationalfinance.com/magazine/technology-magazine/stargate-masayoshi-sons-next-big-bet/',
    },
  ]),
  mk(27, 'Zhang Yiming', 69_000_000_000, 'ByteDance (TikTok)', 'China', 42, 'conventional-philanthropy', [
    {
      vehicle: 'Fangmei Education Development Fund',
      description: 'Hometown education fund in Fujian province — teacher training, edtech, vocational education infrastructure. A $28.9M follow-on gift came in 2023.',
      amount: { value: 77_300_000, unit: 'USD donated (2021)', source: 'Bloomberg', confidence: 'high', asOf: RESEARCHED },
      source: 'Bloomberg — ByteDance Founder Donates $77 Million to Education Fund',
      sourceUrl: 'https://www.bloomberg.com/news/articles/2021-06-22/bytedance-founder-donates-77-million-to-education-fund',
    },
  ]),
  mk(28, 'Tadashi Yanai', 69_000_000_000, 'Fast Retailing (Uniqlo)', 'Japan', 77, 'conventional-philanthropy', [
    {
      vehicle: 'UNHCR refugee support',
      description: 'Personal and Fast Retailing giving to UNHCR since 2006 — clothing, funds, and emergency response (Bangladesh, Ukraine). Humanitarian relief, not frontier research.',
      amount: { value: 10_000_000, unit: 'USD personal commitment over three years (2016)', source: 'UNHCR', confidence: 'high', asOf: RESEARCHED },
      source: 'UNHCR — Fast Retailing and UNHCR Announce New Agreement',
      sourceUrl: 'https://www.unhcr.org/us/news/news-releases/fast-retailing-and-unhcr-announce-new-agreement',
    },
  ]),
  mk(29, 'Jeff Yass', 67_000_000_000, 'Susquehanna International Group (trading)', 'USA', 67, 'prestige-giving', [
    {
      vehicle: 'University of Austin + school-choice political spending',
      description: '$100M tuition-free gift to a free-speech-focused university, alongside $209M+ over a decade on school-choice political advocacy (PACs, candidates) — ideologically framed spending, not neutral established-cause giving or frontier research.',
      amount: { value: 100_000_000, unit: 'USD to University of Austin', source: 'Lifestyles Magazine', confidence: 'high', asOf: RESEARCHED },
      source: 'CNBC — Republican megadonor Jeff Yass gives millions to shape schools, courts',
      sourceUrl: 'https://www.cnbc.com/2024/04/09/jeff-yass-millions-to-influence-schools-courts-and-markets.html',
    },
  ]),
  mk(30, 'Dieter Schwarz', 64_000_000_000, 'Schwarz Gruppe (Lidl, Kaufland)', 'Germany', 86, 'frontier-bets', [
    {
      vehicle: 'Innovation Park AI (IPAI), Heilbronn',
      description: 'A €3B AI research and startup campus explicitly aimed at giving Europe an OpenAI-class competitor — his foundation’s direct contribution is smaller, the total scope is state- and Schwarz-Group-backed. Same gap as Masayoshi Son’s Stargate bet, independently, from a different continent.',
      amount: { value: 50_000_000, unit: 'EUR from Dieter Schwarz Stiftung directly (total campus scope ~€3B, mixed funding)', source: 'Science|Business', confidence: 'med', asOf: RESEARCHED },
      gapLabel: 'AI compute infrastructure',
      source: 'Sifted — Germany’s richest man wants to ensure Europe has an OpenAI rival',
      sourceUrl: 'https://sifted.eu/articles/heilbronn-franken-ai',
    },
  ]),
  mk(31, 'Germán Larrea Mota Velasco', 61_000_000_000, 'Grupo México (mining)', 'Mexico', 71, undefined, []),
  mk(32, 'Robin Zeng', 60_000_000_000, 'CATL (batteries)', 'China', 57, 'conventional-philanthropy', [
    {
      vehicle: 'Shanghai Jiao Tong University',
      description: 'His alma mater — $291M in CATL shares (2026), on top of a prior $166M gift in 2021. University giving, not a frontier-science bet distinct from his own company’s core battery business.',
      amount: { value: 291_000_000, unit: 'USD in CATL shares (2026)', source: 'Caproasia', confidence: 'high', asOf: RESEARCHED },
      source: 'Caproasia — Robin Zeng donates $291 million to Shanghai Jiao Tong University',
      sourceUrl: 'https://www.caproasia.com/2026/04/04/china-269-billion-ev-energy-storage-battery-giant-catl-billionaire-co-founder-ceo-robin-zeng-yuqun-with-62-billion-fortune-donates-291-million-5-million-catl-shares-to-shanghai-jiao-tong-univ/',
    },
  ]),
  mk(33, 'Zhong Shanshan', 58_000_000_000, 'Nongfu Spring (beverages)', 'China', 71, 'conventional-philanthropy', [
    {
      vehicle: 'Zhuji High School education fund',
      description: 'RMB100M personal gift to an education fund in his hometown — modest relative to net worth, conventional local giving.',
      amount: { value: 14_000_000, unit: 'USD (RMB100M)', source: 'AAStocks', confidence: 'med', asOf: RESEARCHED },
      source: 'AAStocks — Nongfu Spring’s Zhong Shanshan Donates RMB100M to Education Fund',
      sourceUrl: 'http://www.aastocks.com/en/mobile/news.aspx?newsid=NOW.1485657&newssource=AAFN',
    },
  ]),
  mk(34, 'Ken Griffin', 51_000_000_000, 'Citadel (hedge funds)', 'USA', 57, 'conventional-philanthropy', [
    {
      vehicle: 'Harvard University',
      description: 'Over $500M cumulative to his alma mater, including the $300M naming gift for the Griffin Graduate School of Arts and Sciences — elite-university giving, not a distinct frontier-science bet.',
      amount: { value: 500_000_000, unit: 'USD cumulative', source: 'Bloomberg', confidence: 'high', asOf: RESEARCHED },
      source: 'Bloomberg — Citadel’s Ken Griffin Gives $300 Million to Harvard University',
      sourceUrl: 'https://www.bloomberg.com/news/articles/2023-04-11/citadel-s-ken-griffin-gives-300-million-to-harvard-university',
    },
  ]),
  mk(35, 'Iris Fontbona', 47_000_000_000, 'Antofagasta (mining), beverages', 'Chile', 82, 'conventional-philanthropy', [
    {
      vehicle: 'Chilean Telethon + Fundación Luksic',
      description: 'Annual gifts to Chile’s children’s-disability telethon (~$5.5M) and a family foundation funding a local school — modest relative to a $47B fortune, and purely domestic/local, not frontier research.',
      amount: { value: 5_500_000, unit: 'USD (record 2016 Telethon gift)', source: 'Leaders League / Mining.com', confidence: 'med', asOf: RESEARCHED },
      source: 'The CEO — Iris Fontbona: Chile’s Mining Magnate and Philanthropist',
      sourceUrl: 'https://www.theceo.in/leaders/iris-fontbona',
    },
  ]),
  mk(36, 'Giovanni Ferrero', 47_000_000_000, 'Ferrero (Nutella)', 'Italy', 60, 'conventional-philanthropy', [
    {
      vehicle: 'Ferrero Foundation',
      description: 'Founded 1983, focused on Ferrero employees and retirees (scholarships, healthcare, social programs) rather than external causes. Giovanni Ferrero’s personal giving is deliberately low-profile and undisclosed in amount.',
      source: 'Ferrero Group — Ferrero Foundation',
      sourceUrl: 'https://www.ferrero.com/int/en/about-us/our-people/ferrero-foundation',
    },
  ]),
  mk(37, 'Li Ka-shing', 47_000_000_000, 'Diversified (CK Hutchison)', 'Hong Kong', 97, 'frontier-bets', [
    {
      vehicle: 'Horizons Ventures — Cortical Labs',
      description: 'Led a $10M round into an Australian biotech growing living brain cells into "biocomputers" — literally biological brain-computer interfaces, the same gap Musk’s Neuralink surfaces from a completely different technical direction.',
      amount: { value: 10_000_000, unit: 'USD, Series round led', source: 'Yahoo Finance', confidence: 'med', asOf: RESEARCHED },
      gapLabel: 'Brain-computer interfaces',
      source: 'Yahoo Finance — Billionaire Li Ka-Shing Funds Startup Growing Brain Cell "Biocomputers"',
      sourceUrl: 'https://finance.yahoo.com/news/alive-billionaire-li-ka-shing-191221596.html',
    },
    {
      vehicle: 'Horizons Ventures — deep science portfolio',
      description: 'Broader venture arm with a stated focus on regenerative medicine and cell therapy across 200+ portfolio companies — $350M raised recently for continued deep-tech investment.',
      amount: { value: 350_000_000, unit: 'USD raised for continued deployment', source: 'Family Capital', confidence: 'med', asOf: RESEARCHED },
      problemSlug: 'longevity',
      source: 'Family Capital — Investment Office of the Year: Horizons Ventures',
      sourceUrl: 'https://www.famcap.com/2020/12/investment-office-of-the-year-horizons-ventures/',
    },
  ]),
  mk(38, 'Ma Huateng', 46_000_000_000, 'Tencent (online games)', 'China', 54, 'conventional-philanthropy', [
    {
      vehicle: 'Tencent Sustainable Social Value program',
      description: 'A $7.7B (RMB 50B) corporate pledge spanning healthcare, rural revitalization, education, and renewable energy — announced in 2021 alongside rising Chinese regulatory scrutiny of Big Tech. Too broad to map to one problem, and driven partly by political pressure rather than personal conviction alone.',
      amount: { value: 7_700_000_000, unit: 'USD (RMB 50B) pledged, 2021', source: 'Forbes', confidence: 'high', asOf: RESEARCHED },
      source: 'Forbes — Tencent Pledges Additional $7.7 Billion For Social Philanthropy Projects',
      sourceUrl: 'https://www.forbes.com/sites/ywang/2021/08/19/tencent-warns-of-more-regulations-pledges-additional-77-billion-for-social-philanthropy-projects/',
    },
  ]),
  mk(39, 'Lukas Walton', 44_000_000_000, 'Walmart', 'USA', 39, 'frontier-bets', [
    {
      vehicle: 'Builders Vision',
      description: 'A $15B self-funded impact platform across climate, sustainable food systems, and ocean conservation — one of the largest single individual commitments to impact investing anywhere.',
      amount: { value: 15_000_000_000, unit: 'USD deployed', source: 'New York Business Excellence', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'climate-change',
      source: 'Forbes — Lukas Walton’s Builders Vision Reveals How It’s Deployed $3 Billion (updated to $15B total)',
      sourceUrl: 'https://www.forbes.com/sites/amyfeldman/2023/10/17/exclusive-lukas-waltons-builders-vision-reveals-how-its-deployed-3-billion-to-change-the-world/',
    },
    {
      vehicle: 'Builders Vision — ocean conservation',
      description: 'Reef restoration (Coral Vita micro-fragmentation), sustainable seaweed farming, and Bahamas nature-bond projects — the ocean/marine-ecosystem gap this session’s /coverage audit already flagged from SDG14, now independently validated by real capital.',
      amount: { value: 260_000_000, unit: 'USD committed', source: 'Forbes', confidence: 'high', asOf: RESEARCHED },
      gapLabel: 'Ocean & marine ecosystems',
      source: 'Forbes — Lukas Walton’s Builders Vision',
      sourceUrl: 'https://www.forbes.com/sites/amyfeldman/2023/10/17/exclusive-lukas-waltons-builders-vision-reveals-how-its-deployed-3-billion-to-change-the-world/',
    },
  ]),
  mk(40, 'Mark Mateschitz', 44_000_000_000, 'Red Bull', 'Austria', 32, 'frontier-bets', [
    {
      vehicle: 'Alpine Biodiversity Trust + climate-innovation fund',
      description: '€100M pledged over 5 years for Tyrolean forest rewilding, plus a separate €250M fund backing startups in reusable packaging, green logistics, and athlete-nutrition science.',
      amount: { value: 350_000_000, unit: 'USD combined (€100M + €250M)', source: 'Daily Citizen', confidence: 'med', asOf: RESEARCHED },
      problemSlug: 'climate-change',
      source: 'Daily Citizen — Mark Mateschitz: heir to Red Bull’s empire powering a $45B eco-sports and media revolution',
      sourceUrl: 'https://citizendaily.news/mark-mateschitz/',
    },
  ]),
  mk(41, 'Rafaela Aponte-Diamant', 44_000_000_000, 'Mediterranean Shipping Company', 'Italy', 60, 'frontier-bets', [
    {
      vehicle: 'MSC Foundation',
      description: 'Marine ecosystem restoration, coastal-community healthcare, and disaster relief — including funding a new hospital ship with Mercy Ships. Same ocean/marine gap Lukas Walton’s Builders Vision surfaces, independently, from shipping wealth rather than retail wealth.',
      gapLabel: 'Ocean & marine ecosystems',
      source: 'MSC Foundation — About Us',
      sourceUrl: 'https://www.mscfoundation.org/about',
    },
  ]),
  mk(42, 'Gianluigi Aponte', 44_000_000_000, 'Mediterranean Shipping Company', 'Italy', 85, 'frontier-bets', [
    {
      vehicle: 'MSC Foundation',
      description: 'Chair of the MSC Foundation board — same family foundation as Rafaela Aponte-Diamant, marine conservation and humanitarian relief.',
      gapLabel: 'Ocean & marine ecosystems',
      source: 'MSC Foundation — About Us',
      sourceUrl: 'https://www.mscfoundation.org/about',
    },
  ]),
  mk(43, 'John Mars', 43_000_000_000, 'Mars, Incorporated (candy, pet food)', 'USA', 89, undefined, []),
  mk(44, 'Jacqueline Mars', 43_000_000_000, 'Mars, Incorporated (candy, pet food)', 'USA', 86, undefined, []),
  mk(45, 'Klaus-Michael Kuehne', 42_000_000_000, 'Kuehne+Nagel (logistics)', 'Germany', 88, 'conventional-philanthropy', [
    {
      vehicle: 'Kuehne Logistics University + University Hospital Hamburg-Eppendorf',
      description: 'University and hospital funding — $112M and $22M respectively — plus HELP Logistics, which trains public-health logisticians in Malawi on vaccine cold-chain delivery. That last piece is a real, if small, infectious-disease-delivery bet.',
      amount: { value: 112_000_000, unit: 'USD to Kuehne Logistics University', source: 'VIPFortunes / Kuehne Foundation', confidence: 'med', asOf: RESEARCHED },
      problemSlug: 'infectious-disease',
      source: 'Kuehne+Nagel — Vaccine logistics for a complex world',
      sourceUrl: 'https://www.kuehne-nagel.com/us/market-insights/healthcare/vaccine-logistics',
    },
  ]),
  mk(46, 'William Ding', 41_000_000_000, 'NetEase (online games)', 'China', 54, 'conventional-philanthropy', [
    {
      vehicle: 'Zhejiang NetEase Charity Foundation',
      description: 'Disaster relief and education giving — modest and undisclosed in full amount relative to net worth. His well-known tech-driven pig farm is a business venture, not disclosed philanthropy.',
      source: 'Grokipedia — Ding Lei',
      sourceUrl: 'https://grokipedia.com/page/Ding_Lei',
    },
  ]),
  mk(47, 'Andrea Pignataro', 41_000_000_000, 'ION Group (financial software)', 'Italy', 57, 'conventional-philanthropy', [
    {
      vehicle: 'ION Management Science Lab, University of Utah',
      description: 'Deliberately private philanthropy; this and gifts to Doctors Without Borders and the Children’s Defense Fund are the only disclosed pieces.',
      amount: { value: 12_000_000, unit: 'USD donated', source: 'University of Utah Eccles School of Business', confidence: 'high', asOf: RESEARCHED },
      source: 'Eccles School of Business — University of Utah announces $12 million gift',
      sourceUrl: 'https://eccles.utah.edu/news/university-of-utah-announces-12-million-gift-to-fund-ion-management-science-lab/',
    },
  ]),
  mk(48, 'Stephen Schwarzman', 40_000_000_000, 'Blackstone (investments)', 'USA', 78, 'frontier-bets', [
    {
      vehicle: 'MIT Stephen A. Schwarzman College of Computing',
      description: 'Part of a $1B total MIT commitment — the single largest computing/AI investment by an American academic institution, 50 new faculty hired. A third billionaire on the AI compute infrastructure gap, after Son and Schwarz, via education/research rather than data centers.',
      amount: { value: 350_000_000, unit: 'USD donated (2018)', source: 'Bloomberg', confidence: 'high', asOf: RESEARCHED },
      gapLabel: 'AI compute infrastructure',
      source: 'Bloomberg — Schwarzman Gives $350 Million for MIT College of Computing',
      sourceUrl: 'https://www.bloomberg.com/news/articles/2018-10-15/steve-schwarzman-gives-350-million-for-mit-college-of-computing',
    },
  ]),
  mk(49, 'Abigail Johnson', 40_000_000_000, 'Fidelity Investments', 'USA', 63, 'conventional-philanthropy', [
    {
      vehicle: 'Fidelity Foundation',
      description: 'Multi-generational family foundation (founded 1965 by her father and grandfather, not her alone) — $500M+ cumulative across arts, education, health, and national parks.',
      amount: { value: 500_000_000, unit: 'USD distributed since 1965 (family-run, not solely personal)', source: 'Inside Philanthropy', confidence: 'med', asOf: RESEARCHED },
      source: 'Inside Philanthropy — How Abigail Johnson and her family give',
      sourceUrl: 'https://www.insidephilanthropy.com/home/old-money-quiet-support-how-abigail-johnson-and-her-family-give',
    },
  ]),
  mk(50, 'Thomas Frist Jr.', 41_100_000_000, 'HCA Healthcare (hospitals)', 'USA', 87, 'conventional-philanthropy', [
    {
      vehicle: 'Frist Foundation',
      description: 'Local Nashville community and arts giving (Frist Center for the Visual Arts) — modest relative to net worth, no distinct frontier-science bet found.',
      source: 'Tennessee Encyclopedia — Frist Foundation',
      sourceUrl: 'https://tennesseeencyclopedia.net/entries/frist-foundation/',
    },
  ]),
  mk(51, 'Alain Wertheimer', 39_400_000_000, 'Chanel', 'France', 77, undefined, []),
  mk(52, 'Gerard Wertheimer', 39_400_000_000, 'Chanel', 'France', 75, undefined, []),
  mk(53, 'Savitri Jindal', 39_100_000_000, 'Jindal Group (steel, power, mining)', 'India', 75, 'frontier-bets', [
    {
      vehicle: 'Jindal Foundation',
      description: '$100M/year across education, healthcare, and cancer treatment centers in rural India — a fourth billionaire on the cancer gap, and the first via treatment delivery rather than research.',
      amount: { value: 100_000_000, unit: 'USD per year', source: 'Business Outreach', confidence: 'med', asOf: RESEARCHED },
      gapLabel: 'Cancer',
      source: 'VIPFortunes — Savitri Jindal',
      sourceUrl: 'https://vipfortunes.com/savitri-jindal',
    },
  ]),
  mk(54, 'He Xiangjian', 33_200_000_000, 'Midea Group (appliances)', 'China', 83, 'frontier-bets', [
    {
      vehicle: 'He Xiangjian Science Fund',
      description: 'A $428M science fund launched 2023, explicitly focused on AI and climate research — separate from his broader $1.1B in conventional Chinese charitable giving (elderly care, poverty alleviation).',
      amount: { value: 428_000_000, unit: 'USD', source: 'Yahoo Finance', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'climate-change',
      source: 'Yahoo Finance — He Xiangjian creates US$428 million science fund focused on AI and climate research',
      sourceUrl: 'https://finance.yahoo.com/news/chinese-billionaire-xiangjian-founder-home-093000564.html',
    },
  ]),
  mk(55, 'Marilyn Simons', 32_500_000_000, 'Renaissance Technologies (finance)', 'USA', undefined, 'frontier-bets', [
    {
      vehicle: 'Simons Foundation',
      description: 'Over $4B given since 1994 for flexible, long-horizon basic research in math and the sciences — one of the largest basic-science funders in the US, plus a $500M gift to Stony Brook in 2024.',
      amount: { value: 4_000_000_000, unit: 'USD given since 1994', source: 'Inside Philanthropy', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'scientific-productivity',
      source: 'Simons Foundation — Our History',
      sourceUrl: 'https://www.simonsfoundation.org/about/our-history/',
    },
    {
      vehicle: 'Simons Foundation Autism Research Initiative (SFARI)',
      description: '$725M+ pledged to autism research since 2003, started after her daughter’s diagnosis — a distinct neurodevelopmental-research gap, not on the index.',
      amount: { value: 725_000_000, unit: 'USD pledged to date', source: 'Wikipedia', confidence: 'high', asOf: RESEARCHED },
      gapLabel: 'Autism & neurodevelopmental research',
      source: 'Wikipedia — Simons Foundation Autism Research Initiative',
      sourceUrl: 'https://en.wikipedia.org/wiki/Simons_Foundation_Autism_Research_Initiative',
    },
  ]),
  mk(56, 'Phil Knight', 31_100_000_000, 'Nike', 'USA', 88, 'frontier-bets', [
    {
      vehicle: 'OHSU Knight Cancer Institute',
      description: '$2B pledged with his wife Penny in 2025 — the single largest gift ever to a US university, college, or health institution. A third billionaire on the cancer gap, after Ellison and Julia Koch, at ten times either of their gifts.',
      amount: { value: 2_000_000_000, unit: 'USD pledged (2025)', source: 'CNBC', confidence: 'high', asOf: RESEARCHED },
      gapLabel: 'Cancer',
      source: 'OHSU News — Knight Cancer Institute receives record $2 billion commitment',
      sourceUrl: 'https://news.ohsu.edu/2025/08/14/ohsu-knight-cancer-institute-receives-record-2-billion-commitment-from-phil-and-penny-knight',
    },
  ]),
  mk(57, 'Lakshmi Mittal', 31_000_000_000, 'ArcelorMittal (steel)', 'India', 75, 'conventional-philanthropy', [
    {
      vehicle: 'Mittal Foundation / LNM Foundation',
      description: 'Education, child health, and poverty alleviation — $25M to Harvard, £15M to a London children’s hospital. Broad conventional giving, no distinct frontier bet.',
      source: 'Gulf News — Lakshmi Mittal donates $25m to Harvard University',
      sourceUrl: 'https://gulfnews.com/world/asia/india/lakshmi-mittal-donates-25m-to-harvard-university-1.2107905',
    },
  ]),
  mk(58, 'Shiv Nadar', 30_900_000_000, 'HCL Technologies', 'India', 80, 'conventional-philanthropy', [
    {
      vehicle: 'Shiv Nadar Foundation',
      description: '$1.7B+ cumulative, primarily VidyaGyan — free boarding schools for gifted rural children across Uttar Pradesh. India’s most generous individual donor four of the last five years; education access, not frontier research.',
      amount: { value: 1_700_000_000, unit: 'USD cumulative', source: 'TIME100 Philanthropy', confidence: 'high', asOf: RESEARCHED },
      source: 'Business Today — Hurun India Philanthropy List 2025',
      sourceUrl: 'https://www.businesstoday.in/india/story/hurun-india-philanthropy-list-2025-shiv-nadar-tops-list-with-rs2708-cr-donation-check-full-list-501042-2025-11-06',
    },
  ]),
  mk(59, 'Henry Samueli', 30_800_000_000, 'Broadcom (semiconductors)', 'USA', 71, 'conventional-philanthropy', [
    {
      vehicle: 'UCI and UCLA engineering + integrative medicine',
      description: '$500M+ across the Samueli Schools of Engineering at UCLA and UC Irvine and a college of integrative health sciences — university-building, not a distinct frontier-science bet.',
      amount: { value: 500_000_000, unit: 'USD cumulative', source: 'UCI Samueli School of Engineering', confidence: 'high', asOf: RESEARCHED },
      source: 'UCI Engineering — How Broadcom’s Henry Samueli Is Giving Away Billions',
      sourceUrl: 'https://engineering.uci.edu/how-broadcom-s-henry-samueli-giving-away-billions',
    },
  ]),
  mk(60, 'Eric Schmidt', 35_500_000_000, 'Google, Alphabet', 'USA', 71, 'frontier-bets', [
    {
      vehicle: 'Schmidt Sciences — AI2050',
      description: '$125M over 5 years for a fellowship on beneficial/trustworthy AI. A fifth billionaire on the AI compute infrastructure gap, after Son, Schwarz, Schwarzman, and — from the research-safety angle rather than hardware — this one closest in spirit to the AI-safety welfare-problem this index already excluded by deliberate decision.',
      amount: { value: 125_000_000, unit: 'USD over 5 years', source: 'Inside Philanthropy', confidence: 'high', asOf: RESEARCHED },
      gapLabel: 'AI compute infrastructure',
      source: 'Inside Philanthropy — AI2050: Eric and Wendy Schmidt’s Optimistic AI Research Fellowship',
      sourceUrl: 'https://www.insidephilanthropy.com/home/aiai2050-eric-and-wendy-schmidts-optimistic-ai-research-fellowship',
    },
    {
      vehicle: 'Schmidt Ocean Institute',
      description: 'Partners with Schmidt Sciences on the Ocean Biogeochemistry Virtual Institute — a fourth billionaire on the ocean/marine-ecosystem gap, after Walton and both Apontes.',
      gapLabel: 'Ocean & marine ecosystems',
      source: 'Wikipedia — Schmidt Sciences',
      sourceUrl: 'https://en.wikipedia.org/wiki/Schmidt_Sciences',
    },
  ]),
  mk(61, 'Idan Ofer', 34_600_000_000, 'Shipping, energy, diversified', 'Israel', 65, 'frontier-bets', [
    {
      vehicle: 'Idan & Batia Ofer Family Foundation — cancer research',
      description: 'Sustained support for Prof. Ronit Satchi-Fainaro’s cancer research at Tel Aviv University, alongside a $42M gift to London Business School (education, not frontier). A fifth billionaire on the cancer gap, after Ellison, Julia Koch, Savitri Jindal, and Phil Knight.',
      gapLabel: 'Cancer',
      source: 'Idan & Batia Ofer Family Foundation',
      sourceUrl: 'https://foundationguide.org/service-categories/idan-batia-ofer-foundation/',
    },
  ]),
  mk(62, 'Eyal Ofer', 33_600_000_000, 'Shipping, real estate, diversified', 'Israel', 76, 'conventional-philanthropy', [
    {
      vehicle: 'Eyal & Marilyn Ofer Family Foundation',
      description: 'Arts and museum funding (Tel Aviv Museum of Art, $5M) alongside general education and healthcare giving — conventional, not a distinct frontier bet.',
      amount: { value: 5_000_000, unit: 'USD to Tel Aviv Museum of Art (2019)', source: 'Globes', confidence: 'high', asOf: RESEARCHED },
      source: 'Globes — Eyal Ofer to donate $5m to Tel Aviv Museum of Art',
      sourceUrl: 'https://en.globes.co.il/en/article-eyal-ofer-to-donate-5m-to-tel-aviv-museum-of-art-1001278098',
    },
  ]),
  mk(63, 'Zheng Shuliang', 33_200_000_000, 'China Hongqiao Group (aluminum)', 'China', 68, undefined, []),
  mk(64, 'Robert Pera', 31_700_000_000, 'Ubiquiti Networks', 'USA', 48, 'conventional-philanthropy', [
    {
      vehicle: 'Robert J. Pera Foundation + Grizzlies Foundation',
      description: 'Local Memphis youth development, education, and health programs tied to his NBA team ownership — modest and low-profile relative to net worth.',
      source: 'ProPublica Nonprofit Explorer — Robert J Pera Foundation',
      sourceUrl: 'https://projects.propublica.org/nonprofits/organizations/871254834',
    },
  ]),
  mk(65, 'Michal Strnad', 31_100_000_000, 'Czechoslovak Group (defense manufacturing)', 'Czech Republic', 33, 'conventional-philanthropy', [
    {
      vehicle: 'CSG Foundation',
      description: 'Established 2025 for education, community development, and assistance to those in need — new, undisclosed in amount, and the company itself only just IPO’d.',
      source: 'European Correspondent — Meet the world’s wealthiest defence boss',
      sourceUrl: 'https://europeancorrespondent.com/en/r/meet-the-worlds-wealthiest-defence-boss',
    },
  ]),
  mk(66, 'Elaine Marshall', 30_900_000_000, 'Koch, Inc. (inherited stake)', 'USA', 84, 'conventional-philanthropy', [
    {
      vehicle: 'Marshall Legacy Foundation',
      description: 'Education and healthcare giving through a family foundation with $30.5M in assets — modest relative to a $30.9B fortune, low public profile.',
      amount: { value: 30_500_000, unit: 'USD foundation assets (2024)', source: 'ProPublica', confidence: 'med', asOf: RESEARCHED },
      source: 'ProPublica Nonprofit Explorer — Marshall Legacy Foundation',
      sourceUrl: 'https://projects.propublica.org/nonprofits/organizations/467206339',
    },
  ]),
  mk(67, 'Melinda French Gates', 30_300_000_000, 'Pivotal Ventures', 'USA', 61, 'frontier-bets', [
    {
      vehicle: 'Pivotal Ventures — women’s power and health',
      description: '$1B pledged through 2026 for women’s political and economic power, plus a further $600M specifically for women’s reproductive and midlife health. Directly fills the gender-inequality gap the /coverage audit flagged from the SDGs — the clearest match on this whole page between a billionaire’s giving and a named taxonomy gap.',
      amount: { value: 1_000_000_000, unit: 'USD pledged through 2026', source: 'Pivotal', confidence: 'high', asOf: RESEARCHED },
      gapLabel: 'Gender inequality',
      source: 'Pivotal — Melinda French Gates Announces $1B Commitment to Advance Women Globally',
      sourceUrl: 'https://www.pivotal.com/articles/melinda-french-gates-announces-1billlion-commitment-to-advance-women-globally',
    },
  ]),
  mk(68, 'Stefan Quandt', 30_100_000_000, 'BMW (automotive)', 'Germany', 59, 'conventional-philanthropy', [
    {
      vehicle: 'Stiftung Charité / BMW Foundation Herbert Quandt',
      description: '€30M to the BMW Foundation alongside Susanne Klatten, plus board involvement in Stiftung Charité’s life-sciences funding programs.',
      amount: { value: 30_000_000, unit: 'EUR to BMW Foundation', source: 'BMW Group press', confidence: 'med', asOf: RESEARCHED },
      source: 'BMW Group — foundations consolidation announcement',
      sourceUrl: 'https://www.press.bmwgroup.com/africa-dom-easteurope/article/detail/T0258028EN/',
    },
  ]),
  mk(69, 'Reinhold Würth', 30_100_000_000, 'Würth Group (hardware)', 'Germany', 90, 'prestige-giving', [
    {
      vehicle: 'Museum Würth / Kunsthalle Würth',
      description: 'A 17,000-piece art collection displayed across free-admission museums in six European countries — cultural patronage, no disclosed dollar figure, not a research or welfare bet.',
      source: 'Würth Group — kunstkultur.wuerth.com',
      sourceUrl: 'https://kunstkultur.wuerth.com/artsculture/startpage.php',
    },
  ]),
  mk(70, 'Len Blavatnik', 29_900_000_000, 'Access Industries (diversified)', 'USA / UK', 68, 'frontier-bets', [
    {
      vehicle: 'Blavatnik Awards for Young Scientists + Blavatnik School of Government',
      description: '$30M multi-year commitment funding early-career scientists across the US, UK, and Israel, plus a £75M (~$114M) gift that founded Oxford’s Blavatnik School of Government — roughly $500M in disclosed giving total, concentrated on accelerating scientific output.',
      amount: { value: 500_000_000, unit: 'USD disclosed total', source: 'Forbes', confidence: 'med', asOf: RESEARCHED },
      problemSlug: 'scientific-productivity',
      source: 'Forbes — Billionaire Len Blavatnik Pledges $30M To Fund Young Scientists',
      sourceUrl: 'https://www.forbes.com/sites/afontevecchia/2013/06/03/billionaire-len-blavatnik-pledges-30m-to-fund-young-scientists-and-keep-innovation-in-the-u-s/',
    },
  ]),
  mk(71, 'Susanne Klatten', 29_700_000_000, 'BMW / Altana (automotive, chemicals)', 'Germany', 64, 'conventional-philanthropy', [
    {
      vehicle: 'SKala Initiative + Stiftung Charité',
      description: '€88M across 95 nonprofit projects via SKala, plus board-level funding of Charité’s life-sciences research programs alongside Stefan Quandt.',
      amount: { value: 88_000_000, unit: 'EUR across 95 projects', source: 'PHINEO — SKala Initiative', confidence: 'med', asOf: RESEARCHED },
      problemSlug: 'scientific-productivity',
      source: 'PHINEO — SKala: Gemeinsam Menschen bewegen',
      sourceUrl: 'https://www.phineo.org/en/projects/skala-initiative',
    },
  ]),
  mk(72, 'Jack Ma', 29_100_000_000, 'Alibaba (technology)', 'China', 61, 'conventional-philanthropy', [
    {
      vehicle: 'Jack Ma Foundation',
      description: 'Rural teacher training (100 teachers/yr, $75M+ pledged) and Xixi Wetland conservation ($14.26M) — real but modest relative to net worth, domestic and conventional.',
      amount: { value: 300_000_000, unit: 'USD distributed or pledged, foundation lifetime', source: 'Devex', confidence: 'med', asOf: RESEARCHED },
      source: 'Jack Ma Foundation — Our Work',
      sourceUrl: 'https://www.jackmafoundation.org.cn/our-work/',
    },
  ]),
  mk(73, 'MacKenzie Scott', 28_600_000_000, 'Former Amazon stake', 'USA', 56, 'conventional-philanthropy', [
    {
      vehicle: 'Yield Giving',
      description: 'The largest and most unusual philanthropic commitment on this entire page: $26.2B given away since 2019 across 2,700+ grants, all unrestricted — no strings, no reporting requirements, full trust in the grantee. Causes are broad and established (not a frontier-science bet), but the giving methodology itself is genuinely novel.',
      amount: { value: 26_200_000_000, unit: 'USD donated since 2019', source: 'Benzinga', confidence: 'high', asOf: RESEARCHED },
      source: 'Fortune — MacKenzie Scott gave away more than $7 billion last year',
      sourceUrl: 'https://fortune.com/article/mackenzie-scott-not-on-top-philanthropist-list-depite-7-billion-donations/',
    },
  ]),
  mk(74, 'Aliko Dangote', 28_500_000_000, 'Dangote Group (cement, manufacturing)', 'Nigeria', 69, 'frontier-bets', [
    {
      vehicle: 'Dangote Foundation',
      description: 'Africa’s largest private foundation ($1.25B endowment, +$700M since). A $100M joint program with the Gates Foundation treats childhood malnutrition in Nigeria — the same gap flagged as a draft candidate on this site’s own /admin/candidates queue, independently validated by Africa’s richest person.',
      amount: { value: 100_000_000, unit: 'USD, joint 5-year malnutrition program with Gates Foundation', source: 'Billionaires.Africa', confidence: 'high', asOf: RESEARCHED },
      source: 'Billionaires.Africa — Aliko Dangote gave $47 million to charity in six months of 2026',
      sourceUrl: 'https://www.billionaires.africa/2026/06/12/africas-richest-man-has-publicly-donated-47-million-to-charity-so-far-in-2026/',
    },
  ]),
  mk(75, 'Peter Thiel', 28_400_000_000, 'PayPal, Founders Fund (finance & investments)', 'USA', 58, 'frontier-bets', [
    {
      vehicle: 'Breakout Labs + SENS Research Foundation',
      description: '$7M seeded into ~24 hard-science biotech companies since 2011 via Breakout Labs, plus $3.5M to the Methuselah Foundation and direct support for SENS — anti-aging research, in the same spirit as Bezos’s Altos Labs and Page/Brin’s Calico bets.',
      amount: { value: 7_000_000, unit: 'USD via Breakout Labs', source: 'FierceBiotech', confidence: 'med', asOf: RESEARCHED },
      problemSlug: 'longevity',
      source: 'FierceBiotech — Thiel’s Breakout Labs fuels four new life science companies',
      sourceUrl: 'https://www.fiercebiotech.com/biotech/thiel-s-breakout-labs-fuels-four-new-life-science-companies',
    },
  ]),
  mk(76, 'Daniel Gilbert', 27_900_000_000, 'Rocket Companies (mortgage lending)', 'USA', 64, 'conventional-philanthropy', [
    {
      vehicle: 'Rocket Community Fund + Bedrock Detroit',
      description: '$5.6B in downtown Detroit real estate development (Bedrock) plus a dedicated $500M, 10-year commitment to Detroit neighborhoods (property-tax debt relief, community investment) — place-based urban revitalization, a pattern distinct from every other entry on this page: it blurs real-estate investment and philanthropy rather than sitting cleanly in either.',
      amount: { value: 500_000_000, unit: 'USD, 10-year Detroit neighborhoods commitment', source: 'Rocket Community Fund', confidence: 'high', asOf: RESEARCHED },
      source: 'Rocket Community Fund — Five Years In: Progress on $500 Million Commitment',
      sourceUrl: 'https://www.rocketcommunityfund.org/2026/03/26/five-years-in-rocket-community-fund-and-gilbert-family-foundation-share-progress-on-500-million-commitment-to-building-opportunity-in-detroit-neighborhoods/',
    },
  ]),
  mk(77, 'Lei Jun', 27_900_000_000, 'Xiaomi (technology)', 'China', 56, 'frontier-bets', [
    {
      vehicle: 'Wuhan University donation',
      description: 'The largest individual donation ever given to a Chinese university — basic research across math, physics, chemistry, plus computer-science innovation and talent cultivation, at his alma mater.',
      amount: { value: 183_000_000, unit: 'USD donated (2023)', source: 'Bloomberg', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'scientific-productivity',
      source: 'Bloomberg — Xiaomi Co-Founder Lei Jun Gifts Record $182 Million to Wuhan University',
      sourceUrl: 'https://www.bloomberg.com/news/articles/2023-11-29/xiaomi-billionaire-gifts-record-182-million-to-china-university',
    },
  ]),
  mk(78, 'Andreas von Bechtolsheim', 27_900_000_000, 'Arista Networks (technology)', 'Germany / USA', 70, 'conventional-philanthropy', [
    {
      vehicle: 'Stanford, Carnegie Mellon, UC Davis engineering education',
      description: 'Long-standing, quiet support for electrical-engineering education at his alma maters — no single large disclosed figure, modest relative to a $28B fortune.',
      source: 'Stanford Engineering — Andreas Bechtolsheim, Stanford Engineering Hero',
      sourceUrl: 'https://engineering.stanford.edu/about/history/heroes/2012-heroes/andreas-bechtolsheim',
    },
  ]),
  mk(79, 'Pham Nhat Vuong', 27_700_000_000, 'Vingroup (diversified)', 'Vietnam', 57, 'frontier-bets', [
    {
      vehicle: 'VinUniversity + VinFuture Prize',
      description: '$182M non-profit university (VinUni), plus VinFuture, a global science and technology prize he founded for breakthrough innovations benefiting humanity — a real, if young, entrant in the same category as the Nobel Prizes.',
      amount: { value: 182_000_000, unit: 'USD invested in VinUniversity (2019)', source: 'VnExpress International', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'scientific-productivity',
      source: 'VnExpress — Vietnam’s richest man among Asia’s top philanthropists',
      sourceUrl: 'https://e.vnexpress.net/news/news/vietnam-s-richest-man-among-asia-s-top-philanthropists-forbes-4190315.html',
    },
  ]),
  mk(80, 'Vicky Safra', 27_100_000_000, 'Banking (Safra family)', 'Greece / Brazil', 71, 'frontier-bets', [
    {
      vehicle: 'Edmond J. Safra Foundation — Parkinson’s research',
      description: 'A significant, sustained portfolio of Parkinson’s disease research and patient care at leading universities and institutes worldwide — a fourth billionaire on the neurodegenerative-disease gap, after Brin, Gates, and Bettencourt Meyers.',
      amount: { value: 100_000_000, unit: 'USD+ in disclosed giving', source: 'Vicky Safra Foundation', confidence: 'med', asOf: RESEARCHED },
      gapLabel: 'Neurodegenerative disease',
      source: 'Edmond J. Safra Foundation — News of medical research sponsored',
      sourceUrl: 'https://www.edmondjsafra.org/2023/03/20/news-of-medical-research-sponsored-by-the-edmond-j-safra-foundation/',
    },
  ]),
  mk(81, 'Jay Y. Lee', 27_000_000_000, 'Samsung Electronics', 'South Korea', 57, 'frontier-bets', [
    {
      vehicle: 'Samsung Science & Technology Foundation',
      description: 'KRW 1.5 trillion (~$1.1B) endowed over 10 years for basic science, materials engineering, and information-technology research — 517 research projects funded to date at Korean universities and public institutes.',
      amount: { value: 1_100_000_000, unit: 'USD (KRW 1.5 trillion endowment)', source: 'Samsung Global Newsroom', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'scientific-productivity',
      source: 'Samsung Newsroom — Samsung Science & Technology Foundation Announces Grants',
      sourceUrl: 'https://news.samsung.com/global/samsung-science-technology-foundation-announces-grants-for-basic-science-and-future-technologies',
    },
    {
      vehicle: 'Korea national infectious disease research institute',
      description: '200 billion won (~$150M) to update the research center and equipment at Korea’s national infectious-disease research institute, alongside 300 billion won for pediatric cancer and rare-disease treatment.',
      amount: { value: 150_000_000, unit: 'USD (KRW 200 billion)', source: 'KED Global', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'infectious-disease',
      source: 'KED Global — Samsung heirs to donate nearly $3bn in cash, art',
      sourceUrl: 'https://www.kedglobal.com/inheritance-tax/newsView/ked202104280006',
    },
  ]),
  mk(82, 'Cyrus Poonawalla', 27_000_000_000, 'Serum Institute of India (vaccines)', 'India', 84, 'frontier-bets', [
    {
      vehicle: 'Poonawalla Vaccines Research Building, Oxford',
      description: 'Oxford University’s largest-ever gift for vaccines research, from the founder of the world’s largest vaccine manufacturer by volume (1.3B+ doses). About as direct a match to this index’s infectious-disease problem as any bet on this page.',
      amount: { value: 63_000_000, unit: 'USD (£50M)', source: 'University of Oxford', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'infectious-disease',
      source: 'University of Oxford — £50m funding for Poonawalla Vaccines Research Building',
      sourceUrl: 'https://www.ox.ac.uk/news/2021-12-15-50m-funding-poonawalla-vaccines-research-building-oxford-university',
    },
  ]),
  mk(83, 'Rick Cohen', 26_300_000_000, 'C&S Wholesale Grocers', 'USA', 71, 'conventional-philanthropy', [
    {
      vehicle: 'Panjandrum Foundation + Holocaust education',
      description: 'Environment, human rights, women’s issues, and Holocaust education (Keene State College) — real but modest grants, well under $10M/yr disclosed, relative to a $26B fortune. Deliberately low public profile.',
      source: 'Nonprofit Quarterly — Rick Cohen Is NH’s Richest Person',
      sourceUrl: 'https://nonprofitquarterly.org/rick-cohen-nhs-richest-person-in-a-list-of-wealthiest-by-state/',
    },
  ]),
  mk(84, 'Israel Englander', 25_800_000_000, 'Millennium Management (hedge fund)', 'USA', 77, 'frontier-bets', [
    {
      vehicle: 'Englander Institute for Precision Medicine, Weill Cornell',
      description: 'A translational precision-medicine research hub, part of $100M+ in disclosed giving concentrated on medical research through the Englander Foundation.',
      amount: { value: 100_000_000, unit: 'USD+ disclosed giving', source: 'Inside Philanthropy', confidence: 'med', asOf: RESEARCHED },
      problemSlug: 'scientific-productivity',
      source: 'Inside Philanthropy — Israel Englander',
      sourceUrl: 'https://www.insidephilanthropy.com/wall-street-donors/israel-englander.html',
    },
  ]),
  mk(85, 'Dilip Shanghvi', 25_600_000_000, 'Sun Pharmaceutical Industries', 'India', 70, 'scaling-proven-tech', [
    {
      vehicle: 'Shantilal Shanghvi Foundation + Sun Foundation',
      description: 'Rural healthcare infrastructure and medicine access for underserved communities in India — delivering existing, proven healthcare at scale, not funding new frontier research.',
      source: 'LinkedIn — Dilip Shanghvi: Illuminating the Path of Healthcare Innovation',
      sourceUrl: 'https://www.linkedin.com/pulse/dilip-shanghvi-illuminating-path-healthcare-innovation',
    },
  ]),
  mk(86, 'Gina Rinehart', 25_500_000_000, 'Hancock Prospecting (mining)', 'Australia', 71, 'conventional-philanthropy', [
    {
      vehicle: 'Rinehart Medical Foundation + Australian Olympic sports',
      description: 'Royal Flying Doctor Service ($6M), St Vincent’s Hospital redevelopment ($5M), and ~$10M/yr to Australian rowing, swimming, and beach volleyball ($80M+ cumulative since 2012) — real domestic giving, concentrated on rural health access and sport, not frontier research.',
      amount: { value: 80_000_000, unit: 'USD+ to Australian Olympic sports since 2012', source: 'CEOWORLD magazine', confidence: 'med', asOf: RESEARCHED },
      source: 'Royal Flying Doctor Service — Mrs Gina Rinehart donates $6 million',
      sourceUrl: 'https://www.flyingdoctor.org.au/sant/news/mrs-gina-rinehart-and-rinehart-medical-foundation-donate-6-million-royal-flying-doctor/',
    },
  ]),
  mk(87, 'Yu Yong', 25_400_000_000, 'Cathay Fortune Corp / China Molybdenum (mining)', 'China', 65, 'conventional-philanthropy', [
    {
      vehicle: 'CMOC Group community investment (corporate, not personal)',
      description: 'CMOC (China Molybdenum), the Yu-chaired mining group behind his fortune, discloses only modest community spending — RMB 3.21M on education programs in 2023 across all its global operations. No personal foundation or individually attributed gift with a disclosed dollar figure surfaces for Yu Yong himself.',
      amount: { value: 450_000, unit: 'USD (RMB 3.21M, CMOC 2023 education spend, corporate not personal)', source: 'CMOC Group', confidence: 'low', asOf: RESEARCHED },
      source: 'CMOC Group — Thriving Communities: Education',
      sourceUrl: 'https://en.cmoc.com/html/SustainableDevelopment/ThrivingCommunities/Education/',
    },
  ]),
  mk(88, 'Stuart Hoegner', 24_700_000_000, 'Tether / Bitfinex (Ifinex) — stablecoin issuer, ~13% equity stake', 'Canada', undefined, 'conventional-philanthropy', [
    {
      vehicle: 'No disclosed personal philanthropy found',
      description: 'Long-time general counsel of Tether and Bitfinex (retired as GC in early 2025, remains an Ifinex equityholder). Extremely private: no foundation, pledge, or gift with a disclosed dollar figure surfaces in public records, unlike almost every other billionaire at this rank.',
      source: 'Forbes — Stuart Hoegner',
      sourceUrl: 'https://www.forbes.com/profile/stuart-hoegner/',
    },
  ]),
  mk(89, 'Huang Shilin', 24_400_000_000, 'CATL (EV batteries)', 'China', 59, 'conventional-philanthropy', [
    {
      vehicle: 'No individually disclosed personal philanthropy found',
      description: 'CATL, the battery giant Huang co-founded and helped lead until stepping back from operating roles in 2022, and its chairman Zeng Yuquan disclosed roughly RMB 1.6B ($220M+) in combined giving 2018-2022 across education, poverty alleviation, and disaster relief — but the underlying reporting attributes essentially all of it to Zeng personally and to the company, not to Huang. No individually attributed gift or personal foundation tied to Huang Shilin was found.',
      source: 'Sina Finance — 宁德时代：从造富到共富',
      sourceUrl: 'https://finance.sina.com.cn/tech/roll/2023-02-08/doc-imyeyaiy3187623.shtml',
    },
  ]),
  mk(90, 'Christy Walton', 24_300_000_000, 'Walmart (widow of John Walton)', 'USA', 77, 'frontier-bets', [
    {
      vehicle: 'Alumbra Innovations Foundation',
      description: 'Her own vehicle (est. 2018, independent of the main Walton Family Foundation, where she no longer sits on the board), funding “ocean vitality” and land/water stewardship centered on Baja California Sur, Mexico. Grantmaking grew from $1.4M (2019) to $27M (2023) on a $138M endowment — a fifth billionaire on this page’s ocean/marine gap, after both Waltons (Lukas), the Apontes, and Schmidt.',
      amount: { value: 27_000_000, unit: 'USD/yr grantmaking (2023), $138M endowment', source: 'Inside Philanthropy', confidence: 'med', asOf: RESEARCHED },
      gapLabel: 'Ocean & marine ecosystems',
      source: 'Inside Philanthropy — The Quiet Donors of America’s Richest Family: Three Low-Profile Walton Foundations',
      sourceUrl: 'https://www.insidephilanthropy.com/home/the-quiet-donors-of-americas-richest-family-three-low-profile-walton-foundations',
    },
  ]),
  mk(91, 'Stefan Persson', 24_200_000_000, 'H&M (fashion retail)', 'Sweden', 78, 'conventional-philanthropy', [
    {
      vehicle: 'H&M Foundation',
      description: 'Textile-industry sustainability, circularity, and social-inclusion programs, funded entirely by the Persson family since the foundation went independent in 2013 — steady corporate-adjacent philanthropy, not frontier research.',
      amount: { value: 210_000_000, unit: 'USD (SEK 2.1 billion cumulative since 2013)', source: 'H&M Foundation', confidence: 'high', asOf: RESEARCHED },
      source: 'H&M Foundation — Our Story',
      sourceUrl: 'https://hmfoundation.com/our-story/',
    },
  ]),
  mk(92, 'Gennady Timchenko', 24_200_000_000, 'Novatek / Volga Group (energy)', 'Russia', 73, 'conventional-philanthropy', [
    {
      vehicle: 'Elena and Gennady Timchenko Charitable Foundation',
      description: 'Domestic Russian giving to elderly care, family and children’s support, and culture/sport. TASS cites Forbes Russia ranking it among the country’s largest private charity foundations, but neither outlet discloses a specific annual dollar figure. EU/US-sanctioned since 2014.',
      source: 'TASS — Russian businessman Timchenko says charity projects unaffected by US sanctions',
      sourceUrl: 'https://tass.com/russia/758542',
    },
  ]),
  mk(93, 'David Tepper', 23_700_000_000, 'Appaloosa Management (hedge fund)', 'USA', 68, 'prestige-giving', [
    {
      vehicle: 'Tepper School of Business, Carnegie Mellon University (his alma mater)',
      description: '$55M in 2004 (then the largest gift in CMU history) plus $67M in 2013 to build a new home for the business school that bears his name — classic naming-rights, alma-mater giving, not frontier research.',
      amount: { value: 125_000_000, unit: 'USD cumulative (2004 + 2013 gifts)', source: 'Carnegie Mellon University', confidence: 'high', asOf: RESEARCHED },
      source: 'Carnegie Mellon University — $67 million gift funds new home for Tepper School of Business',
      sourceUrl: 'https://www.cmu.edu/news/stories/archives/2013/november/nov14_teppergift.html',
    },
  ]),
  mk(94, 'Harry Triguboff', 23_400_000_000, 'Meriton Group (real estate)', 'Australia', 93, 'conventional-philanthropy', [
    {
      vehicle: 'Harry Triguboff Foundation',
      description: 'Roughly A$3M/yr in disclosed giving, including support for Jewish immigration to Israel via the Shorashim Center, plus one-off gifts like A$5,000 to each of the 99 Australian medal winners at the Tokyo Olympics — modest and steady relative to a $23B fortune, not frontier research.',
      source: 'Meriton — AOC thanks Harry Triguboff for generous donation to Tokyo 2020 medal winners',
      sourceUrl: 'https://www.meriton.com.au/aoc-thanks-harry-triguboff-for-generous-donation-to-tokyo-2020-medal-winners/',
    },
  ]),
  mk(95, 'Steve Cohen', 23_000_000_000, 'Point72 Asset Management (hedge fund)', 'USA', 69, 'frontier-bets', [
    {
      vehicle: 'Cohen Veterans Network + Cohen Veterans Bioscience',
      description: 'A $275M pledge (2016) built a national network of free mental-health clinics for veterans and their families, paired with Cohen Veterans Bioscience — a nonprofit funding biomarker and diagnostic research for PTSD and traumatic brain injury that the VA and pharma haven’t prioritized.',
      amount: { value: 275_000_000, unit: 'USD pledge (2016)', source: 'Philanthropy News Digest', confidence: 'high', asOf: RESEARCHED },
      gapLabel: 'Veteran mental health & PTSD',
      source: 'Philanthropy News Digest — Steven A. Cohen Pledges $275 Million for Veterans’ Mental Health Care',
      sourceUrl: 'https://philanthropynewsdigest.org/news/steven-a.-cohen-pledges-275-million-for-veterans-mental-health-care',
    },
  ]),
  mk(96, 'Rupert Murdoch', 22_700_000_000, 'News Corp / Fox Corporation (media)', 'USA', 94, 'prestige-giving', [
    {
      vehicle: 'News Corp corporate giving + personal gifts',
      description: 'Widely reported as reluctant to give personally — his largest documented personal gift is roughly $1M (in memory of Milly Dowler), plus smaller five- and six-figure gifts (a Stony Brook journalism center, the Tony Blair Faith Foundation). His company, News Corp, has been more generous: $20M to the Motion Picture & Television Fund. Industry-adjacent prestige giving, not frontier research.',
      amount: { value: 20_000_000, unit: 'USD (News Corp corporate gift to MPTF)', source: 'Chronicle of Philanthropy', confidence: 'med', asOf: RESEARCHED },
      source: 'Chronicle of Philanthropy — Rupert Murdoch’s Firm Gives $20-Million to Hollywood Charity',
      sourceUrl: 'https://www.philanthropy.com/article/rupert-murdochs-firm-gives-20-million-to-hollywood-charity/',
    },
  ]),
  mk(97, 'Henry Nicholas III', 23_800_000_000, 'Broadcom (semiconductors)', 'USA', 66, 'conventional-philanthropy', [
    {
      vehicle: 'Nicholas Academic Centers (Henry T. Nicholas III Foundation)',
      description: 'Broadcom’s co-founder (federal stock-options and drug charges both later resolved without conviction) has quietly put more than $57.7M into free after-school tutoring, SAT prep, and college-admissions support for under-resourced high schoolers in Santa Ana, California — a direct-service bet on educational access rather than research.',
      amount: { value: 57_700_000, unit: 'USD cumulative', source: 'Orange County Business Journal', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'pedagogy',
      source: 'Orange County Business Journal — OC’s Wealthiest 2025: Henry T. Nicholas III',
      sourceUrl: 'https://www.ocbj.com/special-report/ocs-wealthiest-2025/ocs-wealthiest-2025-henry-t-nicholas-iii/',
    },
  ]),
  mk(98, 'Kumar Mangalam Birla', 22_800_000_000, 'Aditya Birla Group (conglomerate: metals, cement, telecom, financial services)', 'India', 59, 'conventional-philanthropy', [
    {
      vehicle: 'Aditya Birla Centre for Community Initiatives and Rural Development',
      description: 'The Group’s CSR arm, chaired by his mother Rajashree Birla, runs 42 schools and roughly 18–24 hospitals across India, Thailand, Indonesia, the Philippines, and Egypt on more than Rs 500 crore in global CSR investment — steady, broad-based corporate giving across established causes, not a bet on any single underserved frontier.',
      amount: { value: 60_000_000, unit: 'USD (Rs 500+ crore global CSR investment)', source: 'Aditya Birla Group', confidence: 'med', asOf: RESEARCHED },
      source: 'Aditya Birla Group — Driving Sustainable Impact',
      sourceUrl: 'https://www.adityabirla.com/en/community/our-strategy/',
    },
  ]),
  mk(99, 'Ernest Garcia II', 22_700_000_000, 'Carvana / DriveTime Automotive (used cars, subprime auto loans)', 'USA', 69, 'conventional-philanthropy', [
    {
      vehicle: 'Garcia Family Foundation',
      description: 'A $61M-asset Phoenix foundation funding Arizona education and health causes, including a University of Arizona childhood-disease research grant (the PANDA program) and the Brian Garcia Welcome Center at Phoenix’s homelessness campus, named for his late son. Modest and local relative to a $22.7B fortune.',
      source: 'Inside Philanthropy — Garcia Family Foundation',
      sourceUrl: 'https://www.insidephilanthropy.com/find-a-grant-places/arizona-grants/garcia-family-foundation',
    },
  ]),
  mk(100, 'Wang Chuanfu', 22_100_000_000, 'BYD (EVs and batteries)', 'China', 60, 'conventional-philanthropy', [
    {
      vehicle: 'BYD 3-billion-yuan Education Charity Fund',
      description: 'Launched December 30, 2024 alongside BYD’s 30th anniversary and its 10-millionth EV, funding scholarships at 100+ Chinese universities plus NEV-technology exhibits donated to 28 science museums — explicitly framed as building China’s next generation of battery and EV engineers.',
      amount: { value: 414_000_000, unit: 'USD (RMB 3 billion)', source: 'Gasgoo', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'scientific-productivity',
      source: 'Gasgoo — BYD launches 3-billion-yuan education charity fund to support scholarships, promote NEV tech',
      sourceUrl: 'https://autonews.gasgoo.com/articles/news/byd-launches-3-billion-yuan-education-charity-fund-to-support-scholarships-promote-nev-tech-70035553',
    },
  ]),
  mk(101, 'Todd Graves', 22_000_000_000, 'Raising Cane’s (fast food)', 'USA', 54, 'conventional-philanthropy', [
    {
      vehicle: 'Raising Cane’s community giving ("Cane’s for a Cause")',
      description: '$25M spread across hometown communities nationwide for the chain’s 25th anniversary in 2021, plus one-off gifts like $1M for 2025 Texas flood relief via the American Red Cross — branded, feel-good local philanthropy rather than a bet on any research frontier.',
      amount: { value: 25_000_000, unit: 'USD (25th-anniversary community donations, 2021)', source: 'KATC', confidence: 'high', asOf: RESEARCHED },
      source: 'KATC — Raising Cane’s celebrates 25 years with $25M donation to communities nationwide',
      sourceUrl: 'https://www.katc.com/news/covering-louisiana/raising-canes-celebrates-25-years-with-25m-donation-to-communities-nationwide',
    },
  ]),
  mk(102, 'John Fredriksen', 21_300_000_000, 'Frontline / Golden Ocean / Seadrill (shipping, tankers, offshore drilling)', 'Cyprus', 81, 'conventional-philanthropy', [
    {
      vehicle: 'Inger and John Fredriksen cancer research gifts, Radium Hospital, Oslo',
      description: 'Named in memory of his wife Inger, who died of cancer in 2006 — the same year the family gave 50 million NOK to Oslo’s Radium Hospital. Norwegian press reports "hundreds of millions" more in NOK to cardiac and oncology research there since the early 2000s: a rare disclosed-dollar commitment from an otherwise famously press-shy shipping magnate.',
      amount: { value: 7_700_000, unit: 'USD (NOK 50 million, 2006 gift)', source: 'Wikipedia, citing e24.no', confidence: 'med', asOf: RESEARCHED },
      gapLabel: 'Cancer',
      source: 'Wikipedia — Kathrine Fredriksen',
      sourceUrl: 'https://en.wikipedia.org/wiki/Kathrine_Fredriksen',
    },
  ]),
  mk(103, 'Dang Yanbao', 20_600_000_000, 'Ningxia Baofeng Energy Group (coal chemicals)', 'China', 53, 'conventional-philanthropy', [
    {
      vehicle: 'Ningxia Yanbao Charity Foundation',
      description: 'Since 2011 has funneled 10% of Baofeng’s annual profit into scholarships and subsidies for poor families across Ningxia, one of China’s poorest provinces — RMB 302M personally donated in 2019 alone, on a path toward a pledged RMB 6 billion (~$940M) total, aimed squarely at breaking multi-generational rural poverty through education access.',
      amount: { value: 44_000_000, unit: 'USD (RMB 302 million, 2019 personal donation)', source: 'Wikipedia — Dang Yanbao', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'extreme-poverty',
      source: 'Wikipedia — Dang Yanbao',
      sourceUrl: 'https://en.wikipedia.org/wiki/Dang_Yanbao',
    },
  ]),
  mk(104, 'Andrey Melnichenko', 20_400_000_000, 'EuroChem / SUEK (fertilizers, coal)', 'Russia', 54, 'conventional-philanthropy', [
    {
      vehicle: 'Andrey Melnichenko Foundation + Sirius educational center settlement',
      description: 'Founded a foundation in 2016 for gifted-student STEM education (the Sirius network, Mendeleev Olympiad); his companies report roughly $500M in cumulative "charitable programs." The most striking recent disclosed figure — 32 billion rubles paid to Putin’s Sirius educational center in 2023 — was reported by The Economist to have coincided with prosecutors dropping a bid to seize his coal company, Sibeco: giving with a legal-settlement flavor, not pure discretionary philanthropy.',
      amount: { value: 375_000_000, unit: 'USD approx (RUB 32 billion, 2023)', source: 'Meduza, citing The Economist', confidence: 'med', asOf: RESEARCHED },
      source: 'Meduza — Billionaire Andrey Melnichenko gave 32 billion rubles to Putin’s ‘Sirius educational center’ as Russian prosecutors tried to seize his company',
      sourceUrl: 'https://meduza.io/en/news/2026/07/10/billionaire-andrei-melnichenko-gave-32-billion-rubles-to-putin-s-sirius-educational-center-as-russian-prosecutors-tried-to-seize-his-company-the-economist-reports',
    },
  ]),
  mk(105, 'Jerry Jones', 19_100_000_000, 'Dallas Cowboys / Comstock Resources (sports team ownership, oil and gas)', 'USA', 83, 'prestige-giving', [
    {
      vehicle: 'Gene and Jerry Jones Family–Dallas Cowboys Charities + Arlington Youth Foundation',
      description: 'A family foundation making modest, growing grants — 79 grants totaling $19.6M since inception, annual giving up from $3.1M in 2020 to $7.3M in 2023 — plus a standing $16.5M commitment (2009–2041) to youth programs in Arlington, the Cowboys’ home city. Classic team-owner civic giving, family name on the building included.',
      amount: { value: 19_600_000, unit: 'USD cumulative (79 grants)', source: 'Inside Philanthropy', confidence: 'high', asOf: RESEARCHED },
      source: 'Inside Philanthropy — Gene & Jerry Jones Family Foundation',
      sourceUrl: 'https://www.insidephilanthropy.com/find-a-grant/grants-j/gene-jerry-jones-family-foundation',
    },
  ]),
  mk(106, 'Andrew Forrest', 18_100_000_000, 'Fortescue Metals Group (iron ore, green energy)', 'Australia', 64, 'frontier-bets', [
    {
      vehicle: 'Minderoo Foundation — Flourishing Oceans initiative',
      description: 'A $100M initiative launched in 2018 to track illegal global fishing fleets and build a marine research station at Exmouth on Australia’s Ningaloo Reef — part of $1.8B+ the Forrests have given to Minderoo since 2001, including a record $5B share donation in 2023, the largest single charitable gift in Australian history.',
      amount: { value: 100_000_000, unit: 'USD initiative (2018)', source: 'Philanthropy News Digest', confidence: 'high', asOf: RESEARCHED },
      gapLabel: 'Ocean & marine ecosystems',
      source: 'Philanthropy News Digest — Minderoo Foundation Launches Marine Research Initiative',
      sourceUrl: 'https://philanthropynewsdigest.org/news/minderoo-foundation-launches-marine-research-initiative',
    },
    {
      vehicle: 'Minderoo Foundation — Eliminate Cancer Initiative',
      description: 'A$75M of a record A$400M pledge (2017) went specifically to reward international collaboration among cancer research institutes — an unusual funding structure aimed at breaking down the silo problem in cancer research rather than funding any single lab.',
      amount: { value: 75_000_000, unit: 'USD (A$75 million, 2017)', source: 'SBS News', confidence: 'high', asOf: RESEARCHED },
      gapLabel: 'Cancer',
      source: 'SBS News — Billionaire Andrew Forrest pledges $400m for various charities',
      sourceUrl: 'http://www.sbs.com.au/news/article/2017/05/22/billionaire-andrew-forrest-pledges-400m-various-charities',
    },
  ]),
  mk(107, 'Sarath Ratanavadi', 17_900_000_000, 'Gulf Energy Development (power generation, LNG, telecom infrastructure)', 'Thailand', 61, 'prestige-giving', [
    {
      vehicle: 'USC Trojan golf program donation',
      description: 'Donated $3M to USC’s men’s golf program in 2015; his son was admitted as a walk-on golfer through a special athletics admissions track days later, despite grades an admissions officer called "mediocre at best." One of dozens of cases detailed in a 2024 Los Angeles Times investigation into wealthy families buying admission through minor sports.',
      amount: { value: 3_000_000, unit: 'USD donated (2015)', source: 'Daily Trojan / LA Times investigation', confidence: 'high', asOf: RESEARCHED },
      source: 'Daily Trojan — Investigation exposes ‘walk-on’ admission backdoor',
      sourceUrl: 'https://dailytrojan.com/2024/10/23/investigation-exposes-walk-on-admission-backdoor/',
    },
  ]),
  mk(108, 'Zhong Huijuan', 17_800_000_000, 'Hansoh Pharmaceutical (oncology, CNS, and diabetes drugs)', 'China', 64, undefined, []),
  mk(109, 'Pierre Chen', 17_800_000_000, 'Yageo Corporation (passive electronic components)', 'Taiwan', 67, 'prestige-giving', [
    {
      vehicle: 'YAGEO Foundation art collection — Sanyu’s "Five Nudes"',
      description: 'Personally paid HK$303M (~US$38.7M) at a 2019 Christie’s Hong Kong evening sale for Sanyu’s Five Nudes, a world auction record for the Chinese-French modernist — bought back into his own YAGEO Foundation collection, which he plans to house in a private museum outside Taipei.',
      amount: { value: 38_700_000, unit: 'USD (HK$303M) paid at auction (2019)', source: 'The Value', confidence: 'high', asOf: RESEARCHED },
      source: 'The Value — HK$303m Record-Setting Sanyu’s Five Nudes Reigns Supreme in Hong Kong Auction 2019',
      sourceUrl: 'https://en.thevalue.com/articles/christies-sanyu-five-nudes-hong-kong-record',
    },
  ]),
  mk(110, 'Lin Tsung-Chi', 17_700_000_000, 'King Slide Works (server rail kits and AI data-center hardware)', 'Taiwan', 85, 'prestige-giving', [
    {
      vehicle: 'Huixian Temple reconstruction + hometown elementary school scholarship',
      description: 'After a deepened religious faith following King Slide’s difficult IPO years, donated NT$20M (~US$650K) toward rebuilding the Huixian Temple’s Tiangong Hall (his daughter and son-in-law gave a further NT$20M+); also funds a small scholarship at Dahu Elementary, his childhood school. Taiwan’s newly-minted richest man remains otherwise intensely private about giving relative to his $17B+ fortune.',
      amount: { value: 650_000, unit: 'USD (NT$20M) donated toward temple reconstruction', source: 'China Times', confidence: 'med', asOf: RESEARCHED },
      source: 'China Times — 台灣新科首富在高雄！川湖董座林聰吉篤信濟公「不賣專利」寫傳奇',
      sourceUrl: 'https://www.chinatimes.com/realtimenews/20260811004091-260410',
    },
  ]),
  mk(111, 'Kwong Siu-hing', 17_650_000_000, 'Sun Hung Kai Properties (real estate)', 'Hong Kong', 96, 'conventional-philanthropy', [
    {
      vehicle: 'SHKP-Kwoks’ Foundation — CUHK scholarship programme',
      description: 'Since 2005, the family foundation has funded a scholarship track bringing top mainland Chinese students from remote provinces to the Chinese University of Hong Kong, plus need-based aid for local students; the foundation has run 80+ charitable projects across nearly 30 universities since inception.',
      amount: { value: 740_000_000, unit: 'RMB cumulative donations to university programs (20 years)', source: 'Sun Hung Kai Properties', confidence: 'med', asOf: RESEARCHED },
      problemSlug: 'pedagogy',
      source: 'Sun Hung Kai Properties — SHKP-Kwoks’ Foundation Supports Outstanding Students from CUHK',
      sourceUrl: 'https://www.shkp.com/en-US/media/press-releases/shkp-kwoks-foundation-supports-outstanding-students-from-cuhk',
    },
  ]),
  mk(112, 'John Collison', 17_500_000_000, 'Stripe (payments infrastructure)', 'Ireland', 35, 'frontier-bets', [
    {
      vehicle: 'Frontier (advance market commitment for carbon removal)',
      description: 'Stripe (Collison is president) co-launched Frontier in 2022 with Alphabet, Meta, Shopify, and McKinsey: a pre-purchase commitment to buy verified carbon removal from early-stage startups to de-risk a nascent market, growing out of Stripe’s original $1M/year carbon-removal purchasing commitment started in 2019.',
      amount: { value: 925_000_000, unit: 'USD initial advance market commitment (2022, since expanded to $1.8B)', source: 'CNBC', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'climate-change',
      source: 'CNBC — Stripe, Alphabet, Meta, Shopify, McKinsey spur $925 million carbon capture market',
      sourceUrl: 'https://www.cnbc.com/2022/04/12/stripe-alphabet-meta-shopify-mckinsey-spur-carbon-capture-market.html',
    },
  ]),
  mk(113, 'Patrick Collison', 17_500_000_000, 'Stripe (payments infrastructure)', 'Ireland', 37, 'frontier-bets', [
    {
      vehicle: 'Fast Grants',
      description: 'Co-founded with economist Tyler Cowen in 2020 after concluding NIH grant cycles moved too slowly for a pandemic; funded 260+ COVID-19 research projects with $10K-$500K awards for variant sequencing, repurposed-drug trials, and rapid testing, turning around in days instead of the usual hundreds.',
      amount: { value: 50_000_000, unit: 'USD raised and distributed (2020-2022)', source: 'Nature', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'scientific-productivity',
      source: 'Nature — COVID ‘Fast Grants’ sped up pandemic science',
      sourceUrl: 'https://www.nature.com/articles/d41586-021-02111-7',
    },
    {
      vehicle: 'Arc Institute',
      description: 'Co-founded in 2021 with Stanford/UC Berkeley scientists Patrick Hsu and Silvana Konermann: an independent nonprofit biomedical research institute giving scientists unrestricted, multi-year funding outside the standard NIH grant-application grind, seeded by Collison alongside Vitalik Buterin and Dustin Moskovitz and Cari Tuna’s Good Ventures.',
      amount: { value: 650_000_000, unit: 'USD initial endowment commitment (2021)', source: 'Stanford Report', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'scientific-productivity',
      source: 'Stanford Report — Stanford collaboration with Arc Institute aims to expand academic, research and funding opportunities',
      sourceUrl: 'https://news.stanford.edu/stories/2021/12/stanford-collaboration-arc-institute-aims-expand-academic-research-funding-opportunities',
    },
  ]),
  mk(114, 'George Kaiser', 16_700_000_000, 'BOK Financial / oil and gas', 'USA', 83, 'conventional-philanthropy', [
    {
      vehicle: 'George Kaiser Family Foundation',
      description: 'Signed the Giving Pledge in 2010; has given nearly $4B to his foundation to date (endowment ~$5B as of 2024), with roughly 80% staying in Tulsa to fund early-childhood poverty programs including Educare early-learning centers and the Tulsa Remote cash-incentive relocation program.',
      amount: { value: 4_000_000_000, unit: 'USD given to foundation to date', source: 'Tulsa World', confidence: 'high', asOf: RESEARCHED },
      problemSlug: 'extreme-poverty',
      source: 'Tulsa World — Happy birthday to Tulsa philanthropist George Kaiser: How he and his foundation invest in Tulsa',
      sourceUrl: 'https://tulsaworld.com/news/local/history/happy-birthday-to-tulsa-philanthropist-george-kaiser-how-he-and-his-foundation-invest-in-tulsa/collection_4bbe5e7f-147f-52a7-9250-491421ef6df4.html',
    },
    {
      vehicle: 'A Gathering Place (public park)',
      description: 'Funded through GKFF; believed to be the largest single gift to a public park in U.S. history, opened 2018 along the Arkansas River in Tulsa.',
      amount: { value: 350_000_000, unit: 'USD gift', source: 'Tulsa World', confidence: 'high', asOf: RESEARCHED },
      source: 'Tulsa World — Happy birthday to Tulsa philanthropist George Kaiser: How he and his foundation invest in Tulsa',
      sourceUrl: 'https://tulsaworld.com/news/local/history/happy-birthday-to-tulsa-philanthropist-george-kaiser-how-he-and-his-foundation-invest-in-tulsa/collection_4bbe5e7f-147f-52a7-9250-491421ef6df4.html',
    },
  ]),
  mk(115, 'Georg Schaeffler', 16_700_000_000, 'Schaeffler Group (automotive and industrial bearings)', 'Germany', 62, 'conventional-philanthropy', [
    {
      vehicle: 'Schaeffler Foundation',
      description: 'Launched in 2021 to mark Schaeffler Group’s 75th anniversary, funded by Schaeffler AG and IHO Holding (the family holding company Schaeffler controls) with initial capital plus ongoing annual commitments, focused on climate and environmental protection, research and science, and education.',
      amount: { value: 3_000_000, unit: 'EUR initial capital (2021)', source: 'Process Engineering', confidence: 'med', asOf: RESEARCHED },
      source: 'Process Engineering — Schaeffler launches global foundation to mark 75th anniversary',
      sourceUrl: 'https://processengineering.co.uk/article/2031653/schaeffler-launches-global-foundation-to-mark-75th-anniversary',
    },
    {
      vehicle: 'Schaeffler Group COVID-19 relief donations',
      description: 'Corporate donations during the pandemic: €1M to the German Red Cross and €800K to first-responder organizations in China (2020).',
      amount: { value: 1_800_000, unit: 'EUR combined (2020)', source: 'Schaeffler Sustainability Report 2021', confidence: 'med', asOf: RESEARCHED },
      source: 'Schaeffler Sustainability Report 2021 — Social responsibility',
      sourceUrl: 'https://www.schaeffler-sustainability-report.com/2021/action-fields/employees-and-society/social-responsibility.html',
    },
  ]),
  mk(116, 'John Menard Jr', 16_600_000_000, 'Menards (home improvement retail)', 'USA', 85, 'conventional-philanthropy', [
    {
      vehicle: 'Luther Midelfort / Mayo Clinic Health System (Eau Claire, WI)',
      description: 'Donated $15M in 2008 to fund the Menard Center for Emergency Care and the Menard Transformational Fund for Education at Luther Midelfort in Eau Claire, Wisconsin.',
      amount: { value: 15_000_000, unit: 'USD donated (2008)', source: 'Newswise', confidence: 'high', asOf: RESEARCHED },
      source: 'Newswise — Menard Gift to Fund Mayo Clinic Learning System, Luther Midelfort Emergency Center',
      sourceUrl: 'https://www.newswise.com/articles/menard-gift-to-fund-mayo-clinic-learning-system-luther-midelfort-emergency-center',
    },
    {
      vehicle: 'North Dakota State University — Challey Institute for Global Innovation and Growth',
      description: 'The Menard family gave $5.5M to endow the Sheila and Robert Challey Institute for Global Innovation and Growth at NDSU, supporting free-market economics research and teaching.',
      amount: { value: 5_500_000, unit: 'USD gift', source: 'Philanthropy News Digest', confidence: 'high', asOf: RESEARCHED },
      source: 'Philanthropy News Digest — North Dakota State receives $5.5 million from Menard family',
      sourceUrl: 'https://philanthropynewsdigest.org/news/north-dakota-state-receives-5.5-million-from-menard-family',
    },
  ]),
]
