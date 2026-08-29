/**
 * Export pickable essay seeds + asset index for summon.guide / book.movie.
 *
 * Usage: node scripts/export-seeds.mjs
 * Writes: seeds/export/*.json, seeds/export/*.md, seeds/asset-index.json
 *
 * Reads in-repo TypeScript data files as text (no TS runtime required).
 * Canonical seed list is mirrored in this file so export stays deterministic;
 * keep in sync with src/data/essay-seeds.ts.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const exportDir = join(root, 'seeds', 'export')
const libraryDir = join(root, 'seeds', 'library')

/** @typedef {{ title: string, url?: string, path?: string }} SeedSource */
/** @typedef {{
 *   id: string,
 *   kind: string,
 *   title: string,
 *   claim: string,
 *   bullets: [string, string, string],
 *   source: SeedSource,
 *   problemSlug?: string,
 *   sectorSlugs?: string[],
 *   hook?: string,
 *   mediaIds?: string[],
 *   voiceSlugs?: string[],
 * }} EssaySeed */

/** @type {EssaySeed[]} */
const essaySeeds = [
  {
    id: 'seed-housing-productivity-flat',
    kind: 'problem',
    title: 'Why construction productivity has been flat for 50 years',
    claim:
      'Housing is expensive because construction never industrialized — not because materials got scarce.',
    bullets: [
      '1.6B people live in inadequate housing; in rich cities median homes run 6–12× median income.',
      'Construction productivity is roughly flat for 50 years while almost every manufactured good got cheaper and better.',
      'The gap is process (zoning, labor, finance, factory logistics), not the physics of steel, timber, or concrete.',
    ],
    source: {
      title: 'optimism.fun · Low-cost housing & construction',
      url: 'https://optimism.fun/p/housing-construction',
      path: 'src/data/problems.ts#housing-construction',
    },
    problemSlug: 'housing-construction',
    sectorSlugs: ['shelter-and-construction'],
    hook: 'Every other industry got a factory. Housing still builds on dirt, one house at a time.',
    mediaIds: [
      'cp-construction-productivity-50yrs',
      'wip-housing-supply-physics',
      'coogan-housing-zoning',
    ],
    voiceSlugs: ['jason-crawford', 'trae-stephens', 'patrick-collison'],
  },
  {
    id: 'seed-energy-fusion-near',
    kind: 'media',
    title: 'Fusion is closer than you think',
    claim:
      'Private fusion is no longer science fiction — it is a milestone race with commercial timelines.',
    bullets: [
      'Multiple private teams (Commonwealth, Helion, TAE and others) are racing to net-energy milestones.',
      'Energy abundance is a canonical hard/good quest: important if it works, still a real frontier.',
      'Dispatchable clean baseload would unlock downstream abundance in compute, desalination, and industry.',
    ],
    source: {
      title: 'Not Boring · Fusion is closer than you think (seeded media)',
      url: 'https://www.notboring.co/p/fusion-is-closer-than-you-think',
      path: 'src/data/media.ts#notboring-fusion-near',
    },
    problemSlug: 'energy-abundance',
    sectorSlugs: ['energy-and-abundance'],
    hook: 'We stopped talking about fusion like it was always 30 years away. The private labs did not.',
    mediaIds: ['notboring-fusion-near', 's3-fusion-startups'],
    voiceSlugs: ['elon-musk', 'jason-crawford', 'trae-stephens'],
  },
  {
    id: 'seed-progress-moral-imperative',
    kind: 'media',
    title: 'Progress as a moral imperative',
    claim:
      'Material progress is the precondition for nearly every flourishing humans care about — not a nice-to-have.',
    bullets: [
      'Extreme poverty more than halved since 1990; child mortality fell ~60% — none of it inevitable.',
      'Problems are soluble given knowledge (Deutsch); stagnation is a choice, not physics.',
      'A progress philosophy is the missing cultural infrastructure behind hard-tech quests.',
    ],
    source: {
      title: 'Roots of Progress · The case for progress',
      url: 'https://rootsofprogress.org/the-case-for-progress',
      path: 'src/data/media.ts#rop-progress-as-moral-imperative',
    },
    problemSlug: 'scientific-productivity',
    sectorSlugs: ['science-and-progress'],
    hook: 'If suffering is an unsolved problem, then progress is not optional — it is ethics.',
    mediaIds: ['rop-progress-as-moral-imperative', 'mr-ideas-getting-harder'],
    voiceSlugs: ['jason-crawford', 'david-deutsch', 'patrick-collison', 'tyler-cowen'],
  },
  {
    id: 'seed-rfs-interpretability-service',
    kind: 'rfs',
    title: 'The MRI machine for neural networks',
    claim:
      'Frontier labs ship models they cannot read — interpretability should be a product, not a side paper.',
    bullets: [
      'Deception and goal-misgeneralization stay invisible until they are catastrophic.',
      'Mechanistic interpretability scaled from toy circuits to production features in ~3 years.',
      'A hosted risk report (deception, sandbagging, capability spikes) can sell to labs, evals, and regulators.',
    ],
    source: {
      title: 'optimism.fun RFS · interpretability-as-a-service',
      url: 'https://optimism.fun/rfs',
      path: 'src/data/rfs.ts#interpretability-as-a-service',
    },
    problemSlug: 'ai-safety',
    sectorSlugs: ['ai-and-x-risk'],
    hook: 'We inspect bridges before we open them. We do not inspect model internals before we deploy them.',
    mediaIds: ['notboring-ai-aligned-by-default'],
    voiceSlugs: ['david-deutsch', 'elon-musk', 'trae-stephens'],
  },
  {
    id: 'seed-rfs-pathogen-early-warning',
    kind: 'rfs',
    title: 'Pathogen-agnostic early warning',
    claim:
      'We still detect outbreaks by waiting for hospitals — continuous metagenomics can cut that to days.',
    bullets: [
      'COVID excess deaths ran on the order of ~20M; engineered-pandemic risk is rising with synthesis capability.',
      'Sequencing cost crossed the threshold for continuous environmental sampling.',
      'Wastewater + airport + air-handler networks can alarm on any novel exponentially-growing genome.',
    ],
    source: {
      title: 'optimism.fun RFS · pathogen-agnostic-early-warning',
      url: 'https://optimism.fun/rfs',
      path: 'src/data/rfs.ts#pathogen-agnostic-early-warning',
    },
    problemSlug: 'biosecurity',
    hook: 'Cholera taught us not to wait for corpses to test the water. Pathogens still get a free head start.',
    voiceSlugs: ['patrick-collison', 'trae-stephens'],
  },
  {
    id: 'seed-scientific-productivity',
    kind: 'problem',
    title: 'Are ideas really getting harder to find?',
    claim:
      'Research productivity is falling for institutional reasons as much as cognitive ones — and that is attackable.',
    bullets: [
      'Bloom–Jones–Reenen–Webb: it takes ~18× more researchers to sustain Moore-like progress vs the 1970s.',
      'Progress studies (Collison/Cowen) argues the process of progress is under-studied.',
      'Fast Grants showed wartime-speed biomedical funding is possible when structure allows it.',
    ],
    source: {
      title: 'optimism.fun · Scientific productivity',
      url: 'https://optimism.fun/p/scientific-productivity',
      path: 'src/data/problems.ts#scientific-productivity',
    },
    problemSlug: 'scientific-productivity',
    sectorSlugs: ['science-and-progress'],
    hook: 'We fund more scientists than ever. Breakthroughs per dollar keep falling. Why?',
    mediaIds: ['mr-ideas-getting-harder', 'rop-progress-as-moral-imperative'],
    voiceSlugs: ['patrick-collison', 'tyler-cowen', 'jason-crawford', 'david-deutsch'],
  },
  {
    id: 'seed-fertility-policy',
    kind: 'media',
    title: 'What actually moves fertility rates',
    claim:
      'Fertility collapse is a larger civilizational risk than most X-risk discourse admits — and policy evidence is mixed but non-empty.',
    bullets: [
      'Global TFR is near or below replacement in much of the developed world and falling elsewhere.',
      'Cross-country policy experiments show some levers work; many popular ones do not.',
      'Voices from Musk to Cowen frame demographic stagnation as under-discussed risk.',
    ],
    source: {
      title: 'Slow Boring · What actually moves fertility rates (seeded media)',
      url: 'https://www.slowboring.com/p/what-actually-moves-fertility-rates',
      path: 'src/data/media.ts#sb-fertility-policy',
    },
    problemSlug: 'fertility-decline',
    sectorSlugs: ['demographics-and-society'],
    hook: 'Civilization runs on people. The replacement rate is not a vibe — it is arithmetic.',
    mediaIds: ['sb-fertility-policy'],
    voiceSlugs: ['elon-musk', 'tyler-cowen'],
  },
  {
    id: 'seed-longevity-engineering',
    kind: 'problem',
    title: "Longevity is an engineering project — and the clock is loud",
    claim:
      'Aging research has crossed from philosophy into fundable engineering, but institutions still treat it as fringe.',
    bullets: [
      'Global life expectancy improved for decades; healthy lifespan extension is the next step-change.',
      'Curing aging is as legitimate as curing any single disease (progress / good-quest framing).',
      'The bottleneck is coordinated capital + regulatory path, not pure impossibility.',
    ],
    source: {
      title: 'optimism.fun · Longevity',
      url: 'https://optimism.fun/p/longevity',
      path: 'src/data/problems.ts#longevity',
    },
    problemSlug: 'longevity',
    sectorSlugs: ['aging-and-longevity'],
    hook: 'We accept aging as fate. Every other medical fate we once accepted eventually became a product roadmap.',
    mediaIds: ['rop-longevity-not-too-late'],
    voiceSlugs: ['jason-crawford', 'trae-stephens', 'elon-musk'],
  },
  {
    id: 'seed-voice-choose-good-quests',
    kind: 'voice',
    title: 'Choose good quests',
    claim:
      'Talent and capital systematically underfund hard/good quests — the map of what is worth doing is broken.',
    bullets: [
      'A good quest makes the future better; markets still overfund easy/bad and underfund hard/good.',
      'Energy abundance, biosecurity, longevity, construction, and AGI safety sit in that underfunded quadrant.',
      'optimism.fun is the coordination layer: rank the quests, attach RFS, surface media and capital.',
    ],
    source: {
      title: 'Trae Stephens & Markie Wagner · Choose Good Quests',
      url: 'https://traestephens.substack.com/p/choose-good-quests',
      path: 'src/data/voices.ts#trae-stephens',
    },
    hook: 'Most ambitious people pick the wrong boss fight. The good quests are hard, underfunded, and unambiguously better if they work.',
    voiceSlugs: ['trae-stephens'],
  },
  {
    id: 'seed-deutsch-problems-soluble',
    kind: 'voice',
    title: 'Problems are soluble',
    claim:
      'All evils are caused by insufficient knowledge — problems are inevitable, and problems are soluble.',
    bullets: [
      'Deutsch’s Beginning of Infinity frames safety and progress as knowledge problems, not limit problems.',
      'Aligned AGI, better pedagogy, and scientific institutions are all conjectures open to criticism.',
      'This is the philosophical root of the optimism.fun manifesto and ranking posture.',
    ],
    source: {
      title: 'David Deutsch · The Beginning of Infinity',
      url: 'https://www.amazon.com/Beginning-Infinity-Explanations-Transform-World/dp/0143121359',
      path: 'src/data/voices.ts#david-deutsch',
    },
    problemSlug: 'ai-safety',
    hook: 'If a problem is not forbidden by physics, it is solvable — given the right knowledge.',
    voiceSlugs: ['david-deutsch'],
  },
]

