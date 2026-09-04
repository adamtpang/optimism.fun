export type ExistentialQuest = {
  title: string
  wedge: string
  proof: string
}

export type ExistentialRisk = {
  rank: number
  slug: 'ai-control' | 'engineered-pandemics' | 'nuclear-war' | 'planetary-catastrophe'
  name: string
  shortName: string
  mechanism: string
  evidenceState: string
  objective: string
  bottleneck: string
  quests: ExistentialQuest[]
  source: {
    label: string
    url: string
  }
}

/**
 * S-tier is a consequence class, not a percentile. A risk belongs here only
 * when there is a credible mechanism for human extinction or permanent loss
 * of civilization's future. Rank reflects present urgency, changing capability,
 * and tractable neglected defenses. It is not a fabricated probability estimate.
 */
export const existentialRisks: ExistentialRisk[] = [
  {
    rank: 1,
    slug: 'ai-control',
    name: 'Loss of control over advanced AI',
    shortName: 'AI control',
    mechanism:
      'Highly capable systems could evade oversight, acquire resources, resist shutdown, or give a small group irreversible power over everyone else.',
    evidenceState:
      'Current systems cannot cause loss of control. Relevant capabilities are improving, while the probability and timing of future loss of control remain deeply uncertain.',
    objective:
      'No system capable of defeating human oversight is deployed without demonstrated containment, independent evaluation, and a reliable path to shutdown.',
    bottleneck:
      'We can measure benchmark performance faster than we can measure deceptive behavior, long-horizon autonomy, situational awareness, and whether safeguards survive adversarial pressure.',
    quests: [
      {
        title: 'The control plane for AI agents',
        wedge:
          'A runtime permission, isolation, tripwire, and immutable-audit layer for agents operating computers, codebases, laboratories, or financial systems.',
        proof:
          'An evaluated agent cannot exceed a declared capability envelope without a logged, human-authorized escalation.',
      },
      {
        title: 'Independent frontier evaluations',
        wedge:
          'A technically credible third-party lab that tests autonomy, oversight evasion, cyber, and biological capabilities before deployment.',
        proof:
          'Major deployers and regulators use reproducible external evaluations as a real release gate.',
      },
      {
        title: 'Verifiable compute and model provenance',
        wedge:
          'Hardware-backed records showing which model ran, with what weights, permissions, tools, and compute budget.',
        proof:
          'Auditors can verify high-risk training and deployment claims without receiving model weights or private user data.',
      },
    ],
    source: {
      label: 'International AI Safety Report 2026',
      url: 'https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026',
    },
  },
  {
    rank: 2,
    slug: 'engineered-pandemics',
    name: 'Engineered or extreme pandemics',
    shortName: 'Pandemic defense',
    mechanism:
      'A highly transmissible pathogen can replicate, cross borders before symptoms appear, and attack people, food systems, or critical institutions everywhere at once.',
    evidenceState:
      'The last natural pandemic demonstrated global propagation. Genetic engineering, synthesis, and AI-enabled biological tools add misuse and accident pathways that require stronger defenses.',
    objective:
      'Detect any exponentially growing pathogen within days, contain it locally, and manufacture effective countermeasures at global scale before the first major wave.',
    bottleneck:
      'Surveillance is fragmented, synthesis screening is not universal, and vaccine design is much faster than regulated manufacturing and distribution.',
    quests: [
      {
        title: 'Pathogen-agnostic early warning',
        wedge:
          'Continuous metagenomic monitoring of wastewater, transport hubs, farms, and building air that alerts on unknown biological growth.',
        proof:
          'A novel pathogen is detected and localized before hospitals observe the first large clinical wave.',
      },
      {
        title: 'Universal nucleic-acid screening',
        wedge:
          'Privacy-preserving screening infrastructure for synthesis providers, benchtop devices, and high-risk biological design workflows.',
        proof:
          'Dangerous orders and design patterns are intercepted across participating providers without exposing legitimate customer sequences.',
      },
      {
        title: 'Days-not-months biomanufacturing',
        wedge:
          'Distributed, reconfigurable manufacturing with prevalidated processes for vaccines, diagnostics, and broad-spectrum countermeasures.',
        proof:
          'A validated countermeasure moves from pathogen sequence to globally meaningful production in weeks.',
      },
    ],
    source: {
      label: 'WHO laboratory biosecurity guidance',
      url: 'https://www.who.int/publications/i/item/9789240095113',
    },
  },
  {
    rank: 3,
    slug: 'nuclear-war',
    name: 'Nuclear escalation and nuclear winter',
    shortName: 'Nuclear stability',
    mechanism:
      'Warning errors, cyberattack, miscalculation, or war could escalate into mass detonations. Firestorms could then disrupt climate and collapse global food production.',
    evidenceState:
      'The extinction probability is uncertain, but modeled large-war scenarios produce civilization-scale famine. Existing arsenals make this an active hazard, not a future invention.',
    objective:
      'Prevent accidental or intentional escalation while making food, communications, energy, and knowledge resilient to abrupt global catastrophe.',
    bottleneck:
      'Nuclear decision systems are opaque and politically constrained, while most resilience planning assumes sunlight, trade, power, and normal agriculture continue.',
    quests: [
      {
        title: 'Verification without strategic exposure',
        wedge:
          'Sensors and cryptographic protocols that verify limits, dismantlement, and treaty compliance without revealing sensitive weapons data.',
        proof:
          'Adversarial states can verify a safety claim that neither side could previously trust.',
      },
      {
        title: 'Crisis communication that survives attack',
        wedge:
          'Authenticated, redundant communication and decision-support infrastructure designed to reduce false alarms and preserve de-escalation options.',
        proof:
          'Leaders retain a trusted communication path and independent warning checks during a severe cyber or infrastructure failure.',
      },
      {
        title: 'Food without normal sunlight',
        wedge:
          'Scalable foods based on fermentation, stored feedstocks, resilient crops, and industrial conversion processes that work after abrupt sunlight reduction.',
        proof:
          'A region can supply minimum nutrition for years without depending on normal harvests or global food trade.',
      },
    ],
    source: {
      label: 'Nature Food nuclear-winter model',
      url: 'https://www.nature.com/articles/s43016-022-00573-0',
    },
  },
  {
    rank: 4,
    slug: 'planetary-catastrophe',
    name: 'Single-planet catastrophic exposure',
    shortName: 'Civilization continuity',
    mechanism:
      'Asteroids, long-period comets, supervolcanoes, or an unknown global shock can destroy modern civilization while every human population and supply chain shares one planet.',
    evidenceState:
      'NASA has demonstrated asteroid deflection, but detection and response are incomplete. A self-sustaining second biosphere does not yet exist.',
    objective:
      'Detect and divert impactors, preserve an independent recovery capability on Earth, and ultimately maintain a self-sustaining human biosphere beyond Earth.',
    bottleneck:
      'Long-period objects can arrive with limited warning, continuity systems are rarely tested, and off-world settlements remain dependent on terrestrial resupply.',
    quests: [
      {
        title: 'Complete the impactor map',
        wedge:
          'Detection, orbit determination, and rapid characterization for hazardous asteroids and comets, including objects difficult to observe from Earth.',
        proof:
          'Every object above a defined damage threshold is found with enough warning time to mount a response.',
      },
      {
        title: 'Planetary defense as a repeatable capability',
        wedge:
          'Rapid-response launch, reconnaissance, and deflection systems that turn a successful demonstration into standing infrastructure.',
        proof:
          'Humanity can launch a characterized deflection mission inside the minimum warning window.',
      },
      {
        title: 'A tested civilization recovery stack',
        wedge:
          'Distributed energy, tools, seed and microbial libraries, manufacturing instructions, communications, and institutions designed for independent recovery.',
        proof:
          'A geographically isolated site can maintain essential industry and restore lost capabilities without functioning global supply chains.',
      },
    ],
    source: {
      label: 'NASA Planetary Defense',
      url: 'https://science.nasa.gov/planetary-defense/',
    },
  },
]

