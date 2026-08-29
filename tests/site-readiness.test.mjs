import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import nextConfig, { contentSecurityPolicy, securityHeaders } from '../next.config.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8')

test('security headers are enforced on every route with explicit source allowlists', async () => {
  const configured = await nextConfig.headers()
  assert.equal(configured.length, 1)
  assert.equal(configured[0].source, '/:path*')
  assert.deepEqual(configured[0].headers, securityHeaders)

  const byName = new Map(securityHeaders.map(({ key, value }) => [key.toLowerCase(), value]))
  assert.equal(byName.get('x-content-type-options'), 'nosniff')
  assert.equal(byName.get('x-frame-options'), 'DENY')
  assert.equal(byName.get('referrer-policy'), 'strict-origin-when-cross-origin')
  assert.equal(byName.get('content-security-policy'), contentSecurityPolicy)
  assert.match(contentSecurityPolicy, /default-src 'self'/)
  assert.match(contentSecurityPolicy, /frame-ancestors 'none'/)
  assert.match(contentSecurityPolicy, /object-src 'none'/)
  assert.match(contentSecurityPolicy, /form-action 'self'/)
  assert.doesNotMatch(contentSecurityPolicy, /(?:^|[ ;])\*(?:[ ;]|$)/)
  assert.doesNotMatch(contentSecurityPolicy, /unsafe-eval/)
})

test('the PostHog proxy uses an absolute same-origin URL compatible with CSP', async () => {
  const providers = await read('src/app/providers.tsx')
  assert.match(providers, /configuredHost\?\.startsWith\('\/'\)/)
  assert.match(providers, /`\$\{window\.location\.origin\}\$\{configuredHost\}`/)
  assert.match(providers, /configuredHost \|\| `\$\{window\.location\.origin\}\/ingest`/)
  assert.match(providers, /api_host: apiHost/)
  assert.match(contentSecurityPolicy, /connect-src 'self'/)
})

test('the two formerly unnamed homepage controls have stable accessible names', async () => {
  const [radar, newsletter] = await Promise.all([
    read('src/components/RadarClient.tsx'),
    read('src/components/EmailCapture.tsx'),
  ])
  assert.match(radar, /aria-label="Search ranked problems"/)
  assert.match(newsletter, /aria-label="Email address"/)
})

test('trust and agent-discovery pages are substantive and linked', async () => {
  const [footer, about, contact, privacy, llms] = await Promise.all([
    read('src/components/Footer.tsx'),
    read('src/app/about/page.tsx'),
    read('src/app/contact/page.tsx'),
    read('src/app/privacy/page.tsx'),
    read('public/llms.txt'),
  ])

  for (const route of ['/about', '/contact', '/privacy']) {
    assert.match(footer, new RegExp(`href="${route}"`))
  }
  assert.ok(about.length > 2_000)
  assert.ok(contact.length > 2_000)
  assert.ok(privacy.length > 5_000)
  assert.match(llms, /https:\/\/optimism\.fun\/methodology/)
  assert.match(llms, /does not advertise a supported public API/)
  assert.match(llms, /https:\/\/optimism\.fun\/privacy/)
})
