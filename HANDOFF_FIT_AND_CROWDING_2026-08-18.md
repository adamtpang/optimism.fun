# Handoff from Aether: personal fittedness + real crowding scans

Written 2026-08-18 from the Aether hub session, for whoever (Claude/Codex/Grok) picks up
optimism.fun next. Adam asked to "hand off this situation so I can start scanning for
more crowding scans for S-tier businesses, and fitting it to me using personal context
from themain.quest and adampang.com." This file is that handoff.

## What happened in the hub session

1. Scored all 53 real Aether businesses on optimism.fun's own startup-idea-evaluator
   scorecard (8 dimensions, 100 points) plus a new ninth dimension, **personal
   fittedness** (0-10), blended as `Final = Core*0.7 + Fittedness*10*0.3`.
2. Zero businesses cleared S tier (85+). Top score was waterfall.sh at 74 (A tier).
   Full ranked results: `C:\Users\adamp\Aether\iron.credit\STARTUP_EVALUATION.md` has
   the one full deep-dive; the compact 53-project tier list itself was published as an
   Artifact, not committed to any repo (ask Adam for the link if it's needed again, or
   re-run the same batched scoring pass, prompts are reconstructable from this file).
3. Used `src/data/quest-crowding.ts` (sourced 2026-07-20) to find quests tagged `open`
   or lightly `contested`, filtered to Adam's archetype domains, and surfaced two
   headline candidates: `fast-grants-as-a-product` (0 competitors) and
   `replication-layer` (2 competitors: Researka, ValiChord).
4. **Real web research the same session found both of those undercounted.** The
   crowding scan only searches for for-profit companies, so it missed real
   philanthropic/academic infrastructure already working both quests:
   - `fast-grants-as-a-product`: Longevity Impetus Grants (live, 200+ funded papers,
     3-week decisions), Renaissance Philanthropy ($500M+ mobilized, publishing on
     exactly this thesis), Asothia (an AI grant-matching platform Coefficient Giving
     is funding, UK-wide launch spring 2026).
   - `replication-layer`: Institute for Progress's "Replication Engine" (cloud-native,
     containerized, API-first, AI-vision-model-powered, architecture already published
     2025), Institute for Replication (a live academic org running this, Abel Brodeur
     chair), NIH's own centralized replication/reproducibility hub (launched Feb 2026),
     Center for Open Science's funded replication project.
   - None of this shows up in `quest-crowding.ts` because `crowdingFromCount` and its
     source search (the `/api/cron/refresh-crowding` job referenced in the file's own
     header comment) evidently only queries for companies, not nonprofits, academic
     institutes, or philanthropic funds. **This is a real, fixable gap, not a one-off
     miss** — any quest whose real competition is institutional rather than
     venture-funded will read as falsely open.

## Task 1: fix the crowding scan's blind spot

The `/api/cron/refresh-crowding` job (or whatever now generates `sourcedCrowding` in
`quest-crowding.ts`) needs to search nonprofits, academic institutes, philanthropic
funds, and government initiatives, not just companies, before a quest can honestly be
labeled `open`. Concretely:
- Expand whatever search/classification prompt currently powers the crowding refresh
  to explicitly include "who else, of any legal structure (company, nonprofit,
  academic institute, government program, philanthropic fund), is already working on
  this quest" rather than a company-shaped query.
- Re-run the refresh across all quests in `quest-crowding.ts`, not just the two named
  above — if these two were undercounted, others likely are too.
- Consider surfacing the org *type* (company / nonprofit / academic / government)
  alongside `exampleCompetitors`, since "join a well-funded nonprofit" and "compete
  with a venture-backed startup" are different real moves for Adam, and the current
  schema conflates them under one generic competitor list.

## Task 2: build real personal-fittedness scoring, not an ad hoc session rubric

The hub session invented a fittedness rubric by hand each time (repeated verbatim
across 7 parallel scoring agents) instead of reading it from a real source. That rubric
should live in optimism.fun itself, sourced from real files, not re-typed:

**Source for Adam's profile — read these live, don't hardcode a snapshot:**
- `C:\Users\adamp\Aether\themain.quest\CLAUDE_PROJECT_CONTEXT.md` — the real, verbatim
  mission statement (Who/What/Where/Wisdom/Philosophy/Health/Immortality/Psychedelics),
  the priority order (Life > Health.fun > Visa > Taxes > Leverage-maxxing >
  Marketplace-maxxing > Loops), and the standing chat-instruction tone.
- `C:\Users\adamp\Aether\adampang.com\` — the real proof-of-work layer (shipped apps,
  essays, songs via its progress-tracker system). Check `_links/links.md` and the
  theme/quest-tracking components for what Adam has actually shipped and called out as
  proud-of vs merely functional; that's a stronger fun-fit signal than a stated
  preference.
- This repo's own `src/data/archetypes.ts` — already has the six-archetype framework
  (Missionary/Scientist/Operator/Craftsman/Evangelist/Outsider) with domain mappings.
  Adam scored primarily Missionary, secondarily Scientist, tertiary Craftsman this
  session (see the ad hoc rubric embedded in the hub session's Agent-tool prompts if
  the exact reasoning is needed — not reproduced in full here to avoid a second stale
  copy; re-derive from the sources above instead).

**What to build:** a `fit.ts`-adjacent module (the file `src/lib/fit.ts` is already
referenced in `archetypes.ts`'s own header comment as where archetype-to-problem
matching happens) that scores personal fittedness per quest using the real mission
statement and proof-of-work history, not a re-typed rubric. This makes the fittedness
score live and auditable instead of a one-time session artifact, and lets it be applied
to every quest in the catalog going forward, not just the ones a hub session happened
to ask about.

## Task 3: re-run the S-tier search once both fixes land

Once crowding scans catch institutional competitors and fittedness reads from real
sources, re-run the open-quest search. The honest expectation, stated plainly: most
quests that looked open under the old company-only scan will likely turn out
contested once nonprofits and academic institutes are counted. That is a real, useful
finding on its own, not a failure of the search — it means the actual S-tier opening
for Adam is probably a specific underserved sub-niche within an institutionally-active
space (e.g. Asothia's UK-only gap in grant-matching), not a wide-open category, and the
tooling should be built to find sub-niches, not just category-level openness.

## Next physical action

Pick Task 1 or Task 2 first, whichever is faster to ship; Task 3 depends on both. If
starting fresh, Task 2 is probably the better first move: it's self-contained (reading
real local files, no external API dependency) and makes every future crowding-scan
session automatically personal-fit-aware instead of re-deriving Adam's profile by hand
again.

## Status

PICKED UP 2026-08-18, by the Claude Code session in optimism.fun
(cf10168e-3221-49e5-b4c1-b3d285369c12). Task 2 done: `src/data/adam-profile.ts`
(sourced facts, cites themain.quest + adampang.com) and `src/lib/personal-fit.ts`
(`scorePersonalFit()` + `blendWithCoreScore()`, the handoff's own
`Final = Core*0.7 + Fittedness*10*0.3` formula) are built, type-checked, smoke-tested
against real `rfs.ts` quests, and build-clean.

Task 1 also done: the query and schema in `src/lib/sources/exa.ts`'s
`sourceQuestCrowding()` now explicitly search companies, nonprofits, academic
institutes, and government programs equally, with non-company orgs tagged inline in
`exampleCompetitors`. All 22 quests in `quest-crowding.ts` were re-researched with the
broadened methodology (three parallel batches). Findings: 20 of 22 were undercounted,
several severely (`autonomous-lab` 3->9, `healthspan-diagnostic` 4->9,
`geothermal-via-oilfield-tooling` 2->8). Two data-quality bugs also caught in passing:
`pathogen-agnostic-early-warning` had the same company double-counted under an old and
new name (Ginkgo Biosecurity/Concentric = Perimeter), and `third-places-as-a-business`
/ `proximity-over-feeds` had identical copy-pasted competitor lists despite being
different quest shapes — both now have independently-researched real competitors.
Both originally-flagged quests (`gene-drive-vector-control`, `single-encounter-tb-cure`)
moved from open to contested; `gene-drive-vector-control` dropped out of S-tier
entirely (now B-tier, rank 12). Live-verified on `/rankings` and `/good-quests`
(hard+good quadrant count: 8 -> 6, the honest result of the fix, not a regression).

Task 3 done: re-ran the S-tier search with both fixes live via a new kept script,
`scripts/stier-scan.ts` (`npx tsx scripts/stier-scan.ts`), blending every quest's
core ranking score with `scorePersonalFit()`. Before running it, extended the Task 1
fix to the 8 newer quests (added after `quest-crowding.ts` was first built) that had
never been through the broadened methodology — this caught 2 more real reversals:
`graduation-approach-cost-collapse` and `onchocerciasis-cure-readiness` both moved
from "open" to contested once nonprofits/government programs were counted (the
onchocerciasis one badly so — the exact manufacturing/distribution layer the quest
proposed is contractually already assigned to Bayer per the real DNDi/Bayer deal).

Final result: only ONE quest survives as genuinely open across all 30 —
`dumpsite-methane-capture` ("Methane capture for the open dump, not the landfill"),
core S-tier (60/100) independent of personal fit, blended #1 at 57. Runner-ups are
all contested/crowded, not open. This confirms the handoff's own prediction almost
exactly: the real opening was a specific underserved sub-niche, not a wide-open
category, and it took both fixes plus a second, more careful pass to actually find it
rather than stopping at the first plausible-looking "open" result.

All three tasks from this handoff are now done. Type-checked, build-clean, dev-verified.
Nothing committed/pushed yet, pending Adam's go, same as everything else this session.

## Task 4: sub-niche mapping inside the two best-fit quests (2026-08-18, hub session)

Adam reviewed the blended scan and explicitly declined to commit to a direction yet,
asking instead for a sharper sub-niche search within the two highest-fit, pure-software
quests (`fast-grants-as-a-product` fit 6.8/10, `replication-layer` fit 6.8/10) rather
than picking blind. Real web research (not yet folded into the crowding data schema)
found a specific, named gap in each:

**Fast Grants gap:** every real player is scoped narrow, either by geography or by
discipline, and none of them overlap. Asothia is confirmed UK-applicants-only, no
international expansion evidence found. Impetus Grants is longevity-only. Renaissance
Philanthropy runs 20+ real funds but each is thesis-curated (AI-for-math, AI-for-
education, climate/ARC, geologic hydrogen, open-source-for-science) rather than a
general-purpose rapid-decision product any researcher in any field can use. **The real
white space: a discipline-agnostic, geography-agnostic fast-grants infrastructure,
specifically serving researchers outside the UK and outside the 4-5 curated thesis
areas the funded incumbents already cover** — i.e. a materials scientist in Nigeria or
a chemist in Vietnam has no equivalent of what a UK researcher (Asothia) or a longevity
researcher (Impetus) already gets.

**Replication layer gap:** I4R (Institute for Replication) is confirmed
economics/political-science/social-science only (232+ discussion papers, editorial
board explicitly scoped to econ/finance and poli-sci, expanding into macro and
int'l relations next, still all social science). NIH's reproducibility hub is
biomedical-specific. COS's funded replication project is health-behavior-specific.
**The real white space: nobody is running replication-as-a-service for the hard/
physical sciences broadly** — chemistry, materials science, physics, and biology
outside NIH's biomedical scope have no equivalent of I4R. IFP's own Replication
Engine architecture (AI-vision-model paper reading, containerized reproduction) is
discipline-agnostic by design but is currently deployed only inside I4R's
social-science-scoped organization.

Neither gap has a `sourcedCrowding` entry sharp enough to say "0 competitors" honestly
— the parent quest is contested, but the specific sub-niche (non-UK/non-thesis fast
grants; hard-science replication) has not been directly searched for competitors yet.
That real search is the next physical action before Adam commits either direction.
