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

const small = rg(['-n', 'text-\\[(9|10|11|12|13)', 'src'])
if (small.trim()) failures.push('text below 14px:\n' + small)

const arbitrary = rg(['-n', 'text-\\[', 'src', '--glob', '*.tsx', '--glob', '*.ts'])
if (arbitrary.trim()) failures.push('arbitrary text-[ utilities:\n' + arbitrary)

const amber = rg(['-n', 'amber-', 'src'])
if (amber.trim()) failures.push('amber- alias still present:\n' + amber)

const hex = rg(['-n', '#[0-9a-fA-F]{6}', 'src', '--glob', '*.tsx'])
if (hex.trim()) failures.push('hex literals in tsx:\n' + hex)

const diff = spawnSync('git', ['diff', '--name-only', 'origin/main'], { encoding: 'utf8' })
const forbidden = ['src/lib/priority.ts', 'src/lib/radar.ts', 'src/data/problems.ts', 'src/data/discoveries.ts']
const touched = (diff.stdout || '').split('\n').filter((file) => forbidden.includes(file))
if (touched.length) failures.push('forbidden files changed:\n' + touched.join('\n'))

if (failures.length) {
  console.error(failures.join('\n\n'))
  process.exit(1)
}
console.log('design gates passed')
