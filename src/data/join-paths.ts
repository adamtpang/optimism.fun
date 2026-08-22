/**
 * Join paths — the other half of every starter pack.
 *
 * starter-packs.ts answers "how do I START this company." This file answers
 * "who do I JOIN instead, and how do I get in." Both are legitimate ways onto
 * an S-tier mission; the index has always quietly assumed a founder.
 *
 * The routing rule, and the reason this file exists: **crowding flips a quest
 * from start to join.** A quest with N=8 real, funded competitors is not a dead
 * quest, it is one where the correct move is to join one of the eight rather
 * than become the ninth. quest-crowding.ts already holds that number. Read
 * together: low N means start (starter-packs.ts), high N means join (this
 * file). Neither is a consolation prize for the other.
 *
 * Keyed by problemSlug rather than questSlug on purpose: joining is a
 * problem-level decision. The fusion companies are the clearest case — they are
 * the highest-ceiling employers on the energy-abundance problem, and there is
 * no fusion *quest* in rfs.ts because founding a fusion company solo is not a
 * real option. A questSlug key would have hidden them entirely.
 *
 * Honesty rules, same as everywhere else in this repo:
 *  - Every valuation is real, sourced, and dated. No estimates dressed as facts.
 *  - `softwareBridge` names a role CATEGORY the company demonstrably needs given
 *    what it publicly builds. It is NOT a claim that a specific req is open
 *    today; live openings must be checked at the company's own careers page.
 *  - `ceiling` is a judgement, not a forecast, and it is the same test applied
 *    in S_TIER_TIMELINE.md: does this company sit on a $1T+ in-limit problem AND
 *    plausibly capture enough of it alone.
 */

/** Could this company plausibly reach $1T, on the test used in S_TIER_TIMELINE.md? */
export type Ceiling =
  /** Sits on a $1T+ in-limit problem and could plausibly capture it alone. */
  | 'trillion-shaped'
  /** A real, large outcome, but not a plausible $1T on current shape. */
  | 'large'
  /** Component or service economics — valuable, structurally capped well below $1T. */
  | 'component'

export type JoinTarget = {
  company: string
  url: string
  /** Real, dated, sourced. */
  stage: string
  ceiling: Ceiling
  /** Why this company specifically, not the category. */
  whyThisOne: string
  /** How a software-shaped person gets in at a hardware company. Role CATEGORY, not a live req. */
  softwareBridge: string
  source: string
  sourceUrl: string
}

export type JoinPath = {
  problemSlug: string
  /** Why joining beats founding on this problem right now. Must cite real crowding. */
  whyJoinNotStart: string
  targets: JoinTarget[]
  /** The portfolio artifact that earns a reply without a warm introduction. */
  provingArtifact: string
  /** The approach angle, given no existing network inside the industry. */
  outreachAngle: string
}

