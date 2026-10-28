# Discoveries

`/discoveries` is a feed of verified findings. Each row is tagged to the ranked problem it moves, and to an S-tier risk when that is the real subject. A weekly research pass adds rows by pull request. The page sorts itself. Append to the array. Do not reorder it for display.

File: `src/data/discoveries.ts`
Type: `Discovery`
Rendered by: `src/app/discoveries/page.tsx`

The feed does not change problem ranks, scores, or demand.

## Add a row

1. Confirm the paper. Use a DOI that resolves, or a stable URL if there is no DOI.
2. Copy the title from Crossref, OpenAlex, or the preprint server. Look the publish date up the same way. If you cannot find a date, set `published` to `""`. Do not guess.
3. Write one or two plain sentences. Every number in `summary` must appear in the paper or in the note you are citing. No new figures.
4. Set `problemSlugs` to ids from `src/data/problems.ts`. Use `riskSlugs` (`ai-control`, `engineered-pandemics`, `nuclear-war`, `planetary-catastrophe`) when the finding is about an S-tier risk. At least one of the two lists must be non-empty.
5. Set `changes` to the ranking input the finding moves: `scale`, `neglectedness`, or `tractability`.
6. Set `review` to `peer-reviewed`, `preprint`, or `trial-result`. A journal trial is `trial-result`. The page labels preprints "Preprint, not peer reviewed" from this field. Do not put that phrase in the summary.
7. If a later paper retracts the result, set `status` to `retracted`. If a later paper challenges it, set `status` to `challenged`. Both require `notice.note` and `notice.url`. Leave the original row in the feed.
8. Set `added` to the day you add the row (`YYYY-MM-DD`). Keep `id` unique and stable. Do not reuse an id.
9. `npm test` and `npx tsc --noEmit` must pass. The data file throws on a bad slug, a broken date, a missing source link, or a status with no notice.

## Fields

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | kebab-case, unique, never reused |
| `title` | yes | publisher title |
| `published` | yes | `YYYY-MM-DD`, or `""` if unknown |
| `added` | yes | `YYYY-MM-DD` |
| `source` | yes | journal, server, or agency |
| `doi` | no | bare DOI, no `https://doi.org/` prefix |
| `url` | yes | `https://doi.org/<doi>` when a DOI exists, otherwise the canonical URL |
| `problemSlugs` | yes | array of `problems.ts` slugs, `[]` only if `riskSlugs` is set |
| `riskSlugs` | no | S-tier slugs |
| `summary` | yes | one or two sentences, sourced numbers only |
| `changes` | yes | `scale`, `neglectedness`, or `tractability` |
| `review` | yes | `peer-reviewed`, `preprint`, or `trial-result` |
| `status` | no | `retracted` or `challenged` |
| `notice` | when `status` is set | `{ note, url }` |

## Example

```ts
{
  id: 'example-finding-2026',
  title: 'Title copied from Crossref',
  published: '2026-01-15',
  added: '2026-10-28',
  source: 'Nature',
  doi: '10.1038/example',
  url: 'https://doi.org/10.1038/example',
  problemSlugs: ['biosecurity'],
  summary: 'One or two sentences. Only numbers that are in the paper.',
  changes: 'tractability',
  review: 'peer-reviewed',
}
```

Challenged row, in addition to the fields above:

```ts
status: 'challenged',
notice: {
  note: 'What the later paper found, in one or two sentences.',
  url: 'https://doi.org/10.0000/challenge',
},
```

## Seed

The first 30 rows were taken from the bounty-board findings whose DOIs were checked on 2026-10-28. Publish dates and titles were read from Crossref, except Greenblatt et al. 2024, which is an arXiv preprint (`published` 2024-12-18 from the arXiv record). Two rows are `challenged`: Park, Leahey, and Funk 2023 (Holst et al., Nature 2026) and Hsieh and Moretti 2019 (Greaney, AEJ Macro 2026).

Four ranked problems have no row because the seed set had no paper that bears on them: fertility decline, neglected tropical diseases, AI datacenter power, and financial infrastructure. Leave them empty until a real paper shows up. Do not stretch a tag to fill the gap.