function seedToMarkdown(seed) {
  const bullets = seed.bullets.map((b) => `- ${b}`).join('\n')
  const media =
    seed.mediaIds?.length ? `\n**Media ids:** ${seed.mediaIds.join(', ')}` : ''
  const voices =
    seed.voiceSlugs?.length
      ? `\n**Voice slugs:** ${seed.voiceSlugs.join(', ')}`
      : ''
  const hook = seed.hook ? `\n\n> Hook: ${seed.hook}\n` : '\n'
  return `# ${seed.title}

**id:** \`${seed.id}\`  
**kind:** ${seed.kind}${seed.problemSlug ? `  
**problem:** \`${seed.problemSlug}\`` : ''}

## Claim

${seed.claim}
${hook}
## Three bullets

${bullets}

## Source

- **${seed.source.title}**${seed.source.url ? `  
  ${seed.source.url}` : ''}${seed.source.path ? `  
  \`${seed.source.path}\`` : ''}
${media}${voices}

---
*Exported from optimism.fun seed library for essay→video (summon.guide / book.movie).*
`
}

/** Normalize Windows CRLF so line-based parsers stay stable. */
function normalize(src) {
  return src.replace(/\r\n/g, '\n')
}

/** First string value for `field: '...'` or `field: "..."`. */
function parseStringField(block, field) {
  const re = new RegExp(
    `${field}:\\s*(?:'((?:\\\\'|[^'])*)'|"((?:\\\\"|[^"])*)")`,
  )
  const m = block.match(re)
  if (!m) return undefined
  const raw = m[1] ?? m[2] ?? ''
  return raw.replace(/\\'/g, "'").replace(/\\"/g, '"')
}

function parseStringArrayField(block, field) {
  const re = new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`)
  const m = block.match(re)
  if (!m) return []
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
}

