/**
 * Sourced quest crowding — real competitor counts, replacing editorial priors.
 *
 * Re-sourced 2026-08-18 (superseding the original 2026-07-20 pass) after
 * HANDOFF_FIT_AND_CROWDING_2026-08-18.md caught a real methodology bug: the
 * original search only counted for-profit companies, so any quest whose
 * real competition is a nonprofit, academic institute, or government
 * program read as falsely open or under-contested. `fast-grants-as-a-
 * product` and `gene-drive-vector-control` both moved off "open" once
 * philanthropic funders and academic consortia (Renaissance Philanthropy,
 * Target Malaria, GHIT Fund, and others) were counted. Every row below was
 * re-searched across all legal structures equally — see
 * /api/cron/refresh-crowding and src/lib/sources/exa.ts for the fixed,
 * broadened query. `crowdingFromCount` maps the count to the band the
 * ranking uses: 0-1 = open, 2-4 = contested, 5+ = crowded. Non-company
 * entries in `exampleCompetitors` carry their type in parens.
 *
 * This file is the override layer: lib/rankings.ts prefers a sourced count
 * over the hand-set `crowding` field in rfs.ts. Where a quest is absent here,
 * the editorial prior still applies, and the UI says which is which.
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

export const sourcedCrowding: SourcedCrowding[] = [
  { questSlug: 'pathogen-agnostic-early-warning', competitorCount: 4, crowding: 'contested', exampleCompetitors: ['Perimeter (formerly Ginkgo Biosecurity/Concentric)', 'Fusion Genomics', 'Nucleic Acid Observatory (academic/nonprofit, SecureBio + MIT)', 'CDC Biothreat Radar (government)'], asOf: '2026-08-18' },
  { questSlug: 'days-not-months-biomanufacturing', competitorCount: 7, crowding: 'crowded', exampleCompetitors: ['BioNTech', 'Univercells Technologies', 'Pharmadule Morimatsu', "CEPI's 100 Days Mission (nonprofit)", 'WHO/MPP mRNA Technology Transfer Hub — Afrigen (nonprofit/government-backed)'], asOf: '2026-08-18' },
  { questSlug: 'far-uvc-as-infrastructure', competitorCount: 7, crowding: 'crowded', exampleCompetitors: ['Visium', 'Beacon', 'Far UV Technologies', 'Uviquity', 'UV Medico'], asOf: '2026-08-18' },
  { questSlug: 'fission-permitting-unlock', competitorCount: 4, crowding: 'contested', exampleCompetitors: ['Everstar', 'NovaCVS', 'RX', 'DOE National Reactor Innovation Center (government)'], asOf: '2026-08-18' },
  { questSlug: 'geothermal-via-oilfield-tooling', competitorCount: 8, crowding: 'crowded', exampleCompetitors: ['Fervo Energy', 'Sage Geosystems', 'Gradient Geothermal', 'Mantle Energy', 'DOE Enhanced Geothermal Shot (government)'], asOf: '2026-08-18' },
  { questSlug: 'hundred-hour-storage', competitorCount: 5, crowding: 'crowded', exampleCompetitors: ['Form Energy', 'Energy Dome', 'Hydrostor', 'Noon Energy', 'DOE ARPA-E DAYS program (government)'], asOf: '2026-08-18' },
  { questSlug: 'factory-housing-that-scales', competitorCount: 7, crowding: 'crowded', exampleCompetitors: ['Reframe Systems', 'Blokable', 'Villa Homes', 'Van Metre Homes', 'Lagom Development', 'Checa', 'Mini Modular'], asOf: '2026-08-18' },
  { questSlug: 'entitlement-as-an-api', competitorCount: 6, crowding: 'crowded', exampleCompetitors: ['ReadyPermit.AI (OffGrid)', 'Archistar', 'Symbium', 'Zoneomics', 'PermitFlow', 'National Zoning Atlas (academic/nonprofit, Cornell)'], asOf: '2026-08-18' },
  { questSlug: 'bloom-two-sigma-tutor', competitorCount: 5, crowding: 'crowded', exampleCompetitors: ['Bloomy', 'PupilTree.ai', 'Khan Academy / Khanmigo (nonprofit)', 'Synthesis Tutor', 'Alpha School / 2 Hour Learning'], asOf: '2026-08-18' },
  { questSlug: 'skills-credential-standard', competitorCount: 7, crowding: 'crowded', exampleCompetitors: ['CodeSignal', 'HireVue', 'Woven Teams', 'TestGorilla', 'iMocha', 'Test Partnership', 'Humanity Protocol'], asOf: '2026-08-18' },
  { questSlug: 'single-encounter-tb-cure', competitorCount: 4, crowding: 'contested', exampleCompetitors: ['Akagera Medicines', 'PAN-TB Collaboration / Gates MRI (nonprofit)', "Unitaid's long-acting rifapentine program (philanthropic fund)", 'GHIT Fund (nonprofit fund)'], asOf: '2026-08-18' },
  { questSlug: 'gene-drive-vector-control', competitorCount: 2, crowding: 'contested', exampleCompetitors: ['Target Malaria (academic/nonprofit consortium, Gates Foundation + Open Philanthropy funded)', 'Oxitec (owned by Third Security)'], asOf: '2026-08-18' },
  { questSlug: 'sub-dollar-diagnostics', competitorCount: 6, crowding: 'crowded', exampleCompetitors: ['VPCIR Biosciences', 'Molbio Diagnostics', 'Mologic / Global Access Health (nonprofit)', 'Sherlock Biosciences', 'FIND (nonprofit foundation)', 'Qure.ai'], asOf: '2026-08-18' },
  { questSlug: 'autonomous-lab', competitorCount: 9, crowding: 'crowded', exampleCompetitors: ['Ginkgo Bioworks (Cloud Lab)', 'Emerald Cloud Lab', 'Strateos', 'Chemify', 'Atinary', 'Kebotix', 'Acceleration Consortium (academic)', 'A-Lab / Berkeley Lab (academic/government)', 'DOE Genesis Mission (government)'], asOf: '2026-08-18' },
  { questSlug: 'replication-layer', competitorCount: 4, crowding: 'contested', exampleCompetitors: ["Institute for Progress's Replication Engine (academic)", 'Institute for Replication (academic)', "NIH's centralized replication hub (government)", 'Center for Open Science (nonprofit)'], asOf: '2026-08-18' },
  { questSlug: 'fast-grants-as-a-product', competitorCount: 3, crowding: 'contested', exampleCompetitors: ['Longevity Impetus Grants (nonprofit)', 'Renaissance Philanthropy (nonprofit)', 'Asothia (nonprofit-funded, Coefficient Giving)'], asOf: '2026-08-18' },
  { questSlug: 'aging-as-an-indication', competitorCount: 5, crowding: 'crowded', exampleCompetitors: ['ANI.AI', 'Vera Genetics', 'TAME trial / AFAR (academic)', 'Life Biosciences', 'Biomarkers of Aging Consortium (academic/nonprofit)'], asOf: '2026-08-18' },
  { questSlug: 'healthspan-diagnostic', competitorCount: 9, crowding: 'crowded', exampleCompetitors: ['Vero Bioscience', 'Cosmica Biosciences', 'ANI.AI', 'TruDiagnostic', 'Tally Health', 'Elysium Health Index', 'Function Health', 'InsideTracker', 'Epigenetic Clock Development Foundation (nonprofit)'], asOf: '2026-08-18' },
  { questSlug: 'order-of-magnitude-cheaper-ivf', competitorCount: 2, crowding: 'contested', exampleCompetitors: ['Overture Life', 'Conceivable Life Sciences'], asOf: '2026-08-18' },
  { questSlug: 'cost-of-family-formation', competitorCount: 9, crowding: 'crowded', exampleCompetitors: ['OurVillageHQ', 'Haven', 'Naptured', 'Childspace / Beyond Care Childcare Cooperative (nonprofit cooperative)'], asOf: '2026-08-18' },
  { questSlug: 'third-places-as-a-business', competitorCount: 7, crowding: 'crowded', exampleCompetitors: ['Culdesac', 'Othership', 'Bathhouse', 'Soho House', 'Common'], asOf: '2026-08-18' },
  { questSlug: 'proximity-over-feeds', competitorCount: 4, crowding: 'contested', exampleCompetitors: ['Timeleft', '222', 'Meetday', 'Friender'], asOf: '2026-08-18' },
  { questSlug: 'graduation-approach-cost-collapse', competitorCount: 4, crowding: 'contested', exampleCompetitors: ['Village Enterprise / SPRINT program (nonprofit)', 'Trickle Up (nonprofit)', 'BRAC / Ultra-Poor Graduation Initiative (nonprofit)', 'World Bank Partnership for Economic Inclusion (government/multilateral)'], asOf: '2026-08-20' },
  { questSlug: 'anticipatory-cash-infrastructure', competitorCount: 4, crowding: 'contested', exampleCompetitors: ['WFP Anticipatory Action (government/UN)', 'Start Ready / Start Network (nonprofit consortium)', 'GovStack INST-2 (government/multilateral consortium)', 'OCHA Centre for Humanitarian Data (UN/nonprofit)'], asOf: '2026-08-20' },
  { questSlug: 'geologic-hydrogen-flow-engineering', competitorCount: 6, crowding: 'crowded', exampleCompetitors: ['Eden GeoPower', 'GeoKiln', 'GeoRedox', 'DOE ARPA-E Geologic Hydrogen Stimulation consortium (government)', 'Lawrence Livermore National Laboratory (government)', 'Idaho National Laboratory (government)'], asOf: '2026-08-20' },
  { questSlug: 'dumpsite-methane-capture', competitorCount: 1, crowding: 'open', exampleCompetitors: ['Global Methane Hub / C40 Cities Waste Accelerator (nonprofit, adjacent not identical — targets waste diversion, not gas-capture retrofit)'], asOf: '2026-08-20' },
  { questSlug: 'onchocerciasis-cure-readiness', competitorCount: 3, crowding: 'contested', exampleCompetitors: ['DNDi (nonprofit, owns the drug + access mandate)', 'Bayer AG (contractually owns registration, manufacturing, and distribution per the DNDi joint-development agreement)', 'ESPEN / WHO (government/multilateral, owns Africa-wide MDA distribution)'], asOf: '2026-08-20' },
  { questSlug: 'broad-spectrum-antivenom', competitorCount: 4, crowding: 'contested', exampleCompetitors: ['Centivax / Columbia (academic)', 'DTU Denmark (academic)', 'Ophirex', 'Wellcome Trust snakebite programme (philanthropic fund)'], asOf: '2026-08-20' },
  { questSlug: 'neonatal-sepsis-risk-score', competitorCount: 4, crowding: 'contested', exampleCompetitors: ['Neotree (academic/nonprofit, UCL/Great Ormond Street)', 'Mbarara Regional Referral Hospital algorithm (academic, Uganda)', 'Delhi Neonatal Infection Study ML model (academic, India)', 'GARDP / NeoOBS (nonprofit, Gates-funded)'], asOf: '2026-08-20' },
  { questSlug: 'interconnection-queue-underwriting', competitorCount: 4, crowding: 'contested', exampleCompetitors: ['GridUnity', 'Smarter Grid Solutions', 'Enline', 'GridAstra'], asOf: '2026-08-20' },
  { questSlug: 'datacenter-power-smoothing', competitorCount: 0, crowding: 'open', exampleCompetitors: [], asOf: '2026-08-20' },
]

const bySlug = new Map(sourcedCrowding.map((c) => [c.questSlug, c]))

/** Sourced crowding for a quest, or null when only the editorial prior exists. */
export function getSourcedCrowding(questSlug: string): SourcedCrowding | null {
  return bySlug.get(questSlug) ?? null
}
