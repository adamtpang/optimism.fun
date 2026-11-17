# Task 4: one claim, one limitation

Draft, 2026-11-17. Not committed.

## The claim

> Ischaemic heart disease caused an estimated 9.5 million deaths in 2023, about 1 in
> every 6.5 deaths worldwide.

## The limitation

> These are WHO's modelled estimates, not counted death certificates, and the file gives
> single values with no uncertainty range, so it cannot show how sure the number is.

## Where each number comes from

All from `snapshot/deaths_global_2026-09-30.xlsx`, sheet "Global 2023", column
"Both sexes, Total (all ages)". Values are copied as stored, then rounded for the sentence.

| Row in the sheet | Cause | Deaths, 2023 |
| --- | --- | --- |
| 10 | All Causes | 61,071,367 |
| 156 | Ischaemic heart disease | 9,469,357 |

- Share: 9,469,357 / 61,071,367 = 15.5 percent. One in 6.45, written as "about 1 in 6.5".
- This division is our arithmetic. WHO's file does not print the share.

## Checks made before writing the sentence

- **It matches what the site already cites.** The same file's "Global 2021" sheet gives
  9,149,522 deaths from ischaemic heart disease. `src/data/mortality.ts` quotes
  9,100,000 for 2021 from WHO's fact sheet. The two agree after rounding.
- **"Estimated" is WHO's own word.** The sheet title begins "Global Health Estimates 2023".
- **No uncertainty range is in the file.** The Notes and Summary sheets were searched for
  "uncertain" and nothing was found. The year sheets hold one value per cell.

## What the claim does not say

- It does not say heart disease is rising. The count went from 6.4 million in 2000 to
  9.5 million in 2023, but the world's population and its age also changed, and a raw
  count cannot separate those. A trend claim needs the age-standardized rates file,
  which has not been snapshotted.
- It does not rank causes. The Top20 sheet does that and was not read for this claim.
- It says nothing about any country. This is the global summary only.

## If this cannot stay two sentences

Then the chart is doing too much. The trend and the ranking are separate charts.
