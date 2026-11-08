import type { Company } from '@/data/types'

// Health companies for diabetes, hypertension, copd and cancer.
// Market caps fetched from companiesmarketcap.com on 2026-10-29 (prices delayed).
// Existing slug `gsk` is NOT duplicated here: add 'copd' to its problemSlugs in
// companies.ts instead (Nucala FDA COPD approval, May 2025).

const ASOF = '2026-10-29'
const CMC_PHARMA =
  'https://companiesmarketcap.com/pharmaceuticals/largest-pharmaceutical-companies-by-market-cap/'

const src = (title: string, url: string) => ({ title, url })

const cap = (value: number, source: string, sourceUrl: string) => ({
  value,
  unit: 'USD',
  source,
  sourceUrl,
  confidence: 'high' as const,
  asOf: ASOF,
})

export const healthCompanies: Company[] = [
  // ---------- diabetes ----------
  {
    slug: 'eli-lilly',
    name: 'Eli Lilly',
    url: 'https://www.lilly.com',
    problemSlugs: ['diabetes'],
    marketCap: cap(1_224_000_000_000, 'companiesmarketcap.com (LLY), 2026-10-29', 'https://companiesmarketcap.com/eli-lilly/marketcap/'),
    valuation: null,
    stage: 'public',
    country: 'USA',
    description: 'Makes insulins and the GLP-1/GIP drug Mounjaro (tirzepatide) for type 2 diabetes.',
    sources: [
      src('companiesmarketcap.com: Eli Lilly market cap', 'https://companiesmarketcap.com/eli-lilly/marketcap/'),
      src('Mounjaro (Lilly)', 'https://mounjaro.lilly.com'),
    ],
    asOf: ASOF,
  },
  {
    slug: 'novo-nordisk',
    name: 'Novo Nordisk',
    url: 'https://www.novonordisk.com',
    problemSlugs: ['diabetes'],
    marketCap: cap(172_630_000_000, 'companiesmarketcap.com (NVO), 2026-10-29', CMC_PHARMA),
    valuation: null,
    stage: 'public',
    country: 'Denmark',
    description: 'Largest insulin maker and developer of semaglutide (Ozempic) for type 2 diabetes.',
    sources: [
      src('companiesmarketcap.com: largest pharma by market cap', CMC_PHARMA),
      src('Novo Nordisk', 'https://www.novonordisk.com'),
    ],
    asOf: ASOF,
  },
  {
    slug: 'dexcom',
    name: 'Dexcom',
    url: 'https://www.dexcom.com',
    problemSlugs: ['diabetes'],
    marketCap: cap(30_160_000_000, 'companiesmarketcap.com (DXCM), 2026-10-29', 'https://companiesmarketcap.com/dexcom/marketcap/'),
    valuation: null,
    stage: 'public',
    country: 'USA',
    description: 'Makes continuous glucose monitors that let people with diabetes track blood sugar in real time.',
    sources: [
      src('companiesmarketcap.com: Dexcom market cap', 'https://companiesmarketcap.com/dexcom/marketcap/'),
      src('Dexcom', 'https://www.dexcom.com'),
    ],
    asOf: ASOF,
  },
  {
    slug: 'abbott',
    name: 'Abbott',
    url: 'https://www.abbott.com',
    problemSlugs: ['diabetes', 'cancer'],
    marketCap: cap(182_140_000_000, 'companiesmarketcap.com (ABT), 2026-10-29', 'https://companiesmarketcap.com/abbott-laboratories/marketcap/'),
    valuation: null,
    stage: 'public',
    country: 'USA',
    description:
      'Makes FreeStyle Libre glucose sensors and, since buying Exact Sciences in March 2026, Cologuard cancer screening.',
    sources: [
      src('companiesmarketcap.com: Abbott market cap', 'https://companiesmarketcap.com/abbott-laboratories/marketcap/'),
      src('Abbott completes acquisition of Exact Sciences (2026-03-23)', 'https://www.nasdaq.com/press-release/abbott-completes-acquisition-exact-sciences-2026-03-23'),
    ],
    asOf: ASOF,
  },
  {
    slug: 'virta-health',
    name: 'Virta Health',
    url: 'https://www.virtahealth.com',
    problemSlugs: ['diabetes'],
    marketCap: null,
    valuation: {
      value: 2_000_000_000,
      unit: 'USD',
      source: 'Series E, $133M led by Tiger Global, April 2021 (stale; no newer round found)',
      sourceUrl: 'https://www.fiercebiotech.com/medtech/virta-health-hits-2b-valuation-133m-funding-to-expand-reach-diabetes-reversing-platform',
      confidence: 'low',
      asOf: '2021-04-19',
    },
    stage: 'private',
    country: 'USA',
    description: 'Telehealth and nutrition program that aims to reverse type 2 diabetes and cut medication use.',
    sources: [
      src('Fierce Biotech: Virta hits $2B valuation', 'https://www.fiercebiotech.com/medtech/virta-health-hits-2b-valuation-133m-funding-to-expand-reach-diabetes-reversing-platform'),
    ],
    asOf: ASOF,
  },

  // ---------- hypertension ----------
  {
    slug: 'resolve-to-save-lives',
    name: 'Resolve to Save Lives',
    url: 'https://resolvetosavelives.org',
    problemSlugs: ['hypertension'],
    marketCap: null,
    valuation: null,
    stage: 'nonprofit',
    country: 'USA',
    description:
      'Partners with WHO on HEARTS protocol programs; about 34M people started on blood pressure treatment by December 2024.',
    sources: [
      src('Resolve to Save Lives: hypertension', 'https://resolvetosavelives.org/cardiovascular-health/hypertension'),
      src('WHO: Improving hypertension control in 3 million people', 'https://www.who.int/publications/i/item/improving-hypertension-control-in-3-million-people-country-experiences-of-programme-development-and-implementation'),
    ],
    asOf: ASOF,
  },
  {
    slug: 'omron',
    name: 'Omron (Omron Healthcare)',
    url: 'https://omronhealthcare.com',
    problemSlugs: ['hypertension'],
    marketCap: cap(6_550_000_000, 'companiesmarketcap.com (6645.T, parent Omron Corp), 2026-10-29', 'https://companiesmarketcap.com/omron/marketcap/'),
    valuation: null,
    stage: 'public',
    country: 'Japan',
    description:
      'Home blood pressure monitor maker whose stated mission, Going for Zero, targets zero heart attacks and strokes.',
    sources: [
      src('companiesmarketcap.com: Omron market cap', 'https://companiesmarketcap.com/omron/marketcap/'),
      src('Omron Healthcare: Going for Zero', 'https://omronhealthcare.com/going-for-zero'),
    ],
    asOf: ASOF,
  },
  {
    slug: 'cadence-rpm',
    name: 'Cadence',
    url: 'https://www.cadence.care',
    problemSlugs: ['hypertension', 'diabetes', 'copd'],
    marketCap: null,
    valuation: {
      value: 1_000_000_000,
      unit: 'USD',
      source: 'Series B, $100M led by Coatue, December 2021 (later Series C reports unverified)',
      sourceUrl: 'https://www.fiercehealthcare.com/digital-health/remote-care-management-platform-cadence-hits-1b-valuation-100m-series-b',
      confidence: 'med',
      asOf: '2021-12-14',
    },
    stage: 'private',
    country: 'USA',
    description:
      'Remote patient monitoring run with health systems for hypertension, COPD and type 2 diabetes patients at home.',
    sources: [
      src('Fierce Healthcare: Cadence hits $1B valuation', 'https://www.fiercehealthcare.com/digital-health/remote-care-management-platform-cadence-hits-1b-valuation-100m-series-b'),
    ],
    asOf: ASOF,
  },

  // ---------- copd ----------
  {
    slug: 'regeneron',
    name: 'Regeneron',
    url: 'https://www.regeneron.com',
    problemSlugs: ['copd'],
    marketCap: cap(84_290_000_000, 'companiesmarketcap.com (REGN), 2026-10-29', CMC_PHARMA),
    valuation: null,
    stage: 'public',
    country: 'USA',
    description:
      'Co-developed Dupixent with Sanofi, the first biologic FDA-approved for COPD with eosinophilic phenotype (September 2024).',
    sources: [
      src('companiesmarketcap.com: largest pharma by market cap', CMC_PHARMA),
      src('Dupixent approved in the US as first biologic for COPD', 'https://www.pharmaceutical-tech.com/news/dupixent-dupilumab-approved-in-the-us-as-the-first-ever-biologic-medicine'),
    ],
    asOf: ASOF,
  },
  {
    slug: 'sanofi',
    name: 'Sanofi',
    url: 'https://www.sanofi.com',
    problemSlugs: ['copd'],
    marketCap: cap(103_340_000_000, 'companiesmarketcap.com (SNY), 2026-10-29', CMC_PHARMA),
    valuation: null,
    stage: 'public',
    country: 'France',
    description: 'Commercializes Dupixent with Regeneron, the first biologic approved in the US for eosinophilic COPD.',
    sources: [
      src('companiesmarketcap.com: largest pharma by market cap', CMC_PHARMA),
      src('FDA approves first biologic for COPD treatment', 'https://www.pharmamanufacturing.com/development/drug-approvals/news/55143214/fda-approves-first-biologic-for-copd-treatment'),
    ],
    asOf: ASOF,
  },
  {
    slug: 'astrazeneca',
    name: 'AstraZeneca',
    url: 'https://www.astrazeneca.com',
    problemSlugs: ['copd', 'cancer'],
    marketCap: cap(270_470_000_000, 'companiesmarketcap.com (AZN), 2026-10-29', CMC_PHARMA),
    valuation: null,
    stage: 'public',
    country: 'UK',
    description:
      'Makes Breztri, a triple-therapy COPD inhaler approved in 90 countries, and runs a large oncology portfolio.',
    sources: [
      src('companiesmarketcap.com: largest pharma by market cap', CMC_PHARMA),
      src('AstraZeneca: Breztri approved in Japan for COPD (2019)', 'https://www.astrazeneca.com/media-centre/press-releases/2019/breztri-aerosphere-pt010-approved-in-japan-for-patients-with-chronic-obstructive-pulmonary-disease-19062019.html'),
    ],
    asOf: ASOF,
  },

  // ---------- cancer ----------
  {
    slug: 'merck',
    name: 'Merck & Co.',
    url: 'https://www.merck.com',
    problemSlugs: ['cancer'],
    marketCap: cap(361_020_000_000, 'companiesmarketcap.com (MRK), 2026-10-29', CMC_PHARMA),
    valuation: null,
    stage: 'public',
    country: 'USA',
    description: 'Makes Keytruda (pembrolizumab), an immunotherapy used across many cancer types.',
    sources: [
      src('companiesmarketcap.com: largest pharma by market cap', CMC_PHARMA),
      src('Keytruda', 'https://www.keytruda.com'),
    ],
    asOf: ASOF,
  },
  {
    slug: 'roche',
    name: 'Roche',
    url: 'https://www.roche.com',
    problemSlugs: ['cancer'],
    marketCap: cap(395_690_000_000, 'companiesmarketcap.com (RHHBY), 2026-10-29', CMC_PHARMA),
    valuation: null,
    stage: 'public',
    country: 'Switzerland',
    description: 'Major oncology drugmaker and cancer diagnostics supplier, through Genentech and Roche Diagnostics.',
    sources: [
      src('companiesmarketcap.com: largest pharma by market cap', CMC_PHARMA),
      src('Roche', 'https://www.roche.com'),
    ],
    asOf: ASOF,
  },
  {
    slug: 'grail',
    name: 'GRAIL',
    url: 'https://grail.com',
    problemSlugs: ['cancer'],
    marketCap: cap(7_090_000_000, 'companiesmarketcap.com (GRAL), 2026-10-29', 'https://companiesmarketcap.com/grail/marketcap/'),
    valuation: null,
    stage: 'public',
    country: 'USA',
    description:
      'Makes Galleri, a multi-cancer early detection blood test; FDA premarket approval filed January 2026, decision pending.',
    sources: [
      src('companiesmarketcap.com: GRAIL market cap', 'https://companiesmarketcap.com/grail/marketcap/'),
      src('GRAIL: FDA advisory committee to review Galleri PMA', 'https://grail.com/press-releases/grail-announces-fda-advisory-committee-meeting-to-review-premarket-approval-application-for-the-galleri-multi-cancer-early-detection-test/'),
    ],
    asOf: ASOF,
  },
]
