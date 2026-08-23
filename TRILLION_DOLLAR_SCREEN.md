# The Trillion-Dollar Screen

Nineteen candidate problems tested against a single question: could this produce a
$1 trillion company? Five passed. Fourteen were killed, each with the specific number
that killed it. Compiled 2026-08-22.

The kill list is the more useful half. It exists so these candidates do not get
re-litigated in six months, and so the reasoning stays auditable when someone disagrees.

## The test

A candidate must pass all four:

1. **Real, verified market size or annual spend**, with a named source.
2. **Single-company capturable.** The market must not fragment across dozens of players
   with no dominant winner. This is the criterion that killed almost everything.
3. **Not already decided** by a few entrenched, well-capitalized incumbents.
4. **A real problem for humanity**, not merely a large market.

**Incumbent ceiling evidence is the most decisive input.** If the largest company in a
category is far below $1T after decades of compounding, the category caps out. Market
size alone predicts nothing: agriculture is a $13T market that fails, scientific
productivity is a smaller market that passes.

## The five that passed, scored

Three columns, because a 10-year commitment needs all three to be true at once.

- **Demand** (0-10): how badly humanity needs this solved.
- **Supply gap** (0-10): how underserved it is right now. High means open. Derived from
  this repo's own sourced crowding counts in `src/data/quest-crowding.ts`, not from vibes.
- **Fit x Fun** (0-10): would this specific person be good at it, and still want to be
  doing it in year eight. Derived from `src/data/adam-profile.ts`: proven shipping
  domains are governance, social, science, and AI; archetype weights are Missionary 1.0,
  Scientist 0.7, Craftsman 0.6; the one recorded anti-signal is a quit B2B-sales motion.

| # | Problem | Ceiling | Demand | Supply gap | Fit x Fun | Note |
|---|---|---|---|---|---|---|
| 1 | **Scientific productivity** | $1T | 8 | **7** | **9** | The only candidate strong on all three. Two quests (fast-grants N=3, replication-layer N=4) are contested only by nonprofits and academics, with no venture-backed competitor. Institution design in a proven domain. |
| 2 | **Energy abundance** | $2T | 9 | 3 | 6 | Highest real ceiling with a live path. Fusion is funded and technical, but the controls and data layer is ordinary software, and US citizenship clears the export-control gate. |
| 3 | **Longevity** | $3T | 10 | 2 | 5 | Largest ceiling on the board and the highest willingness-to-pay in existence. Both quests are crowded (N=5, N=9), and the work is biology-led. |
| 4 | **Climate change** | $1T | 9 | 5 | 4 | dumpsite-methane-capture at N=1 is the single most open quest anywhere on this board, but it is field operations in the Global South, not software. |
| 5 | **Payments / financial infra** | ~$700B-1T | 5 | 3 | 6 | Passes capturability decisively but is weakest on criterion 3 and 4. See the caveats below. |

Scores are judgements, not measurements. The demand and supply-gap columns are anchored
to sourced figures; the Fit column is anchored to a real profile file. All three are
arguable and should be argued with.

### Why payments scores lowest on demand

It passed the structural test and deserves its place, but the humanitarian case is weak
and should not be overstated. The World Bank Findex counts 1.3 billion unbanked adults,
yet 79% of adults now have accounts, up from 74% in 2021. Nubank, the most successful
bank-the-unbanked company ever built with over 100 million customers, is worth **$70B**.
Serving the unbanked is not where the trillion is. The trillion is in float-and-carry and
interchange, which is closer to profitable rent than to a mission.

### Why payments passed anyway

It is the first candidate tested whose incumbent ceiling does not cap out.

| Company | Market cap | Note |
|---|---|---|
| JPMorgan Chase | $934.57B | Days from being the first $1T bank |
| **Visa** (founded 1958) | **$692.74B** | **At its all-time high right now**, compounding ~11%/yr after 68 years |
| Mastercard (founded 1966) | $508.63B | Two companies hold ~$1.2T of one rail |
| PayPal | $53.05B | Peaked at $274.41B in 2020, **down 81%** |

