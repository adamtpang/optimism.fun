# optimism.fun — Design System

> Humanity's quest log. A ranked dashboard of humanity's most important problems.
> *All problems are explainable. All solutions are creatable. Infinite problems, infinite solutions.*

This is the brand + UI design system for **optimism.fun** — a quantitative leaderboard
that ranks humanity's biggest unsolved problems and maps the companies, founders,
countries, crypto, and capital pointed at each one. The aesthetic is a **terminal /
quest-log**: true-black canvas, a faint engineering grid, hairline rules, monospace
data labels, a single sky-blue accent, and confident Fraunces serif headlines.

---

## Source material

This system was reverse-engineered from the product's live codebase. If you have access,
read these to go deeper — the component vocabulary, copy, and data model all live here:

- **GitHub (web app):** https://github.com/adamtpang/optimism.fun
  - `src/app/globals.css` — the canonical color system, lattice background, theme variables
  - `tailwind.config.ts` — the full token map (note: the sky-blue accent is named `amber-*` in code for legacy continuity)
  - `src/components/` — `ProblemTable`, `ScoreBar`, `TierPill`, `SourceBadge`, `Navbar`, `Footer`, `EmailCapture`, `PageHeader`, `InfoTip`, `MarketTable`
  - `src/app/page.tsx`, `src/app/rfs/page.tsx`, `src/app/methodology/page.tsx` — page composition + voice

Built by Adam Pangelinan / Anchor Marianas LLC. Stack: Next.js 16, React 19, Tailwind 3,
Framer Motion, next-themes. Explore the repo to build higher-fidelity work than this kit alone allows.

---

## What this product is

optimism.fun ranks "humanity-scale problems" across multiple cause-prioritization lenses
(EA / welfare BCR, 80,000 Hours x-risk ITN, e/acc utility-delta) and surfaces, for each:
the **explanations** (thinkers who argue it matters), the **solutions** (companies
attacking it), and the **coordination layer** (talent + capital pointed at it). Adjacent
surfaces map countries, crypto, public companies, and a weekly "Requests for Startups"
drop. Everything is **sourced and confidence-tagged** — the brand's core promise is that
every number has a receipt.

The intellectual lineage is explicit and worth matching in tone: David Deutsch's
critical rationalism ("all problems are explainable, all solutions are creatable"),
Founders Fund's *Choose Good Quests*, Patrick Collison's progress studies, YC's RFS.

---

## CONTENT FUNDAMENTALS — how optimism.fun writes

The voice is **terminal-precise but humane** — an engineer's logbook written by someone
who genuinely believes the future is bright. Quantitative confidence without hype.

- **Casing.** Two registers, used deliberately:
  - **lowercase mono** for system chrome, labels, kickers, nav, metadata
    (`humanity's requests for startups · v0.1`, `weighting: balanced`, `methodology →`).
    This is the "machine" voice. Kickers are often numbered: `02 · the explanations`.
  - **Sentence-case Fraunces** for headlines — confident, declarative, often two-beat:
    *"Infinite problems. Infinite solutions."* · *"Choose a good quest."* ·
    *"One problem. One whitepaper. Every week."*
- **Person.** Mostly third-person and imperative — it addresses the *problem space*, not
  the reader's feelings. When it turns to **you**, it's a direct challenge:
  *"Pick one worth your life."* · *"what to do with your one life — start here."*
  "We" appears for the project's own claims (*"each week we ship…"*).
- **Punctuation as texture.** The interpunct `·` and middot `·` separate metadata
  fields. The em-dash carries asides. The diamond `◆` is the brand's verbal/visual tic —
  it opens the logo and closes the footer (*"◆ Infinite problems. Infinite solutions."*).
  Arrows `→` `&rarr;` terminate calls to action. Quotes are typographic (`'` `"`).
- **Numbers are sacred.** Every figure is sourced, given a confidence tag (high / med /
  low), and shown in tabular mono. Magnitudes are order-of-magnitude honest
  ("millions vs. billions vs. trillions"). The product would rather show a `·` placeholder
  than an unsourced number.
