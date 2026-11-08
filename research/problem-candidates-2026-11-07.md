# Problem candidates, 2026-11-07

Every cause in WHO's 2021 top ten deaths already maps to one of the 19 problems,
so new rows have to come from other lists. These are candidates, not additions.
Each needs its numbers opened on the primary page before it enters
`src/data/problems.ts`, because origin's severity model requires an opened
death-rate pair with https sources (see `tests/severity-sources.test.ts`).

## From the burden data (deaths and disability not yet a row)

| Candidate | Headline number | Source status |
|---|---|---|
| Mental disorders (incl. suicide) | 970M people living with one (1 in 8, 2019); 280M with depression; ~727K suicides in 2021 | WHO figures, seen only on mirrors. Open the WHO mental disorders and suicide fact sheets. |
| Air pollution | 6.7M premature deaths a year combined; household 2.9M (2021), ambient ~4.2M (2019) | WHO household fact sheet; ambient figure secondhand. Overlaps COPD, heart disease and stroke, so deaths must not be summed with them. |
| Road traffic injuries | ~1.19M deaths a year; leading killer of ages 5 to 29 | WHO Global Status Report 2023, seen on reprints. Open the WHO fact sheet. |

Mental disorders is the strongest of the three: it is the largest source of years
lived with disability, it has no row today, and it overlaps the existing loneliness row.

## From "Choose Good Quests" (quests the essay names with no row today)

Semiconductor manufacturing, industrial automation, resource discovery, new
transport, brain mapping and interfaces. These are capability problems, not
burden problems, so they need a different denominator than deaths. Do not add
them until there is a sourced way to size them.

## Next step

Pick one, open its primary sources, and add it with a mortality pair the same
way COPD and diabetes were added on 2026-09-11.

## Sources seen (secondary unless noted)

- WHO road safety 2023, via https://safetysteps.org/2023/12/13/despite-notable-progress-road-safety-remains-urgent-global-issue
- WHO mental disorders fact sheet mirror: https://knowledge-action-portal.com/en/node/8673
- WHO household air pollution fact sheet (via AFRO): https://www.afro.who.int/fr/node/3828
- WHO suicide 2021 figure, via https://streamlinefeed.co.ke/news/global-suicide-deaths-top-720000-a-year-who-data-show
