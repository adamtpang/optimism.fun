'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Domain } from '@/data/types'
import type { CtaKind } from '@/data/ctas'
import {
  OFFERS,
  SKILLS,
  matchWhere,
  type OfferId,
  type SkillId,
  type WhereCatalog,
} from '@/lib/where-match'

const KIND_LABEL: Record<CtaKind, string> = {
  build: 'Build',
  fund: 'Fund',
  buy: 'Buy',
  learn: 'Learn',
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

export default function WhereMatcher({ catalog }: { catalog: WhereCatalog }) {
  const [skills, setSkills] = useState<SkillId[]>([])
  const [interests, setInterests] = useState<Domain[]>([])
  const [offers, setOffers] = useState<OfferId[]>([])

  const matches = useMemo(
    () =>
      matchWhere({
        skills,
        interests,
        offers,
        problems: catalog.problems,
        risks: catalog.risks,
        ctas: catalog.ctas,
      }),
    [skills, interests, offers, catalog],
  )

  return (
    <div>
      <fieldset className="border border-hair p-4">
        <legend className="font-mono text-small uppercase tracking-wider text-ink-500 px-1">Skills</legend>
        <div className="flex flex-wrap gap-2 mt-2">
          {SKILLS.map((skill) => {
            const on = skills.includes(skill.id)
            return (
              <button
                key={skill.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSkills((prev) => toggle(prev, skill.id))}
                className={`px-3 py-2 text-sm border ${
                  on ? 'border-primary text-ink-100 bg-primary/10' : 'border-hair text-ink-300 hover:border-primary'
                }`}
              >
                {skill.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="border border-hair p-4 mt-3">
        <legend className="font-mono text-small uppercase tracking-wider text-ink-500 px-1">Interests</legend>
        <div className="flex flex-wrap gap-2 mt-2">
          {catalog.interests.map((interest) => {
            const on = interests.includes(interest.id)
            return (
              <button
                key={interest.id}
                type="button"
                aria-pressed={on}
                onClick={() => setInterests((prev) => toggle(prev, interest.id))}
                className={`px-3 py-2 text-sm border ${
                  on ? 'border-primary text-ink-100 bg-primary/10' : 'border-hair text-ink-300 hover:border-primary'
                }`}
              >
                {interest.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="border border-hair p-4 mt-3">
        <legend className="font-mono text-small uppercase tracking-wider text-ink-500 px-1">What you can offer</legend>
        <div className="flex flex-wrap gap-2 mt-2">
          {OFFERS.map((offer) => {
            const on = offers.includes(offer.id)
            return (
              <button
                key={offer.id}
                type="button"
                aria-pressed={on}
                onClick={() => setOffers((prev) => toggle(prev, offer.id))}
                className={`px-3 py-2 text-sm border text-left ${
                  on ? 'border-primary text-ink-100 bg-primary/10' : 'border-hair text-ink-300 hover:border-primary'
                }`}
              >
                <span className="block">{offer.label}</span>
                <span className="block text-xs text-ink-500">{offer.detail}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <p className="font-mono text-small text-ink-500 mt-3">
        Stays in this browser. Nothing is saved and nothing is sent.
      </p>

      <ol className="mt-8 space-y-4">
        {matches.length === 0 && (
          <li className="border border-hair p-4 text-ink-400">Nothing on the index matches that combination.</li>
        )}
        {matches.map((match, index) => (
          <li key={match.entry.id} className="border border-hair p-4 sm:p-5">
            <p className="font-mono text-small uppercase tracking-wider text-ink-500">
              {index + 1} · {match.entry.kind === 'risk' ? 'S-tier risk' : `Rank ${match.entry.rank}`}
            </p>
            <h2 className="font-serif text-2xl text-ink-100 mt-1">
              <Link href={match.entry.href} className="hover:text-primary">
                {match.entry.name}
              </Link>
            </h2>
            <p className="text-sm text-ink-400 mt-2">{match.entry.tagline}</p>
            <p className="text-sm text-ink-300 mt-2">{match.reasons.join(' · ')}</p>
            {match.ctas.length === 0 ? (
              <div className="text-sm text-ink-500 mt-4 space-y-2">
                <p>No checked action is listed for this match. This page does not invent openings.</p>
                <p>
                  <Link href={match.entry.href} className="text-primary hover:underline">Read the problem and its sources</Link>
                  {match.entry.kind === 'problem' && (
                    <>
                      {' · '}
                      <Link href={`/discoveries?problem=${match.entry.id}`} className="text-primary hover:underline">Curated findings</Link>
                    </>
                  )}
                  {' · '}
                  <Link href="/research" className="text-primary hover:underline">Ask a sourced research question</Link>
                </p>
              </div>
            ) : (
              <ul className="mt-4 border-t border-hair">
                {match.ctas.slice(0, 4).map((cta) => (
                  <li key={cta.id} className="py-3 border-b border-hair last:border-b-0">
                    <p className="font-mono text-small uppercase tracking-wider text-primary">
                      {KIND_LABEL[cta.kind] ?? cta.kind}
                    </p>
                    <a href={cta.url} target="_blank" rel="noopener noreferrer" className="text-ink-100 hover:text-primary">
                      {cta.name}
                    </a>
                    <p className="text-sm text-ink-400 mt-1">{cta.oneLiner}</p>
                  </li>
                ))}
              </ul>
            )}
            {match.ctas.length > 4 && (
              <p className="text-sm text-ink-500 mt-2">{match.ctas.length - 4} more on the page.</p>
            )}
            <Link href={match.entry.href} className="inline-block mt-3 font-mono text-small uppercase tracking-wider text-primary hover:underline">
              Open it
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
