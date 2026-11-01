/**
 * Fails the build-checklist gates: no sub-14px utilities, no amber-* alias,
 * no 6-digit hex in TSX, and no edits to the four files another agent owns.
 */
import { spawnSync } from 'node:child_process'

function rg(args) {
  const result = spawnSync('rg', args, { encoding: 'utf8' })
  if (result.status === 1) return ''
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout)
    process.exit(result.status ?? 1)
  }
  return result.stdout
}

const failures = []

const skipMethodology = ['--glob', '!src/app/methodology/**']

const small = rg(['-n', 'text-\\[(9|10|11|12|13)', 'src', ...skipMethodology])
if (small.trim()) failures.push('text below 14px:\n' + small)

const arbitrary = rg(['-n', 'text-\\[', 'src', '--glob', '*.tsx', '--glob', '*.ts', ...skipMethodology])
if (arbitrary.trim()) failures.push('arbitrary text-[ utilities:\n' + arbitrary)

const aliased = new Set(['50', '100', '200', '300', '400', '500', '600'])
const amberUses = rg(['-o', 'amber-[0-9]+', 'src'])
const unaliased = [
  ...new Set(
    [...amberUses.matchAll(/amber-(\d+)/g)].map((match) => match[1]).filter((step) => !aliased.has(step)),
  ),
]
if (unaliased.length) {
  failures.push('amber step is not in the remapped scale: ' + unaliased.join(', '))
}
const configText = spawnSync('rg', ['-N', 'amber:', '-A', '12', 'tailwind.config.ts'], { encoding: 'utf8' })
const config = configText.stdout || ''
if (!config.includes("300: '#0C625B'") || !config.includes("200: '#0C625B'")) {
  failures.push('tailwind amber-200 and amber-300 must both alias to #0C625B')
}

const hex = rg(['-n', '#[0-9a-fA-F]{6}', 'src', '--glob', '*.tsx', ...skipMethodology])
if (hex.trim()) failures.push('hex literals in tsx:\n' + hex)

const diff = spawnSync('git', ['diff', '--name-only', 'origin/main'], { encoding: 'utf8' })
const forbidden = [
  'src/lib/priority.ts',
  'src/lib/radar.ts',
  'src/data/problems.ts',
  'src/data/discoveries.ts',
  'src/app/methodology/page.tsx',
]
const touched = (diff.stdout || '').split('\n').filter((file) => forbidden.includes(file))
if (touched.length) failures.push('forbidden files changed:\n' + touched.join('\n'))

if (failures.length) {
  console.error(failures.join('\n\n'))
  process.exit(1)
}
console.log('design gates passed')
