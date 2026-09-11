# CLAUDE.md - optimism.fun

Context for Claude Code, Codex, and humans working in this folder.

## What this is

This handoff was generated on 2026-07-07 so every top-level Codex project under
`C:\Users\adamp\OneDrive\Aether` has both `CLAUDE.md` and `AGENTS.md`.

No richer Claude handoff was found here during the workspace sync. Treat this file
as a starting point, then inspect the actual code and docs before making changes.

## Detected project facts

- Workspace folder: `optimism.fun`
- Git repository: yes
- `package.json`: yes
- Detected stack: Next.js, React, Tailwind, TypeScript, package "optimism-fun"
- Existing context-like files: None found before this generated handoff.
- Notable top-level files: .env.local.example, .gitignore, next-env.d.ts, next.config.mjs, package-lock.json, package.json, postcss.config.mjs, tailwind.config.ts, tsconfig.json, tsconfig.tsbuildinfo, vercel.json

## How to keep this useful

- If you learn the product purpose, stack, run commands, deployment target, or open
  tasks, update this file.
- Keep `AGENTS.md` synchronized with this file so Codex sessions have the same
  context inline.
- Prefer concrete project facts over generic instructions.

## Current state (2026-08-27)

- Hypertension is now a first-class health problem in `src/data/problems.ts` and closes the cardiovascular zero-coverage gap partially.
- The published whitepaper entry is in `src/data/whitepapers.ts`.
- The editable source documents are `research/hypertension/WHITEPAPER.md` and `research/hypertension/BLACKPAPER.md`.
- The repository declares `repo-connect` as kin so its agent can exchange evidence-bearing local requests with related repositories.
- `npm run build` and `npx tsc --noEmit` pass with these changes.

## S-tier focus (2026-08-31)

- Adam explicitly narrowed the primary product scope to species-wide existential
  risks. The canonical set is AI loss of control, engineered pandemics, nuclear
  war and nuclear winter, and single-planet catastrophic exposure.
- `/s-tier` is the primary operating page. Its canonical data lives in
  `src/data/existential-risks.ts` and translates each failure mechanism into
  three buildable quests with observable proof conditions.
- The homepage and navigation now lead with S-tier.
- Ordinary startup rankings no longer call their top percentile S-tier. They use
  `top`, `strong`, `consider`, and `watch` opportunity bands, keeping commercial
  attractiveness separate from existential consequence.
- The previous editorial exclusion of AI safety is superseded. See the dated
  scope decision in `MASTERPLAN.md`.
- `npx tsc --noEmit` and `npm run build` pass after the scope change. Helium
  verification passed at 1440px desktop and 390px mobile widths: all four risk
  sections and twelve quests render, navigation exposes S-tier, and neither the
  S-tier page nor the revised mobile homepage has horizontal overflow.

## Last Company Lab (2026-09-02)

- Added `/last-company`, a private-on-device worksheet for turning recurring
  problems, earned edge, people served, life constraints, and a decade test into
  one candidate company thesis and a 30-day proof plan.
- Answers stay in browser local storage. The page generates a reviewed Founders
  council prompt for the user to copy manually; no personal context is put in a
  URL or sent automatically.
- The proof plan requires ten problem interviews, one artifact testing the
  riskiest assumption, one stranger taking a costly action, and prewritten kill
  criteria. This is a commitment-discovery tool, not a claim that software can
  identify a destiny from a questionnaire.
- `/fit` now hands its result into the lab, the main navigation exposes it, and
  Summon's Founders Lens links back as the cited decision-support layer.
- TypeScript and the production build pass locally. No deployment or product
  scope decision receipt was created.

## The coordination layer (2026-09-04)

The site was a research ledger with 30-plus read-only views of one dataset. It
now has a write path. **The map is research, the board is coordination**, and
they are deliberately kept apart. `/coordinate` explains the split to visitors.

- **The map** is everything that was already here: ranked problems, sourced
  numbers, visible confidence, nothing purchasable.
- **The board** is `commitments`, the only user-generated and genuinely live
  table on the site. A commitment never changes a rank and never feeds a demand
  score, and every row renders with a `user-submitted` marker.

