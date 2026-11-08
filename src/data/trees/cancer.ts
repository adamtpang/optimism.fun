// Constraint tree draft for optimism.fun: why is cancer not solved yet?
// Researched 2026-10-29. Every number below was found in a fetched page or search result this session.
// Inference is labeled as inference. Company-reported figures are labeled as company-reported.

import type { ConstraintTree } from '@/data/constraints'

export const cancerTree: ConstraintTree = {
  problemSlug: 'cancer',
  outcome:
    'Fewer people die of cancer: 9.7M deaths a year (GLOBOCAN 2022) falls, and survival stops depending on where you live.',
  whyUnsolved:
    'Most cancer deaths come from causes we already know how to cut, tobacco and late or absent treatment in poorer countries. The tools exist but are not delivered. New detection tests and new drugs help less than the delivery gap costs.',
  bindingId: 'delivery-gap',
  updated: '2026-10-29',
  root: [
    {
      id: 'delivery-gap',
      claim: 'Known prevention and treatment do not reach most people who die of cancer.',
      kind: 'delivery',
      whyUnsolved:
        'About half of cancer deaths trace to modifiable risks, and about 70% of deaths occur in low- and middle-income countries. The fixes are policy, machines, staff and drugs, which nobody profits from selling at scale. Binding choice is inference.',
      falsifier:
        'If modifiable risks explained well under a quarter of deaths, or survival gaps closed without new delivery, this is not binding.',
      tested:
        'Looked for refutation. Found the opposite: ACS/IARC Cancer Atlas says about half of cancer deaths are attributable to modifiable risks; a 2026 WHO/IARC study puts 37.8% of new cases on modifiable risks. WHO AFRO says about 70% of cancer deaths are in LMICs. Weak point: the "half" figure is from an ACS-led atlas, and attribution is not the same as deaths avoidable in practice.',
      suppliers: ['WHO Global Initiative for Childhood Cancer', 'IAEA Rays of Hope', 'St. Jude Global'],
      supplyState: 'thin',
      additionality: {
        level: 'high',
        why: 'Inference: the gap is large and suppliers are a few UN programs and hospital networks, not a market.',
      },
      entryPoints: [
        { who: 'talent', action: 'Pick one LMIC country and map which cancer treatments exist, where, and what they cost.' },
        { who: 'capital', action: 'Fund one radiotherapy or pathology training slot through an existing IAEA or St. Jude program.' },
        { who: 'operator', action: 'Offer logistics or procurement help to a cancer center listed in a Rays of Hope country.' },
      ],
      sources: [
        { label: 'ASCO Post: nearly 50% of cancer deaths attributable to modifiable risks (Cancer Atlas)', url: 'https://ascopost.com/news/june-2025/nearly-50-percent-of-all-cancer-deaths-worldwide-attributable-to-modifiable-risk-factors' },
        { label: 'ASCO Post: WHO/IARC analysis, 37.8% of cases attributable to modifiable risks (Feb 2026)', url: 'https://ascopost.com/news/february-2026/who-analysis-finds-many-global-cancer-cases-attributable-to-modifiable-risk-factors/' },
        { label: 'WHO AFRO: cancer', url: 'https://afro.who.int/health-topics/cancer' },
      ],
      children: [
        {
          id: 'tobacco',
          claim: 'Tobacco still causes about one in five cancer deaths, and 1.2 billion people use it.',
          kind: 'policy',
          whyUnsolved:
            'Tobacco use fell 27% since 2010, short of the 30% WHO target. Users in Africa are still rising with population growth. The levers are taxes and laws, which take politics, not science.',
          falsifier:
            'If tobacco-attributable cancer deaths fell sharply without further policy change, this would not be a live constraint.',
          tested:
            'WHO October 2025 report: 1.38B users in 2000 to 1.2B in 2024; prevalence 33.1% to 19.5%; projected over 1.15B by 2030. Decline is real but slow. The "one in five cancer deaths" figure is from the Cancer Atlas, not a WHO death count; WHO/IARC gives 15.1% of new cases from smoking.',
          suppliers: ['WHO'],
          supplyState: 'thin',
          additionality: {
            level: 'medium',
            why: 'Inference: proven policy playbook exists; extra effort matters most in countries where use is still rising.',
          },
          entryPoints: [
            { who: 'talent', action: 'Write a one-page brief on tobacco tax levels for one country where use is rising.' },
            { who: 'capital', action: 'Give to a tobacco control program in a country where absolute user counts are growing.' },
          ],
          sources: [
            { label: 'WHO tobacco trends report, 6 Oct 2025', url: 'https://www.who.int/news/item/06-10-2025-who-tobacco-trends-report-1-in-5-adults-still-addicted-to-tobacco' },
            { label: 'ACS Cancer Atlas: risk factors', url: 'https://canceratlas.cancer.org/risk-factors/' },
          ],
        },
        {
          id: 'lmic-treatment',
          claim: 'Children with cancer survive about 80% in rich countries and about 20 to 30% elsewhere.',
          kind: 'delivery',
          whyUnsolved:
            'More than 20 African countries have no radiotherapy at all. Pathology, drugs and trained staff are missing together. WHO targets 60% childhood survival by 2030, which means the gap is still open.',
          falsifier:
            'If LMIC childhood survival already approached 60% broadly, or radiotherapy gaps were closed, this child would shrink.',
          tested:
            'UICC: about 80% five-year survival in high-income countries; WHO-linked sources say 20 to 30% in LMICs, St. Jude says about a third. A 2019-data study of 197 countries found no low- or lower-middle-income country at 60% at baseline. IAEA says more than 20 African countries lack radiotherapy; the exact current count was not found.',
          suppliers: ['WHO Global Initiative for Childhood Cancer', 'IAEA Rays of Hope', 'St. Jude Global'],
          supplyState: 'thin',
          additionality: {
            level: 'high',
            why: 'Inference: childhood cancers are often curable with known regimens, so delivered care converts directly to survival.',
          },
          entryPoints: [
            { who: 'capital', action: 'Fund one year of essential childhood cancer drugs for a single named hospital partner.' },
            { who: 'operator', action: 'Help one pediatric oncology unit set up a basic cancer registry to count outcomes.' },
          ],
          sources: [
            { label: 'UICC: Global Initiative for Childhood Cancer', url: 'https://www.uicc.org/what-we-do/advocacy/working-together/global-initiative-childhood-cancer' },
            { label: 'St. Jude: Global Initiative', url: 'https://www.stjude.org/global/collaborating-to-cure/global-initiative.html' },
            { label: 'IAEA Rays of Hope story', url: 'https://iaea.shorthandstories.com/raysofhope/' },
            { label: 'IAEA/WHO joint statement on Rays of Hope', url: 'https://www.who.int/news/item/04-02-2022-iaea-who-joint-statement-on-reducing-inequity-in-access-to-cancer-care-through-rays-of-hope-initiative' },
          ],
        },
      ],
    },
    {
      id: 'late-detection',
      claim: 'Most cancer deaths come from cancers found late, with no proven screening test.',
      kind: 'science',
      whyUnsolved:
        'About 70% of US cancer deaths come from cancers with no recommended screening. The leading multi-cancer blood test missed its main trial goal. Stage shift does not reliably predict fewer deaths, so proof is slow.',
      falsifier:
        'A randomized trial showing a multi-cancer test cuts cancer deaths would turn this into a delivery problem.',
      tested:
        'NHS-Galleri (ASCO, May 2026) missed its primary endpoint: stage III/IV incidence ratio 1.03 (95% CI 0.92 to 1.14). Stage IV fell 14% overall, a secondary endpoint, company-reported and not yet peer reviewed. A 2025 meta-analysis found late-stage vs mortality correlation of 0.69, but varying by cancer. In LMICs, 40% to 80% of new cases are already advanced at diagnosis.',
      suppliers: ['GRAIL', 'NHS England'],
      supplyState: 'contested',
      additionality: {
        level: 'medium',
        why: 'Inference: well funded by industry, but independent mortality evidence is the missing piece, not more tests.',
      },
      entryPoints: [
        { who: 'talent', action: 'Track the peer-reviewed NHS-Galleri paper and summarize its mortality data when published.' },
        { who: 'capital', action: 'Fund an independent analysis of stage-shift evidence for one cancer with no screening.' },
      ],
      sources: [
        { label: 'GRAIL: full NHS-Galleri results at ASCO 2026 (company release)', url: 'https://grail.com/press-releases/grail-reports-full-results-from-nhs-galleri-trial-demonstrating-substantial-reduction-in-stage-iv-cancer-diagnoses-at-2026-asco-annual-meeting/' },
        { label: 'AJMC: cancers without screening and multicancer detection', url: 'https://www.ajmc.com/view/examining-developments-in-multicancer-early-detection-supplement' },
        { label: 'Late-stage outcomes as surrogates for mortality: meta-analysis', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12491949/' },
        { label: 'Late-stage presentation in LMICs (Clin Exp Metastasis 2023)', url: 'https://link.springer.com/article/10.1007/s10585-022-10196-1' },
      ],
      children: [
        {
          id: 'screening-uptake',
          claim: 'Proven screening is underused: under one in five eligible US adults get lung screening.',
          kind: 'delivery',
          whyUnsolved:
            'Eligibility depends on smoking history that clinics rarely record. Uptake varies threefold across states, lowest where lung cancer deaths are highest. Only about 14% of diagnosed cancers are found by screening.',
          falsifier:
            'If eligible adults were mostly up to date and deaths still did not fall, uptake would not be the limit.',
          tested:
            'ACS, JAMA, 2024 NHIS data: 12.8M eligible, 18.7% up to date, state range 9.7% to 31%. An older ALA figure was 5.8%, so the trend is up. ACS models 62,110 lung cancer deaths prevented over five years at full uptake. Global screening uptake was not researched.',
          suppliers: ['American Cancer Society'],
          supplyState: 'thin',
          additionality: {
            level: 'medium',
            why: 'Inference: a proven test with low uptake means outreach converts directly to earlier detection.',
          },
          entryPoints: [
            { who: 'talent', action: 'Build a free eligibility checker for lung screening that tells people what to ask their doctor.' },
            { who: 'operator', action: 'Get one primary care clinic to record pack-year smoking history for every adult patient.' },
          ],
          sources: [
            { label: 'AuntMinnie: ACS, only 1 in 5 eligible US adults screened for lung cancer in 2024', url: 'https://auntminnie.com/clinical-news/ct/article/15772301/acs-only-1-in-5-eligible-us-adults-underwent-lcs-in-2024' },
            { label: 'AARP: lung screening guidelines (ALA 5.8% figure)', url: 'https://www.aarp.org/health/conditions-treatments/lung-cancer-screening-guidelines/' },
            { label: 'Duke Cancer Institute: 14% of cancers found by screening (NORC)', url: 'https://dukecancerinstitute.org/center/center-onco-primary-care/pathfinder-2' },
          ],
        },
      ],
    },
    {
      id: 'slow-trials',
      claim: 'Cancer trials are slow because few patients enroll and many trials never finish.',
      kind: 'coordination',
      whyUnsolved:
        'About 7% of US cancer patients join treatment trials, and most US counties have no active cancer trial. About one in five adult cancer trials fails to finish enrollment. Sites, eligibility rules and costs are not coordinated.',
      falsifier:
        'If most patients offered trials refused, the limit would be willingness, not access or design.',
      tested:
        'Refutation check: a 2020 meta-analysis found 55% of patients agree when offered a trial, so willingness is not the main limit. Enrollment estimate is 7.1% (Unger, JCO 2024), up from the older under-5% figure, and modeled from accreditation data. Cost per patient: only a 2013 industry estimate ($74,800, phase 3) and a 2019 single-center Italian estimate (EUR 11,379) were found; current cost is unknown.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Trial-matching and decentralized-trial suppliers were not researched this session.',
      },
      entryPoints: [
        { who: 'talent', action: 'List active cancer trials within 100 miles of one rural county and publish the gap.' },
        { who: 'capital', action: 'Cover travel costs for patients enrolling in one cancer center trial program.' },
      ],
      sources: [
        { label: 'HealthDay: enrollment in cancer treatment trials about 7% (Unger, JCO)', url: 'https://www.healthday.com/healthpro-news/cancer/patient-enrollment-in-cancer-treatment-trials-about-7-percent' },
        { label: 'Healio: many patients lack trial access where they live', url: 'https://cm.healio.com/news/hematology-oncology/20241022/many-patients-with-cancer-do-not-have-access-to-clinical-trials-based-on-where-they-live' },
        { label: 'Healio: one in five cancer trials fails to complete enrollment', url: 'https://cm.healio.com/news/hematology-oncology/20140130/hot0114galsky_10_3928_1081_597x_20140101_24_1331469' },
        { label: 'PLoS ONE 2019: per-patient trial cost, Italian center', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6324822/' },
        { label: 'Business Wire 2013: phase 3 oncology per-patient cost', url: 'https://www.businesswire.com/news/home/20130722005066/en/Phase-3-Oncology-Trial-Costs-Fall-Narrower' },
      ],
      children: [
        {
          id: 'trial-accrual',
          claim: 'Poor accrual is the leading reason cancer trials stop early.',
          kind: 'coordination',
          whyUnsolved:
            'Trials open at too few sites, with narrow eligibility, and compete for the same patients. Poor accrual caused 38.7% of early terminations in one analysis and 33% in another.',
          falsifier:
            'If terminated trials mostly stopped for safety or futility, accrual would not be the bottleneck.',
          tested:
            'Estimates differ by dataset: 20% risk of failing to complete enrollment (2005 to 2011 adult trials); 8.5% terminated or withdrawn across 12,875 oncology registrations; 37.9% of NCI phase III trials missed minimum accrual. Poor accrual is the top cause in each.',
          suppliers: [],
          supplyState: 'unresearched',
          additionality: {
            level: 'unknown',
            why: 'Not researched which groups already work on accrual at scale.',
          },
          entryPoints: [
            { who: 'talent', action: 'Analyze terminated oncology trials on ClinicalTrials.gov from the last year and tag stop reasons.' },
          ],
          sources: [
            { label: 'PMC: premature termination in oncology trials', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6292544' },
            { label: 'Healio: one in five cancer trials fails to complete enrollment', url: 'https://cm.healio.com/news/hematology-oncology/20140130/hot0114galsky_10_3928_1081_597x_20140101_24_1331469' },
          ],
        },
      ],
    },
  ],
}
