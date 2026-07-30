/**
 * Starter packs — the "you could actually begin this weekend" layer.
 *
 * Modelled on what ideabrowser does well: an idea is inert until it comes with
 * proof of demand, proof of thin supply, and a first move small enough to
 * start. The proof is already in the index, so the pack supplies what the index
 * cannot — a name to call it, the assumption most likely to kill it, and the
 * smallest artifact that tests that assumption.
 *
 * Deliberately NOT here: a full spec or a business plan. The first artifact is
 * always a probe at the riskiest assumption, because for every one of these the
 * binding constraint is regulatory, scientific, or distributional — never the
 * code. A founder who spends three months building an app before testing the
 * assumption has learned nothing.
 *
 * The Claude Code prompt is composed at render time (see buildClaudeCodePrompt)
 * so the live demand, gap, and competitor numbers are injected fresh rather
 * than hardcoded and going stale.
 */

export type NameIdea = {
  name: string
  /** Why this name, in a few words. Register varies on purpose. */
  note: string
}

export type StarterPack = {
  questSlug: string
  names: NameIdea[]
  /** The belief that, if false, kills the company. Test this first. */
  riskiestAssumption: string
  /** The smallest thing that tests it. Days, not months. */
  firstArtifact: string
  /** Who has to say yes before any of it matters. */
  gatekeeper: string
  /** Quest-specific body of the Claude Code prompt. */
  promptBody: string
}

