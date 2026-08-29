// The Quest — the path from nobody to a company that matters.
//
// Rebuilt around a finding that reorganised the whole thing: the methods are
// already public. Eric Jorgenson published 69 of Musk's, free, in every
// bookshop. The Algorithm is on page 130. And there are not a million Musks.
//
// So information is not the binding constraint. Two things actually filter:
//   PERMISSION — method #2 is "it's possible for ordinary people to choose to
//     be extraordinary". That is a belief, not a technique, and almost nobody
//     grants it to themselves. It is Stage 0, and it used to be missing here.
//   SURVIVAL — most people who take the risk die in the middle and you never
//     hear their name. Stages 3 to 5 are about getting through that.
//
// Every stage therefore has a GATE: a falsifiable test you either passed or
// did not. A path without gates is a reading list.

export type QuestAnalogue = {
  founder: string
  company: string
  year: number
  moment: string
  lesson: string
}

/** A numbered maxim from The Book of Elon (Jorgenson), cited where it applies. */
export type QuestMethod = {
  n: number
  text: string
}

export type QuestStage = {
  stage: string // "00"
  key: string
  title: string
  tagline: string
  /**
   * The falsifiable test. Not "understand X" — something that either happened
   * or did not. This is the load-bearing field.
   */
  gate: string
  /** Why this stage exists, and what kills people here. */
  why: string
  moves: string[]
  methods: QuestMethod[]
  cta: { label: string; href: string }
  analogue: QuestAnalogue
}

export const QUEST_MISSION = {
  statement: 'Get a million people working on the problems that matter most.',
  /** The one-noun version, so it can be evangelised the way Mars is. */
  shorthand: 'a million people on good quests',
  why: 'Elon has Mars because Mars is a noun a child can point at, and that is why he can evangelise it for twenty years without the mission blurring. This is the same shape: countable, checkable, and the exact inverse of watching human potential go to waste.',
}

export const QUEST_INTRO = {
  kicker: 'The Quest',
  title: 'Six gates, not seven steps.',
  blurb:
    'The methods for building something enormous are public and free. Nobody is short of information. What people are short of is permission to begin, and the means to survive the middle. So this is not a reading list — every stage below ends in a test you either passed or you did not.',
}

export const QUEST_CLOSER = {
  title: 'The first one is you.',
  blurb:
    'A million people on good quests needs a first person on one. Musk’s mission was Mars, but his 2002 job was building a rocket that did not explode. Stage 0 is free, takes an afternoon, and almost nobody does it.',
  cta: { label: 'Find the gap →', href: '/underserved' },
}

