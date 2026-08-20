import { problems } from '@/data/problems'
import { questStages } from '@/data/journey'
import { ARCHETYPE_LIST } from '@/data/archetypes'
import { publicCompanies } from '@/data/public-companies'
import { founders } from '@/data/founders'
import { countries } from '@/data/countries'
import { crypto } from '@/data/crypto'
import { voices } from '@/data/voices'
import { ecosystem } from '@/data/ecosystem'
import { capitalPools } from '@/data/capital-map'
import { watchedTerms } from '@/data/watched-terms'
import { progress } from '@/data/progress'
import { requestsForStartups } from '@/data/rfs'
import { seededMedia } from '@/data/media'
import { infographicBriefs } from '@/data/infographics'
import { sectors } from '@/data/sectors'
import { coverageGapCandidates } from '@/data/coverage'
import { SIGNAL_CATEGORIES } from '@/lib/signals/categories'
import { ages } from '@/data/ages'
import NavbarClient, { type NavTab } from './NavbarClient'

const dataTabs: NavTab[] = [
  { name: 'Globe', href: '/globe', count: publicCompanies.length, tone: 'cyan' },
  { name: 'Your Fit', href: '/fit', count: ARCHETYPE_LIST.length, tone: 'amber' },
  { name: 'The Quest', href: '/journey', count: questStages.length, tone: 'amber' },
  { name: 'Good Quests', href: '/good-quests', count: requestsForStartups.length, tone: 'amber' },
  { name: 'Problems', href: '/', count: problems.length, tone: 'amber' },
  { name: 'Demand', href: '/demand', count: problems.length, tone: 'amber' },
  { name: 'Under-supplied', href: '/underserved', count: problems.length, tone: 'amber' },
  { name: 'Coverage', href: '/coverage', count: coverageGapCandidates.length, tone: 'cyan' },
  { name: 'Trends', href: '/trends', count: watchedTerms.length, tone: 'cyan' },
  { name: 'Rankings', href: '/rankings', count: requestsForStartups.length, tone: 'amber' },
  { name: 'Capital', href: '/capital', count: capitalPools.length, tone: 'cyan' },
  { name: 'Radar', href: '/radar', count: problems.length, tone: 'amber' },
  { name: 'Sectors', href: '/sector', count: sectors.length, tone: 'amber' },
  { name: 'Requests', href: '/rfs', count: requestsForStartups.length, tone: 'amber' },
  { name: 'Explanations', href: '/voices', count: voices.length, tone: 'violet' },
  { name: 'Media', href: '/media', count: seededMedia.length, tone: 'cyan' },
  { name: 'Artifacts', href: '/artifacts', count: infographicBriefs.length, tone: 'violet' },
  { name: 'Solutions', href: '/companies', count: publicCompanies.length, tone: 'cyan' },
  { name: 'Movers', href: '/movers', count: publicCompanies.filter((c) => c.growth3yr).length, tone: 'amber' },
  { name: 'Signals', href: '/signals', count: SIGNAL_CATEGORIES.length, tone: 'cyan' },
  { name: 'People', href: '/founders', count: founders.length, tone: 'amber' },
  { name: 'Frontier', href: '/frontier', count: founders.length, tone: 'amber' },
  { name: 'Progress', href: '/progress', count: progress.length, tone: 'green' },
  { name: 'Ages', href: '/ages', count: ages.length, tone: 'green' },
  { name: 'Countries', href: '/countries', count: countries.length, tone: 'green' },
  { name: 'Crypto', href: '/crypto', count: crypto.length, tone: 'violet' },
  { name: 'Allocators', href: '/ecosystem', count: ecosystem.length, tone: 'cyan' },
]

export default function Navbar() {
  return <NavbarClient tabs={dataTabs} />
}