export const starterPacks: StarterPack[] = [
  {
    questSlug: 'single-encounter-tb-cure',
    names: [
      { name: 'One Dose', note: 'plain, and the entire product claim' },
      { name: 'Koch', note: 'Robert Koch identified the bacillus in 1882' },
      { name: 'Terminus', note: 'the end of a course of treatment' },
    ],
    riskiestAssumption:
      'That a long-acting formulation can hold therapeutic levels for months without toxicity — and that regulators will accept a single-encounter endpoint instead of measured daily adherence.',
    firstArtifact:
      'A regulatory-path memo: every long-acting injectable approved in the last decade, its trial design, its endpoint, and which of those endpoints a TB regimen could plausibly borrow. Ten pages, no lab required.',
    gatekeeper: 'WHO guideline committees and national TB programmes, not patients or payers',
    promptBody: `Build me a research workspace for evaluating single-encounter TB treatment.

I need to know whether the regulatory path exists before I raise money or touch a lab. Specifically:
1. Pull every long-acting injectable or implant approved by FDA or EMA since 2015. For each: the drug, the duration achieved, the trial endpoint accepted, and the total time from IND to approval.
2. Find every clinical trial (ClinicalTrials.gov API) for long-acting TB therapy, active or terminated. Terminated ones matter most — I want the failure reasons.
3. Summarise what WHO's current TB treatment guideline requires for a regimen change, and who sits on the committee that decides.
4. Output a single markdown memo ranking the three most plausible regulatory paths, each with the precedent that supports it and the reason it might fail.

Use real sources with URLs. Where you cannot verify something, say so rather than guessing.`,
  },
  {
    questSlug: 'gene-drive-vector-control',
    names: [
      { name: 'Confinable', note: 'names the safety property that unlocks approval' },
      { name: 'Anopheles', note: 'the mosquito genus that carries malaria' },
      { name: 'Reversible', note: 'the whole regulatory argument in one word' },
    ],
    riskiestAssumption:
      'That a reversible or self-limiting drive can win community consent and national approval. The biology is closer than the permission is — this is a governance company that happens to do genetics.',
    firstArtifact:
      'A consent-and-approval map for one country: who legally authorises an environmental release, what Target Malaria actually had to do to get field trials, and what the community-engagement process cost in time and money.',
    gatekeeper:
      'National biosafety authorities and the specific communities living where release would happen',
    promptBody: `Build me a governance research workspace for reversible gene-drive vector control.

The genetics is not my bottleneck; permission is. I need:
1. Every gene-drive or GM-mosquito field release attempted worldwide — Target Malaria, Oxitec, and any others. For each: country, year, regulatory body, how long approval took, and whether it proceeded or was blocked.
2. The specific legal instrument that authorises environmental release in Burkina Faso, Ghana, Uganda, and Brazil.
3. What community consent has meant in practice: the actual engagement protocols used, their duration, and any documented refusals.
4. The current scientific state of confinable and reversible drive designs — daisy-chain, split-drive, self-limiting — with the key papers.
5. Output a markdown memo: the single most permissive credible jurisdiction, the approval sequence, and the three things most likely to stop it.

Cite everything. Flag where the record is thin.`,
  },
  {
    questSlug: 'fast-grants-as-a-product',
    names: [
      { name: 'Fast Grants', note: 'the Cowen/Collison original; name the lineage' },
      { name: 'Decision Latency', note: 'the metric the product exists to attack' },
      { name: 'Tuesday', note: 'apply Monday, funded Tuesday' },
    ],
    riskiestAssumption:
      'Not whether researchers want fast money — they obviously do — but whether funders will delegate allocation. The customer is the philanthropist, and the product is trustworthy judgment, not software.',
    firstArtifact:
      'Run the smallest possible version by hand: raise $25k from one person, publish the form, decide in 72 hours, fund five microgrants, publish the outcomes. The operating record IS the product.',
    gatekeeper: 'Philanthropists and family offices who must trust your judgment with their money',
    promptBody: `Help me design and stand up a fast-grants operation.

The bottleneck is funder trust, not tooling, so I want to run a tiny real version before building anything.

1. Research every fast-grant-style programme that has existed: Fast Grants, Emergent Ventures, Renaissance Philanthropy, Astera, Impetus, Speculative Technologies, Experiment.com. For each: decision latency, cheque size, application format, how they capitalised, and any published outcome data.
2. Extract what the fastest ones had in common operationally — who decided, how many people, what they asked for.
3. Draft the leanest possible application form: the fewest questions that still let a competent reviewer decide in under 20 minutes. Justify each question.
4. Draft a one-page memo aimed at a philanthropist explaining why delegating $25k of allocation to a fast process beats their current options, using the outcome evidence from step 1.
5. Scaffold a minimal Next.js app: public form, submissions to Postgres, a reviewer view, and a public grants ledger. No auth beyond a shared secret. Keep it under 500 lines.

Real sources with URLs throughout.`,
  },
  {
    questSlug: 'entitlement-as-an-api',
    names: [
      { name: 'By Right', note: 'the legal term for what needs no discretionary approval' },
      { name: 'Envelope', note: 'the buildable volume zoning permits' },
      { name: 'Setback', note: 'zoning vocabulary, and wryly what the industry suffers' },
    ],
    riskiestAssumption:
      'That municipal code can be parsed into a reliable buildable envelope. Zoning is thousands of inconsistent PDFs plus unwritten practice, and a wrong answer is a lawsuit — not a bug.',
    firstArtifact:
      'Pick one city. Parse its zoning code for one parcel class. Compute buildable envelopes for 50 real parcels and check them against permits actually issued. Publish the accuracy rate honestly.',
    gatekeeper: 'City planning departments, and the liability question of who is responsible when the answer is wrong',
    promptBody: `Help me test whether zoning code can be parsed into a reliable buildable envelope.

Accuracy on real parcels is the whole question. One city, one parcel class, measured against reality.

1. Find a US city that publishes both its zoning code and its issued-permit records as open data. Austin, Raleigh, Seattle, and Minneapolis are good candidates — check which actually has both machine-readable.
2. Pull the zoning ordinance for a single residential district and extract the dimensional standards: height, FAR, setbacks, lot coverage, parking minimums.
3. Write a function that takes a parcel's dimensions and zoning district and returns the maximum buildable envelope, showing which rule binds.
4. Pull 50 recently permitted projects in that district and compare my computed envelope against what was actually approved.
5. Report the accuracy rate and, for every miss, why: an unwritten practice, a variance, a code section I missed, or a genuine parse error.

I want the honest error rate, not a demo that works on three examples.`,
  },
  {
    questSlug: 'sub-dollar-diagnostics',
    names: [
      { name: 'Under A Dollar', note: 'the constraint as the name' },
      { name: 'Ambient', note: 'no cold chain, works at room temperature' },
      { name: 'Lateral', note: 'lateral-flow, the format it has to beat on cost' },
    ],
    riskiestAssumption:
      'That distribution exists at all. A working $0.80 test with no route to community health workers is worth nothing — the hard part is the last mile, not the chemistry.',
    firstArtifact:
      'A unit-economics teardown of one existing lateral-flow test: landed cost line by line, and where the money actually goes. Then the same for the distribution channel that would carry yours.',
    gatekeeper: 'WHO prequalification, and the procurement officers at Global Fund and PEPFAR',
    promptBody: `Help me build the cost and distribution model for sub-dollar point-of-care diagnostics.

The chemistry is not the bottleneck; landed cost and the last mile are.

1. Break down the manufactured cost of a standard malaria rapid diagnostic test, line by line: antibodies, nitrocellulose, housing, packaging, QC, and where each is sourced.
2. Find published landed-cost data for RDTs delivered through Global Fund and PEPFAR procurement — the difference between factory cost and cost at the clinic is the number that matters.
3. List every product that has achieved WHO prequalification for an instrument-free test in the last ten years, with the time and cost to get there.
4. Map the actual distribution channels reaching community health workers in Nigeria, Kenya, and India: who operates them, what they charge, what they will and will not carry.
5. Output a model showing what has to be true for a test to land under one dollar at the point of care, and which line item is the hardest.

Cite sources. Where numbers are commercially confidential, say so and give the best public proxy.`,
  },
  {
    questSlug: 'aging-as-an-indication',
    names: [
      { name: 'Indication', note: 'the single regulatory word the company exists to win' },
      { name: 'TAME', note: 'after the metformin trial that tried this first' },
      { name: 'Healthspan', note: 'the endpoint, not the aspiration' },
    ],
    riskiestAssumption:
      'That the FDA will accept a composite endpoint for aging at all. If it will not, there is no approvable trial and no reimbursable drug — the science is downstream of the category existing.',
    firstArtifact:
      'A precedent memo on composite endpoints: every case where FDA accepted a novel composite, what made it acceptable, and the full documented history of TAME — including exactly where it stalled and why.',
    gatekeeper: 'FDA, specifically whichever division would own the indication — and it is not obvious which one does',
    promptBody: `Help me research whether aging can become an FDA-recognised indication.

The regulatory category is the bottleneck. If FDA will not accept a composite endpoint, none of the biology matters yet.

1. Reconstruct the full history of the TAME trial (Targeting Aging with Metformin): design, endpoint, funding, regulatory interactions, and current status. Be specific about where it stalled.
2. Find every instance where FDA accepted a novel composite endpoint for a chronic indication. What did the sponsors have to show, and how long did the negotiation take?
3. Identify which FDA division would plausibly own an aging indication, and find any public statement from FDA staff about aging as an indication.
4. Summarise the biomarker landscape — epigenetic clocks, inflammatory markers, functional measures — and which have any regulatory qualification status, not merely academic support.
5. Output a memo: the most plausible endpoint, the precedent it leans on, the division to approach, and the three most likely reasons it fails.

Cite everything, especially FDA guidance documents and public meeting minutes.`,
  },
]

