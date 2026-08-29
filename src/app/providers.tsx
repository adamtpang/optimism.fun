'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_POSTHOG_DEBUG) return
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
    const configuredHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
    const apiHost = configuredHost?.startsWith('/')
      ? `${window.location.origin}${configuredHost}`
      : /^https?:\/\//i.test(configuredHost || '')
        ? configuredHost
        : `${window.location.origin}/ingest`

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: apiHost,
      ui_host: 'https://us.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: 'history_change',
      capture_pageleave: true,
      loaded: (ph) => {
        ph.register({ site: window.location.hostname })
      },
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