- **Intellectual register.** Comfortable with jargon from its lineage — *BCR, ITN,
  utility δ, x-risk, power-law, frontier, neglectedness* — but always with a hover-definition
  nearby. It cites real thinkers by surname (Deutsch, Musk, Collison, Cowen).
- **Honest about uncertainty.** *"Every request here is an argument, not an oracle."* ·
  *"This list is a conjecture."* · *"open to refutation."* Confidence is a feature, not a pose.
- **No emoji. Ever.** No exclamation-heavy marketing. No "revolutionary / game-changing."
  The optimism is in the *content* (problems are solvable), not in the punctuation.

**Specimen lines** (lift the cadence, not the words):
- Kicker: `05 · the white mirror`
- Headline: *Every problem above, solved for all that have it.*
- Body: *"{n} priority problems, ranked. Every number sourced. Pick one worth your life."*
- CTA: `See the receipts →` · `subscribe →` · `read the whitepaper →`
- Footer sign-off: `◆ Infinite problems. Infinite solutions.`

---

## VISUAL FOUNDATIONS

**Theme.** Dark is canonical. True-black canvas `#08080A`, warm off-white text `#F6F5F2`.
A clean **light** theme (white `#FFFFFF`, slate-900 ink) ships as a first-class companion —
toggle via `data-theme="light"` on a root element. The accent is identical in both.

**Color.** One accent and one accent only: **sky blue `#0ea5e9`** (brighter `#38bdf8`
on black). Used for the logo diamond, links, active states, primary buttons, focus rings,
selection, the radial glow, and scrollbars — a single bright punch against an otherwise
neutral ink scale. Four **terminal signal** tones carry semantic data and never decorate:
green (welfare / high-confidence), rose (x-risk / low-confidence), violet (explanations /
emerging), cyan (solutions / progress). On dark they are muted; on light they darken to
700-level for AA contrast. The ink scale (100 brightest → 900 darkest surface) is warm-neutral
on dark, Tailwind slate on light.

**Type.** Three families, three jobs. **Fraunces** (serif, optical sizing) for *every*
headline — normal weight at large sizes, leading ~1.05, confident not loud. **IBM Plex Sans**
for UI and reading body (base ~15px, slightly condensed). **IBM Plex Mono** for everything
"machine": labels, kickers, table cells, data, nav counts. The signature move is the
**micro-label**: mono, UPPERCASE, `letter-spacing: 0.25em` (ultra-wide), 10–11px, muted ink.
Numerals are always tabular.

**Backgrounds.** No photography, no illustration, no gradients-as-decoration. The single
atmospheric device is the **terminal-grid lattice** — a 1px line grid at 32px pitch rendered
at ~1.5–4% opacity, with one **sky-blue radial glow** blooming from the top edge (`ellipse
1200×800 at 50% -10%`). Feature sections use `.surface-paper` — a slightly warmer black with
a faint sky wash at the top. That's the entire background language.

**Structure comes from lines, not shadows.** Layout is organized by **hairline borders** —
`rgb(var(--line) / 0.08)` standard, `/0.16` strong — that follow the theme. Cards, tables,
and grids are defined by these 1px rules and 1px gaps (`gap-px bg-ink-700`) that read as
fine dividers. Real shadows are reserved for floating UI only (popovers, dialogs) and are
soft and dark. Tables are the hero layout: dense, mono, tabular, sortable, with uppercase
ultra-wide headers on a faintly raised row.

**Corners.** Small and architectural. `4px` default radius, `8px` maximum. Most rectangles
(buttons, pills, cards, inputs, table cells) are effectively **sharp** — the terminal look.
Full rounding is reserved for avatars and status dots only.

**Components' resting look.** Buttons are mostly **bordered ghost** — a hairline box with
mono uppercase label; the primary variant is a solid sky-blue fill with near-black text.
Pills (tier, source, confidence) are 1px-bordered, tinted with their signal color at ~30%
border / ~90% text, uppercase mono micro. Score bars are a literal **1px-tall track** with
a colored fill — minimal, instrument-like.

