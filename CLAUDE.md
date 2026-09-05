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
