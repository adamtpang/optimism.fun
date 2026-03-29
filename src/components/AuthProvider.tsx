'use client'

import { SessionProvider } from 'next-auth/react'

export default function AuthProvider({
  children,
  authConfigured,
}: {
  children: React.ReactNode
  authConfigured: boolean
}) {
  if (!authConfigured) return <>{children}</>
  return <SessionProvider>{children}</SessionProvider>
}
