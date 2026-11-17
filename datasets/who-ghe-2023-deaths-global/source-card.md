# Source card: WHO Global Health Estimates 2023, deaths by cause (global summary)

Draft, 2026-11-17. Not committed. Every field below was read on the page named beside
it on 2026-11-17. A field the source does not state is marked "not stated".

| Field | Value | Where it was read |
| --- | --- | --- |
| Producer | World Health Organization | WHO GHO page |
| Title | Global Health Estimates 2023: Deaths by Cause, Age, Sex, by Country and by Region, 2000-2023 | WHO GHO page, recommended citation |
| File | Global summary estimates (`deaths_global_2026-09-30.xlsx`) | WHO GHO page, download list |
| File URL | https://cdn.who.int/media/docs/default-source/gho-documents/global-health-estimates/deaths_global_2026-09-30.xlsx?sfvrsn=22004518_1 | WHO GHO page |
| Landing page | https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-leading-causes-of-death | |
| Date published | September 2026, as printed on the file's own Notes sheet (spelled "Sepetember 2026" there). The landing page states no date. The file name carries 2026-09-30 and the server reports it last modified 2026-10-01. | Notes sheet in the file; WHO GHO page; HTTP header |
| Coverage | 2000 to 2023, per the title | Recommended citation |
| Date accessed | 2026-11-17 | |
| License | Not stated on the landing page. See the note below. | WHO GHO page |
| Methods | https://cdn.who.int/media/docs/default-source/gho-documents/global-health-estimates/ghe2023_cod_methods.pdf?sfvrsn=4d284ba5_1 | WHO GHO page |
| Snapshot file | `snapshot/deaths_global_2026-09-30.xlsx`, 504,781 bytes, downloaded 2026-11-17 and stored unchanged | |
| Snapshot checksum | SHA-256 `6e2d131358512faaaffed3e8e2e6c0a313e372a82f4bd6f2dbd5369cf100f91f`, also in `SHA256SUMS` | |
| Archived at | Not created yet | |

## Full citation, as WHO gives it

> Global Health Estimates 2023: Deaths by Cause, Age, Sex, by Country and by Region,
> 2000-2023. Geneva, World Health Organization; 2026.

## License note

The landing page for this file states no license or terms of use.

WHO publishes "Terms and conditions for WHO datasets" at
https://data.who.int/about/data/terms-and-conditions. Those terms say datasets published
on data.who.int are under CC BY 4.0 with added terms: attribute as the dataset's metadata
indicates, do not use WHO's name or emblem without written approval, do not state or
imply WHO endorsement, and do not misrepresent the data.

This file is served from who.int and cdn.who.int, not from data.who.int, and the terms
page does not say it covers files on those hosts. So the license for this specific file is
**unconfirmed**. Before a chart built on it is published, either find a statement that
covers it or ask WHO.

### Second search, 2026-11-17

Adam's ruling: no chart is published from this file unless a statement covering it is
found. A second search found none.

| Page | What it says | Covers this file? |
| --- | --- | --- |
| WHO Copyright, https://www.who.int/about/policies/publishing/copyright | WHO publications are CC BY-NC-SA 3.0 IGO. Materials not under that licence need WHO's permission. Datasets and data files are not mentioned. | Not stated |
| GHO OData API, https://www.who.int/data/gho/info/gho-odata-api | No licence or terms on the page. | No |
| The file's Notes and Summary sheets | No licence, copyright or terms wording. | No |
| data.who.int terms | CC BY 4.0, for datasets published on data.who.int. | Not stated |

Why it matters which one applies: CC BY 4.0 would let a chart be published under our own
CC BY 4.0. CC BY-NC-SA 3.0 IGO would not, because it bars commercial use and requires the
same licence on anything adapted from it.

Status: **unconfirmed**. The snapshot is kept on this machine and held out of git
(`.git/info/exclude`) until this is settled. The way to settle it is to ask WHO.

## Citation in the playbook template (filled only where known)

```
World Health Organization (2026), processed by optimism.fun.
"Global Health Estimates 2023: Deaths by Cause, Age, Sex, by Country and by Region, 2000-2023" [dataset].
Original source: Global Health Estimates 2023: Deaths by Cause, Age, Sex, by Country and by Region, 2000-2023. Geneva, World Health Organization; 2026. https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-leading-causes-of-death
License: [unconfirmed, see license note].
Accessed 2026-11-17. Snapshot checksum: sha256:6e2d131358512faaaffed3e8e2e6c0a313e372a82f4bd6f2dbd5369cf100f91f.
Archived at: [not created yet].
```

## Why this file

- It is the official file behind the leading-causes list, not a news-release summary.
- It is newer than what the site cites. `src/data/mortality.ts` quotes the 2021 edition
  from a fact sheet (ischaemic heart disease, 9.1 million deaths in 2021). This edition
  runs to 2023.
- The global summary is the smallest of the files on the page. The by-country files can
  follow once the pipeline has worked once.

## What is in the file

Read on 2026-11-17 without changing the file. The checksum was the same before and after.

- Sheets: Notes, Top20, Summary, and one sheet per year: Global 2023, 2022, 2021, 2020,
  2019, 2015, 2010 and 2000.
- Each year sheet lists deaths by cause for both sexes, then by sex and age group.
- The Notes sheet repeats the recommended citation and lists the countries included.
  It states no license.

## Not done here

No cleaning, joining or charting. The Format, Curate and Publish stages have not started.
