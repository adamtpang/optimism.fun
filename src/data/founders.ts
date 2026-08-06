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
]