Three actors, six intents, one write surface:

- talent: `start`, `join`, `contribute`
- capital: `fund` (check-size band required; can be anonymous and still count)
- operator: `hire`, `raise` (must name a company already in the dataset)

**Two gates before anything is public.** Email confirmation proves the address
exists; human review in `/admin/commitments` proves someone read it. Confirming
publishes nothing. Companies cannot be created through the form and cannot buy
placement, which is what stops the board from becoming a paid-listings surface.

Key files:

- `scripts/db/0005_commitments.sql` — the migration. Run it before the board works.
- `src/lib/commitments.ts` — vocabulary, pure validation, reads and writes.
- `src/lib/commitments-cache.ts` — tagged cache wrappers. Without these the
  Neon read forces `/` and all 15 problem pages to render per request; with
  them both stay prerendered on a 5 minute window, and approving a commitment
  calls `updateTag` so the board is never actually stale.
- `src/lib/coordination.ts` — "most under-coordinated": demand divided by
  supply and by whoever already showed up.
- `tests/commitments.test.ts` — 30 tests, `npm test`. Mocks `@/lib/db`.

Verified locally: TypeScript clean, production build passes, 30 tests pass, all
new routes return 200, sticky action bar holds at 375px with no horizontal
overflow, and the actor tabs correctly swap the form's fields and proof prompt.

**Deployed 2026-09-04.** `0005_commitments.sql` was applied to the Neon
project (`jolly-fog-41496808`) and every query the library issues was verified
against the real schema, including that email confirmation alone leaves a row
non-public. Commit `a3d47dd` is live on production: `/coordinate`, the board on
every problem page, the homepage router and `/api/commitments` all serve, and
the API reads the real table (`count: 0` at launch, by design).

**Still blocking the loop in production:** `/admin/commitments` returns 503
because `ADMIN_PASSWORD` is not set in Vercel. The gate is failing closed,
which is correct, but until the password is set nobody can approve a
commitment, so the board can receive but never publish. Set it in Vercel env
and the review queue comes up. Also confirm `RESEND_API_KEY` is present in
production, or confirmation links only land in the runtime log.

A draft Emergent Ventures application lives at
`grants/EMERGENT_VENTURES_2026.md`, deliberately left uncommitted: this repo
is public, and whether a grant draft belongs in it is Adam's call.

## Challenge model (2026-09-05)

- Adam proposed learning from ECDSA.fail for problem research and talent.
- `CHALLENGE_MODEL.md` models problems -> bottlenecks -> verifiable challenges
  -> work packages -> talent/resources -> submissions -> reproduced evidence.
- ECDSA.fail's automated evaluation and shared baseline are sourced; pooled
  crowdfunding was not verified and is explicitly our proposed extension.
- The proposed first pilot tests an AI agent permission boundary with synthetic
  tools. Benchmark acceptance remains separate from real-world risk reduction.
- This is a design artifact only. No runtime, database, funding, or deployed
  product behavior changed. Next implementation starts with one validated
  verifier and reproduced baseline, not a broad talent directory.

## Energy and AI research (2026-09-06)

- Saved `research/energy-ai/2026-09-06-energy-ai-kardashev.md` and its dated
  decision brief, with supporting source notes and reproducible calculations.
- Research motivation is expanding civilization's useful capabilities through
  energy abundance. This research pass does not change S-tier or public rankings.
- Seven theses compare interconnection rework, equipment throughput, AI facility
  commissioning, grid/storage evidence, renewable construction, geothermal and
  fission delivery. Generic GPU scheduling is not the default recommendation.
- Distinguishes original Kardashev categories from the continuous convention,
  primary-energy accounting from useful output, and infrastructure spending from
  obtainable software budgets, company valuation and retained ownership.
- Megawatt was inspected read-only. Its dispatch code and fixtures are reusable;
  operator/payment proof is absent from reviewed records. Its single-day model
  should not be described as a guaranteed floor on real battery economics.
- One proposed next investigation: a five-day public PJM study-change benchmark,
  with explicit continue/stop conditions. It has not been executed.
