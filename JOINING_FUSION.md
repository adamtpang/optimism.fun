# Joining Fusion as a Software Engineer

What it concretely takes to join Helion Energy or Commonwealth Fusion Systems (CFS)
as a software person rather than a plasma physicist. These are the only two companies
on optimism.fun's board judged "trillion-shaped" (see `src/data/join-paths.ts`): both
sit on the energy-abundance problem, which carries a $2T in-limit ceiling anchored to
Saudi Aramco. Compiled 2026-08-22 from both companies' own applicant-tracking APIs,
plus levels.fyi and Glassdoor for actual reported compensation.

**Headline finding: no software posting at either company requires a physics or
nuclear background.** Helion's "Software Engineer, Plant Control" posting describes
itself as "a generalist software role" and lists desired experience as "aerospace,
robotics, manufacturing, power systems, scientific instrumentation, or other complex
hardware environments." CFS's stated requirement across all its software roles is a
bachelor's in "computer science, computer engineering, electrical engineering,
industrial engineering, etc." Physics is not listed.

## Open software roles

Pulled live from the companies' public ATS APIs on 2026-08-22 (Helion uses Ashby,
CFS uses Lever). Careers pages themselves are JS-rendered and block scrapers. Helion
had **104 open roles** total, CFS **70**.

### Helion Energy (Everett, WA, all onsite)

| Role | Posted range |
|---|---|
| Software Engineer, Plant Control (2+ yrs) | $185K-$240K |
| Senior Software Engineer, Data Platform | $241K-$255K |
| Senior Software Engineer, Full Stack | $241K-$255K |
| Senior Software Engineer, Cybersecurity | not pulled |
| Controls Development Engineer | $164K-$200K |
| Senior Data Scientist, Fusion Systems | $195K-$222K |
| LabVIEW Controls Engineer | not pulled |
| Senior Manager, Software Engineering, Plant Control | not pulled |
| Test Automation Engineer, Manufacturing | not pulled |

Physics-gated roles to skip: Senior/Principal Applied Plasma Data Scientist, Senior
Computational Plasma Scientist (MHD / Kinetic-PIC).

### Commonwealth Fusion Systems (Devens, MA unless noted, hybrid)

| Role | Posted range |
|---|---|
| Control Software Engineer | $110K-$160K |
| Senior Control Software Engineer | $140K-$200K |
| Senior Embedded Software Engineer | $140K-$200K |
| Senior Data and Operations Software Engineer | $140K-$200K |
| Senior Algorithms and Simulation Software Engineer | $140K-$200K |
| Senior Controls Engineer | $110K-$185K |
| Staff Engineer, Controls and Software (Milpitas, CA) | $160K-$220K |
| Staff Modeling and Simulation Engineer (Milpitas, CA) | $130K-$200K |

**Every CFS role carries a US export-control compliance contingency.** Depending on
citizenship status this may be the binding constraint rather than the technical bar.

## What the work actually is

**Helion** (pulsed field-reversed configuration; their Polaris machine runs at
150M degrees C / 13 keV per the posting): precision timing, synchronization, PTP,
deterministic systems, distributed sensors and actuators, SCADA/PLC, embedded Linux,
time-series pipelines (InfluxDB/Grafana), operator GUIs. A real-time data-acquisition
and machine-coordination job.

**CFS** (SPARC tokamak, high-temperature superconducting magnets):
- Control Software: PLCs, real-time Linux, Beckhoff TwinCAT, EtherCAT/Profinet/Modbus, C++/Rust/Structured Text
- Embedded: microcontrollers, FPGAs, hardware-in-the-loop testbeds
- Data and Operations: **Golang backend, REST APIs, distributed systems, Python client libraries, React a bonus**, essentially indistinguishable from a normal backend role

## Compensation: posted ranges versus actual reported

The posted ranges above are real, mandated by Washington and Massachusetts
pay-transparency law. Actual reported compensation tells a different story and the two
should not be conflated.

| Source | Helion SWE | CFS SWE |
|---|---|---|
| Posted ATS range | $185K-$240K (Plant Control) | $110K-$200K (most roles) |
| levels.fyi median | **no data** (page reads "We only need 4 more Software Engineer submissions to unlock") | **$210K total** = $200K base + $10K/yr stock, range $182K-$340K, updated 2026-08-22 |
| levels.fyi company-wide median | $166,813 | $154,000 |
| Glassdoor | 53 submissions total, no SWE figure | 196 submissions, generic "Engineer" median $109,432 (not software) |

**Important:** an earlier reading of this data claimed Helion pays materially more than
CFS. That claim does not survive the actual reported numbers. CFS software engineers
report a $210K median, above CFS's own posted ranges, while Helion has no
software-specific actuals at all. Any Helion software-comp claim rests on posted ATS
ranges only.

**Equity: not found for either company.** No public reporting exists on grant sizes,
strike prices, refresh policy, or vesting for rank-and-file engineers. The single
datapoint anywhere is levels.fyi's CFS $10K/yr stock component, which is one
self-reported median, not company policy.

## The best first step: CFS open source

