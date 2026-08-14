'use client'

/**
 * Starter pack — names, the assumption that kills it, the first artifact, and a
 * paste-ready Claude Code prompt carrying the index's own evidence.
 *
 * The prompt is the useful part: it arrives pre-loaded with the demand score,
 * the unserved gap, and the named competitors, so a founder starts from proof
 * rather than enthusiasm.
 */
import { useState } from 'react'
import type { StarterPack } from '@/data/starter-packs'

export default function StarterPackBlock({
  pack,
  prompt,
}: {
  pack: StarterPack
  prompt: string
}) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mt-5 border border-hair rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-ink-800/30 transition-colors"
      >
        <span className="font-mono text-[10px] uppercase tracking-wide text-amber-300">
          Starter pack — names, the risk, and a prompt to begin
        </span>
        <span className="font-mono text-[11px] text-ink-500">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-hair pt-4">
          {/* names */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-500 mb-2">
              Three names
            </p>
            <div className="flex flex-wrap gap-2">
              {pack.names.map((n) => (
                <span
                  key={n.name}
                  className="inline-flex items-baseline gap-1.5 border border-hair rounded px-2 py-1"
                  title={n.note}
                >
                  <span className="font-sans text-[13px] text-ink-100">{n.name}</span>
                  <span className="font-mono text-[9.5px] text-ink-500">{n.note}</span>
                </span>
              ))}
            </div>
          </div>

          {/* the risk */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-terminal-rose mb-1">
                Riskiest assumption
              </p>
              <p className="text-ink-300 text-[13px] leading-relaxed">{pack.riskiestAssumption}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-terminal-green mb-1">
                First artifact — days, not months
              </p>
              <p className="text-ink-300 text-[13px] leading-relaxed">{pack.firstArtifact}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-500 mb-1">
              Who has to say yes
            </p>
            <p className="text-ink-300 text-[13px] leading-relaxed">{pack.gatekeeper}</p>
          </div>

          {/* domain ideas */}
          {pack.domainIdeas && pack.domainIdeas.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-500 mb-2">
                Domains — deploy on Vercel this weekend
              </p>
              <div className="space-y-1.5">
                {pack.domainIdeas.map((d) => (
                  <div key={d.domain} className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-mono text-[12.5px] text-amber-300">{d.domain}</span>
                    <span className="text-ink-500 text-[11.5px]">{d.note}</span>
                  </div>
                ))}
              </div>
              <p className="mt-1.5 font-mono text-[9.5px] text-ink-600">
                Not verified live — check availability at registration.
              </p>
            </div>
          )}

          {/* capital firms */}
          {pack.capitalFirms && pack.capitalFirms.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-500 mb-2">
                Who to pitch — real, opinionated, sourced
              </p>
              <div className="space-y-2.5">
                {pack.capitalFirms.map((f) => (
                  <div key={f.name}>
                    <p className="text-ink-100 text-[13px] font-medium">{f.name}</p>
                    <p className="text-ink-400 text-[12px] leading-relaxed">
                      {f.fit}{' '}
                      <a
                        href={f.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                      >
                        {f.source}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* the prompt */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-500">
                Paste into Claude Code
              </p>
              <button
                type="button"
                onClick={copy}
                className="font-mono text-[10px] px-2 py-1 border border-hair rounded text-ink-300 hover:text-amber-300 hover:border-amber-300/40 transition-colors"
              >
                {copied ? 'copied' : 'copy prompt'}
              </button>
            </div>
            <pre className="text-[11px] leading-relaxed text-ink-400 bg-ink-900/60 rounded p-3 overflow-x-auto whitespace-pre-wrap font-mono">
              {prompt}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
