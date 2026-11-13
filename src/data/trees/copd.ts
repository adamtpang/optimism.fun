// Constraint tree for optimism.fun: why is COPD not solved yet?
// Researched 2026-11-11. Every number below comes from a page opened this session.
// Inference is labeled as inference. Unknown stays unknown.

import type { ConstraintTree } from '../constraints'

const WHO_COPD = {
  label: 'WHO COPD fact sheet (opened 2026-11-11)',
  url: 'https://www.who.int/news-room/fact-sheets/detail/chronic-obstructive-pulmonary-disease-(copd)',
}
const WHO_HAP = {
  label: 'WHO household air pollution fact sheet (opened 2026-11-11)',
  url: 'https://www.who.int/news-room/fact-sheets/detail/household-air-pollution-and-health',
}
const WHO_TOBACCO = {
  label: 'WHO tobacco trends report, 6 Oct 2025',
  url: 'https://www.who.int/news/item/06-10-2025-who-tobacco-trends-report-1-in-5-adults-still-addicted-to-tobacco',
}

export const copdTree: ConstraintTree = {
  problemSlug: 'copd',
  outcome:
    'Fewer people develop and die of COPD. WHO counts 3.4 million deaths in 2023, and nearly 90 percent of deaths under age 70 are in low- and middle-income countries.',
  whyUnsolved:
    'The damage cannot be reversed, so the disease has to be stopped before it starts. The two main causes are known: tobacco smoke and smoke from cooking fuel. Both are still breathed by billions of people. Those who already have COPD are mostly never diagnosed in poorer countries, and basic inhalers are often not on the shelf.',
  bindingId: 'exposure',
  updated: '2026-11-11',
  root: [
    {
      id: 'exposure',
      claim: 'People keep breathing the smoke that causes COPD, from tobacco and from cooking fuel.',
      kind: 'policy',
      whyUnsolved:
        'Tobacco smoking accounts for over 70 percent of cases in high-income countries and 30 to 40 percent in low- and middle-income ones. About 1.2 billion people still use tobacco. Around 2.1 billion cook on open fires or inefficient stoves. The fixes are taxes, laws and clean fuel, which nobody sells as a product. Calling this the binding constraint is our inference.',
      falsifier:
        'COPD deaths keep rising in places where smoking and solid-fuel cooking have already fallen to low levels for decades.',
      tested:
        'Looked for the size of the exposure share, not for the falsifier itself. WHO attributes 23 percent of adult COPD deaths in low- and middle-income countries to household air pollution, and 30 to 40 percent of cases there to tobacco. That leaves a share unexplained by these two causes. We did not find a country series that tests the falsifier directly.',
      suppliers: [
        'WHO Framework Convention on Tobacco Control and MPOWER',
        'WHO Clean Household Energy Solutions Toolkit (CHEST)',
        'Health and Energy Platform of Action (HEPA)',
      ],
      supplyState: 'thin',
      additionality: {
        level: 'medium',
        why: 'Inference: the policy playbook is public. Extra effort matters most where exposure is not falling, such as rural clean cooking.',
      },
      entryPoints: [
        { who: 'talent', action: 'Write a one-page brief on tobacco tax and clean-cooking access for one high-burden country.' },
        { who: 'capital', action: 'Fund a clean-cooking programme in a rural area and require it to report fuel actually displaced.' },
        { who: 'operator', action: 'If you sell stoves or fuel, measure whether households stop using solid fuel, not only whether they buy.' },
      ],
      sources: [WHO_COPD, WHO_HAP, WHO_TOBACCO],
      children: [
        {
          id: 'clean-cooking',
          claim: 'Clean cooking will not reach everyone by 2030.',
          kind: 'delivery',
          whyUnsolved:
            'In 2021, 49 percent of rural people relied on polluting fuels, against 14 percent of urban people. WHO expects only 78 percent of the world to have clean cooking by 2030, leaving nearly 1.8 billion people without it.',
          falsifier: 'Rural access to clean cooking closes the gap with urban access before 2030.',
          suppliers: ['WHO CHEST', 'Health and Energy Platform of Action (HEPA)'],
          supplyState: 'unresearched',
          additionality: { level: 'unknown', why: 'Not researched who delivers clean cooking at scale, or what it costs per household.' },
          entryPoints: [
            { who: 'talent', action: 'Map who supplies clean cooking fuel in one rural district and what blocks repeat purchase.' },
          ],
          sources: [WHO_HAP],
        },
        {
          id: 'tobacco',
          claim: 'Tobacco use is falling too slowly.',
          kind: 'policy',
          whyUnsolved:
            'Users fell from 1.38 billion in 2000 to 1.2 billion in 2024. The decline since 2010 is 27 percent, short of the 30 percent target for 2025. In Africa prevalence is the lowest of any region, but the number of users is still growing with population.',
          falsifier: 'Tobacco use reaches the WHO target with no further policy change.',
          tested: 'WHO says men are not expected to reach the target until 2031. The decline is real but behind schedule.',
          suppliers: ['WHO Framework Convention on Tobacco Control and MPOWER'],
          supplyState: 'thin',
          additionality: {
            level: 'medium',
            why: 'Inference: proven measures exist. One more team matters most in countries where user counts are still rising.',
          },
          entryPoints: [
            { who: 'capital', action: 'Give to a tobacco control programme in a country where the number of users is growing.' },
          ],
          sources: [WHO_TOBACCO],
        },
      ],
    },
    {
      id: 'diagnosis-treatment',
      claim: 'Most people with COPD in poorer countries are never diagnosed, and basic inhalers are often missing.',
      kind: 'delivery',
      whyUnsolved:
        'Diagnosis needs spirometry, which WHO says is often not available in low- and middle-income countries. In a study of 10,709 adults in Nepal, Peru and Uganda, 95.3 percent of the COPD cases found had never been diagnosed. In 2023, salbutamol inhalers were generally available in public primary care in less than two-thirds of low- and lower-middle-income countries.',
      falsifier: 'Places with good spirometry access and stocked inhalers show no better outcomes than places without.',
      tested:
        'Not tested. We found the size of the gap, not outcome data. The 95.3 percent figure is from three study sites, not a global estimate. A WHO-commissioned review found inhaled medicines largely unavailable and unaffordable in these countries, most of all inhalers with corticosteroids.',
      suppliers: [
        'WHO Package of Essential NCD Interventions (PEN)',
        'Global Alliance against Chronic Respiratory Diseases (GARD)',
      ],
      supplyState: 'thin',
      additionality: {
        level: 'medium',
        why: 'Inference: treatment eases symptoms but does not reverse damage, so finding cases helps less here than in diseases with a cure.',
      },
      entryPoints: [
        { who: 'operator', action: 'Add a short COPD screening questionnaire to one primary care clinic. In the JAMA study it took 7.6 minutes on average.' },
        { who: 'talent', action: 'Check inhaler stock and price in public clinics in one country and publish the result.' },
      ],
      sources: [
        WHO_COPD,
        {
          label: 'Healio: Siddharthan et al., JAMA 2022, COPD screening in Nepal, Peru and Uganda',
          url: 'https://www.healio.com/news/pulmonology/20220128/simple-screening-tools-feasible-for-identifying-copd-in-low-and-middleincome-countries',
        },
        {
          label: 'Knowledge Action Portal: Lancet Global Health 2022 review of asthma and COPD medicines in LMICs',
          url: 'https://www.knowledge-action-portal.com/en/content/availability-cost-and-affordability-essential-medicines-asthma-and-copd-lmic-systematic-0',
        },
      ],
    },
    {
      id: 'no-reversal',
      claim: 'No treatment cures COPD or repairs the lung.',
      kind: 'science',
      whyUnsolved:
        'WHO states that COPD is not curable. Stopping smoking, avoiding polluted air, vaccines, medicines, oxygen and rehabilitation improve symptoms. None of them restores lost lung tissue.',
      falsifier: 'A trial shows a therapy that restores lung function in established COPD.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: { level: 'unknown', why: 'Not researched this session who works on lung repair or how far along it is.' },
      entryPoints: [
        { who: 'talent', action: 'Review registered trials that aim to restore lung function in COPD and list what each has shown.' },
        { who: 'capital', action: 'Unknown until the review above exists. Do not fund on this node yet.' },
      ],
      sources: [WHO_COPD],
    },
  ],
}