**Motion.** Quiet and fast. Color/background transitions on hover (~120–200ms,
`cubic-bezier(0.4,0,0.2,1)`); a slow 4s pulse on a few live indicators. **No bounces, no
slides, no parallax.** Framer Motion is used for restrained fades/reveals. Respect
`prefers-reduced-motion`.

**Hover states.** Text brightens toward ink-100 or shifts to the accent; surfaces lift one
ink step (`ink-900 → ink-800`); bordered elements warm their border toward the accent
(`border-amber-300/60`). **Press** is conveyed by a darker accent (`#0284c7`), not by
scale/shrink. Disabled = `opacity: 0.4` + `not-allowed`.

**Transparency & blur.** Used sparingly and purposefully: the fixed navbar gains
`backdrop-blur-md` + `bg-ink/90` once scrolled; tints are layered via low-opacity accent
washes (`amber-300/[0.04]–0.10`). No frosted-glass everywhere — blur signals "floating
above content," nothing more.

**Layout rules.** Fixed top navbar (two rows: brand/meta + scrollable data-tab rail).
Content maxes at `80rem` (`max-w-7xl`); editorial pages narrow to `56rem`. Gutter `1.5rem`.
Everything aligns to the 32px lattice. Generous vertical section padding (`py-16`–`py-20`)
separated by hairline rules spanning the full width.

---

## ICONOGRAPHY

optimism.fun is **deliberately icon-light** — it leans on typography, the diamond glyph,
and Unicode symbols rather than an icon library. There is no Lucide/Heroicons/Feather
dependency in the product.

- **The brand mark** is a sky-blue **infinity/link knot** drawn as a single stroked path
  on a white rounded square (`assets/optimism-icon-rounded.svg`) — the infinity loop nods
  to "infinite problems, infinite solutions." A bare-glyph version is `assets/optimism-mark.svg`.
  Both are copied from the product's real favicon/app-icon.
- **The diamond `◆`** (U+25C6) is the workhorse "logo" in running text: it precedes the
  `optimism.fun` wordmark in the nav and footer and accents kickers. Always in the sky accent.
- **Unicode as iconography.** The product uses text glyphs where another app would use SVG
  icons: sort carets `▾` `▴`, the bullet `·` / `&middot;`, arrows `→` `&rarr;`, the theme
  toggle `◐` / `◑` (half-circles for dark/light), and the info `i` in a hairline circle
  (the `InfoTip` trigger). These inherit `currentColor` and tabular metrics.
- **No emoji**, ever — it would break the terminal register.

If you need a richer icon set for a new surface, match the restraint: thin 1.5px stroke,
square caps, no fills — and **flag the addition**, since the base product ships almost none.
(`assets/` holds the two real brand SVGs; add new icons there as inline SVG referencing `currentColor`.)

---

## INDEX — what's in this system

**Foundations (root)**
- `styles.css` — global entry; `@import`s everything below. Link this one file.
- `tokens/fonts.css` — IBM Plex Sans, IBM Plex Mono, Fraunces (Google Fonts)
- `tokens/colors.css` — surfaces, ink scale, accent, terminal signals (dark + light)
- `tokens/typography.css` — families, size scales, tracking, weights
- `tokens/spacing.css` — spacing, radii, hairline borders, shadows, motion
- `tokens/base.css` — body defaults, lattice background, `.surface-paper`, `.kicker`, utilities

**Specimen cards** — `guidelines/*.card.html` (Type, Colors, Spacing, Brand) — render in the Design System tab.

**Components** — `components/` (each: `<Name>.jsx` + `.d.ts` + `.prompt.md`, one card per group)
- core: `Button`, `Kicker` · badges: `TierPill`, `ConfidenceBadge` · data: `ScoreBar`, `StatPair` · layout: `Card`, `Input`

**UI kit** — `ui_kits/website/` — interactive recreation of the optimism.fun web app
(navbar, hero, the problem leaderboard, the pipeline, email capture).

**Assets** — `assets/` — brand mark SVGs.

**Skill** — `SKILL.md` — Agent-Skills-compatible entry point.
