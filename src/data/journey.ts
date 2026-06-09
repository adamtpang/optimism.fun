// The Quest — the gamified founder journey.
//
// optimism.fun maps demand (problems), maps supply (companies, capital, people),
// and finds the gaps. The Quest is the layer on top: it turns that map into a
// path a single human can walk, from "I want to do something that matters" to
// "I built the platonic-ideal company for this problem." Seven levels. Each one
// is a concrete move, a link into the tool on this site that helps you make it,
// and a historical analogue — a founder who stood exactly here and won, so you
// can copy the move instead of the outcome.

export type QuestAnalogue = {
  founder: string
  company: string
  year: number
  moment: string // what they did at this step
  lesson: string // the transferable principle
}

export type QuestLevel = {
  level: string // "01"
  key: string
  title: string
  tagline: string // one-line essence
  move: string // the core move
  steps: string[] // concrete actions for this level
  cta: { label: string; href: string }
  analogue: QuestAnalogue
}

export const QUEST_INTRO = {
  kicker: 'The Quest',
  title: 'Founder to history books.',
  blurb:
    'Most people never start because the distance from "I want to matter" to "I run the company that solved it" looks infinite. It is not infinite. It is seven moves. Each one has been made before, by someone who was, at the time, a nobody. Here is the path, the tool for each step, and the founder who already walked it.',
}

