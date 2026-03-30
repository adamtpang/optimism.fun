'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Category } from '@/lib/db/types'

interface DiscoveryFlowProps {
  categories: Category[]
  problems: { slug: string; title: string; composite_score: number; category_slug: string | null; category_icon: string | null; category_name: string | null }[]
}

type ContributionType = 'research' | 'build' | 'invest' | 'connect'

const CONTRIBUTION_OPTIONS: { type: ContributionType; label: string; description: string }[] = [
  { type: 'research', label: 'Research & understand', description: 'You want to study problems deeply before acting.' },
  { type: 'build', label: 'Build & create', description: 'You want to make technology that solves problems.' },
  { type: 'invest', label: 'Invest & fund', description: 'You want to deploy capital toward solutions.' },
  { type: 'connect', label: 'Connect & organize', description: 'You want to bring the right people together.' },
]

export default function DiscoveryFlow({ categories, problems }: DiscoveryFlowProps) {
  const [step, setStep] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [contribution, setContribution] = useState<ContributionType | null>(null)
  const [remote, setRemote] = useState(true)
  const [freedom, setFreedom] = useState(true)

  const totalSteps = 4 // categories, contribution, preferences, results

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug].slice(0, 3)
    )
  }

  const matchedProblems = problems.filter(p =>
    selectedCategories.length === 0 || selectedCategories.includes(p.category_slug || '')
  ).sort((a, b) => b.composite_score - a.composite_score).slice(0, 8)

  return (
    <div>
      {/* Progress */}
      <div className="h-1 rounded-full bg-white/5 mb-8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gold transition-all duration-300"
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step 1: Categories */}
      {step === 0 && (
        <div>
          <p className="text-xs text-gold font-medium mb-2">Step 1 of {totalSteps}</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream mb-2">
            What problems call to you?
          </h2>
          <p className="text-muted text-sm mb-6">
            Select up to 3 areas you care most about.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {categories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => toggleCategory(cat.slug)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedCategories.includes(cat.slug)
                    ? 'bg-gold/10 border-gold/50 text-gold'
                    : 'bg-white/5 border-white/10 text-warm hover:border-white/20'
                }`}
              >
                <span className="text-lg block mb-1">{cat.icon}</span>
                <span className="text-xs font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-warm mb-4">{selectedCategories.length}/3 selected</p>
          <button
            onClick={() => setStep(1)}
            disabled={selectedCategories.length === 0}
            className="w-full py-3 rounded-lg bg-gold hover:bg-gold-bright text-deep glow-gold font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Contribution type */}
      {step === 1 && (
        <div>
          <p className="text-xs text-gold font-medium mb-2">Step 2 of {totalSteps}</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream mb-2">
            How do you want to contribute?
          </h2>
          <p className="text-muted text-sm mb-6">
            There&apos;s no wrong answer  - the world needs all types.
          </p>
          <div className="space-y-3 mb-6">
            {CONTRIBUTION_OPTIONS.map(opt => (
              <button
                key={opt.type}
                onClick={() => setContribution(opt.type)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  contribution === opt.type
                    ? 'bg-gold/10 border-gold/50'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-medium text-cream text-sm mb-1">{opt.label}</div>
                <div className="text-xs text-muted">{opt.description}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(0)}
              className="flex-1 py-3 rounded-lg border border-white/10 text-cream font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!contribution}
              className="flex-1 py-3 rounded-lg bg-gold hover:bg-gold-bright text-deep glow-gold font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Work preferences */}
      {step === 2 && (
        <div>
          <p className="text-xs text-gold font-medium mb-2">Step 3 of {totalSteps}</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream mb-2">
            What does meaningful work look like for you?
          </h2>
          <p className="text-muted text-sm mb-6">
            We&apos;ll match you to opportunities that fit your life.
          </p>
          <div className="space-y-4 mb-8">
            <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer">
              <div>
                <div className="font-medium text-cream text-sm">Remote work</div>
                <div className="text-xs text-muted">Freedom to work from anywhere.</div>
              </div>
              <input
                type="checkbox"
                checked={remote}
                onChange={() => setRemote(!remote)}
                className="w-5 h-5 rounded border-cream text-gold-dim focus:ring-gold"
              />
            </label>
            <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer">
              <div>
                <div className="font-medium text-cream text-sm">Freedom &amp; autonomy</div>
                <div className="text-xs text-muted">Fun income without being tied down.</div>
              </div>
              <input
                type="checkbox"
                checked={freedom}
                onChange={() => setFreedom(!freedom)}
                className="w-5 h-5 rounded border-cream text-gold-dim focus:ring-gold"
              />
            </label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-lg border border-white/10 text-cream font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 rounded-lg bg-gold hover:bg-gold-bright text-deep glow-gold font-medium transition-colors"
            >
              See My Matches
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 3 && (
        <div>
          <p className="text-xs text-gold font-medium mb-2">Your Matches</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream mb-2">
            Problems Worth Your Work
          </h2>
          <p className="text-muted text-sm mb-6">
            Based on what you care about  - tap any problem for deep analysis, people solving it,
            and meaningful work opportunities.
          </p>

          {/* Summary */}
          <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 mb-6">
            <div className="text-xs text-muted space-y-1">
              <div><span className="font-medium text-cream">Interests:</span> {selectedCategories.join(', ')}</div>
              <div><span className="font-medium text-cream">Contribution:</span> {contribution}</div>
              <div><span className="font-medium text-cream">Preferences:</span> {[remote && 'Remote', freedom && 'Freedom'].filter(Boolean).join(', ') || 'No preferences'}</div>
            </div>
          </div>

          {/* Matched problems */}
          <div className="space-y-3 mb-8">
            {matchedProblems.map((problem) => (
              <Link
                key={problem.slug}
                href={`/problems/${problem.slug}`}
                className="block rounded-xl border border-white/10 bg-white/5 p-4 hover:border-gold/30 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    {problem.category_icon && <span className="text-base">{problem.category_icon}</span>}
                    <div className="min-w-0">
                      <div className="font-display font-semibold text-cream text-sm group-hover:text-gold transition-colors truncate">
                        {problem.title}
                      </div>
                      <div className="text-xs text-warm">{problem.category_name}</div>
                    </div>
                  </div>
                  <span className="font-display text-lg font-bold text-gold flex-shrink-0 ml-3">
                    {Number(problem.composite_score).toFixed(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(0)}
              className="flex-1 py-3 rounded-lg border border-white/10 text-cream font-medium transition-colors"
            >
              Start Over
            </button>
            <Link
              href="/problems"
              className="flex-1 py-3 rounded-lg bg-gold hover:bg-gold-bright text-deep glow-gold font-medium transition-colors text-center"
            >
              View All Problems
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
