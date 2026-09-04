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
import { joinPaths } from '@/data/join-paths'
import { inLimitCaps } from '@/data/in-limit'
import { valueLedgers } from '@/data/value-atlas'
import NavbarClient from './NavbarClient'

const valueExplainedCount = valueLedgers.reduce((sum, ledger) => sum + ledger.rows.length, 0)

// NavbarClient owns stable labels, routes, and colors. Only these live counts
// cross the server/client boundary, avoiding a duplicated metadata payload.
const tabCounts = [
  problems.length, // The Board
  publicCompanies.length,
  ARCHETYPE_LIST.length,
  questStages.length,
  requestsForStartups.length,
  problems.length,
  problems.length,
  problems.length,
  coverageGapCandidates.length,
  watchedTerms.length,
  requestsForStartups.length,
  inLimitCaps.length,
  valueExplainedCount,
  capitalPools.length,
  problems.length,
  sectors.length,
  requestsForStartups.length,
  voices.length,
  seededMedia.length,
  infographicBriefs.length,
  publicCompanies.length,
  joinPaths.length,
  publicCompanies.length + countries.length + founders.length,
  publicCompanies.filter((c) => c.growth3yr).length,
  SIGNAL_CATEGORIES.length,
  founders.length,
  founders.length,
  progress.length,
  ages.length,
  countries.length,
  crypto.length,
  ecosystem.length,
]

export default function Navbar() {
  return <NavbarClient counts={tabCounts} />
}