/** Split a TS array of objects into blocks starting at each `id:` or `slug:`. */
function splitObjectBlocks(src, key) {
  const text = normalize(src)
  const re = new RegExp(`\\{\\s*\\n\\s*${key}:\\s*'([^']+)'`, 'g')
  const matches = [...text.matchAll(re)]
  const blocks = []
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length
    blocks.push({ key: matches[i][1], body: text.slice(start, end) })
  }
  return blocks
}

function parseMediaItems(src) {
  return splitObjectBlocks(src, 'id')
    .filter((b) => b.body.includes('sourceId:'))
    .map((b) => ({
      id: b.key,
      title: parseStringField(b.body, 'title'),
      url: parseStringField(b.body, 'url'),
      sourceId: parseStringField(b.body, 'sourceId'),
      publishedAt: parseStringField(b.body, 'publishedAt'),
      excerpt: parseStringField(b.body, 'excerpt'),
      problemSlugs: parseStringArrayField(b.body, 'problemSlugs'),
      status: parseStringField(b.body, 'status') ?? 'live',
      path: `src/data/media.ts#${b.key}`,
    }))
}

function parseMediaSources(src) {
  return splitObjectBlocks(src, 'id')
    .filter((b) => b.body.includes('kind:'))
    .map((b) => ({
      id: b.key,
      kind: parseStringField(b.body, 'kind'),
      name: parseStringField(b.body, 'name'),
      author: parseStringField(b.body, 'author'),
      url: parseStringField(b.body, 'url'),
      feedUrl: parseStringField(b.body, 'feedUrl'),
      path: `src/data/media-sources.ts#${b.key}`,
    }))
}

