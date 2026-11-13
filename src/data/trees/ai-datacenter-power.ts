// Constraint tree: why powering AI datacenters is not solved yet.
// Researched 2026-11-11. Every number below comes from a page opened that day.
// Inference is labelled as inference. Unknown stays unknown.
// General grid delivery (generation queues, transformer deficits) lives in trees/energy.ts.
// This tree covers connecting and supplying large datacenter loads specifically.

import type { ConstraintTree } from '../constraints'

const IEA_AI = { label: 'IEA, Energy and AI, executive summary', url: 'https://www.iea.org/reports/energy-and-ai/executive-summary' }
const DOE_LBNL = {
  label: 'US DOE release on the LBNL 2024 United States Data Center Energy Usage Report',
  url: 'https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers',
}
const DUKE_UD = {
  label: 'Utility Dive on the Duke Nicholas Institute report Rethinking Load Growth, February 2025',
  url: 'https://www.utilitydive.com/news/us-grid-headroom-flexible-load-data-center-ai-ev-duke-report/739767/',
}
const FERC_ORRICK = {
  label: 'Orrick, FERC show cause orders on large load interconnection, July 2026',
  url: 'https://www.orrick.com/en/Insights/2026/07/FERC-Show-Cause-Orders-Signal-Broad-Reform-to-Large-Load-Interconnection-Policies',
}
const GEV_UD = {
  label: 'Utility Dive, GE Vernova gas turbine backlog hits 100 GW as prices rise, April 2026',
  url: 'https://www.utilitydive.com/news/ge-vernova-gas-turbine-backlog-hits-100-gw-as-prices-rise/',
}

export const aiDatacenterPowerTree: ConstraintTree = {
  problemSlug: 'ai-datacenter-power',
  outcome:
    'A new datacenter gets firm power on roughly the timeline it takes to build the datacenter. Today the IEA estimates about 20 percent of planned datacenter projects could be delayed unless grid risks are addressed.',
  whyUnsolved:
    'Datacenters used about 415 TWh in 2024, 1.5 percent of world electricity, and the IEA expects about 945 TWh by 2030. Inference: a datacenter can be built faster than the grid around it. New transmission lines take four to eight years in advanced economies, and waits for transformers and cables have doubled in three years. One large maker of gas turbines has little capacity left through 2030. The one official US projection opened spans 325 to 580 TWh for 2028, and who should pay for upgrades was still before FERC in 2026. Judging grid connection as most binding is our inference.',
  bindingId: 'large-load-connection',
  updated: '2026-11-11',
  root: [
    {
      id: 'large-load-connection',
      claim: 'Datacenters wait years for a grid connection because rules and wires were not designed for loads this large.',
      kind: 'regulatory',
      whyUnsolved:
        'The IEA calls grid connection queues long and complex. Utility Dive reports some utilities citing delays of up to seven to ten years for large loads. On 18 June 2026 FERC issued show cause orders to all six grid operators it regulates, covering study procedures, upgrade costs, co-located generation and flexible loads for sites of 50 MW or more. Responses were due 17 August 2026. Final rules were not found this session.',
      falsifier:
        'Large loads connect quickly once they accept limited curtailment, which would show the limit is the connection rules, not physical grid capacity.',
      tested:
        'Partly supports a rules problem. A Duke study found the 22 largest US balancing areas could take 76 GW of new load if it were curtailed for 0.25 percent of its maximum uptime, about 85 hours a year, and 126 GW at 1 percent, about 366 hours. It ignored transmission constraints, and datacenters have rarely joined demand response. ERCOT and PG&E offer flexible connection options. No measured connection times for flexible loads were found.',
      suppliers: ['FERC and the six grid operators it regulates (rule reform)', 'ERCOT and PG&E (flexible connection options)'],
      supplyState: 'contested',
      additionality: {
        level: 'medium',
        why: 'Inference: regulators are already acting, so a new team adds most by proving a flexible connection works on a real site, not by restating the case.',
      },
      entryPoints: [
        { who: 'operator', action: 'Apply for a flexible connection for one site and publish the time from request to energisation.' },
        { who: 'talent', action: 'Build the controls that let a datacenter cut load on a utility signal without breaking its service commitments.' },
        { who: 'capital', action: 'Fund on-site storage or backup that lets a datacenter accept curtailment in exchange for a faster connection.' },
      ],
      sources: [IEA_AI, DUKE_UD, FERC_ORRICK],
    },
    {
      id: 'power-equipment',
      claim: 'Waits for transformers and cables have doubled in three years, and one large turbine maker has little capacity left through 2030.',
      kind: 'manufacturing',
      whyUnsolved:
        'The IEA says waits for transformers and cables have doubled in three years and gas turbine deliveries face lead times of several years. GE Vernova reported a 100 GW gas turbine backlog in the first quarter of 2026, up from 83 GW at the end of 2025, with about 10 GW of production capacity left through 2030 and prices up 10 to 20 percent on new bids.',
      falsifier:
        'Turbine and transformer backlogs shrink while datacenter orders keep growing.',
      tested:
        'Not found. The GE Vernova backlog grew by 17 GW in one quarter. Other turbine makers and transformer makers were not checked against primary sources this session.',
      suppliers: ['GE Vernova'],
      supplyState: 'thin',
      additionality: {
        level: 'medium',
        why: 'Inference: with slots booked through 2030, added manufacturing capacity is likely used. A new entrant faces long factory lead times, so the gain arrives late.',
      },
      entryPoints: [
        { who: 'capital', action: 'Finance added turbine or transformer manufacturing capacity, measured in units delivered, not announced.' },
        { who: 'talent', action: 'Join a turbine or transformer plant in manufacturing or test engineering.' },
        { who: 'operator', action: 'Standardise equipment specifications across sites so makers can build ahead of orders.' },
      ],
      sources: [IEA_AI, GEV_UD],
    },
    {
      id: 'demand-uncertainty',
      claim: 'How much datacenter load will arrive is uncertain, and who pays for the upgrades is not settled.',
      kind: 'coordination',
      whyUnsolved:
        'US datacenters used 176 TWh in 2023, about 4.4 percent of US electricity. The Berkeley Lab projection for 2028 is 325 to 580 TWh, or 6.7 to 12 percent. That range is wide. The IEA expects datacenters to drive nearly half of US demand growth to 2030. FERC asked grid operators for more transparent upgrade costs, and one commissioner warned that negotiated agreements may not be enough to protect existing ratepayers.',
      falsifier:
        'Forecasts from independent sources converge to a narrow range, and upgrade cost rules are settled without dispute.',
      tested:
        'Not found. The only official US projection opened spans nearly a factor of two, and cost allocation was still before FERC in mid 2026.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Who produces independent, site-level load forecasts was not researched this session.',
      },
      entryPoints: [
        { who: 'talent', action: 'Build a public count of datacenter projects that have power contracts, separate from announcements.' },
        { who: 'operator', action: 'Publish contracted and energised MW each quarter so utilities can plan on real load.' },
      ],
      sources: [DOE_LBNL, IEA_AI, FERC_ORRICK],
    },
  ],
}
