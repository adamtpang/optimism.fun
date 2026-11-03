'use client'

import { useState, type FormEvent } from 'react'
import type { AskResponse, SimilarResponse } from '@/lib/research/ask'
import type { ResearchPaper } from '@/lib/research/shape'

const STATUS_CLASS: Record<ResearchPaper['status'], string> = {
  'peer-reviewed': 'text-terminal-green border-terminal-green/40',
  preprint: 'text-primary border-primary/70',
  corrected: 'text-terminal-cyan border-terminal-cyan/50',
  retracted: 'text-terminal-rose border-terminal-rose/70',
  concern: 'text-terminal-rose border-terminal-rose/70',
  unverified: 'text-ink-400 border-hair',
  unknown: 'text-ink-400 border-hair',
}

function CitationLine({ paper, struck = false }: { paper: ResearchPaper; struck?: boolean }) {
  return (
    <p className={`text-body leading-relaxed text-ink-100 ${struck ? 'line-through decoration-terminal-rose' : ''}`}>
      {paper.authors}
      {paper.year ? `. ${paper.year}` : ''}
      {`. ${paper.title}`}
      {paper.venue ? `. ${paper.venue}` : ''}
      {paper.href ? (
        <>
          {'. '}
          <a href={paper.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
            {paper.hrefLabel}
          </a>
        </>
      ) : (
        '. No DOI, arXiv, or PubMed link.'
      )}
    </p>
  )
}

function StatusTag({ paper }: { paper: ResearchPaper }) {
  return (
    <span className={`font-mono text-small uppercase tracking-wider border px-1.5 py-px ${STATUS_CLASS[paper.status]}`}>
      {paper.statusLabel}
    </span>
  )
}

function CitedSentenceText({ text, citations }: { text: string; citations: ResearchPaper[] }) {
  const parts = text.split(/(\[\d+\])/g)
  return (
    <p className="text-body leading-relaxed text-ink-100">
      {parts.map((part, index) => {
        const match = part.match(/^\[(\d+)\]$/)
        if (!match) return <span key={index}>{part}</span>
        const n = Number(match[1])
        const cite = citations.find((item) => item.n === n)
        const label = `[${n}]`
        if (!cite?.href) {
          return (
            <sup key={index} className="font-mono text-small text-primary">
              {label}
            </sup>
          )
        }
        return (
          <sup key={index}>
            <a href={cite.href} target="_blank" rel="noopener noreferrer" className="font-mono text-small text-primary hover:underline">
              {label}
            </a>
          </sup>
        )
      })}
    </p>
  )
}

function PaperCard({
  paper,
  struck = false,
  onRelated,
}: {
  paper: ResearchPaper
  struck?: boolean
  onRelated: (url: string) => void
}) {
  return (
    <article className={`border border-hair bg-ink-900 p-5 ${struck ? 'border-l-2 border-l-terminal-rose' : ''}`}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {paper.n ? <span className="font-mono text-small text-primary">[{paper.n}]</span> : null}
        <StatusTag paper={paper} />
        {paper.citationCount ? <span className="font-mono text-small text-ink-400">{paper.citationCount}</span> : null}
      </div>
      <CitationLine paper={paper} struck={struck} />
      {struck ? <p className="mt-2 text-small text-terminal-rose">Retracted. Not used as support.</p> : null}
      {paper.excerpt ? (
        <p className="mt-3 text-small leading-relaxed text-ink-300">
          <span className="font-mono uppercase tracking-wider text-ink-500">
            {paper.excerptKind === 'summary' ? 'Summary. ' : 'Excerpt. '}
          </span>
          {paper.excerpt}
        </p>
      ) : null}
      {paper.dropReason ? <p className="mt-3 text-small text-ink-400">{paper.dropReason}</p> : null}
      <button
        type="button"
        onClick={() => onRelated(paper.sourceUrl)}
        className="mt-4 inline-flex items-center min-h-11 px-3 font-mono text-small uppercase tracking-wider border border-primary/40 text-primary hover:bg-primary/10"
      >
        Related work
      </button>
    </article>
  )
}

async function postJson<T>(path: string, body: unknown): Promise<{ ok: boolean; data: T | null; fallback: string }> {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = (await res.json()) as T
    return { ok: res.ok, data, fallback: res.ok ? '' : `Request failed (HTTP ${res.status}).` }
  } catch {
    return { ok: false, data: null, fallback: 'The request failed before a response arrived.' }
  }
}

