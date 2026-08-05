# The Legibility Engines

One instinct, three surfaces: **take something too big or too diffuse to hold in
your head, and rank it into something you can act on.**

This file is the shared constitution for three repos: `optimism.fun`,
`pokedex.life`, `portal.voyage`. It lives in all three and is the same file
everywhere. If you are a Claude Code session working in any one of them, read this
first so all three sessions speak the same language.

## The one-liners (the canon)

- 🎯 **optimism.fun ranks WHAT** — Requests for Startups: specific, buildable
  companies scored by `demand × quest-gap × readiness`, surfacing the gap between
  what the world needs and what is actually being built.
- 🧑‍🤝‍🧑 **pokedex.life ranks WHO** — the people you actually follow, tier-ranked
  S/A/B/C/D/F by alignment with your values and the person you want to become.
- 🗺️ **portal.voyage ranks WHERE** — every city on Earth, scored 0-100 on personal
  fit (cost, career, people) and filtered by what your passport actually unlocks.

This maps directly onto Adam's own WHO/WHAT/WHERE/WHEN framing in
`life-plan-2026.md` (2026-08-01): three of his four self-authoring counters are
these three repos. WHEN is `themain.quest`, outside this cluster.

## The uncomfortable finding: three engines, not one

Every `repos.yaml` in this cluster names the others as kin with "same ranking
engine" as the why. That is not literally true — verified against the actual code,
not assumed:

| Repo | Persistence | AI | The real math |
|---|---|---|---|
| optimism.fun | Neon (Postgres) | Claude, live | `demand × quest-gap × readiness`, in `src/lib/rankings.ts` |
| pokedex.life | Supabase (wiring in progress per its own README) | Claude, for classification | Tier classification in `lib/services/classify.ts` + `compatibility.ts` |
| portal.voyage | None — static TypeScript in `lib/data/` | None | Weighted axis sum (cost/career/people) + hard-constraint filters, in `lib/score.ts` |

**No shared code exists between any two of these.** Each is a convergent,
independently-built scoring system, on three different persistence layers, one of
which (portal.voyage) uses no AI and no database at all. The kinship is real at the
idea level — rank entities against a fit function — and false at the code level.
Don't let an agent go looking for a shared `rankEntities()` it will not find.

## The real overlap, if it is ever worth extracting

Despite zero shared code, all three converge on the same shape: an entity list, a
set of weighted axes, hard-constraint filters, and a human-readable "why" string
per result (see `buildWhy` in portal.voyage, the `why` field in optimism.fun's
`RankedQuest`, pokedex.life's tier rationale). If a fourth ranking engine is ever
needed, extract that shape into a real shared package first. Until then, do not
force a merge across three working systems that do not actually share code today.

## The lineage that was missing from the graph

`portal.voyage`'s own README says its matching engine "was first built inside
`interneta.world` as its Atlas tool, then extracted here into a clean, standalone
home." `interneta.world` is not declared as kin in any of this cluster's
`repos.yaml` files. That is a real edge missing from the graph — add it if
`interneta.world`'s manifest is ever written.

## One naming collision worth deciding, not defaulting

`life-plan-2026.md` maps `optimism.fun` to the WHAT counter: **1000 shipped
artifacts** (songs, essays, apps), displayed on `pangaea.blog`. The deployed
`optimism.fun` product ranks Requests-for-Startups by market opportunity — a
different WHAT entirely. Nobody has decided whether `optimism.fun` becomes the
artifact tracker, stays the opportunity-ranker, or both ideas live under
`pangaea.blog` instead. Recorded here so it is not silently decided by whichever
code happens to get written next.

## Ownership boundaries

No shared object is transacted between these three today, unlike the talent
trifecta's card. Each engine is sovereign:

- `optimism.fun` owns opportunity/problem ranking. It has never persisted a person
  or a place.
- `pokedex.life` owns people, gated by X/Twitter OAuth. It never scores an
  opportunity or a city.
- `portal.voyage` owns places, and needs no account or database to do it.

## How the three sessions coordinate

- **Shared constitution:** this file. If the model changes, change it here and
  copy it to all three repos in the same commit.
- **No shared Summon board exists yet for this cluster** — unlike the talent
  trifecta's `SKI` board, cross-repo work here is not filed anywhere in particular.
  If that becomes a real need, name a board rather than letting tasks scatter.
- **Machine-readable layer:** each repo also carries a `repos.yaml` (see
  `adamtpang/repo-protocol`), now with `canon: ECOSYSTEM.md` so
  `node repos.mjs sync` tracks this file's hash across all three.
