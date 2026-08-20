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

export type DomainIdea = {
  /** e.g. "oneencounter.co" — never claimed as verified-available; check at registration time. */
  domain: string
  note: string
}

export type CapitalFirm = {
  name: string
  /** Why THIS firm specifically — grounded in a real, citable thesis or portfolio fact, never generic. */
  fit: string
  source: string
  sourceUrl: string
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
  /** Registerable domain-name candidates, ready to deploy on Vercel this weekend. */
  domainIdeas?: DomainIdea[]
  /** Real, named funders with an evidenced thesis fit — not generic "biotech VC" filler. */
  capitalFirms?: CapitalFirm[]
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
    domainIdeas: [
      { domain: 'bacillus.bio', note: 'names the actual organism — Koch’s 1882 "tubercle bacillus" — same register as Koch and Terminus' },
      { domain: 'depota.com', note: 'from "depot," the real pharmacology term for a slow-release injectable — literally the product' },
      { domain: 'holdline.com', note: '"holding therapeutic levels for months" is the riskiest-assumption language itself' },
      { domain: 'oneencounter.co', note: 'lifts "single-encounter endpoint" straight from the regulatory framing' },
      { domain: 'tbzero.com', note: 'plainest option — matches how global-health frontier companies actually brand' },
    ],
    capitalFirms: [
      {
        name: 'Adjuvant Capital',
        fit: 'States its infectious-disease thesis as the "big three (HIV/AIDS, tuberculosis, malaria)" by name on its own site — the closest thing to a normal venture check that already exists in this exact disease set.',
        source: 'Adjuvant Capital — Our Thesis',
        sourceUrl: 'https://adjuvantcapital.com/',
      },
      {
        name: 'Global Health Investment Fund (GHIC)',
        fit: 'A $108M social-impact fund whose public portfolio lists companies explicitly targeting HIV/AIDS, malaria, tuberculosis, and cholera, with TB-relevant assets already in the book.',
        source: 'GHIC — Portfolio',
        sourceUrl: 'https://ghicfunds.org/portfolio/',
      },
      {
        name: 'GHIT Fund',
        fit: 'Tuberculosis is 40.6% of its cumulative $236M invested since 2013, directly funding long-acting-injectable TB regimen work through PAN-TB partners alongside the Gates Medical Research Institute. Realistic ask here is a co-development grant, not a priced round.',
        source: 'GHIT Fund — Investment Overview',
        sourceUrl: 'https://www.ghitfund.org/investment/overview/en',
      },
      {
        name: 'Gates Foundation Strategic Investment Fund',
        fit: 'The foundation’s own investment arm names TB explicitly alongside HIV and malaria in its South Asia / Sub-Saharan Africa healthcare-delivery focus — program-related investment, the realistic anchor check before a normal fund follows.',
        source: 'Gates Foundation SIF — Healthcare Delivery',
        sourceUrl: 'https://sif.gatesfoundation.org/our-focus/healthcare-delivery',
      },
    ],
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
    domainIdeas: [
      { domain: 'daisychain.co', note: 'the "daisy-chain drive" — a real self-exhausting, spatially-limited gene-drive design (Esvelt lab, MIT)' },
      { domain: 'selflimit.bio', note: 'names the actual design property the whole regulatory bet depends on' },
      { domain: 'consenta.com', note: 'plays on "community consent" — the exact bottleneck this quest is really about' },
      { domain: 'suppressor.bio', note: 'real genetics term ("suppression drive" vs. "modification drive")' },
      { domain: 'sterilis.bio', note: 'evokes Sterile Insect Technique, the one regulatory precedent already fielded at scale (Oxitec)' },
    ],
    capitalFirms: [
      {
        name: 'Open Philanthropy (Coefficient Giving)',
        fit: 'Made a direct $17.5M grant to Target Malaria specifically to develop and prepare for gene-drive deployment — the single most on-thesis funder that exists for this exact niche. A grant, not an equity check.',
        source: 'Open Philanthropy — Target Malaria General Support',
        sourceUrl: 'https://www.openphilanthropy.org/focus/scientific-research/miscellaneous/target-malaria-general-support',
      },
      {
        name: 'Bill & Melinda Gates Foundation',
        fit: 'The largest and longest-running funder of Target Malaria and gene-drive vector-control research broadly. Philanthropic, not venture — but the field would not exist without it.',
        source: 'Target Malaria — funder acknowledgment',
        sourceUrl: 'https://targetmalaria.org',
      },
      {
        name: 'Wellcome Trust',
        fit: 'Funds a dedicated 2022-2026 program uniting African and UK research institutions specifically on CRISPR-Cas9 gene drives for malaria control.',
        source: 'Wellcome-funded CRISPR gene-drive malaria research program',
        sourceUrl: 'https://www.frontiersin.org/journals/genetics',
      },
      {
        name: 'Third Security (via Oxitec / TS Biotechnology Holdings)',
        fit: 'The one real equity-style investor with a controlling stake in a commercial genetic-vector-control company — owns Oxitec, maker of the Friendly™ self-limiting Aedes aegypti mosquito. Oxitec is self-limiting/SIT, adjacent to but not a true gene drive; still the closest real venture-ownership precedent, and the plausible acquirer once there’s field data.',
        source: 'Third Security — Our Story',
        sourceUrl: 'https://thirdsecurity.com/our-story/',
      },
    ],
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
    questSlug: 'pathogen-agnostic-early-warning',
    names: [
      { name: 'Sentinel', note: 'the function, plainly named' },
      { name: 'Zero Day', note: 'a novel pathogen is the biological equivalent' },
      { name: 'Effluent', note: 'wastewater is the signal, said straight' },
    ],
    riskiestAssumption:
      'That an automated alarm on an unknown, never-before-seen genome is something any public health authority will act on. Every existing wastewater surveillance program alarms on known, named targets — actioning a true anomaly has no institutional home yet.',
    firstArtifact:
      'Partner with one wastewater plant already running known-pathogen surveillance. Sequence the same samples in parallel and measure the lead time your method would have given for a pathogen everyone already agrees was real, against when it was clinically confirmed. Publish the honest number.',
    gatekeeper:
      "CDC's National Wastewater Surveillance System and equivalent national programmes, and the WHO genomic surveillance network — none of whom currently have a protocol for acting on an alarm with no name",
    promptBody: `Build me a research workspace for pathogen-agnostic wastewater early warning.

Sequencing cost is not the bottleneck anymore; the missing piece is proof that lead time is real and a plausible path to someone acting on the alarm.
1. Find every published wastewater or environmental metagenomic surveillance programme running today (CDC NWSS, WastewaterSCAN, equivalents in the UK, Singapore, EU) — what each one alarms on today, and whether any has ever flagged a genuinely novel target rather than a known one.
2. For at least two past outbreaks with good public data (mpox 2022, a recent flu variant), reconstruct the date the pathogen was first detectable in wastewater-style samples (from retrospective studies) versus the date of first clinical confirmation. This lead-time number is what the whole idea depends on.
3. Find the actual institutional pathway: who at CDC, WHO, or a national public health lab would receive an "unknown novel replicating genome detected" alert, and what, if anything, they are authorised to do with it today.
4. Summarise the state of metagenomic sequencing cost curves (cost per sample, turnaround time) for 2023-2026.
5. Output a memo: the best-supported lead-time estimate, the single most plausible first institutional partner, and the three reasons this alarm might be ignored even if it fires correctly.

Cite everything with URLs. Where retrospective lead-time data does not exist, say so rather than estimating.`,
  },
  {
    questSlug: 'order-of-magnitude-cheaper-ivf',
    names: [
      { name: 'Tenfold', note: 'the entire product claim, as a name' },
      { name: 'Cassette', note: 'the microfluidic unit that would replace the bench' },
      { name: 'Throughput', note: 'the metric that actually has to move' },
    ],
    riskiestAssumption:
      "That automating the embryology bench holds live-birth rates steady or improves them — and that a clinic will bet its own liability and accreditation on an automated system before the outcome data exists to justify that bet.",
    firstArtifact:
      'A line-by-line cost teardown of one real IVF cycle: embryologist hours, equipment amortization, consumables, clinic overhead. Compare it against what time-lapse incubation and AI embryo grading (Ovation.io, Life Whisperer, and similar, already deployed) have actually automated so far, to find the labor share still genuinely up for grabs.',
    gatekeeper:
      'Embryology lab directors and the CLIA / state lab-accreditation bodies that license them — a clinic will not adopt anything that puts its accreditation at risk before the safety case is made',
    promptBody: `Help me build the cost and evidence model for an order-of-magnitude-cheaper IVF cycle.

The question is not whether automation is possible; it's whether the labor share left to automate is large enough to move the price 10x, and whether outcomes hold.
1. Break down the fully-loaded cost of one IVF cycle at a typical US clinic: embryologist labor hours per cycle, lab equipment amortization, consumables (media, dishes, needles), physician time, clinic overhead. Use published cost studies and clinic fee schedules.
2. Research what has already been automated or AI-assisted in the embryology workflow — time-lapse incubators (EmbryoScope and similar), AI embryo grading (Ovation.io, Life Whisperer, others) — and find any published data on their effect on live-birth rate and embryologist hours per cycle.
3. Identify what remains manual and high-skill (oocyte retrieval prep, ICSI injection, vitrification) and whether any lab has published progress automating those specific steps.
4. Find the CLIA and state-level accreditation requirements an automated embryology lab would have to satisfy, and how long a novel lab process typically takes to get accredited.
5. Output a memo: what fraction of current cost is realistically automatable given the state of the art, what live-birth-rate evidence exists for automation so far, and the accreditation path a new entrant would need.

Cite every cost and outcome figure. Flag anywhere you are extrapolating rather than citing a real number.`,
  },
  {
    questSlug: 'third-places-as-a-business',
    names: [
      { name: 'The Stoop', note: 'the porch step, the original third place' },
      { name: 'Regular', note: 'the exact relationship the business exists to create' },
      { name: 'Commons', note: 'plain, and the whole pitch' },
    ],
    riskiestAssumption:
      'That membership, food, and programming revenue alone can cover real urban rent at a price ordinary people will pay — without sliding into an ad-subsidized attention business or a donor-dependent nonprofit. Nobody has published a durable unit-economics model that clears this bar.',
    firstArtifact:
      'A real unit-economics model for one specific location: actual rent comps in one named city, a revenue mix across membership, food and beverage, and events, and the break-even member count. Stress-test it against one operator that has actually survived 3+ years — a run club, boxing gym, or community café — by asking what their real numbers are.',
    gatekeeper:
      'Commercial landlords, who default to a national retail or restaurant tenant over an unproven community-space format, and whoever provides the patient, slow-payback capital a physical location needs before it breaks even',
    promptBody: `Help me build a real unit-economics model for a modern third place.

The demand for in-person belonging is not in question; the open question is whether the business math has ever actually worked without ads or donations.
1. Find every documented case of a "third place" business model that has survived 3+ years on membership/F&B/events revenue alone — run clubs, climbing gyms, community coffee shops, social clubs like Soho House (note where it tips into luxury-only). For each, whatever revenue mix and pricing data is publicly available.
2. Pull commercial rent comparables for a 2,000-3,000 sq ft space in three specific neighbourhoods (one expensive, one mid, one cheap US city) to ground the real fixed-cost floor.
3. Build a break-even model: given that rent, what membership price and count, plus F&B margin, clears it? Show the model, not just the conclusion.
4. Research how commercial landlords currently evaluate community-space tenants versus retail/restaurant tenants — lease terms, personal guarantees required, typical vacancy tolerance.
5. Output a memo: the most financially credible existing comp, the break-even math for one realistic location, and the single biggest number that has to be true for this to work.

Use real, cited numbers throughout. Where rent or revenue data is estimated rather than sourced, say so explicitly.`,
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
  {
    questSlug: 'datacenter-power-smoothing',
    names: [
      { name: 'Surgewell', note: 'names the exact failure mode it prevents — the GPU-cluster load surge' },
      { name: 'Steadygrid', note: 'plain, the whole product claim in one word' },
      { name: 'Wattbuffer', note: 'literal — a buffer for watts, the actual mechanism' },
    ],
    riskiestAssumption:
      'That GPU-cluster power smoothing is genuinely a distinct engineering problem from grid-scale arbitrage storage, not just a relabeled version of it. If existing storage majors (Fluence, Tesla Megapack) can trivially adapt their products, there is no defensible wedge here.',
    firstArtifact:
      'A real load-profile teardown: pull public power-draw data from one documented large GPU training run and show, with numbers, how different the transient signature actually is from a typical grid-scale storage discharge curve. If they look the same, the wedge does not exist.',
    gatekeeper:
      'Hyperscaler and colocation-operator procurement teams, and FERC, whose co-location rules for behind-the-meter storage at datacenters were still being written as of 2026',
    promptBody: `Build me a research workspace for evaluating behind-the-meter battery storage tuned to AI datacenter power smoothing.

The riskiest assumption is that this is a genuinely distinct engineering problem from grid-scale arbitrage storage, not just the same product with new marketing. I need:
1. Pull real, public power-draw data from at least one documented large-scale GPU training run (research papers, hyperscaler engineering blog posts) and characterize the actual load transient: how fast, how large, how frequent the spikes are.
2. Compare that transient signature against a typical grid-scale arbitrage battery's discharge profile (utility-scale storage case studies) to find the real, specific engineering gap, if one exists.
3. Find every company currently selling into this space (Fluence, Tesla Megapack, and any datacenter-specific entrants) and what their actual product spec claims about response time and cycling behavior.
4. Summarize FERC's 2026 rulemaking status on behind-the-meter co-location at datacenters — what's decided, what's still open, and the real regulatory risk of building ahead of the rules.
5. Output a memo: does a genuine wedge exist, what the first product spec should be, and the three biggest reasons a hyperscaler would say no.

Use real sources with URLs. Where you cannot verify something, say so rather than guessing.`,
    domainIdeas: [
      { domain: 'surgewell.com', note: 'names the exact failure mode this product prevents' },
      { domain: 'steadygrid.co', note: 'plain, the product claim in one word — .co since .com is a stretch' },
      { domain: 'wattbuffer.com', note: 'literal mechanism name, easy to explain in one sentence' },
      { domain: 'clusterbalance.io', note: 'names the GPU-cluster-specific angle directly' },
    ],
    capitalFirms: [
      {
        name: 'National Grid Ventures',
        fit: 'Just committed $1.75B for a 35% stake in Joulent LLC specifically to build contracted power and electrical infrastructure for US large-load datacenter demand, real, dated, on-thesis strategic capital already active in exactly this space.',
        source: 'PR Newswire — National Grid Ventures invests $1.75bn in datacenter power',
        sourceUrl: 'https://www.prnewswire.com/news-releases/national-grid-ventures-to-invest-1-75bn-to-accelerate-power-solutions-for-us-data-centers-and-ai-302815750.html',
      },
      {
        name: 'Brookfield Renewable Partners',
        fit: 'Acquired Aypa Power for ~$7B enterprise value in 2026, taking its full battery-storage development platform and team, real, recent proof of appetite for scaled power-storage assets serving large-load demand.',
        source: 'Energy Tech — Brookfield Renewable acquires Aypa Power',
        sourceUrl: 'https://www.energytech.com/energy-storage/news/55395679/where-the-money-flows-mercom-report-says-energy-storage-attracts-nearly-9b-so-far-in-2026',
      },
      {
        name: 'Breakthrough Energy Ventures',
        fit: 'Established early-stage climate/energy-infrastructure fund with a real, public thesis covering grid storage and industrial decarbonization, the standard first call for a hard-infra energy startup at seed/Series A.',
        source: 'Breakthrough Energy — Our Approach',
        sourceUrl: 'https://www.breakthroughenergy.org',
      },
    ],
  },
  {
    questSlug: 'geologic-hydrogen-flow-engineering',
    names: [
      { name: 'Sustained Flow', note: 'names the exact metric every current well is missing' },
      { name: 'Serpentine', note: 'serpentinization, the rock-water reaction that generates the hydrogen' },
      { name: 'Stimwell', note: 'plain, from "well stimulation" — the actual engineering discipline' },
    ],
    riskiestAssumption:
      'That hydrogen-producing rock reactions can be meaningfully accelerated or sustained by injection (water, heat, catalysts) at commercial flow rates, rather than being a fixed, slow geologic process that no amount of stimulation speeds up. If the reaction kinetics are the hard limit, this is a much smaller company than the exploration land grab implies.',
    firstArtifact:
      'A stimulation-literature memo: every published or DOE-funded attempt to accelerate serpentinization or hydrogen-generating reactions in situ, what stimulation method was tried, what flow-rate result (if any) was reported, and whether any well has sustained commercial-comparable flow for more than a few weeks. No lab, no drilling, just the honest state of the evidence.',
    gatekeeper:
      'Exploration companies that already hold a discovery well (Koloma, Mantle8, and peers) — they control the only assets worth stimulating, so the first sale is a services or JV deal with one of them, not a landowner or regulator',
    promptBody: `Build me a research workspace for evaluating geologic hydrogen production/flow-rate engineering, distinct from exploration.

The exploration side of this industry is already funded and crowded (Koloma, Mantle8, Snowfox). My bet is the unsolved problem is downstream: once you've found hydrogen, nobody has proven you can sustain commercial flow rates. I need:
1. Pull every public source on DOE/ARPA-E's 2023 geologic hydrogen program (the $20M, 16-project award) — which teams worked specifically on stimulation, well-flow modeling, or enhancing/controlling the rate of hydrogen production (not exploration or resource mapping), and what results, if any, have been published since.
2. Find every published pilot-well result (Vema in Quebec, GeoKiln in Kansas, Koloma's Midcontinent Rift wells, Mantle8's Pyrenees site, and any others) and extract the actual reported flow rate, well duration, and whether stimulation was attempted.
3. Summarize the current scientific understanding of what limits hydrogen generation rate in situ — serpentinization kinetics, radiolysis rate, rock permeability — and which of those is the binding constraint per the recent Energy & Environmental Science review literature (2025-2026).
4. Identify every company or research group working specifically on stimulation/enhancement technology (not exploration), and what stage each is at.
5. Find what technical or commercial terms exploration companies with discovery wells are actually offering to production-technology partners, if any have been reported.
6. Output a memo: does the flow-rate problem look solvable with known reservoir-engineering techniques (borrowed from geothermal or unconventional gas), or does it look like a hard geochemical ceiling, and who would be the first realistic partner.

Use real sources with URLs. Where you cannot verify something, say so rather than guessing.`,
    domainIdeas: [
      { domain: 'sustainedflow.com', note: 'names the exact metric this company exists to deliver — availability not verified' },
      { domain: 'serpentine.energy', note: 'the real geochemical reaction (serpentinization) that generates natural hydrogen' },
      { domain: 'stimwell.co', note: 'plain, from "well stimulation," the actual reservoir-engineering discipline being sold' },
      { domain: 'h2flowrate.com', note: 'literal — the number every current operator cannot yet produce' },
      { domain: 'ratelimited.energy', note: 'wry — names both the chemistry constraint and the business risk in one phrase' },
    ],
    capitalFirms: [
      {
        name: 'Breakthrough Energy Ventures',
        fit: 'Bill Gates-founded climate fund that is a named backer of both major natural-hydrogen exploration companies, Koloma and Mantle8, making it the one investor already fluent in this exact resource and actively looking for the next layer (production) once exploration derisks.',
        source: 'Hydrogen Insight — Bill Gates-backed Koloma raises private finance',
        sourceUrl: 'https://www.hydrogeninsight.com/innovation/bill-gates-backed-natural-hydrogen-explorer-koloma-raises-nearly-a-quarter-of-a-billion-dollars-in-private-finance/2-1-1597379',
      },
      {
        name: 'ARPA-E (U.S. Department of Energy)',
        fit: 'Ran a $20M, 16-project program in 2023 explicitly targeting technologies that "stimulate hydrogen production from mineral deposits" and "enhance or control the rate of hydrogen production" — this is the flow-engineering sub-problem by name, not exploration, and it already funded Koloma Labs directly for well-stimulation modeling. Realistic first ask is a grant or cooperative agreement, not a priced round.',
        source: 'ARPA-E — $20 Million to 16 Projects Spearheading Exploration of Geologic Hydrogen',
        sourceUrl: 'https://arpa-e.energy.gov/news-and-media/press-releases/us-department-energy-announces-20-million-16-projects-spearheading',
      },
      {
        name: "Amazon's Climate Pledge Fund",
        fit: "Participated in Koloma's ~$245M raise specifically for natural hydrogen, one of the few corporate climate funds with direct, dated exposure to this resource class and a stated interest in derisking it toward commercial supply.",
        source: 'Canary Media — The $245M bid to pull clean hydrogen straight from the earth',
        sourceUrl: 'https://www.canarymedia.com/articles/hydrogen/the-245m-bid-to-pull-clean-hydrogen-straight-from-the-earth',
      },
      {
        name: 'Mitsubishi Heavy Industries / Osaka Gas',
        fit: 'Led a $50M strategic round into Koloma in 2024, corporate energy players with existing gas-production and reservoir-engineering expertise who have the clearest commercial reason to fund whoever solves sustained flow rather than just discovery.',
        source: 'Mitsubishi Heavy Industries — MHI Invests in Geologic Hydrogen Exploration Company: Koloma',
        sourceUrl: 'https://www.mhi.com/news/241015.html',
      },
    ],
  },
  {
    questSlug: 'dumpsite-methane-capture',
    names: [
      { name: 'Vent Zero', note: 'the target state — no more unmanaged venting' },
      { name: 'Biocover', note: 'plain, names the retrofit mechanism directly' },
      { name: 'Undumped', note: 'wry — reframes the site as a resource, not waste' },
    ],
    riskiestAssumption:
      'That a modular, low-capex retrofit can generate carbon credits a buyer will actually pay for at a price that clears the cost of installing and operating gas capture on a dump nobody engineered to be captured from, before a full landfill rebuild — and that a methodology exists (or can be approved) to verify avoided methane on an open, unmanaged site rather than only an engineered one.',
    firstArtifact:
      "A methodology-and-precedent memo: which carbon-credit methodologies (Verra, Gold Standard) currently allow crediting for gas capture on open/unmanaged dumps versus requiring an engineered landfill first, what StratX and any other funded comparable actually built and sold credits against, and a back-of-envelope on whether current credit prices clear the retrofit cost for one real dumpsite.",
    gatekeeper:
      'The municipality or waste-site operator who controls physical access to the dump, plus the carbon-credit registry (Verra/Gold Standard) that has to approve the methodology before any credit is sellable',
    promptBody: `Build me a research workspace for evaluating a modular methane-capture retrofit business for open/unmanaged dumps in the Global South.

The unsolved part is not landfill gas capture in general (that's standard in the US/EU) — it's whether it can be done cheaply, without a full engineered-landfill rebuild, on the open dumps that dominate fast-urbanizing countries, and financed by carbon credits. I need:
1. Find every real company or funded project doing methane mitigation on open/unmanaged dumps specifically (not engineered landfills) in low- and middle-income countries — StratX and any peers — and extract what technology they use, what stage they're at, and who funded them.
2. Pull the actual Verra and Gold Standard methodologies that apply to landfill/dumpsite methane crediting, and determine whether any currently certifies avoided-emissions credits for open, unmanaged dumps versus requiring an engineered landfill or active gas-collection system first.
3. Find real data (WasteMAP or equivalent) on methane output per tonne of waste for a representative open dump in a fast-urbanizing country, and use current voluntary carbon credit prices for methane-destruction credits to estimate whether the revenue would plausibly clear a low-capex retrofit's installation and operating cost.
4. Identify the largest known open/unmanaged dumpsites by volume or population exposure (e.g. sites already flagged by the Global Methane Hub or Global Methane Pledge waste pathway reporting) as realistic first targets.
5. Summarize what community/municipal consent or contracting process a comparable waste-sector project had to go through to get physical site access.
6. Output a memo: does the credit economics plausibly work today, which methodology gap is the real blocker if any, and what the first target site should be.

Use real sources with URLs. Where you cannot verify something, say so rather than guessing.`,
    domainIdeas: [
      { domain: 'ventzero.co', note: 'names the target end-state — zero unmanaged methane venting — availability not verified' },
      { domain: 'dumpcapture.com', note: 'literal and unglamorous, matches how this sector actually talks about itself' },
      { domain: 'biocover.io', note: 'names the retrofit mechanism (a methane-oxidizing cover) directly' },
      { domain: 'methanewell.org', note: 'nonprofit-coded for the credit/verification side of the business' },
      { domain: 'undumped.com', note: 'wry — reframes an open dump as a captured resource rather than a liability' },
    ],
    capitalFirms: [
      {
        name: 'Neglected Climate Opportunities (Grantham Environmental Trust)',
        fit: 'Led the 2026 funding round for StratX, a landfill-methane biocover company operating in the Global South, with its managing director stating on the record that "landfill methane is one of the largest unmanaged sources of climate pollution on Earth... yet it has been almost entirely neglected by both policy and capital" — the closest thing to a dedicated investor thesis that exists for this exact niche.',
        source: 'Tech.eu — StratX raises $1.19M to tackle landfill methane with living biocovers',
        sourceUrl: 'https://tech.eu/2026/07/14/stratx-raises-119m-to-tackle-landfill-methane-with-living-biocovers/',
      },
      {
        name: 'Terraset',
        fit: "Made StratX's initial carbon-credit purchase commitment, a real, dated example of a buyer underwriting a Global South dumpsite-methane retrofit through a credit offtake rather than equity — the realistic first revenue partner for this business model.",
        source: 'Tech.eu — StratX raises $1.19M to tackle landfill methane with living biocovers',
        sourceUrl: 'https://tech.eu/2026/07/14/stratx-raises-119m-to-tackle-landfill-methane-with-living-biocovers/',
      },
      {
        name: 'Global Methane Hub',
        fit: 'Runs a dedicated Waste and Circular Economy program that has already put $10M behind methane-reduction work in Latin American and Caribbean cities and funds waste-methane grantees (WasteMAP, Global Green Growth Institute) across Africa and Latin America — a grant-stage funder and site-access door-opener, not an equity check, but the realistic first call for site partnerships.',
        source: 'Global Methane Hub — $10 Million Investment to Accelerate Methane Reduction in Latin American and Caribbean Cities',
        sourceUrl: 'https://www.globalmethanehub.org/2025/11/04/global-methane-hub-announces-10-million-investment-to-accelerate-methane-reduction-in-latin-american-and-caribbean-cities/',
      },
    ],
  },
  {
    questSlug: 'fission-permitting-unlock',
    names: [
      { name: 'Rickover', note: 'named for Hyman Rickover, who proved reactor licensing could move at wartime speed' },
      { name: 'Docket Zero', note: 'NRC filings are literally called dockets; zero is the added-months target' },
      { name: 'Safeguard', note: 'the plain word for what a safety case actually is, no cleverness needed' },
    ],
    riskiestAssumption:
      'That the NRC bottleneck is genuinely a paperwork/process problem software can compress, not a political-risk-aversion problem no documentation quality fixes. If reviewers move slowly because saying yes carries career risk regardless of the safety case, better software does not move the timeline.',
    firstArtifact:
      "A real teardown of one public NRC licensing docket end to end (Kairos Power's Hermes construction permit or a comparable ADAMS record): every review milestone with actual dates, and which delays were technical versus administrative or discretionary. If most time is discretionary, the wedge is different than if it is paperwork.",
    gatekeeper:
      'NRC review staff and the licensing boards that approve design certifications and construction permits, not the utilities or reactor vendors who would buy the software',
    promptBody: `Build me a research workspace for evaluating a regulatory-tech company that compresses advanced-reactor licensing.

The riskiest assumption is that this is a software-solvable paperwork problem, not a political-risk problem. I need:
1. Pull NRC's public ADAMS docket record for at least two recent advanced reactor licensing cases (Kairos Power's Hermes, NuScale's design certification, X-energy) and build a timeline of every review milestone with actual dates.
2. For each, classify delays as technical/engineering review versus administrative, discretionary, or political, using the docket correspondence itself where possible.
3. Find what the 2024 ADVANCE Act and any 2025-2026 follow-on legislation actually changed about NRC review timelines or fee structures, and whether those changes have shown up in review speed yet.
4. Identify every company currently selling licensing or compliance software into nuclear (Atomic Canyon and any others) and what workflow they have productized versus what is still manual.
5. Find public statements from at least one licensing consultant or former NRC staffer on record about where the real bottleneck sits.
6. Output a memo: is this a software-solvable paperwork problem or a political-risk problem, and what is the smallest wedge that tests the difference.

Use real sources with URLs. Where you cannot verify something, say so rather than guessing.`,
    domainIdeas: [
      { domain: 'docketzero.com', note: 'literal NRC-filing term, register matches the Docket Zero name idea' },
      { domain: 'safetycase.io', note: 'the actual regulatory artifact this replaces, self-explanatory to an engineer' },
      { domain: 'halflife.dev', note: 'plays on the physics term for a compressed decay-to-zero timeline' },
      { domain: 'licensedreactor.com', note: 'blunt, describes the end state a customer is actually buying' },
      { domain: 'rickover.co', note: 'the historical namesake, short and ownable' },
    ],
    capitalFirms: [
      {
        name: 'Energy Impact Partners (Elevate Future Fund)',
        fit: "Led the $7M round for Atomic Canyon, an AI platform for nuclear document search and licensing workflows already deployed at PG&E's Diablo Canyon — the closest real precedent to a productized licensing-compression company.",
        source: 'GlobeNewswire — Atomic Canyon Raises $7M led by Energy Impact Partners',
        sourceUrl: 'https://www.globenewswire.com/news-release/2025/05/28/3089617/0/en/Atomic-Canyon-Raises-7M-led-by-Energy-Impact-Partners-to-bring-AI-Powered-Innovation-to-Nuclear-Energy.html',
      },
      {
        name: 'Commonweal Ventures',
        fit: 'States its own thesis as backing companies that "leverage government as a growth lever" and solve regulatory challenges as a wedge into regulated markets — and lists Atomic Canyon by name under "nuclear compliance" in its public Energy & Climate portfolio.',
        source: 'Commonweal Ventures — Thesis',
        sourceUrl: 'https://www.commonwealventures.com/thesis',
      },
      {
        name: 'Gigascale Capital',
        fit: 'Closed a $250M fund in June 2026 explicitly targeting energy and industrial technology where physical build capacity is the binding constraint, with nuclear microreactor developer Radiant already in its portfolio. Weaker fit than the other two: Radiant is a reactor developer, not a licensing/regtech play, so this reflects the fund\'s broader thesis, not a permitting-specific bet.',
        source: 'Axios — Gigascale Capital announces $250 million fund for rebuilding physical economy',
        sourceUrl: 'https://www.axios.com/2026/06/01/gigascale-capital-schroepfer-250-million-fund',
      },
    ],
  },
  {
    questSlug: 'geothermal-via-oilfield-tooling',
    names: [
      { name: 'Roughneck', note: 'the actual job title for oilfield drilling crews, redirected toward geothermal' },
      { name: 'Firmwell', note: 'plain compound of "firm power" and "well," the entire product claim' },
      { name: 'Basalt', note: 'the rock target common to closed-loop wells, geologic and grounded' },
    ],
    riskiestAssumption:
      "That directional-drilling cost curves have actually crossed the point where engineered or closed-loop geothermal wells pencil out against a gas peaker on levelized cost today, not just in modeled scenarios, and that displaced O&G crews can be redeployed without a multi-year retraining or certification gap.",
    firstArtifact:
      "A real unit-economics teardown of one published EGS or closed-loop project (Fervo's Cape Station data, or a Utah FORGE pilot report): actual drilling cost per well, actual flow or output achieved, and the resulting levelized cost of power compared against a documented gas-peaker LCOE in the same region. If the numbers do not already cross without subsidy, the timing thesis is wrong.",
    gatekeeper:
      'State oil and gas well-permitting regulators (Texas RRC, Utah DOGM, and equivalents) and the utility or data-center offtake buyer signing the PPA, not federal energy regulators',
    promptBody: `Build me a research workspace for evaluating a geothermal developer that redeploys oilfield drilling capability into closed-loop wells.

The riskiest assumption is that the cost curve has already crossed peaker parity, not that it will eventually. I need:
1. Pull public well-level cost and output data from at least one operating EGS or closed-loop project (Fervo's Cape Station, Utah FORGE, Sage Geosystems, Eavor).
2. Compare that against a documented natural-gas peaker's levelized cost of electricity in the same region or ISO, using recent EIA or utility filings.
3. Find how many O&G drilling rigs and crews have actually been redeployed into geothermal so far, named companies and rig counts, versus how many geothermal wells still use new-build purpose-made equipment.
4. Identify the state-level permitting pathway for a geothermal well versus an oil and gas well in at least two states, and where the process actually diverges.
5. Find every company pursuing this exact oilfield-to-geothermal strategy (Fervo, XGS, Sage, Eavor, GA Drilling) and what specifically differentiates each approach.
6. Output a memo: does the unit economics cross today without subsidy, and what is the smallest well or pilot that would prove it in a new geography.

Use real sources with URLs. Where you cannot verify something, say so rather than guessing.`,
    domainIdeas: [
      { domain: 'roughneckenergy.com', note: 'literal, matches the Roughneck name idea' },
      { domain: 'firmwell.com', note: 'plain compound of "firm power" and "well"' },
      { domain: 'basaltpower.co', note: 'geologic and grounded, names the target formation' },
      { domain: 'redrig.io', note: '"redirected rig," names the actual mechanism of repurposed drilling equipment' },
      { domain: 'closedloopgeo.com', note: 'blunt technical descriptor, no cleverness required' },
    ],
    capitalFirms: [
      {
        name: 'DCVC',
        fit: "Participated in Fervo Energy's $462M Series E (Dec 2025) — DCVC's standing thesis is deep-tech and hard-infrastructure bets, and Fervo is the clearest live example of the oilfield-to-geothermal redirect actually working at scale.",
        source: 'Bloomberg — Geothermal Startup Fervo Attracts Investors Including Google',
        sourceUrl: 'https://www.bloomberg.com/news/articles/2025-12-10/geothermal-startup-fervo-attracts-new-investors-including-google',
      },
      {
        name: 'Devon Energy Corp',
        fit: "A real, operating shale producer that invested directly in Fervo Energy's Series E — strategic capital from the exact O&G industry this quest proposes redirecting, not a climate fund reasoning about it from outside.",
        source: 'Fervo Energy — Fervo Energy Raises $462 Million Series E',
        sourceUrl: 'https://fervoenergy.com/fervo-energy-raises-462-million-series-e-to-accelerate-geothermal-development-and-meet-surging-energy-demand-with-clean-firm-power/',
      },
      {
        name: 'Congruent Ventures',
        fit: "Early-stage climate-tech fund and repeat Fervo investor across multiple rounds, with a public thesis centered on hard-infrastructure decarbonization rather than software-only climate bets.",
        source: 'Fervo Energy — Fervo Energy Raises $462 Million Series E',
        sourceUrl: 'https://fervoenergy.com/fervo-energy-raises-462-million-series-e-to-accelerate-geothermal-development-and-meet-surging-energy-demand-with-clean-firm-power/',
      },
      {
        name: 'TDK Ventures',
        fit: "Led Rodatherm Energy's $38M Series A for its closed-loop advanced geothermal system, the fund's named bet on closed-loop (not just EGS) well design specifically.",
        source: 'TDK Ventures — Long Duration Energy Storage',
        sourceUrl: 'https://tdk-ventures.com/explorations/long-duration-energy-storage/',
      },
    ],
  },
  {
    questSlug: 'hundred-hour-storage',
    names: [
      { name: 'Centiday', note: 'coined from "centum" (hundred) plus duration, echoes "century" but for hours' },
      { name: 'Ironclad', note: 'literal for iron-based chemistries, also just means dependable' },
      { name: 'Longwatt', note: 'plain compound, the whole pitch in one word' },
    ],
    riskiestAssumption:
      'That the winning long-duration chemistry (iron-air, thermal, or mechanical) actually reaches cost parity with new gas-peaker capacity within this decade, rather than needing perpetual subsidy — a technology that is merely cheaper than more lithium but still pricier than a peaker does not win a capacity contract.',
    firstArtifact:
      "A real levelized-cost model built from one published commercial deployment's actual reported costs (Form Energy's Minnesota or Georgia projects, or Ore Energy's first grid connection), compared against a documented gas-peaker capacity-contract price in the same market. Days of spreadsheet work, no lab required.",
    gatekeeper:
      'State utility regulators approving capacity contracts and the utilities signing multi-decade offtake, not the technology\'s own published performance claims',
    promptBody: `Build me a research workspace for evaluating a 100-hour-class long-duration storage company.

The riskiest assumption is that this chemistry reaches peaker cost parity on a real timeline, not a modeled one. I need:
1. Pull real, reported project costs and performance data from at least one operating or under-construction 100-hour-class deployment (Form Energy's Minnesota or Georgia projects, Ore Energy's Netherlands connection, or Hydrostor's compressed-air projects).
2. Find a documented gas-peaker capacity-contract price in the same regional market (ISO capacity auction results, utility IRP filings) to compare against.
3. Identify every company currently commercializing 100-hour-class storage (Form Energy, Ore Energy, Hydrostor, ESS Inc, and any others) and what chemistry or mechanism each has bet on, with stated cost targets.
4. Find what happened to venture funding for long-duration storage in 2025-2026 (reported to have dropped sharply) and separate genuine investor skepticism from a general climate-tech funding pullback.
5. Summarize what capacity-contract structures (tolling agreements, resource-adequacy contracts) utilities are actually offering long-duration storage today, and whether they are bankable.
6. Output a memo: which chemistry has the most credible near-term path to peaker parity, and what the smallest pilot deployment would look like.

Use real sources with URLs. Where you cannot verify something, say so rather than guessing.`,
    domainIdeas: [
      { domain: 'centiday.com', note: 'coined portmanteau, matches the Centiday name idea' },
      { domain: 'longwatt.com', note: 'plain compound, states the entire pitch' },
      { domain: 'ironclad.energy', note: 'literal for iron-based chemistries, also reads as dependable' },
      { domain: 'hundredhour.io', note: 'blunt numeric descriptor, matches the quest title directly' },
      { domain: 'peakerparity.com', note: 'names the actual economic threshold the company has to cross' },
    ],
    capitalFirms: [
      {
        name: 'TPG Rise Climate',
        fit: "Led Form Energy's $450M Series E, the largest financing round yet for a 100-hour-class iron-air storage company — the anchor institutional check for exactly this asset class.",
        source: 'Form Energy — Form Energy Announces $450M Series E Financing',
        sourceUrl: 'https://formenergy.com/form-energy-announces-450m-series-e-financing/',
      },
      {
        name: 'Breakthrough Energy Ventures',
        fit: 'A repeat investor in Form Energy across multiple rounds, with a standing public thesis explicitly covering long-duration grid storage as a core decarbonization lever.',
        source: 'Form Energy — Form Energy Announces $450M Series E Financing',
        sourceUrl: 'https://formenergy.com/form-energy-announces-450m-series-e-financing/',
      },
      {
        name: 'ArcelorMittal (XCarb Innovation Fund)',
        fit: "A real industrial strategic, not a generalist fund, investing in Form Energy specifically because iron-air batteries consume iron at scale — it now non-exclusively supplies the battery's core feedstock.",
        source: 'ArcelorMittal — ArcelorMittal makes further investment in Form Energy via XCarb Innovation Fund',
        sourceUrl: 'https://corporate.arcelormittal.com/media/press-releases/arcelormittal-makes-further-investment-in-form-energy-via-xcarb-innovation-fund',
      },
      {
        name: 'HV Capital',
        fit: "Co-led Ore Energy's $43M Series A (August 2026) for iron-air batteries marketed explicitly for \"up to 100 hours\" of storage — the most recent, most literally on-thesis round in this exact category.",
        source: 'EU-Startups — Ore Energy raises €37.3 million to scale iron-air batteries',
        sourceUrl: 'https://www.eu-startups.com/2026/08/ore-energy-raises-e37-3-million-to-scale-iron-air-batteries-that-store-renewable-power-for-up-to-100-hours/',
      },
    ],
  },
  {
    questSlug: 'interconnection-queue-underwriting',
    names: [
      { name: 'Queue Jump', note: 'blunt, literally what the product does for a stuck position' },
      { name: 'Firm Position', note: 'plays on "firm power" and "queue position," the two things being sold' },
      { name: 'Loadstone', note: 'respells "lodestone" toward "load," the grid term' },
    ],
    riskiestAssumption:
      "That a stuck interconnection position can actually be de-risked with engineering and financial structuring fast enough to resell at a profit before the underlying network-upgrade cost estimate changes again. Grid operators re-run studies and costs move; if a position's economics can shift underneath the deal, this is speculation with worse liquidity than the assets it resembles, not underwriting.",
    firstArtifact:
      "A real transaction teardown of one documented queue-position deal (Copia Power's $2.6B sale to EQT, or a specific PJM or MISO queue transfer filed with FERC): what the buyer actually paid for, how they priced the network-upgrade risk, and how long from acquisition to construction-ready. No capital deployed, just the deal structure made legible.",
    gatekeeper:
      "The regional grid operators (PJM, MISO, CAISO) whose interconnection study process and cost-allocation rules determine whether a position is actually transferable and at what cost, not the developers selling positions",
    promptBody: `Build me a research workspace for evaluating a company that buys, de-risks, and resells stuck interconnection queue positions.

The riskiest assumption is that engineering can de-risk a position faster than the underlying cost estimate can move against it. I need:
1. Find at least three documented interconnection queue-position transfers or platform acquisitions filed with FERC or reported in trade press in 2025-2026 (Copia Power's sale to EQT, any PJM or MISO-specific deals) and pull the actual deal terms where public.
2. Summarize PJM's 2026 queue reopening rules and MISO or CAISO's current cost-allocation methodology for network upgrades tied to a queue position, so I know exactly what a buyer is taking on.
3. Research flexible or non-firm interconnection mechanisms (curtailment agreements, last-in-first-out access) as an unsticking tool, and find any real project that used one to accelerate commercial operation.
4. Identify who is already doing something adjacent to this (Anza Renewables and Energy Capital Partners, or infrastructure funds buying developer platforms with existing queue positions) and how their model differs from buy-derisk-resell.
5. Find the actual reported aggregate transaction value and deal count for queue-position transfers in 2025 to size the market.
6. Output a memo: what specifically can be de-risked with engineering versus what is pure regulatory or political risk no amount of capital fixes, and the smallest first deal that would test it.

Use real sources with URLs. Where you cannot verify something, say so rather than guessing.`,
    domainIdeas: [
      { domain: 'queuejump.io', note: 'blunt, states the mechanism directly' },
      { domain: 'firmposition.com', note: 'plays on "firm power" and "queue position"' },
      { domain: 'loadstone.co', note: 'respelled "lodestone," a grid-term pun' },
      { domain: 'unstuckgrid.com', note: 'plain description of the outcome being sold' },
      { domain: 'gridqueue.capital', note: 'literal, signals the capital-markets angle explicitly' },
    ],
    capitalFirms: [
      {
        name: 'EQT Infrastructure',
        fit: 'Agreed to acquire Copia Power from Carlyle for roughly $2.6B in 2026 specifically for its integrated power-generation and grid-interconnection-position platform — real, dated, priced proof that queue positions themselves are the valuable asset.',
        source: 'EQT Group — EQT to acquire Copia Power, a leading integrated power and AI infrastructure platform',
        sourceUrl: 'https://eqtgroup.com/news/eqt-to-acquire-copia-power-a-leading-integrated-power-and-ai-infrastructure-platform-2026-07-09',
      },
      {
        name: 'ArcLight Capital Partners',
        fit: 'A specialist power-and-electric-infrastructure investor (being acquired itself by DigitalBridge for $1.05B in 2026) actively closing PJM-interconnected generation deals — exactly the kind of investor who already prices interconnection risk for a living.',
        source: 'Utility Dive — Data center firm DigitalBridge in $1.1B deal to buy ArcLight',
        sourceUrl: 'https://www.utilitydive.com/news/digitalbridge-arclight-data-center-deal/821199/',
      },
      {
        name: 'Energy Capital Partners',
        fit: "Backed the buyout of Anza Renewables via its Energy Transition Opportunities Fund, a tech-enabled marketplace built to de-risk developer procurement and project bottlenecks — one layer upstream of queue-position underwriting specifically, not the exact same model, but the closest existing precedent.",
        source: 'Business Wire — Anza Completes Separation from Borrego and Receives New Investment from Energy Capital Partners Led Consortium',
        sourceUrl: 'https://www.businesswire.com/news/home/20230516005316/en/Anza-Completes-Separation-from-Borrego-and-Receives-New-Investment-from-Energy-Capital-Partners-Led-Consortium-to-Transform-Solar-and-Storage-Procurement',
      },
    ],
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
