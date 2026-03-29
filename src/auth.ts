import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || 'dev-secret-not-for-production',
  providers: [
    ...(process.env.AUTH_GOOGLE_ID
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account) return false

      try {
        const { getDb } = await import('@/lib/db')
        const sql = getDb()

        await sql`
          INSERT INTO players (email, display_name, google_id)
          VALUES (${user.email}, ${user.name || null}, ${account.providerAccountId})
          ON CONFLICT (email) DO UPDATE SET
            google_id = COALESCE(EXCLUDED.google_id, players.google_id),
            display_name = COALESCE(EXCLUDED.display_name, players.display_name),
            last_active_at = now()
        `
      } catch (err) {
        console.error('Auth sign-in upsert error:', err)
        // Don't block sign-in if DB upsert fails
      }

      return true
    },
    async jwt({ token, user, account }) {
      if (account && user?.email) {
        try {
          const { getDb } = await import('@/lib/db')
          const sql = getDb()
          const result = await sql`
            SELECT id FROM players WHERE email = ${user.email} LIMIT 1
          `
          if (result.length > 0) {
            token.playerId = result[0].id
          }
        } catch (err) {
          console.error('Auth JWT error:', err)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.playerId) {
        (session as unknown as Record<string, unknown>).playerId = token.playerId
      }
      return session
    },
  },
})