export const joinPaths: JoinPath[] = [
  {
    problemSlug: 'energy-abundance',
    whyJoinNotStart:
      'Three of the four energy-abundance quests are crowded or contested by real venture-backed companies (geothermal N=8, storage N=5, interconnection N=4), and the highest-ceiling play on this problem, fusion, has no quest at all because founding a fusion company solo is not a real option. Energy abundance carries a $2T in-limit cap anchored to Saudi Aramco. If any problem on this board produces the next Aramco-scale company, it is this one, and the way in is employment, not incorporation.',
    targets: [
      {
        company: 'Helion Energy',
        url: 'https://www.helionenergy.com',
        stage: '$15.5B, Series G, Jun 4 2026',
        ceiling: 'trillion-shaped',
        whyThisOne:
          'The only fusion company with a signed commercial power-purchase agreement with a hyperscaler (Microsoft), which converts fusion from a science project into a delivery obligation with a date attached. Highest ceiling on the board: a working reactor makes the operator an energy supermajor.',
        softwareBridge:
          'Pulsed-power fusion is a control and diagnostics problem as much as a plasma problem. Magnet timing, real-time pulse control, shot-to-shot data pipelines, and simulation tooling are all software. The most plausible non-physicist entry on this list.',
        source: 'GeekWire, Helion hits $15.5B valuation with $465M in new cash',
        sourceUrl:
          'https://www.geekwire.com/2026/helion-hits-15-5b-valuation-with-465m-in-new-cash-to-commercialize-fusion-this-decade/',
      },
      {
        company: 'Commonwealth Fusion Systems',
        url: 'https://cfs.energy',
        stage: '~$4B total capital raised (one outlet reports $6.85B, unresolved), Jul 30 2026',
        ceiling: 'trillion-shaped',
        whyThisOne:
          'The most-capitalised fusion company in the world, with the clearest physics milestone path (SPARC net energy, then ARC). Same trillion-shaped ceiling as Helion via a different technical bet, which is the argument for treating fusion as a two-horse portfolio rather than picking one.',
        softwareBridge:
          'Tokamak operation is a real-time control problem with a heavy simulation and ML component; plasma disruption prediction is an active published ML field. Magnet manufacturing at scale also needs ordinary industrial data infrastructure.',
        source: 'Commonwealth Fusion Systems, raises another $1B, total capital to $4B',
        sourceUrl:
          'https://cfs.energy/news-and-media/commonwealth-fusion-systems-raises-another-1-billion-bringing-total-capital-raised-to-4-billion/',
      },
      {
        company: 'Fervo Energy',
        url: 'https://fervoenergy.com',
        stage: '$10B, IPO May 14 2026, now public (FRVO)',
        ceiling: 'large',
        whyThisOne:
          'The lowest-technical-risk entry here and the only one already selling firm clean power under real PPAs to data centers. Not trillion-shaped, since geothermal caps out at utility economics, but a revenue-generating company today rather than a bet on physics.',
        softwareBridge:
          "Fervo's actual edge is treating geothermal wells like oilfield assets: subsurface modelling, drilling optimisation, and fleet-level dispatch against power prices are all software problems it demonstrably runs on.",
        source: 'Fortune, Fervo clean energy biggest IPO, $10B valuation',
        sourceUrl:
          'https://fortune.com/2026/05/14/fervo-clean-energy-biggest-ipo-10b-valuation-powered-earths-heat-ai-hunger/',
      },
      {
        company: 'Oklo',
        url: 'https://oklo.com',
        stage: '$7.9B market cap, public (OKLO), Aug 19 2026',
        ceiling: 'large',
        whyThisOne:
          'Publicly traded, so the join decision comes with fully disclosed financials, a genuinely different risk profile from the private fusion bets. Regulatory-gated rather than physics-gated, which makes the timeline risk legible in a way fusion is not.',
        softwareBridge:
          'The licensing bottleneck this company lives inside is the same one the fission-permitting-unlock quest targets. Regulatory-data and safety-case tooling is software, and building it inside an applicant is the fastest way to learn whether the standalone version is a real business.',
        source: 'stockanalysis.com, Oklo market cap',
        sourceUrl: 'https://stockanalysis.com/stocks/oklo/market-cap/',
      },
      {
        company: 'Form Energy',
        url: 'https://formenergy.com',
        stage: '~$3B estimated, Series G Aug 12 2026 (valuation undisclosed)',
        ceiling: 'component',
        whyThisOne:
          'The leader of the hundred-hour-storage quest (N=5 crowded), included with an honest flag: iron-air storage is component economics selling into utility procurement. A good company, structurally not a $1T one.',
        softwareBridge:
          'Storage dispatch optimisation and cell-level manufacturing analytics. Real software work at a company whose ceiling is real but bounded.',
        source: 'Form Energy, $750M Series G financing',
        sourceUrl: 'https://formenergy.com/form-energy-secures-750m-in-series-g-financing/',
      },
    ],
    provingArtifact:
      "A public, working simulation or control artifact against real published data: a plasma-disruption predictor on a public tokamak dataset, or a battery-dispatch optimiser on real ERCOT price series. This repo's own kin project megawatt.fun is already the second of those. A working artifact against real data outperforms a resume at every company here, because all five are engineering-led and none can evaluate a generalist claim.",
    outreachAngle:
      'Skip the careers page as a first move. Find the specific engineer who published the paper or gave the talk on the subsystem your artifact touches, and send it to them with one honest question about a real limitation you hit. This is a technical-credibility industry with almost no cold-inbound pipeline, which cuts both ways: no warm introduction available, but almost no competition on a genuinely good artifact.',
  },
  {
    problemSlug: 'ai-datacenter-power',
    whyJoinNotStart:
      'This entry exists because a 2026-08-22 adversarial pressure-test overturned this repo\'s own earlier data. datacenter-power-smoothing was recorded at N=0 open; it is actually N=5 crowded. NVIDIA now solves millisecond smoothing inside the rack (GB300 capacitor shelves, and a GB200 power-smoothing firmware feature co-developed with Microsoft), hyperscalers build their own workload-side control and publish it, and BESS vendors own the sub-second converter loop. The orchestration seat above that was taken by a company that raised $68M in 16 months. Founding here means arriving last with no firmware, no telemetry, and no utility relationships.',
    targets: [
      {
        company: 'Emerald AI',
        url: 'https://www.emeraldai.dev',
        stage: '$68M raised in 16 months (founded 2024); NVIDIA NVentures, Eaton, GE Vernova, Siemens, Samsung, Salesforce, EIP, IQT',
        ceiling: 'large',
        whyThisOne:
          "The existence proof that pure orchestration software, owning no batteries, is a real venture-scale business: deployed at NVIDIA's own 96MW Aurora datacenter, backed by NVIDIA's own fund. It is also the company that occupies the exact seat a new entrant would target, which is precisely why joining beats founding against it.",
        softwareBridge:
          'The entire product is software. This is the rare company on this whole file where a software-shaped person is the core hire rather than a bridge case, and where the real moat is regulatory credibility and utility relationships rather than control theory.',
        source: 'DCD, NVIDIA-backed Emerald AI raises $24.5M to turn data centers into grid assets',
        sourceUrl:
          'https://www.datacenterdynamics.com/en/news/nvidia-backed-emerald-ai-raises-245m-to-turn-data-centers-into-grid-assets/',
      },
    ],
    provingArtifact:
      'A workload-shaping simulator that takes a real published GPU power trace and shows how much grid-facing peak a given dispatch policy actually removes, with the limits of the approach stated honestly. Meta published the phenomenon in the Llama 3 paper and Microsoft, OpenAI, and NVIDIA published the joint stabilization paper (arXiv 2508.14318), so the source material is real and public.',
    outreachAngle:
      'Frame the work around interconnection queue time, not physics. The pressure-test finding was that the buyer\'s real pain is getting a grid connection approved by proving controllable load, which makes the customer the developer and the utility rather than the GPU operator. Anyone who can speak precisely to that is talking about the actual bottleneck.',
  },
  {
    problemSlug: 'scientific-productivity',
    whyJoinNotStart:
      'A split verdict, and the only problem on the board where start and join are both live. autonomous-lab is N=9 crowded and should be joined, not founded. But replication-layer (N=4) and fast-grants-as-a-product (N=3) are contested only by nonprofits, academic consortia, and government programs, with no venture-backed company racing for either. Those two remain genuine starts; see starter-packs.ts for the founding side.',
    targets: [
      {
        company: 'Ginkgo Bioworks',
        url: 'https://www.ginkgobioworks.com',
        stage: 'Public (DNA), the largest operating autonomous-lab platform',
        ceiling: 'large',
        whyThisOne:
          "The most built-out version of the autonomous-lab quest that exists. Joining is how you learn whether the automated-science thesis holds at scale, using someone else's capital to run the experiment.",
        softwareBridge:
          'A cloud lab is structurally a software company with wet-lab peripherals: scheduling, protocol compilation, and experiment-data infrastructure are the core product surface.',
        source: 'Sourced as a competitor on the autonomous-lab quest, src/data/quest-crowding.ts',
        sourceUrl: 'https://www.ginkgobioworks.com',
      },
      {
        company: 'Emerald Cloud Lab',
        url: 'https://www.emeraldcloudlab.com',
        stage: 'Private, remote-operated cloud laboratory',
        ceiling: 'component',
        whyThisOne:
          'The purest expression of the thesis, a lab operated entirely through an API, and therefore the fastest place to find out whether researchers actually change behaviour when the friction is removed. That is the assumption the whole quest rests on.',
        softwareBridge:
          'The entire customer-facing product is a programming interface to physical experiments. Almost all of the work is software.',
        source: 'Sourced as a competitor on the autonomous-lab quest, src/data/quest-crowding.ts',
        sourceUrl: 'https://www.emeraldcloudlab.com',
      },
    ],
    provingArtifact:
      'Take one published protocol from a real paper, write the machine-executable version of it, and document precisely where the paper is too ambiguous to execute. That gap list is the actual product insight behind both the autonomous-lab and replication-layer quests, and almost nobody outside these companies has written it down.',
    outreachAngle:
      'This field publishes heavily and argues in public. The gap list above is a blog post, and the post is the outreach. Metascience and lab-automation people respond to a specific correct technical observation far more reliably than to an application.',
  },
  {
    problemSlug: 'longevity',
    whyJoinNotStart:
      "Both longevity quests are crowded on this site's own sourced data, aging-as-an-indication at N=5 and healthspan-diagnostic at N=9, and the problem carries the largest in-limit cap on the board at $3T. That combination is the definition of a join: the prize is the biggest available and the field is already dense with funded, technically credible teams.",
    targets: [
      {
        company: 'Function Health',
        url: 'https://www.functionhealth.com',
        stage: 'Private, consumer longitudinal diagnostics at scale',
        ceiling: 'large',
        whyThisOne:
          'Furthest along on the actual bottleneck of the healthspan-diagnostic quest, which is not the assay but consumer distribution and repeat testing. Whoever wins that owns the measurement layer the rest of the field needs.',
        softwareBridge:
          'The product is a data and interpretation layer over commodity lab panels. Longitudinal biomarker interpretation is a modelling problem, not a bench problem.',
        source: 'Sourced as a competitor on the healthspan-diagnostic quest, src/data/quest-crowding.ts',
        sourceUrl: 'https://www.functionhealth.com',
      },
      {
        company: 'Life Biosciences',
        url: 'https://www.lifebiosciences.com',
        stage: 'Private, clinical-stage epigenetic reprogramming',
        ceiling: 'large',
        whyThisOne:
          'One of the few companies actually pushing toward the regulatory frontier the aging-as-an-indication quest describes, rather than selling diagnostics around it. The regulatory unlock is the real prize on this problem and very few teams are attempting it.',
        softwareBridge:
          'Narrower than the others here, and worth saying plainly: this is a biology-led company. The honest software entry is clinical-data and biomarker-endpoint infrastructure, not a general engineering role.',
        source: 'Sourced as a competitor on the aging-as-an-indication quest, src/data/quest-crowding.ts',
        sourceUrl: 'https://www.lifebiosciences.com',
      },
    ],
    provingArtifact:
      'A reproducible analysis of a public aging-biomarker dataset testing whether a published clock actually tracks an intervention, with the negative result reported honestly if that is what the data shows. The field is full of clocks with weak longitudinal validation, and demonstrating you will publish a null result is itself a differentiator.',
    outreachAngle:
      'Longevity has an unusually open public-intellectual layer (Impetus Grants, the Biomarkers of Aging Consortium, active researchers posting publicly). A rigorous public analysis reaches the people who hire far faster than an application does.',
  },
  {
    problemSlug: 'climate-change',
    whyJoinNotStart:
      'A genuine split. geologic-hydrogen-flow-engineering is N=6 crowded and should be joined. dumpsite-methane-capture is N=1 and remains the single most open quest on the entire board; see starter-packs.ts, not this file, for that one.',
    targets: [
      {
        company: 'Koloma',
        url: 'https://koloma.com',
        stage: 'Private, Breakthrough Energy Ventures and Amazon Climate Pledge Fund backed',
        ceiling: 'large',
        whyThisOne:
          'The best-capitalised company in geologic hydrogen, the newest genuinely large energy category to appear in decades. Early enough that joining still carries meaningful equity, funded enough that it will survive long enough to find out whether the resource is commercial.',
        softwareBridge:
          'Finding natural hydrogen is a subsurface-inference problem: geological data modelling and exploration targeting, the same skill set Fervo applies on the geothermal side.',
        source: 'Sourced on the geologic-hydrogen-flow-engineering quest, src/data/quest-crowding.ts',
        sourceUrl: 'https://koloma.com',
      },
    ],
    provingArtifact:
      'A subsurface-prospectivity model built on public geological survey data, published with its own uncertainty stated honestly. Exploration companies hire on demonstrated inference judgement, and public geological data is genuinely available.',
    outreachAngle:
      'Geologic hydrogen is small enough that the serious people all know each other and read the same handful of papers. A credible public model is a direct route to a conversation with any of them.',
  },
]

const byProblem = new Map(joinPaths.map((j) => [j.problemSlug, j]))

/** The join path for a problem, or null where founding is still the right move. */
export function getJoinPath(problemSlug: string): JoinPath | null {
  return byProblem.get(problemSlug) ?? null
}

/** Every company on the board judged plausibly capable of reaching $1T. */
export function trillionShapedTargets(): { problemSlug: string; target: JoinTarget }[] {
  return joinPaths.flatMap((j) =>
    j.targets
      .filter((t) => t.ceiling === 'trillion-shaped')
      .map((target) => ({ problemSlug: j.problemSlug, target })),
  )
}