export default function ResearchDesk({ configured }: { configured: boolean }) {
  const [question, setQuestion] = useState('')
  const [asking, setAsking] = useState(false)
  const [askError, setAskError] = useState<string | null>(null)
  const [answer, setAnswer] = useState<AskResponse | null>(null)
  const [paperUrl, setPaperUrl] = useState('')
  const [finding, setFinding] = useState(false)
  const [similarError, setSimilarError] = useState<string | null>(null)
  const [similar, setSimilar] = useState<SimilarResponse | null>(null)

  async function ask(event: FormEvent) {
    event.preventDefault()
    setAsking(true)
    setAskError(null)
    const { data, fallback } = await postJson<AskResponse>('/api/research/ask', { question })
    setAsking(false)
    if (!data) {
      setAskError(fallback)
      return
    }
    setAnswer(data)
    if (data.configured && data.error) setAskError(data.error)
  }

  async function findSimilar(url: string) {
    setPaperUrl(url)
    setFinding(true)
    setSimilarError(null)
    const { data, fallback } = await postJson<SimilarResponse>('/api/research/similar', { url })
    setFinding(false)
    if (!data) {
      setSimilarError(fallback)
      return
    }
    setSimilar(data)
    if (data.configured && data.error) setSimilarError(data.error)
  }

  const live = answer && answer.configured && Array.isArray(answer.sentences) ? answer : null
  const related = similar && similar.configured && Array.isArray(similar.papers) ? similar : null
  const unconfigured = configured === false || answer?.configured === false || similar?.configured === false

  return (
    <div className="space-y-12">
      {unconfigured ? (
        <div className="border border-primary/40 bg-primary/[0.04] p-6" role="status">
          <p className="font-mono text-small uppercase tracking-wider text-primary">Exa not configured</p>
          <p className="mt-2 text-body text-ink-300">
            The server has no EXA_API_KEY, so this page does not call Exa. Nothing here is a finding.
          </p>
        </div>
      ) : null}

      <form onSubmit={ask} className="space-y-3">
        <label htmlFor="research-question" className="block font-mono text-small uppercase tracking-wider text-ink-500">
          Research question
        </label>
        <textarea
          id="research-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={4}
          maxLength={1000}
          disabled={!configured || asking}
          placeholder="Ask a question a paper can answer."
          className="w-full border border-hair bg-ink-900 px-4 py-3 text-body text-ink-100 placeholder:text-ink-500 disabled:opacity-60"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!configured || asking || question.trim().length < 8}
            className="inline-flex items-center min-h-11 px-4 font-mono text-small uppercase tracking-wider border border-primary bg-primary text-ink-900 disabled:opacity-40"
          >
            {asking ? 'Searching papers' : 'Ask'}
          </button>
          <p className="text-small text-ink-500">8 to 1000 characters. A sentence without a retrieved source is not a finding.</p>
        </div>
      </form>

      {askError ? (
        <p className="border border-terminal-rose/60 bg-terminal-rose/10 px-4 py-3 text-body text-terminal-rose" role="alert">
          {askError}
        </p>
      ) : null}

      {live && live.sentences.length > 0 ? (
        <section aria-label="Cited answer" className="space-y-4">
          <h2 className="font-serif text-2xl text-ink-100">Cited answer</h2>
          {live.sentences.map((sentence) => (
            <CitedSentenceText key={sentence.text} text={sentence.text} citations={live.citations} />
          ))}
        </section>
      ) : null}

      {live && live.sentences.length === 0 && !askError ? (
        <p className="text-body text-ink-400">No cited answer. Sentences without a retrieved source are not shown as findings.</p>
      ) : null}

      {live && live.citations.length > 0 ? (
        <section aria-label="Sources" className="space-y-4">
          <h2 className="font-serif text-2xl text-ink-100">Sources</h2>
          <div className="space-y-4">
            {live.citations.map((paper) => (
              <PaperCard key={`${paper.n}-${paper.sourceUrl}`} paper={paper} onRelated={findSimilar} />
            ))}
          </div>
        </section>
      ) : null}

      {live && live.retrieved.length > 0 ? (
        <section aria-label="Retrieved papers" className="space-y-4">
          <h2 className="font-serif text-2xl text-ink-100">Retrieved, not cited</h2>
          <p className="text-small text-ink-400">Exa returned text for these papers. They do not support the answer above.</p>
          <div className="space-y-4">
            {live.retrieved.map((paper) => (
              <PaperCard key={paper.sourceUrl} paper={paper} onRelated={findSimilar} />
            ))}
          </div>
        </section>
      ) : null}

      {live && live.retracted.length > 0 ? (
        <section aria-label="Retracted" className="space-y-4">
          <h2 className="font-serif text-2xl text-ink-100">Retracted</h2>
          <div className="space-y-4">
            {live.retracted.map((paper) => (
              <PaperCard key={paper.sourceUrl} paper={paper} struck onRelated={findSimilar} />
            ))}
          </div>
        </section>
      ) : null}

      {live && live.coverage.length > 0 ? (
        <section aria-label="Coverage" className="space-y-3">
          <h2 className="font-serif text-2xl text-ink-100">Coverage</h2>
          <p className="text-small text-ink-400">News and press releases. Not evidence.</p>
          <ul className="space-y-2">
            {live.coverage.map((link) => (
              <li key={link.url} className="text-body">
                <span className="font-mono text-small uppercase tracking-wider text-ink-500 mr-2">Coverage</span>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-label="Related work" className="space-y-4 border-t border-hair pt-10">
        <h2 className="font-serif text-2xl text-ink-100">Related work</h2>
        <p className="text-body text-ink-400">
          Find similar research papers from a result above, or paste a paper URL.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void findSimilar(paperUrl)
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <label htmlFor="paper-url" className="sr-only">
            Paper URL
          </label>
          <input
            id="paper-url"
            type="url"
            value={paperUrl}
            onChange={(event) => setPaperUrl(event.target.value)}
            placeholder="https://doi.org/..."
            disabled={!configured || finding}
            className="min-w-0 flex-1 border border-hair bg-ink-900 px-4 py-3 text-body text-ink-100 placeholder:text-ink-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!configured || finding || paperUrl.trim().length < 8}
            className="inline-flex items-center justify-center min-h-11 px-4 font-mono text-small uppercase tracking-wider border border-primary/40 text-primary disabled:opacity-40"
          >
            {finding ? 'Finding papers' : 'Find similar'}
          </button>
        </form>
        {similarError ? (
          <p className="border border-terminal-rose/60 bg-terminal-rose/10 px-4 py-3 text-body text-terminal-rose" role="alert">
            {similarError}
          </p>
        ) : null}
        {related && related.papers.length === 0 && !similarError ? (
          <p className="text-body text-ink-400">No similar papers with retrieved text.</p>
        ) : null}
        {related && related.papers.length > 0 ? (
          <div className="space-y-4">
            {related.papers.map((paper) => (
              <PaperCard key={paper.sourceUrl} paper={paper} onRelated={findSimilar} />
            ))}
          </div>
        ) : null}
        {related && related.retracted.length > 0 ? (
          <div className="space-y-4">
            {related.retracted.map((paper) => (
              <PaperCard key={paper.sourceUrl} paper={paper} struck onRelated={findSimilar} />
            ))}
          </div>
        ) : null}
        {related && related.coverage.length > 0 ? (
          <ul className="space-y-2">
            {related.coverage.map((link) => (
              <li key={link.url} className="text-body">
                <span className="font-mono text-small uppercase tracking-wider text-ink-500 mr-2">Coverage</span>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  )
}
