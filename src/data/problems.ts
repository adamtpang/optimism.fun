import type { Problem } from './types'

const TODAY = '2026-04-24'

export const problems: Problem[] = [
  {
    slug: 'ai-safety',
    name: 'AI safety & alignment',
    tier: 'x-risk',
    tagline:
      'Ensure increasingly capable AI systems remain corrigible, honest, and aligned with human values.',
    description:
      'As AI systems approach and exceed human-level capability across domains, the open problem is whether their goals and behaviors remain under human correction. Unaligned AI is the one x-risk that is accelerating rather than slowing. A Deutschian framing: safety is not a brake on progress, it is an engineering achievement of progress. The work is technical (interpretability, evals, corrigibility) and institutional (governance, deployment protocols).',
    humansAffected: {
      value: 8_100_000_000,
      unit: 'humans',
      source: '80,000 Hours AI problem profile',
      sourceUrl: 'https://80000hours.org/problem-profiles/artificial-intelligence/',
      confidence: 'high',
      asOf: TODAY,
    },
    severity: {
      value: 1.0,
      unit: 'share of wealth',
      source: 'estimated, potential loss is all future value',
      confidence: 'low',
      asOf: TODAY,
    },
    scores: {
      welfareBCR: null,
      xriskITN: {
        value: 9.5,
        unit: '/10 composite',
        source: '80,000 Hours top-priority area',
        sourceUrl: 'https://80000hours.org/problem-profiles/',
        confidence: 'high',
        asOf: TODAY,
      },
      utilityDelta: {
        value: 0.9,
        unit: 'state-of-art vs possible',
        source: 'estimated, aligned ASI would unlock most other quests',
        confidence: 'low',
        asOf: TODAY,
      },
    },
    sources: [
      {
        title: '80,000 Hours AI problem profile',
        url: 'https://80000hours.org/problem-profiles/artificial-intelligence/',
      },
      { title: 'Conjecture Institute', url: 'https://www.conjectureinstitute.com' },
    ],
    asOf: TODAY,
  },
  {
    slug: 'biosecurity',
    name: 'Biosecurity & pandemic preparedness',
    tier: 'x-risk',
    tagline:
      'Prevent engineered and naturally-emerging pandemics from wiping out humanity or crippling civilization.',
    description:
      'COVID-19 demonstrated the tail risk from a single pathogen. Dual-use gene synthesis, lab leaks, and deliberate misuse mean that worst-case pandemics could be civilization-ending. Tractable: far-UVC sterilization, early-warning surveillance, broad-spectrum countermeasures, pathogen-agnostic detection.',
    humansAffected: {
      value: 8_100_000_000,
      unit: 'humans',
      source: '80,000 Hours biosecurity profile',
      sourceUrl: 'https://80000hours.org/problem-profiles/preventing-catastrophic-pandemics/',
      confidence: 'high',
      asOf: TODAY,
    },
    severity: {
      value: 0.85,
      unit: 'share of wealth',
      source: 'estimated, engineered pandemic could approach extinction',
      confidence: 'low',
      asOf: TODAY,
    },
    scores: {
      welfareBCR: null,
      xriskITN: {
        value: 9.0,
        unit: '/10 composite',
        source: '80,000 Hours top-priority area',
        sourceUrl: 'https://80000hours.org/problem-profiles/preventing-catastrophic-pandemics/',
        confidence: 'high',
        asOf: TODAY,
      },
      utilityDelta: {
        value: 0.8,
        unit: 'state-of-art vs possible',
        source: 'estimated, far-UVC + metagenomic surveillance at scale are unbuilt',
        confidence: 'low',
        asOf: TODAY,
      },
    },
    sources: [
      {
        title: '80,000 Hours biosecurity profile',
        url: 'https://80000hours.org/problem-profiles/preventing-catastrophic-pandemics/',
      },
      { title: 'Nucleic Acid Observatory', url: 'https://naobservatory.org/' },
    ],
    asOf: TODAY,
  },
  {
    slug: 'energy-abundance',
    name: 'Energy abundance',
    tier: 'hard-tech',
    tagline:
      'Produce clean, cheap, dispatchable energy at civilizational scale, fusion, advanced fission, geothermal.',
    description:
      "Energy underwrites every other quest. Current global primary energy use is ~600 EJ/year at ~$0.10/kWh average. Thermodynamic physics allows orders of magnitude more throughput at far lower cost. Fusion (net energy achieved at NIF 2022), advanced fission (SMRs, Gen IV), and enhanced geothermal are all within the adjacent possible. Energy is the denominator in Musk's utility-delta: cheap energy improves every human life.",
    humansAffected: {
      value: 8_100_000_000,
      unit: 'humans',
      source: 'IEA World Energy Outlook',
      sourceUrl: 'https://www.iea.org/reports/world-energy-outlook-2025',
      confidence: 'high',
      asOf: TODAY,
    },
    severity: {
      value: 0.15,
      unit: 'share of income',
      source: 'energy ~10-20% of household spending globally (World Bank)',
      sourceUrl: 'https://data.worldbank.org/',
      confidence: 'med',
      asOf: TODAY,
    },
    scores: {
      welfareBCR: {
        value: 15,
        unit: '$ of benefit per $ spent',
        source: 'estimated from clean-energy CBA meta-analyses',
        confidence: 'low',
        asOf: TODAY,
      },
      xriskITN: {
        value: 7.0,
        unit: '/10 composite',
        source: 'climate + great-power competition bundle',
        confidence: 'med',
        asOf: TODAY,
      },
      utilityDelta: {
        value: 0.25,
        unit: 'state-of-art vs thermodynamic limit',
        source: 'current solar efficiency ~22% of Shockley-Queisser; fusion commercial energy unrealized',
        confidence: 'med',
        asOf: TODAY,
      },
    },
    sources: [
      { title: 'IEA World Energy Outlook', url: 'https://www.iea.org/reports/world-energy-outlook-2025' },
      { title: 'Our World in Data, Energy', url: 'https://ourworldindata.org/energy' },
    ],
    asOf: TODAY,
  },
  {
    slug: 'housing-construction',
    name: 'Low-cost housing & construction',
    tier: 'hard-tech',
    tagline:
      'Close the gap between what materials cost and what buildings cost, housing is 5× its bill of materials.',
    description:
      '1.6 billion people live in inadequate housing globally (UN-Habitat). In developed economies, housing is the single largest household expense, with construction productivity flat for 50 years. The physics of concrete, steel, and timber allows much cheaper buildings. The gap is process: zoning, labor shortages, regulatory stacks, and the absence of industrial-scale construction automation. Robotics, 3D printing, prefab, and permitting reform all compound.',
    humansAffected: {
      value: 1_600_000_000,
      unit: 'humans in inadequate housing',
      source: 'UN-Habitat World Cities Report',
      sourceUrl: 'https://unhabitat.org/wcr/',
      confidence: 'high',
      asOf: TODAY,
    },
    severity: {
      value: 0.35,
      unit: 'share of income',
      source: 'global median housing burden (UN-Habitat, Demographia)',
      sourceUrl: 'https://unhabitat.org/',
      confidence: 'med',
      asOf: TODAY,
    },
    scores: {
      welfareBCR: {
        value: 8,
        unit: '$ of benefit per $ spent',
        source: 'estimated from urban economics meta-analyses',
        confidence: 'low',
        asOf: TODAY,
      },
      xriskITN: null,
      utilityDelta: {
        value: 0.2,
        unit: 'state-of-art vs material minimum',
        source: 'residential construction ~5× raw material cost (McKinsey productivity report)',
        confidence: 'med',
        asOf: TODAY,
      },
    },
    sources: [
      { title: 'UN-Habitat World Cities Report', url: 'https://unhabitat.org/wcr/' },
      {
        title: 'McKinsey, Reinventing construction',
        url: 'https://www.mckinsey.com/industries/capital-projects-and-infrastructure/our-insights/reinventing-construction-through-a-productivity-revolution',
      },
    ],
    asOf: TODAY,
  },
  {
    slug: 'pedagogy',
    name: 'Pedagogy at scale',
    tier: 'progress',
    tagline:
      "Close Bloom's 2-sigma gap, every child deserves a personal tutor, and AI may finally make it tractable.",
    description:
      "Benjamin Bloom's 1984 research showed one-on-one tutoring raises student performance by 2 standard deviations versus classroom instruction. The problem was cost: one tutor per child is infeasible at population scale. AI tutoring changes the economics. 1.5B children are undereducated globally (UNESCO); billions more adults lack skills they could have acquired with better pedagogy. This is the problem Deutsch writes about most directly in The Beginning of Infinity, better explanations compound across generations.",
    humansAffected: {
      value: 1_500_000_000,
      unit: 'children undereducated',
      source: 'UNESCO Global Education Monitoring Report',
      sourceUrl: 'https://www.unesco.org/gem-report/en',
      confidence: 'high',
      asOf: TODAY,
    },
    severity: {
      value: 0.2,
      unit: 'share of lifetime earnings',
      source: 'World Bank, returns to schooling meta-analyses',
      sourceUrl: 'https://openknowledge.worldbank.org/entities/publication/1f1b2b42-c50a-5116-9bd7-2f2a08a9e8f8',
      confidence: 'med',
      asOf: TODAY,
    },
    scores: {
      welfareBCR: {
        value: 12,
        unit: '$ of benefit per $ spent',
        source: 'Copenhagen Consensus, education interventions',
        sourceUrl: 'https://copenhagenconsensus.com/',
        confidence: 'med',
        asOf: TODAY,
      },
      xriskITN: null,
      utilityDelta: {
        value: 0.3,
        unit: 'state-of-art vs personal-tutor benchmark',
        source: "Bloom's 2-sigma problem, median classroom at ~30th percentile of tutored outcomes",
        confidence: 'med',
        asOf: TODAY,
      },
    },
    sources: [
      { title: 'UNESCO GEM Report', url: 'https://www.unesco.org/gem-report/en' },
      {
        title: "Bloom's 2-sigma problem",
        url: 'https://en.wikipedia.org/wiki/Bloom%27s_2_sigma_problem',
      },
    ],
    asOf: TODAY,
  },
  {
    slug: 'infectious-disease',
    name: 'Infectious disease (malaria, TB, HIV)',
    tier: 'welfare',
    tagline:
      'The Copenhagen Consensus welfare floor, pennies save lives, and we still are not spending them.',
    description:
      "Malaria killed ~600,000 people in 2023, mostly children under 5. Tuberculosis kills ~1.3M per year. HIV kills ~630,000 per year despite proven suppression protocols. The Copenhagen Consensus ranks these interventions among the highest benefit-cost ratios in global development, $1 of intervention returns $20-$100 in economic and welfare gains. This is the baseline anyone claiming to rank humanity's problems has to include.",
    humansAffected: {
      value: 2_500_000_000,
      unit: 'humans at risk of at least one',
      source: 'WHO Global Burden of Disease',
      sourceUrl: 'https://www.who.int/data/gho',
      confidence: 'high',
      asOf: TODAY,
    },
    severity: {
      value: 0.6,
      unit: 'share of wealth (for affected)',
      source: 'DALY-adjusted health economics (WHO)',
      confidence: 'med',
      asOf: TODAY,
    },
    scores: {
      welfareBCR: {
        value: 48,
        unit: '$ of benefit per $ spent',
        source: 'Copenhagen Consensus Halftime Report 2023',
        sourceUrl: 'https://copenhagenconsensus.com/halftime-sdg/welfare',
        confidence: 'high',
        asOf: TODAY,
      },
      xriskITN: null,
      utilityDelta: {
        value: 0.5,
        unit: 'state-of-art vs possible',
        source: 'mRNA malaria vaccine, antibody prophylaxis still underdeployed',
        confidence: 'med',
        asOf: TODAY,
      },
    },
    sources: [
      { title: 'WHO World Malaria Report', url: 'https://www.who.int/teams/global-malaria-programme' },
      { title: 'Copenhagen Consensus', url: 'https://copenhagenconsensus.com/' },
    ],
    asOf: TODAY,
  },
  {
    slug: 'scientific-productivity',
    name: 'Scientific productivity',
    tier: 'progress',
    tagline:
      'Ideas are getting harder to find. Reverse the decline in research productivity per dollar.',
    description:
      'Bloom, Jones, Van Reenen and Webb showed research productivity across semiconductors, agriculture, and biomedicine has been falling for decades, we spend far more scientist-hours for each new idea. The meta-problem: every other quest on this list depends on scientific throughput. Focused Research Organizations, AI-assisted research, metascience reform, and funding structure changes all compound across every domain.',
    humansAffected: {
      value: 8_100_000_000,
      unit: 'humans (compound effect)',
      source: 'estimated, scientific productivity compounds across every domain',
      confidence: 'med',
      asOf: TODAY,
    },
    severity: {
      value: 0.1,
      unit: 'share of income (indirect)',
      source: 'estimated, affects long-run growth rate, not direct spending',
      confidence: 'low',
      asOf: TODAY,
    },
    scores: {
      welfareBCR: {
        value: 20,
        unit: '$ of benefit per $ spent',
        source: 'estimated from endogenous growth models',
        confidence: 'low',
        asOf: TODAY,
      },
      xriskITN: {
        value: 6.5,
        unit: '/10 composite',
        source: 'Institute for Progress / metascience community',
        sourceUrl: 'https://ifp.org/',
        confidence: 'med',
        asOf: TODAY,
      },
      utilityDelta: {
        value: 0.35,
        unit: 'state-of-art vs possible',
        source: 'AI-assisted research + reformed funding could 3-5x idea output',
        confidence: 'low',
        asOf: TODAY,
      },
    },
    sources: [
      {
        title: 'Bloom, Jones, Van Reenen, Webb, Are Ideas Getting Harder to Find?',
        url: 'https://web.stanford.edu/~chadj/IdeaPF.pdf',
      },
      { title: 'Institute for Progress', url: 'https://ifp.org/' },
    ],
    asOf: TODAY,
  },
  {
    slug: 'longevity',
    name: 'Longevity & aging',
    tier: 'hard-tech',
    tagline:
      'Extend healthspan. Aging is the single largest driver of disease burden, and it is treatable.',
    description:
      "Aging underlies cardiovascular disease, cancer, neurodegeneration, and frailty. Every human alive is affected. The hallmarks-of-aging framework (López-Otín et al.) gives discrete targets: senescent cell clearance, epigenetic reprogramming, stem cell exhaustion. Partial cellular reprogramming (Altos, Retro, NewLimit) and geroprotective drugs (rapamycin, metformin class) are in early trials. Utility delta is enormous: current median healthspan ~75 years, theoretical ceiling unknown and likely much higher.",
    humansAffected: {
      value: 8_100_000_000,
      unit: 'humans (everyone ages)',
      source: 'UN Population Division',
      sourceUrl: 'https://population.un.org/wpp/',
      confidence: 'high',
      asOf: TODAY,
    },
    severity: {
      value: 0.25,
      unit: 'share of lifetime wealth',
      source: 'healthcare spend concentrates in final decade of life (OECD Health Statistics)',
      confidence: 'med',
      asOf: TODAY,
    },
    scores: {
      welfareBCR: {
        value: 7,
        unit: '$ of benefit per $ spent',
        source: 'Goldman et al., value of healthy aging',
        confidence: 'med',
        asOf: TODAY,
      },
      xriskITN: null,
      utilityDelta: {
        value: 0.4,
        unit: 'state-of-art vs possible',
        source: 'partial reprogramming demonstrated in mice; human healthspan additions unproven',
        confidence: 'low',
        asOf: TODAY,
      },
    },
    sources: [
      {
        title: 'Hallmarks of Aging (López-Otín et al.)',
        url: 'https://www.cell.com/cell/fulltext/S0092-8674(22)01377-0',
      },
      { title: 'Buck Institute', url: 'https://www.buckinstitute.org/' },
    ],
    asOf: TODAY,
  },
  {
    slug: 'fertility-decline',
    name: 'Fertility decline & demographic stagnation',
    tier: 'emerging',
    tagline:
      'Every developed country is below replacement. Under-counted by EA and e/acc. Civilizationally large.',
    description:
      "Global fertility has fallen to ~2.3 and is projected to drop below 2.1 (replacement) within a decade. South Korea, Italy, Japan, and China are already at 0.7-1.3. Shrinking working-age populations break pension systems, slow innovation, and collapse housing markets. Causes: housing cost, childcare cost, cultural shift, biological fertility decline. Solutions span policy (childcare subsidies, YIMBY), technology (in-vitro gametogenesis, artificial wombs), and culture. Severely neglected in EA/e/acc canon.",
    humansAffected: {
      value: 6_000_000_000,
      unit: 'humans in countries below replacement',
      source: 'UN World Population Prospects',
      sourceUrl: 'https://population.un.org/wpp/',
      confidence: 'high',
      asOf: TODAY,
    },
    severity: {
      value: 0.15,
      unit: 'share of long-run GDP',
      source: 'estimated, demographic drag on growth, fiscal sustainability',
      confidence: 'low',
      asOf: TODAY,
    },
    scores: {
      welfareBCR: null,
      xriskITN: {
        value: 5.5,
        unit: '/10 composite (high neglectedness)',
        source: 'estimated, extreme neglectedness relative to scale',
        confidence: 'low',
        asOf: TODAY,
      },
      utilityDelta: {
        value: 0.15,
        unit: 'state-of-art vs possible',
        source: 'IVG + artificial wombs could restore fertility optionality at population scale',
        confidence: 'low',
        asOf: TODAY,
      },
    },
    sources: [
      { title: 'UN World Population Prospects', url: 'https://population.un.org/wpp/' },
      { title: 'Our World in Data, Fertility rate', url: 'https://ourworldindata.org/fertility-rate' },
    ],
    asOf: TODAY,
  },
  {
    slug: 'loneliness',
    name: 'Loneliness & social isolation',
    tier: 'emerging',
    tagline:
      'The US Surgeon General called it an epidemic. Mortality effect equivalent to smoking 15 cigarettes a day.',
    description:
      "The 2023 US Surgeon General advisory found ~1 in 2 adults report measurable loneliness, with mortality risk comparable to smoking 15 cigarettes per day. Young adults and seniors are hit hardest. Causes are multi-factor: declining third places, smartphone displacement of in-person contact, atomized work, declining religious attendance. Tractable through deliberate community-building, in-person event platforms, therapy access, and cultural design. Severely missed by hard-tech problem lists because it resists technical framing.",
    humansAffected: {
      value: 1_500_000_000,
      unit: 'adults reporting measurable loneliness',
      source: 'US Surgeon General 2023 advisory + global WHO data',
      sourceUrl: 'https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf',
      confidence: 'med',
      asOf: TODAY,
    },
    severity: {
      value: 0.3,
      unit: 'share of subjective wellbeing',
      source: 'meta-analyses of loneliness and life satisfaction',
      confidence: 'med',
      asOf: TODAY,
    },
    scores: {
      welfareBCR: {
        value: 5,
        unit: '$ of benefit per $ spent',
        source: 'estimated from social-prescription trials (UK NHS)',
        confidence: 'low',
        asOf: TODAY,
      },
      xriskITN: null,
      utilityDelta: {
        value: 0.25,
        unit: 'state-of-art vs possible',
        source: 'most solutions untested at scale; strong WTP signal exists',
        confidence: 'low',
        asOf: TODAY,
      },
    },
    sources: [
      {
        title: 'US Surgeon General, Our Epidemic of Loneliness',
        url: 'https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf',
      },
      {
        title: 'WHO, Commission on Social Connection',
        url: 'https://www.who.int/groups/commission-on-social-connection',
      },
    ],
    asOf: TODAY,
  },
]

export const getProblemBySlug = (slug: string): Problem | undefined =>
  problems.find((p) => p.slug === slug)