export const questLevels: QuestLevel[] = [
  {
    level: '01',
    key: 'choose',
    title: 'Choose a problem worth your life',
    tagline: 'Demand is high, supply is thin. Stand there.',
    move: 'Rank humanity’s problems by how much they matter and how fast they are getting worse, then pick the one where the demand is enormous and almost no one credible is working. That gap is your unfair advantage before you have written a line of code.',
    steps: [
      'Open the Radar and read the top of the ranking: importance × urgency.',
      'Find the high-demand, low-supply gaps — the problems with no obvious winner yet.',
      'Pick the one you would still care about if it took you thirty years.',
    ],
    cta: { label: 'Open the Radar', href: '/radar' },
    analogue: {
      founder: 'Elon Musk',
      company: 'SpaceX',
      year: 2002,
      moment:
        'After PayPal, he wrote down the problems that would most affect the future of humanity — sustainable energy, making life multiplanetary — and started on the one everyone said was impossible for a private citizen.',
      lesson: 'Pick from first principles by importance, not by what looks fundable this quarter.',
    },
  },
  {
    level: '02',
    key: 'shot',
    title: 'Call your shot',
    tagline: 'Turn the problem into a falsifiable bet.',
    move: 'A problem is not a company. Convert it into a Request for Startup: a specific, testable claim about a solution that does not exist yet. Write it down so clearly that you, and everyone you recruit, can tell whether it is working.',
    steps: [
      'Read the Requests for Startups for your problem — the open bets others have framed.',
      'Sharpen yours into one sentence: "We believe X is now possible because Y changed."',
      'State the milestone that would prove you right within eighteen months.',
    ],
    cta: { label: 'Read the Requests', href: '/rfs' },
    analogue: {
      founder: 'Stéphane Bancel',
      company: 'Moderna',
      year: 2010,
      moment:
        'Bet the entire company on mRNA as a programmable platform — a decade before COVID proved the thesis at planetary scale. They called the shot in public and built toward it.',
      lesson: 'Name the specific mechanism you are betting on. Vague missions cannot be falsified or funded.',
    },
  },
  {
    level: '03',
    key: 'study',
    title: 'Study the ones who did it',
    tagline: 'Copy the move, not the outcome.',
    move: 'Someone has already stood roughly where you stand and won. Find them. Reverse-engineer the early moves they made when they were still small and uncertain — not the victory-lap version. Their constraints rhyme with yours.',
    steps: [
      'Find the founder whose starting conditions most resemble yours.',
      'Map their first three moves, made before anyone believed them.',
      'Steal the principle behind each move; discard the parts that were luck or timing.',
    ],
    cta: { label: 'Study the founders', href: '/founders' },
    analogue: {
      founder: 'Patrick & John Collison',
      company: 'Stripe',
      year: 2010,
      moment:
        'They obsessed over a single friction — how absurdly hard it was to accept a payment online — and reduced it to seven lines of code, then hand-onboarded their first developers one by one.',
      lesson: 'Win a narrow thing completely before you try to win a broad thing at all.',
    },
  },
  {
    level: '04',
    key: 'capital',
    title: 'Raise from opinionated capital',
    tagline: 'Take money from believers, not tourists.',
    move: 'Most capital wants a safe multiple. You want the rare capital that wants the mission to exist whether or not it is comfortable. The right investor is contrarian, patient, and writes the check precisely when the consensus says you are crazy.',
    steps: [
      'See who already funds your problem — the firms and angels in the ecosystem.',
      'Target the ones whose thesis is the mission, not just the market size.',
      'Pitch the falsifiable bet from level 02; let it filter out the tourists.',
    ],
    cta: { label: 'See who funds it', href: '/ecosystem' },
    analogue: {
      founder: 'Peter Thiel',
      company: 'Founders Fund → SpaceX',
      year: 2008,
      moment:
        'After three SpaceX launches failed and the company was nearly bankrupt, Founders Fund led a round almost no one else would touch. The fourth launch reached orbit weeks later.',
      lesson: 'The best money arrives at the moment of maximum doubt. Court the investors who run toward it.',
    },
  },
  {
    level: '05',
    key: 'spec',
    title: 'Write the spec',
    tagline: 'Make the future legible. Recruit believers.',
    move: 'Publish the whitepaper: the document that makes an impossible-sounding future concrete enough that smart people quit their jobs to help you build it. The spec is your highest-leverage recruiting and credibility tool.',
    steps: [
      'Read the existing whitepapers as templates for rigor and tone.',
      'Write the version that a brilliant skeptic could not easily dismiss.',
      'Publish it openly. Let it pull talent and allies toward you.',
    ],
    cta: { label: 'Read the whitepapers', href: '/whitepapers' },
    analogue: {
      founder: 'Satoshi Nakamoto',
      company: 'Bitcoin',
      year: 2008,
      moment:
        'A nine-page whitepaper, posted to a mailing list, specified a working solution to a problem cryptographers had circled for decades — and spawned an entire industry from a PDF.',
      lesson: 'A precise, public spec out-recruits any pitch deck. Write the thing that makes the future undeniable.',
    },
  },
  {
    level: '06',
    key: 'ship',
    title: 'Ship, measure, compound',
    tagline: 'One real metric. Reinvest for a decade.',
    move: 'Get the first version into real hands. Pick the single number that actually proves you are helping, ignore the vanity metrics, and reinvest every gain back into the loop. Compounding is the only superpower that is fully under your control.',
    steps: [
      'Ship the smallest version that delivers the real thing, not a demo.',
      'Choose the one metric that means you are genuinely winning.',
      'Reinvest relentlessly; let the loop compound for far longer than feels reasonable.',
    ],
    cta: { label: 'Track the progress', href: '/progress' },
    analogue: {
      founder: 'Jeff Bezos',
      company: 'Amazon',
      year: 1997,
      moment:
        'In his first shareholder letter he declared "It’s all about the long term," optimized obsessively for customers over reported profit, and reinvested for decades while critics called it irrational.',
      lesson: 'Optimize the one metric that compounds, and defend your time horizon against everyone who wants it shorter.',
    },
  },
  {
    level: '07',
    key: 'ideal',
    title: 'Build for the history books',
    tagline: 'The platonic ideal of the company for this problem.',
    move: 'Do not sell early. Most great companies are sold at the moment they are about to become essential. Keep building until you are the company the future quietly runs on — the default answer to the problem you chose at level 01.',
    steps: [
      'Refuse the early acquisition that ends the mission for a payout.',
      'Reinvest into becoming infrastructure: the thing others build on top of.',
      'Compound for the decades it takes to become inevitable.',
    ],
    cta: { label: 'Read the manifesto', href: '/manifesto' },
    analogue: {
      founder: 'Morris Chang',
      company: 'TSMC',
      year: 1987,
      moment:
        'At 55, he founded a pure-play chip foundry on a thesis everyone doubted. Decades later, the entire modern world — every phone, car, and AI model — runs on what that company makes.',
      lesson: 'The platonic-ideal company is built over thirty years, not three. Patience is the final, rarest move.',
    },
  },
]

export const QUEST_CLOSER = {
  title: 'You are one of the next million.',
  blurb:
    'The path is not a secret and it is not luck. It is seven moves, each one already proven by someone who started with nothing but a problem they refused to ignore. The map is on this site. Pick your problem and take the first step.',
}
