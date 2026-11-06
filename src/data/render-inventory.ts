/**
 * Every structured number a public page renders, and where that number lives.
 * Interactive research questions have no standing value, so they are listed
 * and not filled in. Cron jobs are not public pages.
 */
export const RENDER_INVENTORY = [
  {
    surface: '/p/[slug] chart and /demand burden',
    provider: 'our-world-in-data',
    storage: 'snapshot.owid',
    unit: 'chart unit',
  },
  {
    surface: '/demand burden and /p longevity or malaria where mapped',
    provider: 'who',
    storage: 'snapshot.who',
    unit: 'indicator unit',
  },
  {
    surface: '/signals, /api/indicators, /demand burden',
    provider: 'world-bank-wdi',
    storage: 'snapshot.worldbankWdi',
    unit: 'indicator unit',
  },
  {
    surface: '/demand research',
    provider: 'openalex',
    storage: 'snapshot.demandFeeds',
    unit: 'papers',
    formula: 'strength = log10(1+papers)/log10(1+100000) when papers > 0; otherwise no strength',
  },
  {
    surface: '/demand research fallback when OpenAlex is unavailable',
    provider: 'nih-reporter',
    storage: 'snapshot.demandFeeds',
    unit: 'funded projects',
    formula: 'strength = log10(1+projects)/log10(1+20000) when projects > 0; otherwise no strength',
  },
  {
    surface: '/demand capital observation',
    provider: 'sec-edgar',
    storage: 'snapshot.demandFeeds',
    unit: 'Form D filings',
    formula: 'observation only; does not set capital strength',
  },
  {
    surface: '/demand capital observation when EDGAR is not the displayed cell',
    provider: 'usaspending',
    storage: 'snapshot.demandFeeds',
    unit: 'federal awards',
    formula: 'observation only; an award count is not dollars',
  },
  {
    surface: '/demand policy',
    provider: 'federal-register',
    storage: 'snapshot.demandFeeds',
    unit: 'federal documents',
    formula: 'strength = log10(1+documents)/log10(1+800) when documents > 0; otherwise no strength',
  },
  {
    surface: '/demand queues',
    provider: 'openfda',
    storage: 'snapshot.demandFeeds',
    unit: 'drugs in shortage',
    formula: 'strength = log10(1+drugs)/log10(1+50) when drugs > 0; otherwise no strength',
  },
  {
    surface: '/demand attention and /underserved attention share',
    provider: 'wikipedia',
    storage: 'snapshot.demandFeeds',
    unit: 'monthly readers',
    formula: 'not a demand component; weight 0 in the demand composite',
  },
  {
    surface: '/trends',
    provider: 'hackernews, github, wikipedia',
    storage: 'snapshot.trends',
    unit: 'counts in two windows',
    formula: 'scoreTrend on the captured observations; a missing source is absent, not zero',
  },
  {
    surface: 'problem records, companies, discoveries, citations',
    provider: 'repository',
    storage: 'src/data and /api/scores',
    unit: 'as labeled on the record',
  },
  {
    surface: '/research ask and similar',
    provider: 'openalex, crossref, exa',
    storage: 'not a standing table',
    unit: 'none until a person asks',
    formula: 'no default result is invented for the snapshot',
  },
  {
    surface: 'cron refresh-demand and refresh-indicators',
    provider: 'the same public APIs',
    storage: 'not a public page',
    unit: 'not rendered',
  },
] as const