[github.com/cfs-energy](https://github.com/cfs-energy) is the clearest credentialing
surface in this entire space: 13 public repos including `cfspopcon` (plasma operating
contours, 40 stars), `SPARCPublic` (57 stars), `cfsem-rs` and `cfsem-py` (Rust
electromagnetics), `device_inductance`, `radas`, and `scisw_learning` ("learning
materials created or curated by CFS's Scientific Software team").

You can arrive with a real commit instead of a cover letter.

**Correction (2026-08-22):** an earlier version of this file said Helion has no
open-source presence. Helion does have a GitHub organisation
([github.com/helion-energy](https://github.com/helion-energy)), but all 4 repos are
**forks with no original code** (WarpX, pyamrex, maestrowf, FerroX). They are HPC
simulation users, not open-source publishers. The practical conclusion is unchanged:
CFS is the only one of the two you can meaningfully contribute to before applying.

### Two contribution targets better than CFS's own repos

- **TORAX** ([github.com/google-deepmind/torax](https://github.com/google-deepmind/torax)),
  Python/JAX, has a CONTRIBUTING.md, and its SOFE 2025 paper is **co-authored by
  DeepMind and CFS staff together** (Citrin, Felici, Tracey alongside Battaglia, Hasse,
  Teplukhina, Wai of CFS). Contributing here puts your name in front of the exact CFS
  people who would hire you.
- **disruption-py** ([github.com/MIT-PSFC/disruption-py](https://github.com/MIT-PSFC/disruption-py)),
  MDSplus data retrieval for disruption-prediction ML, funded under SPARC RPP021 and run
  with MIT PSFC ([disruptions.mit.edu](https://disruptions.mit.edu),
  [arXiv 2401.00051](https://arxiv.org/abs/2401.00051)).

Note on the famous DeepMind/EPFL tokamak RL work: its public repo
(`deepmind-research/fusion_tcv`) contains only rewards, targets, and a noise model, with
no simulator, no policies, and no training infrastructure, inside an archived monorepo.
It is effectively **non-contributable**. TORAX is the live successor.

### What CFS has published about its actual control stack

CFS publicly described the SPARC Plasma Control System architecture at SOFE 2025 (Boyer,
Kaloyannis, Woodall, Battaglia, Wai, Teplukhina, and the SPARC Software Team). It
processes hundreds of diagnostic signals and runs on **"neutrino"**, a CFS-built
lightweight real-time framework for Linux, macOS, and embedded targets using lock-free
inter-process and inter-node communication. Implemented components include equilibrium
reconstruction, shape control, vertical control, power-balance monitoring, a real-time
heat-flux and temperature model for plasma-facing components, and an off-normal warning
system for soft and hard landings. Two simulators, **COMET** (real-time,
control-oriented) and **MOSAIC** (high fidelity), drive hardware-in-the-loop and
human-out-of-the-loop rigs used in **continuous-integration testing**. The diagnostics
DAQ platform is **96 channels, 18-bit, 10 MS/s, with onboard real-time DSP**.

That is a recognisable distributed-real-time-systems problem, described in ordinary
software-engineering vocabulary. It is the strongest single piece of evidence that this
work does not require a physics background.

For Helion, the equivalent scale figures come from its own site rather than a paper:
plasmas last **~1 millisecond**, Polaris targets **1 pulse per second** (earlier machines
managed roughly 1 pulse per 10 minutes), each pulse is **~50 MJ**, and the electrical
systems are synchronized to **nanosecond** precision.

## Adjacent entry routes

- **INFUSE** ([infuse.ornl.gov](https://infuse.ornl.gov/)), ORNL/PPPL-led, funds
  private-fusion and national-lab collaborations, with topic areas including
  Diagnostics and Modeling & Simulation. Caveat: **companies apply, not individuals**,
  so this is not a direct personal entry path.
- **DeepMind/EPFL tokamak reinforcement learning**, Nature 2022
  ([s41586-021-04301-9](https://www.nature.com/articles/s41586-021-04301-9)). The core
  simulation codes (FGE, LIUQE) are license-gated by EPFL, making this a weaker
  contribution target than CFS's own repos. Follow-on work exists
  ([arXiv 2506.13267](https://arxiv.org/pdf/2506.13267), DIII-D).

## Company funding status

| Company | Latest round | Valuation | Total raised |
|---|---|---|---|
| Helion | Series G, Jun 4 2026 | $15.5B | ~$1.5B |
| CFS | ~$1B round, Jul 30 2026 | not disclosed | $4B per CFS (one outlet reports $6.85B, unresolved) |

Earlier rounds for reference: Helion's Series F (Jan 2025, $425M) was at ~$5.4B
post-money, so the Series G represents roughly a 3x step up. CFS's Series B2 (Aug 2025,
$863M, backed by Google and Nvidia) did not disclose a post-money valuation, and it
should not be paired with one.

## Data-quality flags

- **The "no physics required" conclusion rests on posting text**, which is strong
  evidence but is not testimony. A search found **no public first-person account** of
  an engineer switching into either company from general tech. The door looks open on
  paper; nobody has publicly documented walking through it.
- **Helion has zero software-engineer-specific aggregator data.** Its comp figures come
  from posted ATS ranges only.
- A search snippet showed a Helion "Software Engineer, Diagnostics and Controls" role at
  $100K-$145K, materially below the Plant Control range. The source page returned HTTP
  403, so this is unconfirmed and is not included in the table above.
- **No H-1B / LCA salary records exist** for either company (h1bdata.info returns zero
  records for both), so there is no visa-filing salary data to cross-check against.
- levels.fyi rendered two conflicting CFS medians in one fetch ($210K and $220K). The
  $210K figure is the itemized one and is used here.
- Four Helion role ranges were not retrieved due to rate limiting. They are available
  from the same public API.
- Both companies are **onsite or hybrid in the United States** (Everett WA, Devens MA,
  Milpitas CA). Neither offers remote work for these roles.

## Related

- `src/data/join-paths.ts` for the full join-path data across every $1T problem
- `S_TIER_TIMELINE.md` for how these companies compare against historical
  founding-to-$1T trajectories
- Live at https://optimism.fun/paths
