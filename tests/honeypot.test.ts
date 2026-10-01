/**
 * The honeypot check is pure, so it is tested directly. The route answers a
 * tripped honeypot with a fake success and writes nothing; what is pinned here
 * is which bodies count as tripped.
 */
import { describe, it, expect } from 'vitest'
import { isHoneypotTripped, HONEYPOT_FIELD } from '@/lib/commitments'

describe('isHoneypotTripped', () => {
  it('passes a real submission, which never carries the field or leaves it empty', () => {
    expect(isHoneypotTripped({ name: 'Ada', proof: 'real work' })).toBe(false)
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: '' })).toBe(false)
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: '   ' })).toBe(false)
  })

  it('trips when a bot fills the hidden field', () => {
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: 'https://gkyblzyyqobz.com' })).toBe(true)
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: 'x' })).toBe(true)
  })

  it('does not trip on non-string values or non-object bodies', () => {
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: 123 })).toBe(false)
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: null })).toBe(false)
    expect(isHoneypotTripped(null)).toBe(false)
    expect(isHoneypotTripped('website=spam')).toBe(false)
  })
})
