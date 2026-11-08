// Constraint tree: why energy abundance is not solved yet.
// Researched 2026-10-29. Every number below carries a source URL.
// "Local research" means the 2026-09-06 optimism.fun Kardashev report, which cites
// the linked primary source; those items were not re-fetched on the web this session.
// Inference is labelled as inference.

import type { ConstraintTree } from '@/data/constraints'

export const energyAbundanceTree: ConstraintTree = {
  problemSlug: 'energy-abundance',
  outcome: 'Clean, cheap power on demand for everyone, everywhere.',
  whyUnsolved:
    'Generation is cheap; delivery is not. New plants wait years for grid connection, grid equipment is short, and the 565M people without power in sub-Saharan Africa sit behind a financing gap mostly made of grids. Inference from the sources below.',
  bindingId: 'grid-delivery',
  updated: '2026-10-29',
  root: [
    {
      id: 'grid-delivery',
      claim: 'Cheap clean generation is stranded because grid connection and wires lag years behind.',
      kind: 'delivery',
      whyUnsolved:
        'Connection depends on utility studies, scarce equipment and new lines. US high-voltage line building averaged about 350 miles a year in 2020 to 2023 against roughly 5,000 miles a year needed. Binding status is inference.',
      falsifier:
        'Queued projects reach operation in under two years, or US high-voltage additions approach the 5,000 miles a year benchmark.',
      tested:
        'Refutation search: FERC revised 2024 high-voltage additions from 322 to 888 miles. Still far below 5,000. In Africa, grids are the largest slice (about $7B of $15B a year) of the IEA access need, which supports this as binding there too.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'high',
        why: 'Inference: every cheaper panel or battery is wasted while it waits for a wire, so delivery gains unlock existing supply.',
      },
      entryPoints: [
        { who: 'talent', action: 'Join a utility or grid operator interconnection or transmission planning team as a power systems engineer.' },
        { who: 'capital', action: 'Fund grid-enhancing upgrades on specific constrained lines where a utility has already accepted the study.' },
        { who: 'operator', action: 'Publish your queue position, study dates and blocking upgrade for one project so the delay is visible.' },
      ],
      sources: [
        { label: 'ACEG and Grid Strategies, Fewer New Miles 2025', url: 'https://gridstrategiesllc.com/wp-content/uploads/ACEG_Grid-Strategies_Fewer-New-Miles-2025_vF.pdf' },
        { label: 'pv magazine: transmission build at one fifth the pace needed', url: 'https://pv-magazine-usa.com/2025/07/28/transmission-build-last-year-was-at-one-fifth-the-pace-needed-clean-energy-group-finds' },
        { label: 'IEA, Financing Electricity Access in Africa (2025)', url: 'https://www.iea.org/reports/financing-electricity-access-in-africa' },
      ],
      children: [
        {
          id: 'interconnection-queues',
          claim: 'US queues hold about 1,312 GW of generation; median request to operation exceeds five years.',
          kind: 'regulatory',
          whyUnsolved:
            'Serial utility studies, speculative requests and upgrade cost allocation slow every project. Reforms raised withdrawals and shrank the queue, but built projects still took over five years in 2025.',
          falsifier:
            'Median request-to-operation time for projects built in a year falls below three years in the next Queued Up edition.',
          tested:
            'Partly refuted on size: the queue fell from about 1,400 GW (end 2024) to 1,312 GW (end 2025) after reforms and withdrawals. Not refuted on time: median duration rose past five years. ERCOT connect-and-manage outperformed in 2024, so process design matters.',
          suppliers: ['GridUnity (local research, CAISO deployment)'],
          supplyState: 'thin',
          additionality: {
            level: 'medium',
            why: 'Study rework is real, but FERC reforms target speculative requests too; faster software alone may miss the cause.',
          },
          entryPoints: [
            { who: 'talent', action: 'Build a public dataset of interconnection study revisions and the cost changes between them.' },
            { who: 'capital', action: 'Back tools that cut study rework only after one developer confirms engineer hours saved on a real project.' },
            { who: 'operator', action: 'Copy the ERCOT connect-and-manage approach in one other region and report time to energization.' },
          ],
          sources: [
            { label: 'LBNL, Queued Up 2026 Edition (end of 2025 data)', url: 'https://emp.lbl.gov/queued-2026-edition-characteristics-power-plants-seeking-transmission-interconnection-end-2025' },
            { label: 'LBNL, Queued Up 2025 Edition PDF', url: 'https://emp.lbl.gov/sites/default/files/2025-12/Queued%20Up%202025%20Edition%20-%2012.15.2025.pdf' },
            { label: 'pv magazine: ERCOT outperformed on interconnection in 2024', url: 'https://pv-magazine-usa.com/2026/01/07/ercot-outperformed-on-interconnection-in-2024-likely-due-to-connect-and-manage' },
            { label: 'GridUnity CAISO case study (local research)', url: 'https://www.gridunity.com/resources/how-caiso-is-using-gridunity-to-unsnarl-its-interconnection-process' },
          ],
        },
        {
          id: 'transformer-supply',
          claim: 'US power transformers run a 30% supply deficit with about 128-week lead times.',
          kind: 'manufacturing',
          whyUnsolved:
            'Factories take years and large capital to add. About 80% of US power transformer supply is imported. Wood Mackenzie expects most specifications to stay in marginal shortage through 2030.',
          falsifier:
            'Power transformer lead times fall below one year and the Wood Mackenzie deficit estimate drops under 10%.',
          tested:
            'Partly refuted: lead times eased 10 weeks in Q2 2025. Not refuted: still about 128 weeks (GSUs about 144) and a 30% deficit. Distribution transformer deficit estimates disagree (10% vs 6%).',
          suppliers: ['Eaton ($340M South Carolina transformer factory, production planned 2027; local research)'],
          supplyState: 'thin',
          additionality: {
            level: 'high',
            why: 'Inference: with an import-heavy 30% deficit, each added domestic unit of accepted output is likely used, not displaced.',
          },
          entryPoints: [
            { who: 'talent', action: 'Join a transformer plant in quality, test or winding engineering where accepted output is the limit.' },
            { who: 'capital', action: 'Finance transformer test and winding capacity, measured in units accepted per week, not announcements.' },
            { who: 'operator', action: 'Standardize transformer specs across your utility or developer portfolio so factories can build to stock.' },
          ],
          sources: [
            { label: 'Wood Mackenzie press release: 30% and 10% deficits in 2025', url: 'https://www.woodmac.com/press-releases/power-transformers-and-distribution-transformers-will-face-supply-deficits-of-30-and-10-in-2025/' },
            { label: 'pv magazine: grid transformers face significant supply deficits', url: 'https://pv-magazine-usa.com/2025/08/14/grid-transformers-face-significant-supply-deficits-says-wood-mackenzie/' },
            { label: 'Eaton transformer factory announcement (local research)', url: 'https://www.eaton.com/us/en-us/company/news-insights/news-releases/2025/eaton-invests-in-new-south-carolina-transformer-manufacturing.html' },
          ],
        },
      ],
    },
    {
      id: 'firm-clean-power',
      claim: 'Clean power is cheap when the sun shines; firm power around the clock is not solved.',
      kind: 'engineering',
      whyUnsolved:
        'Four-hour batteries are now cheap, but multi-day and seasonal gaps need longer storage or firm sources. Next-generation geothermal only reached first commercial operation in 2026. Long-duration and nuclear costs were not researched here.',
      falsifier:
        'Firm clean power (storage plus renewables, geothermal or nuclear) is contracted at or below new gas cost in most large markets.',
      tested:
        'Partly refuted: BNEF puts four-hour battery LCOE at a record low $78/MWh in 2025, below $100/MWh in six markets. Daily shifting is no longer the hard part. Multi-day firmness stays unknown.',
      suppliers: [],
      supplyState: 'contested',
      additionality: {
        level: 'medium',
        why: 'Batteries are scaling without new entrants; additionality is higher in multi-day storage and firm sources, which remain unresearched.',
      },
      entryPoints: [
        { who: 'talent', action: 'Work on reservoir, drilling or storage engineering where firm output, not nameplate, is measured.' },
        { who: 'capital', action: 'Fund firm clean projects with signed offtake, and track delivered MWh rather than financing raised.' },
        { who: 'operator', action: 'Write procurement for hourly matched clean power so firm supply gets paid for being firm.' },
      ],
      sources: [
        { label: 'BNEF: battery storage costs hit record lows', url: 'https://about.bnef.com/insights/clean-energy/battery-storage-costs-hit-record-lows-as-costs-of-other-clean-power-technologies-increased-bloombergnef/' },
        { label: 'Energy-Storage.news: BNEF and Ember price reports', url: 'https://www.energy-storage.news/battery-storage-system-prices-continue-to-fall-sharply-bnef-and-ember-reports-find/' },
      ],
      children: [
        {
          id: 'storage-duration',
          claim: 'Four-hour storage is cheap; storage for multi-day and seasonal gaps is unproven at scale.',
          kind: 'engineering',
          whyUnsolved:
            'Turnkey four-hour systems averaged about $110/kWh in 2025, but US systems cost $219/kWh versus $73/kWh in China. Long-duration cost and deployment data were not found this session.',
          falsifier:
            'Multi-day storage projects reach commercial operation at a delivered cost comparable to four-hour lithium-ion.',
          tested:
            'The "batteries are too expensive" claim is refuted for daily cycling. The multi-day claim was not tested; no long-duration source was fetched.',
          suppliers: ['Fluence (local research: FY2025 loss and tariff-related pauses)'],
          supplyState: 'unresearched',
          additionality: {
            level: 'unknown',
            why: 'Four-hour supply looks well served; long-duration supply was not researched.',
          },
          entryPoints: [
            { who: 'talent', action: 'Model how many hours of storage a real grid needs in its worst week, using public load data.' },
            { who: 'capital', action: 'Ask any long-duration storage pitch for delivered cost per MWh from an operating project before investing.' },
            { who: 'operator', action: 'Pilot one multi-day storage asset and publish its round-trip efficiency and availability.' },
          ],
          sources: [
            { label: 'Energy-Storage.news: turnkey prices by region and duration', url: 'https://www.energy-storage.news/battery-storage-system-prices-continue-to-fall-sharply-bnef-and-ember-reports-find/' },
            { label: 'BNEF press release on storage costs', url: 'https://about.bnef.com/insights/clean-energy/battery-storage-costs-hit-record-lows' },
          ],
        },
        {
          id: 'geothermal-scale',
          claim: 'Enhanced geothermal works commercially but has only about 100 MW at one site.',
          kind: 'engineering',
          whyUnsolved:
            'Fervo Cape Station declared commercial operation on 30 September 2026 with one 33 MW block; two more are due by January 2027. Repeatability across sites and cost at scale are not yet shown.',
          falsifier:
            'A second developer or a second region reaches commercial EGS operation at comparable cost before 2030.',
          tested:
            'Refuted "EGS is not commercial": Cape Station hit commercial operation one day before its contract date. A 400 MW phase targets 2028. Cost per MWh was not found.',
          suppliers: ['Fervo Energy', 'PNNL, Fervo and NVIDIA EGS-Twin (local research)'],
          supplyState: 'thin',
          additionality: {
            level: 'medium',
            why: 'Few players, but Fervo is funded and ahead; a duplicate developer may add less than drilling or reservoir talent.',
          },
          entryPoints: [
            { who: 'talent', action: 'Bring oil and gas drilling or completions experience to a geothermal developer.' },
            { who: 'capital', action: 'Back a second EGS site outside Utah to test whether the Cape result repeats.' },
            { who: 'operator', action: 'Sign a firm geothermal PPA like the 396 MW Google deal to give developers bankable demand.' },
          ],
          sources: [
            { label: 'Renewable Energy Magazine: Fervo declares commercial operation at Cape', url: 'https://www.renewableenergymagazine.com/geothermal/fervo-energy-declares-commercial-operation-at-cape-20261002' },
            { label: 'ThinkGeoEnergy: Fervo commercial operation of first plant', url: 'https://www.thinkgeoenergy.com/fervo-energy-announces-commercial-operation-of-first-geothermal-power-plant-in-cape-station-utah/' },
            { label: 'Fervo Q2 2026 results', url: 'https://fervoenergy.com/fervo-energy-reports-second-quarter-2026-results/' },
            { label: 'PNNL, Fervo and NVIDIA EGS-Twin (local research)', url: 'https://www.pnnl.gov/news-media/pnnl-teams-fervo-energy-and-nvidia-accelerate-geothermal-energy-development' },
          ],
        },
      ],
    },
    {
      id: 'access-finance',
      claim: '666M people lack electricity; 85% (565M) live in sub-Saharan Africa.',
      kind: 'payment',
      whyUnsolved:
        'IEA estimates $15B a year is needed for universal access in Africa; less than $2.5B a year reaches sub-Saharan Africa. Low-income households also need about $2B a year in affordability support.',
      falsifier:
        'Annual access finance to sub-Saharan Africa reaches $15B and the unserved count falls by tens of millions a year.',
      tested:
        'Not refuted. In 2023, 35M people gained access but population grew 30M, so the gap shrank only 5M. 84% of the unserved are rural.',
      suppliers: ['World Bank and AfDB Mission 300'],
      supplyState: 'thin',
      additionality: {
        level: 'high',
        why: 'Funding covers under a fifth of the stated need, so added finance or delivery capacity is unlikely to displace existing supply.',
      },
      entryPoints: [
        { who: 'talent', action: 'Join a mini-grid or solar home system company in a Mission 300 country.' },
        { who: 'capital', action: 'Provide local-currency debt to mini-grid and solar home system operators in sub-Saharan Africa.' },
        { who: 'operator', action: 'Report connections and paying customers per quarter so financiers can price the risk.' },
      ],
      sources: [
        { label: 'World Bank, Tracking SDG 7 2025', url: 'https://www.worldbank.org/en/topic/energy/publication/tracking-sdg-7-the-energy-progress-report-2025' },
        { label: 'ESMAP, Tracking SDG7 Progress Report 2025', url: 'https://www.esmap.org/publications/tracking-sdg7-progress-report-2025' },
        { label: 'IEA, Financing Electricity Access in Africa', url: 'https://www.iea.org/reports/financing-electricity-access-in-africa' },
        { label: 'IEA, Financing Electricity Access in Africa: state of play', url: 'https://www.iea.org/reports/financing-electricity-access-in-africa/state-of-play' },
      ],
      children: [
        {
          id: 'access-finance-gap',
          claim: 'Access finance to sub-Saharan Africa runs under $2.5B a year against $15B needed.',
          kind: 'payment',
          whyUnsolved:
            'Private finance was only $640M in 2023 versus $1.8B public. The need splits into about $7B grids, $5B mini-grids and $3B solar home systems a year.',
          falsifier:
            'Private access finance exceeds public finance for two consecutive years without new guarantees.',
          tested:
            'Partly refuted on pace: Mission 300 banks committed nearly $15B and mobilized about $4.5B co-financing. Whether that closes the annual gap was not verified.',
          suppliers: ['World Bank', 'African Development Bank'],
          supplyState: 'thin',
          additionality: {
            level: 'high',
            why: 'Private capital is a small share of a large unmet need.',
          },
          entryPoints: [
            { who: 'talent', action: 'Build credit models from pay-as-you-go solar repayment data to lower lender risk.' },
            { who: 'capital', action: 'Offer first-loss or currency hedges that let private lenders follow development bank money.' },
            { who: 'operator', action: 'Bundle small connection projects into one financeable portfolio with shared reporting.' },
          ],
          sources: [
            { label: 'IEA, Financing Electricity Access in Africa', url: 'https://www.iea.org/reports/financing-electricity-access-in-africa' },
            { label: 'Engineering News: IEA on demand-side support', url: 'https://www.engineeringnews.co.za/article/longer-term-demand-side-support-needed-to-realise-universal-electricity-access-in-africa-iea-2025-10-21' },
            { label: 'Ecofin: World Bank and AfDB reach 50M connections', url: 'https://www.ecofinagency.com/news-industry/1706-56530-world-bank-afdb-reach-50-million-electricity-connections-under-mission-300' },
          ],
        },
        {
          id: 'mission-300-pace',
          claim: 'Mission 300 connected over 50M people in two years; 300M by 2030 needs faster delivery.',
          kind: 'delivery',
          whyUnsolved:
            'The World Bank owns 250M connections and AfDB 50M. AfDB says progress must accelerate. A 64M figure from October 2026 was not confirmed against a primary source.',
          falsifier:
            'Mission 300 reports 150M or more connections by end of 2027.',
          tested:
            'Partly refuted: the banks say delivery runs at nearly twice the launch pace, led by Tanzania (7.5M) and Ethiopia (4.6M). Affordability after connection was not measured.',
          suppliers: ['Mission 300 (World Bank and AfDB)'],
          supplyState: 'thin',
          additionality: {
            level: 'medium',
            why: 'A funded program exists; the gap is local delivery and affordability, where added operators still matter.',
          },
          entryPoints: [
            { who: 'talent', action: 'Join a utility or distributor in a Mission 300 compact country on last-mile connections.' },
            { who: 'capital', action: 'Fund connection subsidies tied to verified paying customers six months later, not meters installed.' },
            { who: 'operator', action: 'Track and publish how many new connections are still paying for power after one year.' },
          ],
          sources: [
            { label: 'Engineering News: Mission 300 achieving results as 50M gain access', url: 'https://www.engineeringnews.co.za/article/mission-300-achieving-results-as-50m-more-people-gain-access-to-electricity-2026-06-17' },
            { label: 'Daily Maverick: Mission 300 flips the switch for 50M', url: 'https://www.dailymaverick.co.za/article/2026-06-18-mission-300-flips-the-switch-for-50-million-africans-but-harder-work-lies-ahead/' },
            { label: 'GNA: 64M connected (unconfirmed)', url: 'https://gna.org.gh/2026/10/world-bank-afdb-connect-64-million-africans-to-electricity/' },
          ],
        },
      ],
    },
  ],
}