export const questStages: QuestStage[] = [
  {
    stage: '00',
    key: 'permission',
    title: 'Give yourself permission',
    tagline: 'The constraint is not information. It is believing you are allowed.',
    gate: 'You have said out loud, in public, with your name on it, what you are attempting.',
    why: 'This stage is missing from almost every founder guide, which is one reason almost every founder guide fails to produce founders. The methods are free; the belief that you may use them is not. Saying it publicly is the cheapest possible version of commitment, and it is the one that makes the next five stages feel obligatory rather than optional.',
    moves: [
      'Write one sentence: the thing you are attempting, and why it matters.',
      'Publish it somewhere with your real name attached.',
      'Tell one person who will ask you about it in a month.',
      'Accept that the first version will be embarrassing. Publish anyway.',
    ],
    methods: [
      { n: 1, text: 'You are capable of more than you think.' },
      { n: 2, text: 'It is possible for ordinary people to choose to be extraordinary.' },
      { n: 13, text: 'Do not wait for the world to want it. If it should obviously exist, go build it.' },
      { n: 59, text: 'Fear of failure is the biggest cause of failure.' },
    ],
    cta: { label: 'Read the manifesto', href: '/manifesto' },
    analogue: {
      founder: 'Elon Musk',
      company: 'Zip2',
      year: 1995,
      moment:
        'Deferred a Stanford physics PhD after two days and started a company with no permission from anyone, no track record, and no capital.',
      lesson:
        'Nobody grants the permission. The credential you are waiting for does not arrive, and it was never the thing standing in your way.',
    },
  },
  {
    stage: '01',
    key: 'quest',
    title: 'Choose a problem worth your life',
    tagline: 'Enormous need, thin supply. Stand exactly there.',
    gate: 'You can state the problem, its size, and who is already working on it — with numbers, not adjectives.',
    why: 'Most wasted decades are not spent on unimportant problems. They are spent on important problems that forty well-funded teams already picked, discovered eighteen months in. Demand is easy to see, which is precisely why the head of the demand curve is the most crowded place on earth. The opportunity is the residual.',
    moves: [
      'Open the Questbook and list three problems you would be proud to work on for a decade.',
      'Score each for importance, founder fit, friends you can build with, and a first artifact you can ship.',
      'Choose one 30-day problem exploration.',
      'Write a one-page problem thesis with one concrete artifact due this week.',
      'Save the thesis in Obsidian and name the first build or research block.',
      'For the finalist, name the companies already building it and decide whether the field is a frontier or a graveyard.',
    ],
    methods: [
      { n: 8, text: 'A useful life is worth having lived.' },
      { n: 12, text: 'Work on what is just becoming possible.' },
      { n: 14, text: 'Build what no one else is building.' },
      { n: 9, text: 'Do not aspire to glory; aspire to work.' },
    ],
    cta: { label: 'Open the Questbook →', href: '/good-quests' },
    analogue: {
      founder: 'Elon Musk',
      company: 'SpaceX',
      year: 2002,
      moment:
        'Went looking for the cost of getting to Mars, found that nobody was attacking cost-to-orbit, and started there rather than at the rocket.',
      lesson:
        'He did not pick the exciting problem. He picked the one whose binding constraint nobody was touching.',
    },
  },
  {
    stage: '02',
    key: 'method',
    title: 'Acquire the method',
    tagline: 'Reason from physics, not from what everyone else is doing.',
    gate: 'You have run The Algorithm on something real and actually deleted a part you had already built.',
    why: 'The deletion is the test, because every other step of The Algorithm is comfortable. Questioning requirements feels like diligence; simplifying feels like craft. Deleting something you built and were proud of is the only step that costs ego — which is exactly why the order matters, and why most people skip straight to "automate".',
    moves: [
      'Take one thing you are building. List every requirement and name the person who set it.',
      'Delete the part you are least willing to lose. Add it back only if something breaks.',
      'Compute the idiot index: finished cost divided by raw material cost. Anything high is an opportunity.',
      'Ask the magic-wand question: what would the theoretically perfect version cost?',
    ],
    methods: [
      { n: 18, text: 'Reason from fundamentals, not from what others are doing.' },
      { n: 21, text: 'The Algorithm: question requirements, delete the part, simplify, accelerate, automate — in that order.' },
      { n: 20, text: 'Know the idiot index. Understand the cost of components.' },
      { n: 26, text: 'The best part is no part; the best process is no process.' },
      { n: 29, text: 'Overdelete and add back the absolutely necessary.' },
      { n: 24, text: 'All requirements should be treated as recommendations.' },
    ],
    cta: { label: 'The starter packs →', href: '/rfs/fall-2026' },
    analogue: {
      founder: 'Elon Musk',
      company: 'SpaceX',
      year: 2002,
      moment:
        'Priced a rocket by its raw materials — aluminium, titanium, copper, carbon fibre — and found the metal cost a small fraction of the launch price.',
      lesson:
        'First principles is not a mindset. It is an arithmetic operation you can perform this afternoon on the thing in front of you.',
    },
  },
  {
    stage: '03',
    key: 'proof',
    title: 'Get proof from a stranger',
    tagline: 'Friends will use anything you make. Strangers pay or they leave.',
    gate: 'Someone you do not know has used the thing, or paid for it.',
    why: 'This is where the survival filter begins. Everything before it is reversible and costs only time; here you find out whether the thing you reasoned your way to has any purchase on reality. The stranger requirement is not pedantry — the people who love you are not a market.',
    moves: [
      'Ship the smallest artifact that tests the riskiest assumption, not the fullest version of the idea.',
      'Put it in front of someone with no reason to be kind to you.',
      'Measure one thing: did they come back?',
      'If the answer is no, change the thing, not the audience.',
    ],
    methods: [
      { n: 16, text: 'Prototypes are proof.' },
      { n: 17, text: 'Start somewhere, question assumptions, and adapt to reality.' },
      { n: 46, text: 'Ask: is this effort resulting in a better product or service? If not, stop.' },
      { n: 58, text: 'Failure is essentially irrelevant unless it is catastrophic.' },
    ],
    cta: { label: 'The power rankings →', href: '/rankings' },
    analogue: {
      founder: 'Elon Musk',
      company: 'SpaceX',
      year: 2008,
      moment:
        'Falcon 1 reached orbit on the fourth attempt, with money for that attempt and no more.',
      lesson:
        'Three public failures were survivable. Not shipping would not have been. The proof arrived at the last possible moment, which is where it usually arrives.',
    },
  },
  {
    stage: '04',
    key: 'machine',
    title: 'Build the machine',
    tagline: 'Past a certain point, the factory is the product.',
    gate: 'Someone else can do the work without you in the room.',
    why: 'A founder who cannot leave the room has built a job, not a company, and a job does not compound. The work here is unglamorous: hiring, one number per team, and attacking whichever single constraint is setting the rate for everything else.',
    moves: [
      'Find the actual bottleneck. Not the annoying thing — the thing setting the rate.',
      'Give each part of the work one number that says whether it is winning.',
      'Hire for demonstrated ability rather than credentials, and go directly to the source of information.',
      'Remove yourself from one loop entirely and see what breaks.',
    ],
    methods: [
      { n: 34, text: 'Attack the bottleneck. One broken thing sets the overall rate.' },
      { n: 42, text: 'Money is not the constraint. Exceptional engineers are.' },
      { n: 37, text: 'Give teams one key metric to focus on.' },
      { n: 52, text: 'When hiring, look for evidence of exceptional ability.' },
      { n: 57, text: 'All bad news should be given loudly and often. Good news quietly and once.' },
    ],
    cta: { label: 'Who funds this →', href: '/capital' },
    analogue: {
      founder: 'Elon Musk',
      company: 'Tesla',
      year: 2018,
      moment:
        'Moved onto the production floor and treated the line itself as the thing being designed, not the car coming off it.',
      lesson:
        'Past a certain scale the product stops being the product. The rate at which you can make it becomes the product.',
    },
  },
  {
    stage: '05',
    key: 'double-down',
    title: 'Put the winnings back in',
    tagline: 'The signature move, and the one almost nobody makes.',
    gate: 'You have taken what the last thing earned and put it into the next one.',
    why: 'This is the most repeated pattern in his timeline and the least imitated. Zip2 into X.com. PayPal into Tesla and SpaceX simultaneously. Then 2008: the last of his net worth into Tesla while SpaceX had one launch left. Most people take one win and stop — a completely reasonable choice, and the exact point at which compounding ends.',
    moves: [
      'Decide in advance what fraction of any win goes back in. Deciding afterwards is deciding emotionally.',
      'Pick the next quest before you need to, using the same index you used the first time.',
      'Keep the survival floor separate and untouchable. Doubling down is not betting the rent.',
      'Say the next thing out loud in public. Stage 0, again.',
    ],
    methods: [
      { n: 61, text: 'Double down. Push your chips back in.' },
      { n: 65, text: 'When something is important enough, do it even if the odds are not in your favour.' },
      { n: 66, text: 'Do not ever give up. You would have to be dead or completely incapacitated.' },
      { n: 10, text: 'Take actions that increase the odds of the future being good.' },
    ],
    cta: { label: 'Back to the gap →', href: '/underserved' },
    analogue: {
      founder: 'Elon Musk',
      company: 'Tesla and SpaceX',
      year: 2008,
      moment:
        'Put the remainder of his net worth into Tesla in the same year Falcon 1 finally reached orbit, with both companies weeks from failing.',
      lesson:
        'The compounding is not in the win. It is in what you do with the win, and that decision gets made under maximum pressure with minimum information.',
    },
  },
]

export const questStageKeys = questStages.map((s) => s.key)
