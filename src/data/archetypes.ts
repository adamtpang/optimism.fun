/**
 * Founder archetypes — the talent side of founder-problem fit.
 *
 * Daniel Ek's claim (via David Senra): founder-problem fit matters more than
 * product-market fit or founder-market fit, and there is no single founder
 * mold — there are a handful of archetypes, and the work is to know which one
 * you are, then point it at the problem it was built for.
 *
 * These six are synthesized from the founder canon. Each carries the domains
 * and tiers it has historically won, so a profile can be matched to the
 * problems that fit it (see src/lib/fit.ts). Affinities are designed so every
 * ranked problem is reachable by two or three archetypes — fit, not a funnel.
 */
import type { Domain, Tier } from './types'

export type ArchetypeKey =
  | 'missionary'
  | 'scientist'
  | 'operator'
  | 'craftsman'
  | 'evangelist'
  | 'outsider'

export type Archetype = {
  key: ArchetypeKey
  name: string
  /** One line: the disposition. */
  essence: string
  /** How this shows up in the work. */
  traits: string[]
  /** The unfair advantage this archetype brings to a problem. */
  edge: string
  /** Founders who share the shape — copy the move, not the outcome. */
  exemplars: { name: string; company: string; note: string }[]
  /** Problem domains this archetype has historically won. */
  domains: Domain[]
  /** Problem tiers this archetype is suited to. */
  tiers: Tier[]
}

