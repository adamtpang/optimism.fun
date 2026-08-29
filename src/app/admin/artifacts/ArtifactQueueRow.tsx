'use client'

import { useState, useTransition } from 'react'
import type { SocialPost } from '@/lib/social-posts'
import {
  approveArtifactPostAction,
  publishArtifactPostAction,
  setArtifactAssetAction,
  setArtifactXMediaAction,
} from './actions'

export default function ArtifactQueueRow({ post, title }: { post: SocialPost; title: string }) {
  const [pending, startTransition] = useTransition()
  const [assetUrl, setAssetUrl] = useState(post.assetUrl ?? '')
  const [xMediaId, setXMediaId] = useState(post.xMediaId ?? '')
  const [message, setMessage] = useState('')
  // Provider credentials remain server-only. The publish action validates them
  // again, while the client can still block the universal missing-asset gate.
  const gates = [
    ...(post.assetUrl ? [] : ['a public HTTPS image URL']),
    ...(post.platform === 'x' && !post.xMediaId ? ['an uploaded X media ID'] : []),
  ]

  function run(work: () => Promise<void>) {
    setMessage('')
    startTransition(async () => {
      try {
        await work()
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Action failed')
      }
    })
  }

  return (
    <article className="border border-hair bg-ink-900 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1">
            {post.platform} · {post.status}
          </p>
          <h2 className="font-serif text-xl text-ink-100">{title}</h2>
        </div>
        {post.providerPostId && <span className="font-mono text-[10px] text-terminal-green">published: {post.providerPostId}</span>}
      </div>
      <p className="whitespace-pre-line text-sm leading-relaxed text-ink-300 mb-4">{post.body}</p>
      <label className="block mb-4">
        <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">Public final image URL</span>
        <div className="mt-1 flex gap-2">
          <input
            value={assetUrl}
            onChange={(event) => setAssetUrl(event.target.value)}
            placeholder="https://.../ntd-1080x1350.png"
            className="min-w-0 flex-1 border border-hair bg-ink-950 px-3 py-2 font-mono text-[11px] text-ink-200 outline-none focus:border-amber-300"
          />
          <button onClick={() => run(() => setArtifactAssetAction(post.id, assetUrl))} disabled={pending || !assetUrl} className="border border-hair px-3 font-mono text-[10px] uppercase tracking-wider text-ink-300 hover:border-amber-300 hover:text-amber-300 disabled:opacity-40">
            Save asset
          </button>
        </div>
      </label>
      {post.platform === 'x' && (
        <label className="block mb-4">
          <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">Uploaded X media ID</span>
          <div className="mt-1 flex gap-2">
            <input value={xMediaId} onChange={(event) => setXMediaId(event.target.value)} placeholder="numeric media ID" className="min-w-0 flex-1 border border-hair bg-ink-950 px-3 py-2 font-mono text-[11px] text-ink-200 outline-none focus:border-amber-300" />
            <button onClick={() => run(() => setArtifactXMediaAction(post.id, xMediaId))} disabled={pending || !xMediaId} className="border border-hair px-3 font-mono text-[10px] uppercase tracking-wider text-ink-300 hover:border-amber-300 hover:text-amber-300 disabled:opacity-40">Save X media</button>
          </div>
        </label>
      )}
      {gates.length > 0 && <p className="mb-4 font-mono text-[10px] leading-relaxed text-ink-500">Release gates: {gates.join(' · ')}</p>}
      {post.lastError && <p className="mb-4 font-mono text-[10px] text-terminal-rose">Last publish error: {post.lastError}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => run(() => approveArtifactPostAction(post.id))} disabled={pending || post.status === 'approved' || post.status === 'published'} className="border border-terminal-green/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-terminal-green hover:bg-terminal-green/[0.08] disabled:opacity-40">
          {post.status === 'approved' ? 'approved' : 'approve'}
        </button>
        <button onClick={() => run(() => publishArtifactPostAction(post.id))} disabled={pending || post.status !== 'approved' || gates.length > 0} className="border border-amber-300/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-amber-300 hover:bg-amber-300/[0.08] disabled:opacity-40">
          Publish to {post.platform}
        </button>
        {pending && <span className="font-mono text-[10px] text-ink-500">working...</span>}
        {message && <span className="font-mono text-[10px] text-terminal-rose">{message}</span>}
      </div>
    </article>
  )
}

