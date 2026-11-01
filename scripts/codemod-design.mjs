/**
 * Mechanical design-token sweep. Skips the four files another agent owns.
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('src')
const skip = new Set([
  'src/lib/priority.ts',
  'src/lib/radar.ts',
  'src/data/problems.ts',
  'src/data/discoveries.ts',
])

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (/\.(tsx|ts|css)$/.test(entry.name)) out.push(full)
  }
  return out
}

function sizeToken(px) {
  if (px <= 14) return 'text-small'
  if (px <= 16) return 'text-body'
  if (px <= 18) return 'text-body-lg'
  if (px <= 22) return 'text-h3'
  if (px <= 32) return 'text-h2'
  if (px <= 42) return 'text-h1'
  if (px <= 56) return 'text-display-2'
  return 'text-display-1'
}

function replaceTextArbitrary(input) {
  return input.replace(/(?:[\w-]+:)*text-\[[^\]]+\]/g, (match) => {
    const prefixes = match.match(/^(?:[\w-]+:)*/)[0]
    const body = match.slice(prefixes.length)
    const px = body.match(/text-\[(\d+(?:\.\d+)?)px\]/)
    if (px) return prefixes + sizeToken(Number(px[1]))
    const rem = body.match(/text-\[(\d+(?:\.\d+)?)rem\]/)
    if (rem) return prefixes + sizeToken(Number(rem[1]) * 16)
    return prefixes + 'text-small'
  })
}

function replaceAmber(input) {
  let s = input
  s = s.replace(/stroke-amber-\d+/g, 'stroke-blue-600')
  s = s.replace(/fill-amber-\d+/g, 'fill-blue-600')
  s = s.replace(/hover:bg-amber-\d+(?:\/\[[^\]]+\]|\/\d+)?/g, 'hover:bg-primary/90')
  s = s.replace(/amber-50\b/g, 'teal-50')
  s = s.replace(/amber-100\b/g, 'teal-100')
  s = s.replace(/amber-200\b/g, 'primary')
  s = s.replace(/amber-300\b/g, 'primary')
  s = s.replace(/amber-400\b/g, 'primary')
  s = s.replace(/amber-500\b/g, 'primary')
  s = s.replace(/amber-600\b/g, 'primary')
  return s
}

function replaceHex(input) {
  return input.replace(/#([0-9a-fA-F]{6})\b/g, (m, hex) => {
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgb(${r}, ${g}, ${b})`
  })
}

function shells(input) {
  return input
    .replaceAll('max-w-7xl mx-auto px-6', 'site-shell')
    .replaceAll('max-w-7xl mx-auto px-4 sm:px-6', 'site-shell')
    .replaceAll('max-w-6xl mx-auto px-6', 'site-shell')
    .replaceAll('max-w-6xl mx-auto px-4 sm:px-6', 'site-shell')
    .replaceAll('max-w-5xl mx-auto px-6', 'site-shell')
    .replaceAll('max-w-5xl mx-auto px-4 sm:px-6', 'site-shell')
    .replaceAll('max-w-4xl mx-auto px-6', 'site-shell')
    .replaceAll('max-w-4xl mx-auto px-4 sm:px-6', 'site-shell')
    .replaceAll('max-w-3xl mx-auto px-6', 'site-shell')
    .replaceAll('max-w-3xl mx-auto px-4 sm:px-6', 'site-shell')
    .replaceAll('max-w-2xl mx-auto px-6', 'site-shell')
    .replaceAll('max-w-2xl mx-auto px-4 sm:px-6', 'site-shell')
}

const files = walk(root)
let changed = 0
for (const file of files) {
  const rel = file.replace(/\\/g, '/').split('/src/').slice(1).join('/src/').replace(/^/, 'src/')
  const relPath = path.relative(process.cwd(), file).split(path.sep).join('/')
  if (skip.has(relPath)) continue
  if (relPath.startsWith('src/components/ui/')) continue
  let text = fs.readFileSync(file, 'utf8')
  const original = text
  if (relPath.endsWith('.tsx') || relPath.endsWith('.ts')) {
    text = replaceTextArbitrary(text)
    text = replaceAmber(text)
    text = text.replace(/\s*tracking-ultra-wide/g, '')
    text = text.replace(/fontSize="(\d+(?:\.\d+)?)"/g, (_, n) => `fontSize="${Number(n) < 14 ? 14 : n}"`)
    text = text.replace(/fontSize=\{(\d+(?:\.\d+)?)\}/g, (_, n) => `fontSize={${Number(n) < 14 ? 14 : n}}`)
    text = text.replace(/\smin-w-\[560px\]/g, '')
    if (relPath.endsWith('.tsx')) text = replaceHex(text)
    text = text.replace(/\sbackdrop-blur(?:-\w+)?/g, '')
    text = shells(text)
  }
  if (text !== original) {
    fs.writeFileSync(file, text)
    changed++
  }
}
console.log(`updated ${changed} files`)