Global payments revenue is **$2.5T on $2.0 quadrillion of value flows** (McKinsey Global
Payments Report 2025). The rail concentrates rather than fragments, which is exactly the
test everything else failed.

The live opening is dated: the **GENIUS Act was signed July 18, 2025 (S.1582) but takes
effect January 18, 2027**, because rulemaking missed its deadline. Tether earns over
**$10B/yr net profit** on $186B of USDT and $141B of Treasuries, a float-and-carry model
structurally different from interchange, at a fraction of Visa's headcount.

The counter-evidence is equally real: US merchant processing fees hit a **record $198.25B
in 2025**, the year after GENIUS passed. No disruption is visible in the fee data yet.

## The fourteen that failed

### Killed on incumbent ceiling

| Candidate | The number that killed it |
|---|---|
| **Water / desalination** | Veolia, the largest water company on Earth after 170 years: **$31.4B**, one thirty-second of $1T. Xylem $29.7B, American Water Works $26.6B. SOURCE Global raised $270M from Gates, Bezos and BlackRock for atmospheric water and collapsed. Every customer is a municipality with a price cap; no network effect, no pricing power, and the asset is a pipe network nobody can own globally. |
| **Critical minerals** | BHP crossed **$200B for the first time in March 2026** and no mining company had ever reached that level before, at the peak of a critical-minerals supercycle. A rumored Rio-Glencore merger would create only ~$260B. You sell a fungible metal at a price the LME sets. |
| **Food / agriculture** | A **$13T** market whose most valuable participant is Deere at **$169B**. Corteva $59.2B. Vertical farming is in collapse: Bowery shut down after ~$700M raised, Plenty filed Chapter 11. Cultivated-meat funding fell to **$73.9M in 2025** from $144M in 2024. |
| **Insurance / risk transfer** | **Munich Re, 146 years old, the largest reinsurer on Earth, doing exactly what climate risk transfer proposes: $75.92B, which is 7.6% of $1T.** Swiss Re $51.30B. No pure insurer in history has passed ~$236B. **No insurtech has ever reached $10B**; the largest exit was NEXT Insurance at $2.6B. Berkshire's $1.06T is not a counterexample: its insurance **underwriting was $7,258M of $44.5B operating earnings, 16.3%**, making it a capital allocator funded by $176B of float. |

### Killed on structural anti-monopoly design

