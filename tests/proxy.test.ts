/**
 * The /admin/* gate.
 *
 * This is the only thing standing between the public and the commitment review
 * queue, where approving a row publishes it to the board. It was renamed from
 * middleware.ts to proxy.ts for Next 16, and a rename that quietly stops the
 * gate from running looks exactly like a rename that works: the pages still
 * load in dev either way.
 *
 * So the behaviour is pinned here rather than trusted. These assertions are
 * about the gate's own logic; that Next actually invokes it for /admin/* is a
 * separate fact, covered by the matcher assertion plus the export-name check.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { proxy, config } from '@/proxy'

const url = 'https://optimism.fun/admin/commitments'

const basic = (user: string, password: string) =>
  new NextRequest(url, {
    headers: {
      authorization: `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`,
    },
  })

const original = { ...process.env }

beforeEach(() => {
  delete process.env.ADMIN_PASSWORD
})

afterEach(() => {
  process.env = { ...original }
})

describe('the /admin gate', () => {
  it('is wired to every admin path and nothing else', () => {
    expect(config.matcher).toEqual(['/admin/:path*'])
  })

  it('exports the Next 16 name, not the deprecated one', async () => {
    const mod = await import('@/proxy')
    expect(typeof mod.proxy).toBe('function')
    // If a future rename reintroduces `middleware`, Next 16 ignores it and the
    // admin area silently becomes public. Fail loudly instead.
    expect('middleware' in mod).toBe(false)
  })

  it('challenges an unauthenticated request when a password is set', () => {
    process.env.ADMIN_PASSWORD = 'correct-horse'
    const res = proxy(new NextRequest(url))
    expect(res.status).toBe(401)
    expect(res.headers.get('WWW-Authenticate')).toContain('Basic')
  })

  it('rejects the wrong password', () => {
    process.env.ADMIN_PASSWORD = 'correct-horse'
    expect(proxy(basic('admin', 'battery-staple')).status).toBe(401)
  })

  it('accepts the right password regardless of username', () => {
    process.env.ADMIN_PASSWORD = 'correct-horse'
    expect(proxy(basic('anyone', 'correct-horse')).status).toBe(200)
    expect(proxy(basic('', 'correct-horse')).status).toBe(200)
  })

  it('accepts a password that contains a colon', () => {
    // The parser splits on the FIRST colon, so everything after it is the
    // password. A naive split would break any password containing one.
    process.env.ADMIN_PASSWORD = 'a:b:c'
    expect(proxy(basic('admin', 'a:b:c')).status).toBe(200)
  })

  it('rejects a malformed authorization header instead of throwing', () => {
    process.env.ADMIN_PASSWORD = 'correct-horse'
    const res = proxy(
      new NextRequest(url, { headers: { authorization: 'Basic !!!not-base64!!!' } }),
    )
    expect(res.status).toBe(401)
  })

  it('refuses to serve admin at all in production with no password set', () => {
    // Fail closed. An unconfigured production deploy must not expose the queue.
    const prev = process.env.NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', configurable: true })
    const res = proxy(new NextRequest(url))
    expect(res.status).toBe(503)
    Object.defineProperty(process.env, 'NODE_ENV', { value: prev, configurable: true })
  })

  it('stays open in development with no password, so localhost is not blocked', () => {
    expect(proxy(new NextRequest(url)).status).toBe(200)
  })
})
