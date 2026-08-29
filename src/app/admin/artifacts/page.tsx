import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FIGMA_ARTIFACT_FACTORY_URL, infographicBriefs } from '@/data/infographics'
import { isDbConfigured } from '@/lib/db'
import { ensureSocialPost, listSocialPosts } from '@/lib/social-posts'
import ArtifactQueueRow from './ArtifactQueueRow'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Artifact queue · admin', robots: { index: false, follow: false } }

export default async function ArtifactQueuePage() {
  const configured = isDbConfigured()
  if (configured) {
    await Promise.all(infographicBriefs.flatMap((brief) => [
      ensureSocialPost(brief.slug, 'x'),
      ensureSocialPost(brief.slug, 'instagram'),
    ]))
  }
  const posts = configured ? await listSocialPosts() : []
  const titleBySlug = new Map(infographicBriefs.map((brief) => [brief.slug, brief.title]))

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-5xl mx-auto px-6">
            <Link href="/artifacts" className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 hover:text-amber-300">&larr; artifact factory</Link>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">admin · social approval queue</p>
            <h1 className="mt-2 font-serif text-4xl text-ink-100">Nothing posts itself.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-300">Save the final PNG at a public HTTPS URL, approve the exact platform copy, then release it. The final editable source remains in <a className="text-amber-300 hover:text-amber-200" href={FIGMA_ARTIFACT_FACTORY_URL} target="_blank" rel="noreferrer">Figma</a>.</p>
          </div>
        </section>
        <section className="max-w-5xl mx-auto px-6 py-10">
          {!configured ? (
            <div className="border border-amber-300/40 bg-amber-300/[0.04] p-6 text-sm leading-relaxed text-ink-300">Run <code className="text-amber-300">scripts/db/0004_social_posts.sql</code> in Neon after setting <code className="text-amber-300">DATABASE_URL</code>. The queue persists approvals and publish audit data there.</div>
          ) : <div className="grid gap-4">{posts.map((post) => <ArtifactQueueRow key={post.id} post={post} title={titleBySlug.get(post.briefSlug) ?? post.briefSlug} />)}</div>}
        </section>
      </main>
      <Footer />
    </>
  )
}

