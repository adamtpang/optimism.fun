import type { EcosystemEntity } from './types'

export const ecosystem: EcosystemEntity[] = [
  {
    slug: 'emergent-ventures',
    name: 'Emergent Ventures',
    type: 'grant',
    url: 'https://www.mercatus.org/emergent-ventures',
    thesis: 'Fast grants. High-variance, unconventional, talent-first.',
    problemSlugs: [
      'scientific-productivity',
      'pedagogy',
      'ai-safety',
      'longevity',
      'fertility-decline',
    ],
    bestFor: 'Unproven people with a weird, specific idea and no credential path.',
    description:
      'Run by Tyler Cowen at the Mercatus Center. Extremely short application, decisions in weeks, no strings attached. The operational embodiment of permissionless innovation.',
  },
  {
    slug: 'thiel-fellowship',
    name: 'Thiel Fellowship',
    type: 'fellowship',
    url: 'https://thielfellowship.org',
    thesis: '$100k to stop out of school and build something important.',
    problemSlugs: [
      'ai-safety',
      'energy-abundance',
      'housing-construction',
      'longevity',
      'scientific-productivity',
    ],
    bestFor: 'Under-22 builders with spiky talent and a real project.',
    description:
      'Founded by Peter Thiel to challenge the university credential monopoly. Selects for spikiness over well-roundedness. Alumni include founders of Ethereum, Figma, and Luminar.',
  },
  {
    slug: 'oshaughnessy-fellowships',
    name: "O'Shaughnessy Fellowships",
    type: 'fellowship',
    url: 'https://www.osv.llc/fellowships',
    thesis: '$100k for creators across domains, art, science, history, startups.',
    problemSlugs: ['scientific-productivity', 'pedagogy', 'loneliness'],
    bestFor: 'Agency-specific builders whose project does not fit a discipline box.',
    description:
      "Funded by Jim O'Shaughnessy. Domain agnostic, invests in the person and their Good Quest. Fellows include documentary makers, physics theorists, and startup founders.",
  },
  {
    slug: '776-fellowship',
    name: '776 Fellowship',
    type: 'fellowship',
    url: 'https://www.776.org',
    thesis: '$100k over two years for 18-24 year olds tackling climate change.',
    problemSlugs: ['energy-abundance'],
    bestFor: 'Young climate-focused founders bridging activism and company building.',
    description:
      'Founded by Alexis Ohanian. Integrates fellows into the 776 venture network for company-building support beyond the grant itself.',
  },
  {
    slug: 'activate',
    name: 'Activate Fellowship',
    type: 'accelerator',
    url: 'https://activate.org',
    thesis: 'Two-year salary and national-lab access for scientists taking PhD research to market.',
    problemSlugs: ['energy-abundance', 'housing-construction', 'scientific-productivity'],
    bestFor: 'Technical founders who need time and lab equipment, not just cash.',
    description:
      'Success stories include Fervo Energy (geothermal), Sublime Systems (decarbonized cement), and Twelve (CO2 electrolysis). The critical node in the hard-tech stack.',
  },
  {
    slug: 'prime-coalition',
    name: 'Prime Coalition',
    type: 'catalytic',
    url: 'https://www.primecoalition.org',
    thesis: 'Catalytic capital for climate tech that would not get conventional VC funding.',
    problemSlugs: ['energy-abundance'],
    bestFor: 'Climate-tech teams facing the Valley of Death between science and scale.',
    description:
      'Invests only when its capital is additional (a deal would not happen otherwise). Blends philanthropic dollars with for-profit vehicles for long-horizon deep tech.',
  },
  {
    slug: 'speculative-technologies',
    name: 'Speculative Technologies',
    type: 'fro',
    url: 'https://spec.tech',
    thesis: 'ARPA-style coordinated research programs for big-if-true platform tech.',
    problemSlugs: ['scientific-productivity', 'energy-abundance'],
    bestFor: 'Research areas that are not yet startups but could unlock whole fields.',
    description:
      'Creates technical roadmaps and funds milestone-based programs. Examples: molecular additive manufacturing, nanomodular electronics.',
  },
  {
    slug: 'homeworld-collective',
    name: 'Homeworld Collective',
    type: 'fro',
    url: 'https://www.homeworld.bio',
    thesis: 'Climate biotech is neglected vs pharma. Fund the gap.',
    problemSlugs: ['energy-abundance'],
    bestFor: 'Early-stage experiments in greenhouse gas removal and climate biology.',
    description:
      'Garden Grants ($50k-$150k) for greenhouse gas removal research at the protein-engineering scale. Filling the gap between pharma biotech funding and climate needs.',
  },
  {
    slug: 'deep-science-ventures',
    name: 'Deep Science Ventures',
    type: 'studio',
    url: 'https://www.deepscienceventures.com',
    thesis: 'Outcome-first venture creation. Define the holy-grail outcome, then recruit founders.',
    problemSlugs: [
      'energy-abundance',
      'longevity',
      'scientific-productivity',
      'infectious-disease',
    ],
    bestFor: 'Founders who want a co-founder thesis and institutional support from day one.',
    description:
      'Sectors: agriculture, computation, climate, pharma. Example: defined "Restoring the underground network of forests" and recruited Rhizocore to build it.',
  },
  {
    slug: 'marble',
    name: 'Marble',
    type: 'studio',
    url: 'https://marble.studio',
    thesis: 'Hard climate tech studio, pair scientists with operators.',
    problemSlugs: ['energy-abundance'],
    bestFor: 'Scientists who want an operator co-founder paired in residence.',
    description:
      'Paris-based. Founders in Residence program targeting hard climate problems like high-temperature industrial heat. Portfolio includes Aerleum (CO2 to fuel).',
  },
  {
    slug: 'founders-fund',
    name: 'Founders Fund',
    type: 'vc',
    url: 'https://foundersfund.com',
    thesis: 'Contrarian hard tech that rebuilds the industrial base.',
    problemSlugs: ['ai-safety', 'energy-abundance', 'biosecurity', 'longevity'],
    bestFor: 'Scaling massive hard-tech quests, space, defense, biotech, fusion.',
    description:
      "Portfolio: SpaceX, Anduril, Varda, Flock Safety, Palantir. Publishers of the \"Choose Good Quests\" thesis that named this category.",
  },
  {
    slug: 'a16z-american-dynamism',
    name: 'a16z American Dynamism',
    type: 'vc',
    url: 'https://a16z.com/american-dynamism/',
    thesis: 'National-interest technology, aerospace, defense, manufacturing, public safety.',
    problemSlugs: ['energy-abundance', 'housing-construction', 'biosecurity'],
    bestFor: 'Founders rebuilding American industrial capacity.',
    description:
      'a16z practice aligning e/acc with civic duty. Explicit thesis that American prosperity requires renewed industrial capability.',
  },
  {
    slug: 'lux-capital',
    name: 'Lux Capital',
    type: 'vc',
    url: 'https://luxcapital.com',
    thesis: 'Counter-conventional science at the edges of physics and biology.',
    problemSlugs: ['longevity', 'scientific-productivity', 'biosecurity', 'ai-safety'],
    bestFor: 'Technical founders at the frontier who need contrarian conviction capital.',
    description:
      'Portfolio spans neurotech, robotics, genomics, space, and AI. Known for betting on emerging fields before they have categories.',
  },
  {
    slug: 'fifty-years',
    name: 'Fifty Years',
    type: 'vc',
    url: 'https://www.fiftyyears.com',
    thesis: 'Every portfolio company must solve a UN SDG. Profit with purpose, no exceptions.',
    problemSlugs: [
      'energy-abundance',
      'infectious-disease',
      'housing-construction',
      'scientific-productivity',
    ],
    bestFor: 'Mission-aligned technical founders who want to marry returns and impact.',
    description:
      'VC firm with a hard mandate: no portfolio company without a mapped SDG solution. Portfolio includes Solugen (green chemistry), Pivot Bio, and Nautilus.',
  },
  {
    slug: 'rise-fund',
    name: 'Rise Fund (TPG)',
    type: 'vc',
    url: 'https://therisefund.com',
    thesis: 'Growth-stage impact investing with rigorous Impact Multiple of Money scoring.',
    problemSlugs: [
      'infectious-disease',
      'pedagogy',
      'energy-abundance',
      'housing-construction',
    ],
    bestFor: 'Growth-stage impact companies with measurable IMM.',
    description:
      'TPG impact platform. Developed the IMM methodology with Y Analytics, the most rigorous ex-ante impact scoring in use today.',
  },
]

export const getEcosystemForProblem = (problemSlug: string): EcosystemEntity[] =>
  ecosystem.filter((e) => e.problemSlugs.includes(problemSlug))

export const getEcosystemBySlug = (slug: string): EcosystemEntity | undefined =>
  ecosystem.find((e) => e.slug === slug)