function parseVoices(src) {
  // Top-level voices are indented with two spaces: `  {\n    slug:`
  const text = normalize(src)
  const re = /\n  \{\n    slug: '([^']+)'/g
  const matches = [...text.matchAll(re)]
  const voices = []
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length
    const body = text.slice(start, end)
    const slug = matches[i][1]
    voices.push({
      slug,
      name: parseStringField(body, 'name'),
      role: parseStringField(body, 'role'),
      org: parseStringField(body, 'org'),
      url: parseStringField(body, 'url'),
      positionCount: (body.match(/problemSlug:/g) || []).length,
      path: `src/data/voices.ts#${slug}`,
    })
  }
  return voices
}

function parseProblemSlugs(src) {
  // Known problem set from product — prefer explicit list over greedy parse.
  const known = [
    'ai-safety',
    'biosecurity',
    'energy-abundance',
    'housing-construction',
    'pedagogy',
    'infectious-disease',
    'scientific-productivity',
    'longevity',
    'fertility-decline',
    'loneliness',
    'extreme-poverty',
    'climate-change',
  ]
  const text = normalize(src)
  return known.filter((slug) => text.includes(`slug: '${slug}'`))
}

function brandAssets() {
  const brandDir = join(root, 'public', 'brand')
  const out = []
  if (!existsSync(brandDir)) return out
  for (const name of ['optimism-icon-rounded.svg', 'optimism-mark.svg']) {
    const p = join(brandDir, name)
    if (existsSync(p)) {
      out.push({
        id: `brand:${name}`,
        kind: 'brand',
        path: `public/brand/${name}`,
        url: `/brand/${name}`,
      })
    }
  }
  return out
}

