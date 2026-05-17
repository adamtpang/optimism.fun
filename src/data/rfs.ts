import type { RequestForStartup } from './types'

/**
 * Humanity's Requests for Startups.
 *
 * Genre: YC RFS (concrete, urgent, buildable) crossed with Founders Fund's
 * "Choose Good Quests" (important × frontier × unambiguously good). Every
 * entry is tied to a ranked problem in problems.ts. These are conjectures,
 * open to refutation — the goodQuest line is the falsifiable claim.
 */
const ASOF = '2026-05-16'

export const requestsForStartups: RequestForStartup[] = [
  // ─── AI safety & alignment ───────────────────────────────────────────────
  {
    slug: 'interpretability-as-a-service',
    problemSlug: 'ai-safety',
    title: 'The MRI machine for neural networks',
    pitch:
      'Every frontier lab ships models it cannot read. Deception and goal-misgeneralization are invisible until they are catastrophic. Build the hosted interpretability layer that flags dangerous circuits before deployment.',
    whyNow:
      'Mechanistic interpretability went from toy circuits to production-scale feature extraction in three years. The labs now want this and cannot all build it in-house.',
    shape:
      'An API + dashboard that ingests model weights or activations and returns a risk report: deceptive features, situational awareness, sandbagging, capability spikes. Sells to labs, evaluators, and eventually regulators.',
    successLooksLike:
      'No frontier model is deployed without an interpretability sign-off, the way no bridge opens without an inspection.',
    goodQuest:
      'If alignment is unsolved, nothing else on this list matters; reading model internals is the genuine scientific frontier and there is no downside to seeing clearly.',
    confidence: 'med',
    asOf: ASOF,
  },
  {
    slug: 'agentic-eval-grid',
    problemSlug: 'ai-safety',
    title: 'The adversarial eval grid for agents',
    pitch:
      'Autonomous agents are shipping with benchmark suites built for chatbots. We are grading self-driving cars with a written test. Build the continuously-updated red-team grid that stress-tests agents at the capability frontier.',
    whyNow:
      'Agentic deployment went mainstream in 2025–26; incident rate is climbing and no standard adversarial harness exists.',
    shape:
      'A hosted eval platform that runs agents through escalating adversarial scenarios — tool misuse, prompt injection, multi-step deception — and issues a capability + safety profile that updates as new attacks are discovered.',
    successLooksLike:
      'Every deployed agent carries a current, adversarial safety rating, and the rating actually predicts field failures.',
    goodQuest:
      'Important because agents act in the world, a frontier because the attack surface is unmapped, and good because better evals help cautious and bold builders alike.',
    confidence: 'med',
    asOf: ASOF,
  },
  {
    slug: 'hardware-enforced-containment',
    problemSlug: 'ai-safety',
    title: 'Hardware-enforced AI containment',
    pitch:
      'Alignment that lives only in software can be jailbroken or fine-tuned away. Build the trusted-execution + tamper-evident compute layer that makes a model’s deployment envelope physically enforceable.',
    whyNow:
      'Confidential-computing silicon (TEEs, secure enclaves at GPU scale) finally exists at the performance tier frontier models need.',
    shape:
      'A compute substrate + attestation protocol where a model can only run inside a verified policy envelope; weight exfiltration and unsanctioned fine-tuning are cryptographically detectable.',
    successLooksLike:
      'Frontier weights cannot be silently stolen or repurposed, and deployment limits are enforced by physics, not promises.',
    goodQuest:
      'A real hardware/cryptography frontier, decisive if model theft is the dominant risk path, and net-good regardless of takeoff speed.',
    confidence: 'low',
    asOf: ASOF,
  },

  // ─── Biosecurity & pandemic preparedness ─────────────────────────────────
  {
    slug: 'pathogen-agnostic-early-warning',
    problemSlug: 'biosecurity',
    title: 'Pathogen-agnostic early warning',
    pitch:
      'We detect outbreaks by waiting for humans to get sick and show up at hospitals — weeks late, by design. Build the metagenomic sampling network that flags any novel replicating pathogen in days.',
    whyNow:
      'Sequencing cost fell below the threshold where continuous environmental metagenomics is economically routine.',
    shape:
      'A network of wastewater, airport, and air-handler samplers feeding a continuous metagenomic pipeline that alarms on any novel exponentially-growing genome — known or unknown.',
    successLooksLike:
      'Time-to-detection for a novel pathogen drops from weeks to days, globally, before the first hospital wave.',
    goodQuest:
      'A real systems + bioinformatics frontier, decisive against the one risk that scales to civilization-ending, and good with no plausible misuse.',
    confidence: 'med',
    asOf: ASOF,
  },
  {
    slug: 'days-not-months-biomanufacturing',
    problemSlug: 'biosecurity',
    title: 'Days-not-months vaccine manufacturing',
    pitch:
      'mRNA proved the design step can take hours. Manufacturing, fill-finish, and distribution still take a year. Build the distributed, rapidly-reconfigurable biomanufacturing stack that closes the gap.',
    whyNow:
      'Cell-free and benchtop synthesis matured; the constraint is now industrialization, not science.',
    shape:
      'Containerized, standardized micro-factories + a regulatory playbook that lets a validated process move from sequence to vialed doses in days, near the point of need.',
    successLooksLike:
      'A new vaccine reaches a billion arms within weeks of pathogen identification, not within years.',
    goodQuest:
      'A genuine manufacturing + regulatory frontier, decisive in any fast pandemic, and unambiguously good.',
    confidence: 'med',
    asOf: ASOF,
  },
  {
    slug: 'far-uvc-as-infrastructure',
    problemSlug: 'biosecurity',
    title: 'Far-UVC as building infrastructure',
    pitch:
      'We treat indoor airborne transmission as a fact of life. It is not — it is an untreated utility. Build the far-UVC + ventilation retrofit company that makes indoor air as safe as treated water.',
    whyNow:
      'Far-UVC safety data matured and 222nm excimer cost is on a manufacturing learning curve.',
    shape:
      'A retrofit + new-build company that designs, installs, and certifies far-UVC + ventilation for schools, transit, and offices, sold on insurance and absenteeism economics.',
    successLooksLike:
      'Airborne transmission indoors becomes as rare as cholera from tap water in developed economies.',
    goodQuest:
      'An engineering frontier with massive everyday upside even absent a pandemic, and good with no downside.',
    confidence: 'med',
    asOf: ASOF,
  },

  // ─── Energy abundance ────────────────────────────────────────────────────
  {
    slug: 'fission-permitting-unlock',
    problemSlug: 'energy-abundance',
    title: 'The fission permitting unlock',
    pitch:
      'The NRC takes years and tens of millions to license a reactor design that has already been built and run safely. The bottleneck is paperwork, not physics. Build the regulatory-tech company that compresses approval to months.',
    whyNow:
      'Post-2024 advanced-reactor legislation reopened the path; a generation of SMR designs is queued behind process, not engineering.',
    shape:
      'Software + regulatory expertise that productizes licensing: standardized design packages, automated safety-case generation, and a track record that compounds across applicants.',
    successLooksLike:
      'Time-and-cost to license a proven reactor design falls 10×, and firm clean baseload actually gets built.',
    goodQuest:
      'A regulatory + systems frontier that gates the entire energy stack; unambiguously good if you believe cheap clean energy lifts every other quest.',
    confidence: 'med',
    asOf: ASOF,
  },
  {
    slug: 'geothermal-via-oilfield-tooling',
    problemSlug: 'energy-abundance',
    title: 'Geothermal everywhere via oilfield tooling',
    pitch:
      'The oil & gas industry already knows how to drill anywhere on Earth, cheaply. Redirect that exact capability into closed-loop geothermal and you get firm clean power on demand.',
    whyNow:
      'Directional drilling and downhole tooling hit a cost/perf point where engineered geothermal pencils out; displaced O&G crews are available.',
    shape:
      'A geothermal developer that acquires and redeploys oilfield drilling capacity, standardizes closed-loop well design, and sells firm power via PPA to data centers and grids.',
    successLooksLike:
      'Firm geothermal is deployable in most geographies at a cost competitive with gas peakers.',
    goodQuest:
      'A real engineering + cost frontier, decisive for firm clean power, and good with negligible externalities.',
    confidence: 'med',
    asOf: ASOF,
  },
  {
    slug: 'hundred-hour-storage',
    problemSlug: 'energy-abundance',
    title: 'Hundred-hour grid storage',
    pitch:
      'Renewables are the cheapest electrons in history and worthless when the wind stops. Lithium is too expensive past ~8 hours. Build the long-duration storage company that makes 100-hour storage cost-competitive.',
    whyNow:
      'Iron-air, thermal, and mechanical approaches crossed from lab to first commercial deployments in 2024–26.',
    shape:
      'A storage developer + manufacturer betting on one chemistry/mechanism, selling multi-day firming to utilities under capacity contracts.',
    successLooksLike:
      'A renewables-plus-storage grid delivers firm power at a cost below new fossil generation.',
    goodQuest:
      'A materials + systems frontier that determines whether cheap renewables become reliable power; unambiguously good.',
    confidence: 'med',
    asOf: ASOF,
  },

  // ─── Low-cost housing & construction ─────────────────────────────────────
  {
    slug: 'factory-housing-that-scales',
    problemSlug: 'housing-construction',
    title: 'The factory-built housing company that actually scales',
    pitch:
      'Modular construction has failed a dozen times — on logistics, financing, and entitlement, almost never on the technology. Build the vertically-integrated company that owns the whole failure surface.',
    whyNow:
      'A graveyard of modular startups produced a clear map of why they died; capital and software to fix logistics + financing now exist.',
    shape:
      'A vertically-integrated factory + entitlement + project-financing company that sells finished homes, not panels, and underwrites its own absorption risk.',
    successLooksLike:
      'Quality housing delivered at roughly one-third today’s cost per unit, repeatably, at metro scale.',
    goodQuest:
      'A logistics + finance frontier disguised as a tech problem; decisive for 1.6B under-housed humans and unambiguously good.',
    confidence: 'med',
    asOf: ASOF,
  },
  {
    slug: 'entitlement-as-an-api',
    problemSlug: 'housing-construction',
    title: 'Permitting and entitlement as an API',
    pitch:
      'A single-family home waits months on discretionary review that produces no safety value. Build the software that turns zoning + permitting from a black box into a queryable, deterministic API.',
    whyNow:
      'Municipal records are digitizing and LLMs can finally parse zoning code reliably enough to be load-bearing.',
    shape:
      'A platform that ingests local code, returns by-right buildable envelopes instantly, auto-generates compliant submittals, and tracks the approval pipeline for builders and cities.',
    successLooksLike:
      'Time-to-permit for compliant housing falls from months to days in adopting jurisdictions.',
    goodQuest:
      'An unglamorous software + govtech frontier with enormous leverage; good for builders, cities, and residents alike.',
    confidence: 'med',
    asOf: ASOF,
  },

  // ─── Pedagogy at scale ───────────────────────────────────────────────────
  {
    slug: 'bloom-two-sigma-tutor',
    problemSlug: 'pedagogy',
    title: 'The Bloom 2-sigma tutor',
    pitch:
      '1:1 tutoring beats classroom instruction by two standard deviations and has been unaffordable for 4,000 years. Build the AI tutor that delivers it for the marginal cost of inference, in any language.',
    whyNow:
      'Models crossed the threshold where they can diagnose a misconception and adapt — not just answer — at conversational latency and cost.',
    shape:
      'A tutoring product (not a chatbot) with a real pedagogical model: mastery tracking, spaced retrieval, Socratic dialog, and outcome measurement against standardized gains.',
    successLooksLike:
      'A median student using it gains the Bloom 2-sigma effect, reproducibly, on independent assessments.',
    goodQuest:
      'A pedagogy + measurement frontier, civilization-scale if it works, and unambiguously good.',
    confidence: 'med',
    asOf: ASOF,
  },
  {
    slug: 'skills-credential-standard',
    problemSlug: 'pedagogy',
    title: 'Credentialing that routes around the diploma',
    pitch:
      'Employers want proof of skill; the degree is a $1.5T noisy proxy. Build the verifiable, adversarially-robust skills-assessment standard that employers actually trust.',
    whyNow:
      'AI both threatens take-home assessment integrity and enables proctored, adaptive, cheating-resistant evaluation at scale.',
    shape:
      'An assessment + credential issuer with employer-side validity studies, designed from day one to resist AI-assisted cheating and to be portable across employers.',
    successLooksLike:
      'A meaningful share of hiring uses the credential as a primary signal, decoupling opportunity from tuition.',
    goodQuest:
      'A measurement + trust frontier; good if you believe opportunity should track skill, not the ability to pay for a degree.',
    confidence: 'low',
    asOf: ASOF,
  },

  // ─── Infectious disease ──────────────────────────────────────────────────
  {
    slug: 'single-encounter-tb-cure',
    problemSlug: 'infectious-disease',
    title: 'Single-encounter curatives for TB',
    pitch:
      'Tuberculosis kills 1.3M people a year and the cure requires 4–6 months of daily adherence most patients cannot sustain. Build the long-acting or single-dose regimen plus the delivery model.',
    whyNow:
      'Long-acting injectable formulation science matured (proven in HIV PrEP); the same toolkit is unapplied to TB at scale.',
    shape:
      'A drug-delivery company pairing a long-acting regimen with a field delivery and adherence model designed for high-burden, low-resource settings.',
    successLooksLike:
      'TB treatment becomes a single supervised encounter, and TB mortality falls like HIV mortality did after ART.',
    goodQuest:
      'A pharmacology + delivery frontier, decisive against humanity’s deadliest infection, and unambiguously good.',
    confidence: 'med',
    asOf: ASOF,
  },
  {
    slug: 'gene-drive-vector-control',
    problemSlug: 'infectious-disease',
    title: 'Safe, reversible gene-drive vector control',
    pitch:
      'Bednets and spraying have plateaued; the mosquito is the delivery system for malaria. Build the safe, reversible, field-deployable gene-drive company for malaria vectors.',
    whyNow:
      'Gene-drive and self-limiting designs reached field-trial readiness; the gating problems are now governance and reversibility, which are buildable.',
    shape:
      'A vector-control company developing confinable/reversible drives plus the field-trial, regulatory, and community-consent apparatus to deploy them responsibly.',
    successLooksLike:
      'Malaria transmission collapses in deployment regions without ecological regret.',
    goodQuest:
      'A genuine genetic-engineering frontier with real risk that must be engineered down; good if and only if reversibility is solved — which is the quest.',
    confidence: 'low',
    asOf: ASOF,
  },
  {
    slug: 'sub-dollar-diagnostics',
    problemSlug: 'infectious-disease',
    title: 'Point-of-care diagnostics under a dollar',
    pitch:
      'You cannot treat what you cannot diagnose, and PCR needs a lab, cold chain, and a day. Build the paper or CRISPR diagnostic that returns an accurate result anywhere for pennies.',
    whyNow:
      'CRISPR-based detection (SHERLOCK/DETECTR-class) moved from papers to manufacturable formats.',
    shape:
      'A diagnostics company productizing instrument-free, ambient-stable tests for the high-burden infections, distributed through existing community-health rails.',
    successLooksLike:
      'Accurate infectious-disease diagnosis is available at the point of need anywhere on Earth for under a dollar.',
    goodQuest:
      'A biotech + manufacturing frontier with enormous leverage on every other disease program; unambiguously good.',
    confidence: 'med',
    asOf: ASOF,
  },

  // ─── Scientific productivity ─────────────────────────────────────────────
  {
    slug: 'autonomous-lab',
    problemSlug: 'scientific-productivity',
    title: 'The autonomous lab',
    pitch:
      'A PhD spends most of their hours pipetting, not thinking. Build the closed-loop robotic wet-lab that runs experiments 24/7 and proposes the next one.',
    whyNow:
      'Lab robotics + foundation models crossed the line where the design-build-test-learn loop can close without a human in the inner loop.',
    shape:
      'A self-driving lab as a service: researchers submit hypotheses, the system designs, executes, and iterates experiments autonomously, returning results and next-best experiments.',
    successLooksLike:
      'Experimental throughput per scientist rises an order of magnitude in adopting fields.',
    goodQuest:
      'A robotics + ML + lab-science frontier that compounds across all of science; unambiguously good.',
    confidence: 'med',
    asOf: ASOF,
  },
  {
    slug: 'replication-layer',
    problemSlug: 'scientific-productivity',
    title: 'The replication layer',
    pitch:
      'Most published findings are never independently checked, so the literature quietly rots. Build the company that makes high-value replication fast, funded, and a default step.',
    whyNow:
      'Autonomous labs + AI literature analysis make systematic replication economically feasible for the first time.',
    shape:
      'A replication-as-a-service org funded by journals, funders, and firms that need a result to be true before they bet on it; outputs a trust score the field actually uses.',
    successLooksLike:
      'High-stakes results carry a replication status, and the replication rate of new work rises measurably.',
    goodQuest:
      'A metascience frontier with leverage over every downstream bet; unambiguously good.',
    confidence: 'low',
    asOf: ASOF,
  },
  {
    slug: 'fast-grants-as-a-product',
    problemSlug: 'scientific-productivity',
    title: 'Fast grants as a standing product',
    pitch:
      'It takes 6–12 months to fund a science idea. Fast Grants proved it can take 48 hours without quality loss. Build the always-on micro-grant rail for frontier research.',
    whyNow:
      'The Fast Grants experiment produced the playbook; no one operationalized it as durable infrastructure.',
    shape:
      'A funding platform with rolling micro-grants, expert triage, and radically compressed decision latency, capitalized by philanthropies and firms wanting optionality on frontier work.',
    successLooksLike:
      'Time from research idea to funded work drops from quarters to days as a standing option.',
    goodQuest:
      'An institution-design frontier with outsized leverage; unambiguously good.',
    confidence: 'med',
    asOf: ASOF,
  },

  // ─── Longevity & aging ───────────────────────────────────────────────────
  {
    slug: 'aging-as-an-indication',
    problemSlug: 'longevity',
    title: 'Aging as an FDA-recognized indication',
    pitch:
      'You cannot run a trial for a disease the regulator does not recognize. Build the company that runs the TAME-class trial and operationalizes aging biomarkers as approvable endpoints.',
    whyNow:
      'Biomarker science (epigenetic and proteomic clocks) matured enough to be candidate endpoints; the regulatory path is the remaining frontier.',
    shape:
      'A clinical-stage company designing and running the pivotal trial plus the regulatory-science work to make "aging" a legitimate, reimbursable indication.',
    successLooksLike:
      'Aging is a recognized indication with at least one approved intervention and validated endpoints.',
    goodQuest:
      'A regulatory + biomarker frontier that unlocks the entire longevity field; unambiguously good if healthspan, not just lifespan, is the target.',
    confidence: 'low',
    asOf: ASOF,
  },
  {
    slug: 'healthspan-diagnostic',
    problemSlug: 'longevity',
    title: 'The healthspan diagnostic',
    pitch:
      'Medicine measures disease, not the slope of decline. You cannot manage what you do not measure. Build the longitudinal aging-clock and intervention-tracking company.',
    whyNow:
      'Multi-omic aging clocks became reproducible enough to track individual trajectories over time.',
    shape:
      'A consumer + clinical diagnostic that measures biological aging longitudinally and quantifies whether an intervention is bending the curve.',
    successLooksLike:
      'Individuals and trials can see, in months, whether an intervention slows aging.',
    goodQuest:
      'A measurement frontier that makes the whole field falsifiable; unambiguously good.',
    confidence: 'low',
    asOf: ASOF,
  },

  // ─── Fertility decline & demographic stagnation ──────────────────────────
  {
    slug: 'order-of-magnitude-cheaper-ivf',
    problemSlug: 'fertility-decline',
    title: 'Order-of-magnitude cheaper IVF',
    pitch:
      'Assisted reproduction is gated by cost and clinic throughput, not desire. Build the automated fertility lab that drops the cost of a cycle by an order of magnitude.',
    whyNow:
      'Lab automation + imaging AI can now standardize the most labor-intensive, operator-variable steps of the embryology lab.',
    shape:
      'An automated embryology platform + clinic model that turns a boutique, artisanal process into a standardized, high-throughput one.',
    successLooksLike:
      'A cycle costs what a used car costs, not what a house down-payment costs, and throughput multiplies.',
    goodQuest:
      'A biotech + automation frontier addressing a demographic problem with century-long consequences; unambiguously good for those who want children.',
    confidence: 'low',
    asOf: ASOF,
  },
  {
    slug: 'cost-of-family-formation',
    problemSlug: 'fertility-decline',
    title: 'The cost-of-family-formation attack',
    pitch:
      'Below-replacement fertility is downstream of housing, childcare, and time — not ideology. Build the company that makes the marginal child dramatically cheaper to raise.',
    whyNow:
      'The bottleneck stack (housing cost, childcare labor, logistics) is now individually attackable with software + operations.',
    shape:
      'An operating company bundling the expensive, time-eating parts of early parenting into a radically cheaper, reliable service — pick the wedge (childcare ops, family housing, logistics) and own it.',
    successLooksLike:
      'In served markets, the all-in marginal cost of the next child falls enough to move revealed preference.',
    goodQuest:
      'An operations + policy frontier on a problem most ignore until it is irreversible; good if you believe people should be able to afford the families they want.',
    confidence: 'low',
    asOf: ASOF,
  },

  // ─── Loneliness & social isolation ───────────────────────────────────────
  {
    slug: 'third-places-as-a-business',
    problemSlug: 'loneliness',
    title: 'Third places as a business model',
    pitch:
      'We optimized retail and offices and quietly deleted the places people simply *are* together. Build the company that makes the modern third place financially self-sustaining.',
    whyNow:
      'Remote/hybrid work permanently changed where people spend their days; the demand for in-person belonging is unmet and growing.',
    shape:
      'An operator of third places (not an app) with a unit economic model that does not depend on selling attention — membership, food, programming, or local commerce — and is replicable.',
    successLooksLike:
      'A profitable, repeatable third-place format exists and is expanding, measured by relationships formed, not engagement.',
    goodQuest:
      'An operations + social-design frontier on a mortality-grade problem; unambiguously good.',
    confidence: 'low',
    asOf: ASOF,
  },
  {
    slug: 'proximity-over-feeds',
    problemSlug: 'loneliness',
    title: 'Proximity over feeds',
    pitch:
      'Social software optimized engagement and corroded connection. Build the product whose only success metric is offline relationships formed.',
    whyNow:
      'A generation raised on feeds is actively seeking alternatives; the cultural permission to build anti-engagement social products now exists.',
    shape:
      'A social product engineered, instrumented, and financed around offline meetups and durable local ties — the opposite of a feed — with a business model that rewards that.',
    successLooksLike:
      'Users form measurably more real-world relationships, and the company is viable without an attention-extraction model.',
    goodQuest:
      'A product + incentive-design frontier; good only if it genuinely avoids the engagement trap — which is the quest.',
    confidence: 'low',
    asOf: ASOF,
  },
]

export const getRequestsForProblem = (problemSlug: string): RequestForStartup[] =>
  requestsForStartups.filter((r) => r.problemSlug === problemSlug)

export const getRequestBySlug = (slug: string): RequestForStartup | undefined =>
  requestsForStartups.find((r) => r.slug === slug)
