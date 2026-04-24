import type { Voice } from './types'

const TODAY = '2026-04-24'

export const voices: Voice[] = [
  {
    slug: 'david-deutsch',
    name: 'David Deutsch',
    role: 'Physicist & Philosopher',
    org: 'Oxford',
    url: 'https://www.daviddeutsch.org.uk',
    bio: 'Quantum-computing pioneer and founder of critical rationalism as applied to the theory of knowledge. Argues that problems are soluble and knowledge grows without limit through conjecture and refutation.',
    writings: [
      {
        title: 'The Beginning of Infinity',
        url: 'https://www.amazon.com/Beginning-Infinity-Explanations-Transform-World/dp/0143121359',
      },
      {
        title: 'The Fabric of Reality',
        url: 'https://www.amazon.com/Fabric-Reality-Parallel-Universes-Implications/dp/014027541X',
      },
    ],
    positions: [
      {
        problemSlug: 'ai-safety',
        stance:
          'AI safety is a knowledge problem, not a limit problem. Aligned AGI is achievable through better explanations, not through halting development.',
        quote:
          'All evils are caused by insufficient knowledge. Problems are inevitable. Problems are soluble.',
        source: 'The Beginning of Infinity, chapter 1',
        sourceUrl:
          'https://www.amazon.com/Beginning-Infinity-Explanations-Transform-World/dp/0143121359',
        asOf: TODAY,
      },
      {
        problemSlug: 'pedagogy',
        stance:
          'Bad explanations waste billions of childhood hours. Good explanations compound across generations. Pedagogy is an epistemology problem.',
        source: 'The Beginning of Infinity, chapter on bad philosophy',
        asOf: TODAY,
      },
      {
        problemSlug: 'scientific-productivity',
        stance:
          'Progress depends on the unhindered creation of good explanations. Institutions that reward criticism outperform those that reward consensus.',
        source: 'The Beginning of Infinity, multiple chapters',
        asOf: TODAY,
      },
    ],
  },
  {
    slug: 'elon-musk',
    name: 'Elon Musk',
    role: 'Engineer & Founder',
    org: 'SpaceX, Tesla, Neuralink, xAI',
    url: 'https://x.com/elonmusk',
    bio: 'Serial hard-tech founder. Has explicitly framed his career around the problems he considers civilizationally important: sustainable energy, multi-planetary life, AI safety, and neural interfaces.',
    writings: [
      {
        title: 'Master Plan Part 3 (Tesla, 2023)',
        url: 'https://www.tesla.com/blog/master-plan-part-3',
      },
      {
        title: 'Making Humans a Multiplanetary Species (2017)',
        url: 'https://www.liebertpub.com/doi/10.1089/space.2017.29009.emu',
      },
    ],
    positions: [
      {
        problemSlug: 'energy-abundance',
        stance:
          'The entire Tesla Master Plan is a bet that a sustainable-energy economy is both necessary and engineering-tractable. Solar + batteries + electrification is the physics-possible path.',
        quote:
          'Earth will run on sustainable energy, sooner with Tesla, later without.',
        source: 'Tesla Master Plan Part 3 (April 2023)',
        sourceUrl: 'https://www.tesla.com/blog/master-plan-part-3',
        asOf: TODAY,
      },
      {
        problemSlug: 'fertility-decline',
        stance:
          'Population collapse from low birth rates is a larger civilizational risk than most mainstream X-risk. Has stated this repeatedly across years.',
        quote:
          'Population collapse due to low birth rates is a much bigger risk to civilization than global warming.',
        source: 'Public statements, 2022-2024',
        asOf: TODAY,
      },
      {
        problemSlug: 'ai-safety',
        stance:
          'Co-founded OpenAI originally because of concerns about unaligned AI. Has continued to treat AI alignment as an existential priority.',
        source: 'OpenAI founding announcement (2015); subsequent public statements',
        asOf: TODAY,
      },
      {
        problemSlug: 'scientific-productivity',
        stance:
          'First-principles reasoning beats reasoning by analogy. Most industries are throttled by process, not physics. The idiot-index gap is where opportunities live.',
        source: 'Public interviews; Walter Isaacson biography (2023)',
        asOf: TODAY,
      },
      {
        problemSlug: 'longevity',
        stance:
          'Neuralink targets brain and spinal-cord disease as near-term deliverables with long-term implications for human-AI symbiosis and healthspan.',
        source: 'Neuralink public updates',
        sourceUrl: 'https://neuralink.com/',
        asOf: TODAY,
      },
    ],
  },
  {
    slug: 'patrick-collison',
    name: 'Patrick Collison',
    role: 'Co-founder & CEO, Stripe',
    org: 'Stripe',
    url: 'https://patrickcollison.com',
    bio: 'Co-founder of Stripe. Co-originated "progress studies" as a field with Tyler Cowen. Funded Fast Grants during COVID. Publishes an exceptional reading list and a running page of open questions about the world.',
    writings: [
      {
        title: 'We Need a New Science of Progress (with Tyler Cowen, The Atlantic, 2019)',
        url: 'https://www.theatlantic.com/science/archive/2019/07/we-need-new-science-progress/594946/',
      },
      {
        title: 'Fast',
        url: 'https://patrickcollison.com/fast',
      },
      {
        title: 'Questions',
        url: 'https://patrickcollison.com/questions',
      },
    ],
    positions: [
      {
        problemSlug: 'scientific-productivity',
        stance:
          'Research productivity has been falling for decades and we under-study the process of progress itself. Metascience and institution design matter as much as any single discovery.',
        quote:
          'Progress itself is understudied. By "progress," we mean the combination of economic, technological, scientific, cultural, and organizational advancement that has transformed our lives and raised standards of living over the past couple of centuries.',
        source: 'We Need a New Science of Progress (Atlantic, July 2019)',
        sourceUrl:
          'https://www.theatlantic.com/science/archive/2019/07/we-need-new-science-progress/594946/',
        asOf: TODAY,
      },
      {
        problemSlug: 'housing-construction',
        stance:
          'Housing policy and construction cost are major drags on productivity and opportunity. Reforming them unlocks downstream gains in almost every quest.',
        source: 'patrickcollison.com/advice and published interviews',
        sourceUrl: 'https://patrickcollison.com/advice',
        asOf: TODAY,
      },
      {
        problemSlug: 'pedagogy',
        stance:
          'Asks whether we can dramatically improve the quality and speed of learning. Cites tutoring and personalized instruction as high-leverage unsolved problems.',
        source: 'patrickcollison.com/questions',
        sourceUrl: 'https://patrickcollison.com/questions',
        asOf: TODAY,
      },
      {
        problemSlug: 'biosecurity',
        stance:
          'Funded Fast Grants during COVID to demonstrate that biomedical research can move at wartime speed when the structure allows it.',
        source: 'Fast Grants and Fast',
        sourceUrl: 'https://fastgrants.org',
        asOf: TODAY,
      },
    ],
  },
  {
    slug: 'jason-crawford',
    name: 'Jason Crawford',
    role: 'Founder',
    org: 'Roots of Progress',
    url: 'https://rootsofprogress.org',
    bio: 'Writer and founder of The Roots of Progress Institute. Building the intellectual foundation for a new philosophy of progress. Coined "techno-humanism" as a third way between safetyism and reckless acceleration.',
    writings: [
      {
        title: 'Neither EA nor e/acc is what humanity needs right now',
        url: 'https://blog.rootsofprogress.org/neither-ea-nor-e-acc',
      },
      {
        title: 'The Techno-Humanist Manifesto',
        url: 'https://rootsofprogress.org/techno-humanism',
      },
      {
        title: 'Roots of Progress blog',
        url: 'https://rootsofprogress.org',
      },
    ],
    positions: [
      {
        problemSlug: 'energy-abundance',
        stance:
          'Nuclear, fusion, and solar abundance are the central infrastructure quests. Safety is an engineering achievement of progress, not a brake on it.',
        source: 'Roots of Progress essays on nuclear and fusion',
        sourceUrl: 'https://rootsofprogress.org',
        asOf: TODAY,
      },
      {
        problemSlug: 'housing-construction',
        stance:
          'Housing affordability is a solvable problem of permitting, construction productivity, and policy. Progress narratives must include material abundance.',
        source: 'Roots of Progress essays',
        sourceUrl: 'https://rootsofprogress.org',
        asOf: TODAY,
      },
      {
        problemSlug: 'scientific-productivity',
        stance:
          'We need a new philosophy of progress that makes technological and scientific advancement a positive cultural project again, not something to apologize for.',
        source: 'The Techno-Humanist Manifesto',
        sourceUrl: 'https://rootsofprogress.org/techno-humanism',
        asOf: TODAY,
      },
      {
        problemSlug: 'longevity',
        stance:
          'Extending healthy human life is a core progress goal. Curing aging is as legitimate a target as curing any single disease.',
        source: 'Roots of Progress blog',
        sourceUrl: 'https://rootsofprogress.org',
        asOf: TODAY,
      },
      {
        problemSlug: 'pedagogy',
        stance:
          'Education quality is the compounding lever. Progress requires transmitting knowledge at higher fidelity and lower cost to each successive generation.',
        source: 'Roots of Progress essays',
        sourceUrl: 'https://rootsofprogress.org',
        asOf: TODAY,
      },
    ],
  },
  {
    slug: 'tyler-cowen',
    name: 'Tyler Cowen',
    role: 'Economist & Writer',
    org: 'George Mason, Emergent Ventures',
    url: 'https://marginalrevolution.com',
    bio: 'Economist at George Mason, director of Emergent Ventures, co-originator of progress studies with Patrick Collison. Author of The Great Stagnation and Talent. Prolific blogger at Marginal Revolution.',
    writings: [
      {
        title: 'We Need a New Science of Progress (with Patrick Collison, 2019)',
        url: 'https://www.theatlantic.com/science/archive/2019/07/we-need-new-science-progress/594946/',
      },
      {
        title: 'The Great Stagnation',
        url: 'https://www.amazon.com/Great-Stagnation-Low-Hanging-Eventually-Eventually/dp/0525952713',
      },
      {
        title: 'Talent (with Daniel Gross)',
        url: 'https://www.amazon.com/Talent-Identify-Energizers-Creatives-Winners/dp/1250275814',
      },
      {
        title: 'Marginal Revolution',
        url: 'https://marginalrevolution.com',
      },
    ],
    positions: [
      {
        problemSlug: 'scientific-productivity',
        stance:
          'The Great Stagnation thesis: since roughly 1973 the low-hanging fruit of science and industry has been picked. Restoring the innovation engine is the meta-problem.',
        source: 'The Great Stagnation (2011)',
        asOf: TODAY,
      },
      {
        problemSlug: 'fertility-decline',
        stance:
          'Demographic stagnation and complacency are under-discussed civilizational risks. Cultural risk aversion compounds into stagnation.',
        source: 'The Complacent Class (2017)',
        asOf: TODAY,
      },
      {
        problemSlug: 'pedagogy',
        stance:
          'Finding and developing talent is an underrated problem. Most selection is bad, most mentorship is worse, and the tails of ability are where civilizational value compounds.',
        source: 'Talent (with Daniel Gross, 2022)',
        asOf: TODAY,
      },
      {
        problemSlug: 'ai-safety',
        stance:
          'Emergent Ventures has funded AI-safety projects and unconventional alignment researchers under the "fast grants" model.',
        source: 'Emergent Ventures grant cohorts',
        sourceUrl: 'https://www.mercatus.org/emergent-ventures',
        asOf: TODAY,
      },
    ],
  },
  {
    slug: 'trae-stephens',
    name: 'Trae Stephens',
    role: 'Partner & Co-founder',
    org: 'Founders Fund, Anduril',
    url: 'https://foundersfund.com',
    bio: 'Partner at Founders Fund. Co-founder and executive chairman of Anduril. Co-author (with Markie Wagner) of "Choose Good Quests," the essay that named the "hard / good" quadrant of quests humanity structurally underfunds.',
    writings: [
      {
        title: 'Choose Good Quests (with Markie Wagner, 2023)',
        url: 'https://traestephens.substack.com/p/choose-good-quests',
      },
    ],
    positions: [
      {
        problemSlug: 'energy-abundance',
        stance:
          "Energy abundance, specifically fusion, geothermal, and next-gen fission, is a canonical hard/good quest that markets structurally underfund.",
        quote:
          'A good quest makes the future better than our world today. A bad quest doesn\u2019t improve the world much at all, or makes it worse.',
        source: 'Choose Good Quests (Founders Fund / Pirate Wires, 2023)',
        sourceUrl: 'https://traestephens.substack.com/p/choose-good-quests',
        asOf: TODAY,
      },
      {
        problemSlug: 'biosecurity',
        stance:
          'Bio-manufacturing and biosecurity are named hard-quest categories in the Founders Fund thesis and deserve high-agency builders.',
        source: 'Choose Good Quests',
        sourceUrl: 'https://traestephens.substack.com/p/choose-good-quests',
        asOf: TODAY,
      },
      {
        problemSlug: 'housing-construction',
        stance:
          'Low-labor, low-cost construction and new transportation modes are listed explicitly as underfunded good quests.',
        source: 'Choose Good Quests',
        sourceUrl: 'https://traestephens.substack.com/p/choose-good-quests',
        asOf: TODAY,
      },
      {
        problemSlug: 'longevity',
        stance:
          'Human lifespan extension is on the canonical list of "good quests that require massively leveled heroes."',
        source: 'Choose Good Quests',
        sourceUrl: 'https://traestephens.substack.com/p/choose-good-quests',
        asOf: TODAY,
      },
      {
        problemSlug: 'ai-safety',
        stance:
          'AGI is named on the good-quest list. Hard-tech builders, not only researchers, need to be at the center of the safety conversation.',
        source: 'Choose Good Quests',
        sourceUrl: 'https://traestephens.substack.com/p/choose-good-quests',
        asOf: TODAY,
      },
    ],
  },
]

export const getVoicesForProblem = (problemSlug: string) =>
  voices.filter((v) => v.positions.some((p) => p.problemSlug === problemSlug))

export const getPositionsForProblem = (problemSlug: string) =>
  voices.flatMap((v) =>
    v.positions
      .filter((p) => p.problemSlug === problemSlug)
      .map((p) => ({ voice: v, position: p })),
  )

export const getVoiceBySlug = (slug: string) =>
  voices.find((v) => v.slug === slug)