- No outreach, spending, deployment, product code changes or readiness pass is
  claimed. No private life or financial context is included in the research.

## Energy system visualization (2026-09-06)

- `research/energy-ai/visuals/energy-map.html` provides an interactive map of
  major sources, conversions, carriers and uses, with AI inside services.
- Matching SVG and PNG exports are generated by `build-energy-map.mjs`.
- This is a qualitative pathway map, not a measured global Sankey. Source
  figures retain their own years and denominators; all data centres is not AI.
- Working near-term constraint: deploying dependable delivered power. Local
  constraints vary; no universal single grid component is claimed.
- PNG visually inspected. Helium checks verified AI trace, generation and
  connection controls, unique IDs, and no page overflow at 390px width.
- Research artifacts only; no product runtime, ranking or deployment changed.

## Bounded PJM feasibility check (2026-09-07)

- `research/energy-ai/2026-09-07-pjm-one-pair-receipt.md` inspects the linked
  AG1-320 Retool 1/2 reports. Public text comparison detects a $4,334,526
  displayed cost decrease while the security-subject total stays unchanged.
- The newer affected-system footnote prevents interpreting this as confirmed
  savings; engineering obligation remains unresolved pending expert review.
- One pair only, not the five-day benchmark. No demand or time savings proven.
- Next owner: Adam selects a qualified engineer for manual usefulness review.
  No outreach, product changes, publication, commits or deployment occurred.

## Demand-gap selection contract (2026-09-10)

Adam requested high-demand, inadequate-supply business selection. Added research/demand-gaps/README.md, opportunities.json and REVIEW.md. The commercial evidence gate separates human need, payer demand, effective supply, distribution and economics. All three seeded hypotheses remain research; no product shortage or profit is certified. Existing S-tier scope, public ranks and runtime are unchanged. Optimism owns research, Summon operations, Pele reviewed presentation. No deployment or dispatch.

## The burden layer (2026-09-11)

Why people die, with counts, mapped onto the ranked problems. Not a new
route: it feeds the demand model, renders on problem pages, and turns the GBD
cross-check on `/coverage` from list membership into deaths.

- `src/data/mortality.ts`: WHO Global Health Estimates 2021 (68M deaths) for
  counts, GBD 2023 for the newer rank order, GLOBOCAN 2022 for cancer as a
  group. Where WHO's public summary ranks a cause but gives no count (diabetes,
  kidney disease, tuberculosis, neonatal disorders) the count is null and stays
  null. Aggregates (all cancers 9.7M, all cardiovascular 19.2M) are excluded
  from every sum. `problemSlugs` means "this problem addresses this cause", not
  "would prevent these deaths"; shared causes count under both problems and
  every display says so.
- `src/lib/burden.ts`: per-problem deaths, the unmapped killers, and
  `mortalitySignal`, a 0..1 log scale against a 20M ceiling (the largest cause
  group, chosen because summed causes overlap and a 10M ceiling clamped
  hypertension and longevity both to 1).
- `src/lib/demand.ts`: the burden component is now a half-and-half blend of the
  editorial estimate and the mortality signal where one exists, and untouched
  where none does. The source label says when it is blended.
- `src/components/BurdenBlock.tsx` on every problem page with a mortality
  dimension; `/coverage` gains a "by deaths, not by list" section.
- `/coverage` data correction: "Neonatal disorders / maternal mortality" read
  "gap" while newborn-survival has been on the index; now "partial".

**The ranking change, on the record** (tests/burden-delta.test.ts prints it):
three problems moved and thirteen did not. Longevity 82 to 87 (7th to 3rd),
infectious disease 86 to 88 (4th to 2nd), hypertension 57 to 58 (still 16th).
Every problem without a mortality dimension scored exactly as before.

**The finding:** cancer, 9.7M deaths a year, has no problem on the index.
COPD (3.4M) and diabetes have none either. These are now visible in deaths on
`/coverage` rather than as a note.

Verified: TypeScript clean, 57 tests, production build passes with the
homepage and problem pages still prerendered.