const bySlug = new Map(starterPacks.map((p) => [p.questSlug, p]))

export function getStarterPack(questSlug: string): StarterPack | null {
  return bySlug.get(questSlug) ?? null
}

/**
 * Compose the paste-ready Claude Code prompt, injecting the live evidence from
 * the index so the founder starts with the proof rather than a vibe.
 */
export function buildClaudeCodePrompt(
  pack: StarterPack,
  evidence: {
    title: string
    problemName: string
    demand: number
    gap: number
    competitorCount: number | null
    exampleCompetitors: string[]
  },
): string {
  const supply =
    evidence.competitorCount === 0
      ? 'A search for companies building this specific thing found none.'
      : `A search found ${evidence.competitorCount} company/companies building this specific thing${
          evidence.exampleCompetitors.length
            ? `: ${evidence.exampleCompetitors.join(', ')}`
            : ''
        }.`

  return `# ${evidence.title}

Context from optimism.fun, which ranks problems by demand against how well-served they already are:
- Attacks: ${evidence.problemName}
- Triangulated demand: ${evidence.demand}/100 (burden, willingness to pay, capital, research, queues)
- Unserved gap: ${evidence.gap}/100
- ${supply}

The riskiest assumption: ${pack.riskiestAssumption}

Who has to say yes: ${pack.gatekeeper}

${pack.promptBody}`
}
