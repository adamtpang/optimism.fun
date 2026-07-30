/**
 * Sourced quest crowding — real competitor counts, replacing editorial priors.
 *
 * Every row here was produced by a live Exa Agent run against production on
 * 2026-07-20 (/api/cron/refresh-crowding), which searched for companies
 * currently building each specific quest and returned a count plus named
 * examples. `crowdingFromCount` maps the count to the band the ranking uses:
 * 0-1 = open, 2-4 = contested, 5+ = crowded.
 *
 * This file is the override layer: lib/rankings.ts prefers a sourced count
 * over the hand-set `crowding` field in rfs.ts. Where a quest is absent here,
 * the editorial prior still applies, and the UI says which is which.
 *
 * The sourcing falsified roughly half the priors — several quests marked
 * "open" turned out to have five or more real competitors, and the entire
 * previous S-tier collapsed. That is the system working: conjecture, then
 * refutation by data.
 */
import type { Crowding } from './types'

export type SourcedCrowding = {
  questSlug: string
  competitorCount: number
  crowding: Crowding
  exampleCompetitors: string[]
  /** When the count was sourced. */
  asOf: string
}

const ASOF = '2026-07-20'

export const sourcedCrowding: SourcedCrowding[] = [
  { questSlug: 'pathogen-agnostic-early-warning', competitorCount: 3, crowding: 'contested', exampleCompetitors: ['Ginkgo Biosecurity / Concentric', 'Fusion Genomics', 'Perimeter'], asOf: ASOF },
  { questSlug: 'days-not-months-biomanufacturing', competitorCount: 5, crowding: 'crowded', exampleCompetitors: ['BioNTech', 'Univercells Technologies', 'Pharmadule Morimatsu'], asOf: ASOF },
  { questSlug: 'far-uvc-as-infrastructure', competitorCount: 5, crowding: 'crowded', exampleCompetitors: ['Visium', 'Harmony', 'Beacon'], asOf: ASOF },
  { questSlug: 'fission-permitting-unlock', competitorCount: 3, crowding: 'contested', exampleCompetitors: ['NovaCVS', 'RX', 'Everstar'], asOf: ASOF },
  { questSlug: 'geothermal-via-oilfield-tooling', competitorCount: 2, crowding: 'contested', exampleCompetitors: ['Gradient Geothermal', 'Mantle Energy'], asOf: ASOF },
  { questSlug: 'hundred-hour-storage', competitorCount: 4, crowding: 'contested', exampleCompetitors: ['Form Energy', 'Energy Dome', 'Hydrostor'], asOf: ASOF },
  { questSlug: 'factory-housing-that-scales', competitorCount: 5, crowding: 'crowded', exampleCompetitors: ['Reframe Systems', 'Checa', 'Mini Modular'], asOf: ASOF },
  { questSlug: 'entitlement-as-an-api', competitorCount: 2, crowding: 'contested', exampleCompetitors: ['OffGrid / ReadyPermit.AI', 'Archistar'], asOf: ASOF },
  { questSlug: 'bloom-two-sigma-tutor', competitorCount: 5, crowding: 'crowded', exampleCompetitors: ['PupilTree.ai', 'Classy AI', 'Bloomy'], asOf: ASOF },
  { questSlug: 'skills-credential-standard', competitorCount: 3, crowding: 'contested', exampleCompetitors: ['Humanity Protocol', 'HireVue', 'Test Partnership'], asOf: ASOF },
  { questSlug: 'single-encounter-tb-cure', competitorCount: 1, crowding: 'open', exampleCompetitors: ['Akagera Medicines'], asOf: ASOF },
  { questSlug: 'gene-drive-vector-control', competitorCount: 0, crowding: 'open', exampleCompetitors: [], asOf: ASOF },
  { questSlug: 'sub-dollar-diagnostics', competitorCount: 3, crowding: 'contested', exampleCompetitors: ['VPCIR Biosciences', 'Molbio Diagnostics', 'Qure.ai'], asOf: ASOF },
  { questSlug: 'autonomous-lab', competitorCount: 3, crowding: 'contested', exampleCompetitors: ['Atinary', 'Scivity', 'Autoscience'], asOf: ASOF },
  { questSlug: 'replication-layer', competitorCount: 2, crowding: 'contested', exampleCompetitors: ['Researka', 'ValiChord'], asOf: ASOF },
  { questSlug: 'fast-grants-as-a-product', competitorCount: 0, crowding: 'open', exampleCompetitors: [], asOf: ASOF },
  { questSlug: 'aging-as-an-indication', competitorCount: 2, crowding: 'contested', exampleCompetitors: ['ANI.AI', 'Vera Genetics'], asOf: ASOF },
  { questSlug: 'healthspan-diagnostic', competitorCount: 4, crowding: 'contested', exampleCompetitors: ['Vero Bioscience', 'Cosmica Biosciences', 'ANI.AI'], asOf: ASOF },
  { questSlug: 'order-of-magnitude-cheaper-ivf', competitorCount: 2, crowding: 'contested', exampleCompetitors: ['Overture Life', 'Conceivable Life Sciences'], asOf: ASOF },
  { questSlug: 'cost-of-family-formation', competitorCount: 8, crowding: 'crowded', exampleCompetitors: ['OurVillageHQ', 'Haven', 'Naptured'], asOf: ASOF },
  { questSlug: 'third-places-as-a-business', competitorCount: 4, crowding: 'contested', exampleCompetitors: ['Culdesac', 'Communal', 'Meetday'], asOf: ASOF },
  { questSlug: 'proximity-over-feeds', competitorCount: 4, crowding: 'contested', exampleCompetitors: ['Culdesac', 'Communal', 'Meetday'], asOf: ASOF },
]

const bySlug = new Map(sourcedCrowding.map((c) => [c.questSlug, c]))

/** Sourced crowding for a quest, or null when only the editorial prior exists. */
export function getSourcedCrowding(questSlug: string): SourcedCrowding | null {
  return bySlug.get(questSlug) ?? null
}