export const ARCHETYPES: Record<ArchetypeKey, Archetype> = {
  missionary: {
    key: 'missionary',
    name: 'The Missionary',
    essence: 'Serving a cause bigger than yourself — forever, not for an exit.',
    traits: ['Mutes the world and builds their own', 'Optimizes for control, not money', 'Decade-plus time horizon'],
    edge: 'You will still be here in 20 years when everyone chasing the exit has gone home.',
    exemplars: [
      { name: 'Elon Musk', company: 'SpaceX', note: 'Picked the problems that most affect humanity’s future, then took the impossible one.' },
      { name: 'Dana White', company: 'UFC', note: 'Lost money for six years on a mission no one believed in, ran it for 26.' },
      { name: 'Jeff Bezos', company: 'Amazon', note: '"It’s all about the long term" — reinvested for decades against every critic.' },
    ],
    domains: ['ai', 'energy', 'longevity', 'climate', 'bio'],
    tiers: ['x-risk', 'hard-tech'],
  },
  scientist: {
    key: 'scientist',
    name: 'The Scientist',
    essence: 'Pulled down a deep technical rabbit hole you can’t climb out of.',
    traits: ['Obsessed with the frontier itself', 'Deep founder-problem fit from years of immersion', 'Truth over consensus'],
    edge: 'You understand the problem at a depth competitors cannot fake or fast-follow.',
    exemplars: [
      { name: 'Demis Hassabis', company: 'DeepMind', note: '"Put on this planet" to do it — the textbook case of founder-problem fit.' },
      { name: 'Jennifer Doudna', company: 'CRISPR / Caribou', note: 'Turned a fundamental discovery into a platform for editing life.' },
      { name: 'Katalin Karikó', company: 'BioNTech', note: 'Decades on mRNA when no one funded it — then it saved the world.' },
    ],
    domains: ['science', 'bio', 'ai', 'longevity', 'health'],
    tiers: ['progress', 'x-risk'],
  },
  operator: {
    key: 'operator',
    name: 'The Operator',
    essence: 'Obsessed with making it actually work — at scale, at the lowest cost.',
    traits: ['Ruthless about cost and execution', 'Logistics and systems are the product', 'Compounds small advantages'],
    edge: 'You win the unglamorous war of cost and reliability that decides who survives.',
    exemplars: [
      { name: 'John D. Rockefeller', company: 'Standard Oil', note: 'Obsessed with the lowest cost per barrel; the advantage compounded for decades.' },
      { name: 'Michael Dell', company: 'Dell', note: 'Profitable every quarter for 20 years by out-operating a giant.' },
      { name: 'Tony Xu', company: 'DoorDash', note: '"So much more to do" — relentless on the operational details others ignore.' },
    ],
    domains: ['poverty', 'health', 'energy', 'climate'],
    tiers: ['welfare', 'hard-tech'],
  },
  craftsman: {
    key: 'craftsman',
    name: 'The Craftsman',
    essence: 'Obsessed with the product and the experience — taste is the moat.',
    traits: ['Says no to good ideas to protect the great one', 'Feels the user’s experience viscerally', 'Insanely-great-product energy'],
    edge: 'You make something people love, and love is the cheapest distribution there is.',
    exemplars: [
      { name: 'Steve Jobs', company: 'Apple', note: '"Insanely great products" — said the same words at 19 and at the end.' },
      { name: 'Brian Chesky', company: 'Airbnb', note: 'Founder-mode taste, down to every pixel of the experience.' },
      { name: 'Rick Rubin', company: 'Def Jam', note: 'A professional listener — taste applied for 40 years across mediums.' },
    ],
    domains: ['education', 'social', 'longevity'],
    tiers: ['progress', 'emerging'],
  },
  evangelist: {
    key: 'evangelist',
    name: 'The Evangelist',
    essence: 'Builds the movement, the brand, and the capital around the mission.',
    traits: ['100x storyteller and recruiter', 'Pulls talent and capital toward the cause', 'Makes the future feel inevitable'],
    edge: 'You can rally the people and money a hard problem needs before it can pay them.',
    exemplars: [
      { name: 'Richard Branson', company: 'Virgin', note: 'Built a movement and a brand across dozens of hard industries.' },
      { name: 'Howard Schultz', company: 'Starbucks', note: 'Sold a story and a ritual, not just a product.' },
      { name: 'Marc Benioff', company: 'Salesforce', note: 'Turned a category into a movement through sheer evangelism.' },
    ],
    domains: ['climate', 'social', 'poverty', 'education'],
    tiers: ['welfare', 'emerging'],
  },
  outsider: {
    key: 'outsider',
    name: 'The Outsider',
    essence: 'A chip on the shoulder and an eye for what everyone else ignores.',
    traits: ['Contrarian and right', 'Immigrant-grade work ethic and urgency', 'Sees the neglected problem as the opening'],
    edge: 'You attack the underallocated problem the consensus is too comfortable to touch.',
    exemplars: [
      { name: 'Peter Thiel', company: 'Founders Fund', note: 'Backed SpaceX at maximum doubt — contrarian and right.' },
      { name: 'Jensen Huang', company: 'NVIDIA', note: 'Immigrant outsider who bet a decade early on a market no one saw.' },
      { name: 'Jan Koum', company: 'WhatsApp', note: 'From food stamps to a product for the billions the Valley ignored.' },
    ],
    domains: ['social', 'bio', 'science'],
    tiers: ['emerging', 'x-risk'],
  },
}

export const ARCHETYPE_LIST: Archetype[] = Object.values(ARCHETYPES)

/**
 * The disposition question — phrased as a felt pull, not a label, so people
 * pick honestly instead of picking the flattering word. Each maps to an archetype.
 */
export const DISPOSITIONS: { archetype: ArchetypeKey; label: string; sub: string }[] = [
  { archetype: 'missionary', label: 'Serve a mission bigger than me — forever', sub: 'I want the cause to exist whether or not I get rich.' },
  { archetype: 'scientist', label: 'Crack an impossible technical problem', sub: 'I’m already down a rabbit hole I can’t climb out of.' },
  { archetype: 'operator', label: 'Make it work at massive scale and low cost', sub: 'I love the unglamorous machine that actually delivers.' },
  { archetype: 'craftsman', label: 'Build a product people genuinely love', sub: 'Taste and the experience are where I can’t be beaten.' },
  { archetype: 'evangelist', label: 'Rally the people and capital to a cause', sub: 'I can make a hard future feel inevitable to others.' },
  { archetype: 'outsider', label: 'Bet on what everyone else is ignoring', sub: 'I see the neglected thing and I have something to prove.' },
]
