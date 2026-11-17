# Task 1: license split review

Draft, 2026-11-17. Not committed. Adam decides before any wording is published.
Read on `origin/main` at `eba93c8`: `LICENSE`, `DATA_LICENSE.md`, `README.md` line 5.

## What is already covered

| Material | Playbook recommends | On main today | Covered? |
| --- | --- | --- | --- |
| Code | MIT | `LICENSE`: MIT, "Copyright (c) 2026 Adam Pangelinan and contributors" | Yes |
| Datasets we compile | CC BY 4.0 | `DATA_LICENSE.md`: "the compilations in `src/data/`" are CC BY 4.0, with a usable credit line | Yes |
| Third-party source data | Keep the original license | `DATA_LICENSE.md`: "Those upstream sources keep their own terms", with WHO, OWID and World Bank called out | Yes, for live feeds and quoted rows |
| OWID Grapher code | Do not copy | Not copied. Charts are our own HTML and SVG. | Yes |
| Visual Capitalist graphics | Not a model | Not used. | Yes |

## Gaps

1. **Original writing is not covered.** `DATA_LICENSE.md` is scoped to "the compilations
   in `src/data/`". The whitepapers, the "why it is not solved" trees' prose, page copy and
   everything under `research/` have no stated license. Under default copyright that means
   all rights reserved, which is the opposite of the public-goods intent.
2. **Charts and figures are not covered in the license files, but one page already says
   they are.** `src/app/figures/[slug]/page.tsx` tells readers each figure is "Free to
   reuse under CC BY 4.0". That sentence is ahead of the license files. Either the files
   catch up or the sentence comes out.
3. **Snapshots are not mentioned.** Nothing says an upstream file stored unchanged in the
   repo stays under its producer's license, or that it is stored with a checksum.
4. **Photographs are credited but not named in the license files.** The NASA and CDC
   images are public domain and one is CC0 (`public/media/CREDITS.md`). They are not ours
   to license and the license files should say so in one line.
5. **README line 5 names only code and "the data compilation".** It should name writing
   and charts once the gap above is closed.

## Draft wording to add to `DATA_LICENSE.md` (not applied)

> ## Writing, charts and figures
>
> Original writing, charts, figures and share images made for optimism.fun are also
> released under CC BY 4.0. Credit them the same way: optimism.fun, CC BY 4.0, with the
> page URL and the date you retrieved it. A chart is only as reusable as the data in it,
> so also cite the source named on the chart.
>
> ## Snapshots of upstream files
>
> Some upstream files are stored unchanged in this repository so that a citation still
> resolves if the producer later revises or removes the file. Each snapshot sits beside a
> source card that names the producer, the license and the date accessed, and a checksum
> of the file. A snapshot keeps its producer's license. Storing it here does not relicense
> it, and CC BY 4.0 above does not apply to it.
>
> ## Photographs
>
> Photographs on the site are not ours to license. Each is credited on the page and in
> `public/media/CREDITS.md`, with its own terms (public domain or CC0 at the time of writing).

## Draft replacement for README line 5 (not applied)

> The code is [MIT](LICENSE). The data we compile, and our own writing, charts and figures,
> are [CC BY 4.0](DATA_LICENSE.md), in the spirit of Our World in Data. Upstream files and
> photographs keep their producers' terms. Cite optimism.fun and the source on the row.

## Decisions for Adam

- Approve, edit or reject the three draft sections above.
- Whitepapers: confirm they should be CC BY 4.0 like the rest. They are the most
  "authored" thing on the site.
- MIT or Apache-2.0 for code. MIT is in place and matches `owid/etl`. Apache-2.0 adds an
  explicit patent grant. No change is needed unless you want that.