| Candidate | The number that killed it |
|---|---|
| **Defense** | **$2,887bn** in 2025 world military expenditure, eleventh consecutive rise, and it still cannot produce a $1T company. Lockheed, the world's #1 arms seller for 15 straight years, books 2.6% of global spend and is worth **$130.1B**. Golden Dome approved **2,440 vendors**. Europe legislated against foreign capture: EDIP requires **≥65% of component cost from EU/associated countries**, under a €800bn ReArm envelope. ITAR partitions the rest. |
| **Space** | The only large profitable sub-market is satellite broadband, and Starlink already owns it ($11.4B revenue, SpaceX's only profitable segment). The #2 pure-play, Rocket Lab at $43.4B, is **one fortieth** of SpaceX. Launch itself is a rounding error at $6-25B. SpaceX flies over 80% of global mass to orbit, so every challenger buys its trucking from the incumbent it must displace. |

### Killed because the value migrated to AI

| Candidate | The number that killed it |
|---|---|
| **Humanoid robotics** | Actual 2025 revenue: **$440M globally on ~18,000 units**, and the largest shipment category was entertainment performances. Only ~10% of units reached any real-world application. **Figure's $39B valuation alone exceeds Goldman's projection for the entire global market in 2035 ($38B).** NVIDIA open-sourced the brain (Isaac GR00T N1), commoditizing the OEM layer and routing margin to itself. |
| **Autonomous vehicles** | The closest call. Uber, the near-monopoly aggregator of global ride-hail demand, is worth **$160B on $193B of gross bookings** — that is the ceiling a robotaxi winner inherits. Waymo is real (500,000 paid rides/week, 220.6M rider-only miles) but is priced at ~355x revenue while Alphabet's Other Bets lost $1.8B in Q2 2026 alone. The market fragments geographically: Waymo US, Baidu China. |
| **AI drug discovery (as a platform)** | **Zero AI-discovered drugs have been approved anywhere.** Every AI-platform-selling-into-pharma caps at $1-3B: Schrödinger **$1.32B after 35 years**, Recursion ~$1.8B, Certara $1.06B. Isomorphic Labs, the best-positioned player on Earth, signed Lilly for **$45M upfront**. That is a vendor contract, not a tax on pharma. The $1T belongs to whoever owns the molecule (Lilly, $1.12T). |
| **Post-NVIDIA compute** | NVIDIA **licensed Groq's inference tech for $17B in cash** rather than lose to it; Groq is now worth $3.5B, down from a $6.9B peak. Celestial AI was acquired by Marvell. Cerebras at ~$70B is the best case and is still one seventy-fifth of NVIDIA. Quantum has demonstrated no commercially relevant advantage; all pure-plays are sub-$20B. |

### Killed in earlier rounds

**Cancer**, **neurodegenerative disease**, **AI compute broadly**, and **obesity / GLP-1**
were tested and disqualified before this pass, each failing the same single-company-capture
test. AI compute broadly fails because the foundation-model race is already decided:
OpenAI at $852B, eleven years old, the fastest pace on record.

## The three structural causes of death

Every failure fell into one of three patterns. These are more predictive than market size.

1. **Price-taking with no network effect.** Water, minerals, food. You sell a fungible
   thing at a price someone else sets, so scale never converts into pricing power.
2. **Deliberate anti-monopoly structure.** Defense, insurance. The buyer or the regulator
   actively prevents single-vendor capture: 2,440 vendors on one program, ≥65% EU content
   rules, 56 US insurance jurisdictions, and solvency regimes that hard-cap how much
   premium a given equity base can write.
3. **The value migrated to AI.** Space, defense, robotics, drug discovery, compute. In
   every one, the trillion-dollar outcome accrued to an AI layer or to an incumbent that
   already won.

The third pattern is the strongest finding in the whole exercise, and three independent
research passes converged on it:

- **Palantir ($432.4B) exceeds Lockheed + Northrop + General Dynamics combined ($312B)**
  on roughly 1/28th of their revenue. Its US commercial revenue grew +149% against +90%
  for government, so it is evidence that AI produces $1T companies, not that defense does.
- **SpaceX absorbed xAI on February 2, 2026.** AI is now ~17% of its revenue. The
  trillion-dollar "space" company is partly an AI conglomerate.
- NVIDIA gave away the humanoid brain and bought out its inference challenger.

## Data-quality flags

- Every market cap above comes from aggregators (stockanalysis.com, companiesmarketcap.com)
  rather than filings, and they move daily.
- Market-sizing firms disagree wildly. Desalination 2025 estimates ranged $17.8B to $27.8B
  across five firms; launch-services estimates vary 4x; humanoid-robot 2035 projections
  differ by 100x between Goldman ($38B) and Morgan Stanley ($5T by 2050). Ranges are used
  above, never a single vendor number presented as fact.
- **Could not be verified:** Kairos Power's current valuation, Relativity Space's
  valuation, Castelion's 2026 figure at first pass (later verified at $13B on Aug 20),
  Perfect Day's current valuation, Helsing's revenue, and Anduril's reported ~$100B round
  (talks only, not closed at $61B confirmed).
- Global stablecoin volume estimates diverge 2.5x by methodology (Visa Onchain ~$10.2T vs
  Artemis ~$26T). The "stablecoin volume beats Visa" claim is apples-to-oranges and is not
  used here.
- The Berkshire segment figures come from the FY2025 10-K and annual report and are exact.
- Scores in the passing table are judgements, not measurements.

## Related

- `src/data/in-limit.ts` for the per-problem equity ceilings
- `src/data/quest-crowding.ts` for the sourced competitor counts behind the supply-gap column
- `src/data/adam-profile.ts` for the profile behind the Fit column
- `S_TIER_TIMELINE.md` for founding-to-$1T trajectories of every real trillion-dollar company
- `JOINING_FUSION.md` for the join path into the energy-abundance candidate
- Live at https://optimism.fun/paths