function main() {
  mkdirSync(exportDir, { recursive: true })
  mkdirSync(libraryDir, { recursive: true })

  // --- essay seeds: json + md ---
  const catalog = {
    generatedAt: new Date().toISOString(),
    product: 'optimism.fun',
    purpose: 'essay→video seed library for summon.guide / book.movie',
    schema: {
      id: 'string',
      kind: 'problem | rfs | media | voice',
      title: 'string',
      claim: 'string',
      bullets: 'exactly 3 strings',
      source: '{ title, url?, path? }',
    },
    count: essaySeeds.length,
    seeds: essaySeeds,
  }

  writeFileSync(
    join(exportDir, 'essay-seeds.json'),
    JSON.stringify(catalog, null, 2) + '\n',
    'utf8',
  )
  writeFileSync(
    join(libraryDir, 'essay-seeds.json'),
    JSON.stringify(catalog, null, 2) + '\n',
    'utf8',
  )

  const indexLines = [
    '# Essay seed index',
    '',
    `Generated: ${catalog.generatedAt}`,
    '',
    '| id | kind | title | problem |',
    '| --- | --- | --- | --- |',
  ]
  for (const s of essaySeeds) {
    writeFileSync(join(exportDir, `${s.id}.md`), seedToMarkdown(s), 'utf8')
    writeFileSync(join(libraryDir, `${s.id}.md`), seedToMarkdown(s), 'utf8')
    indexLines.push(
      `| \`${s.id}\` | ${s.kind} | ${s.title} | ${s.problemSlug ?? '—'} |`,
    )
  }
  indexLines.push('')
  writeFileSync(join(exportDir, 'INDEX.md'), indexLines.join('\n'), 'utf8')
  writeFileSync(join(libraryDir, 'INDEX.md'), indexLines.join('\n'), 'utf8')

  // --- asset index from in-repo sources ---
  const mediaSrc = readFileSync(join(root, 'src/data/media.ts'), 'utf8')
  const sourcesSrc = readFileSync(
    join(root, 'src/data/media-sources.ts'),
    'utf8',
  )
  const voicesSrc = readFileSync(join(root, 'src/data/voices.ts'), 'utf8')
  const problemsSrc = readFileSync(join(root, 'src/data/problems.ts'), 'utf8')

  const mediaItems = parseMediaItems(mediaSrc)
  const mediaSources = parseMediaSources(sourcesSrc)
  const voices = parseVoices(voicesSrc)
  const problemSlugs = parseProblemSlugs(problemsSrc)

  const assetIndex = {
    generatedAt: catalog.generatedAt,
    product: 'optimism.fun',
    note:
      'In-repo shippable media source index. Desktop optimism.fun/hi/* is ARCHIVE — not merged.',
    counts: {
      essaySeeds: essaySeeds.length,
      mediaItems: mediaItems.length,
      mediaSources: mediaSources.length,
      voices: voices.length,
      problemSlugs: problemSlugs.length,
      brandAssets: brandAssets().length,
    },
    essaySeeds: essaySeeds.map((s) => ({
      id: s.id,
      kind: s.kind,
      title: s.title,
      problemSlug: s.problemSlug,
      path: `seeds/library/${s.id}.md`,
    })),
    mediaSources,
    mediaItems,
    voices,
    problems: problemSlugs.map((slug) => ({
      slug,
      path: `src/data/problems.ts#${slug}`,
      route: `/p/${slug}`,
    })),
    brand: brandAssets(),
    productRoutes: {
      home: '/',
      media: '/media',
      voices: '/voices',
      rfs: '/rfs',
      globe: '/globe',
      manifesto: '/manifesto',
      radar: '/radar',
    },
  }

  writeFileSync(
    join(root, 'seeds', 'asset-index.json'),
    JSON.stringify(assetIndex, null, 2) + '\n',
    'utf8',
  )
  writeFileSync(
    join(exportDir, 'asset-index.json'),
    JSON.stringify(assetIndex, null, 2) + '\n',
    'utf8',
  )

  console.log(
    JSON.stringify(
      {
        ok: true,
        exportDir: 'seeds/export',
        libraryDir: 'seeds/library',
        assetIndex: 'seeds/asset-index.json',
        counts: assetIndex.counts,
      },
      null,
      2,
    ),
  )
}

main()

