# Calls to action

Each row is something a person can do about a ranked problem, or about an S-tier risk: build, fund, buy, or learn. A research pass adds rows by pull request. Append to the array. Do not reorder it for display.

File: `src/data/ctas.ts`
Type: `Cta`
Rendered on `/p/[slug]`, on `/s-tier`, and in `/where`.

The list does not change problem ranks, scores, or demand.

The compilation is CC BY 4.0. See `DATA_LICENSE.md`.

## Add a row

1. Open the page. Use the final https URL. Do not invent a shorter link.
2. Write one sentence in `oneLiner`. If you mention a number, it has to be on that page. Otherwise leave the number out.
3. Set `problemSlugs` from `src/data/problems.ts`, or `riskSlugs` (`ai-control`, `engineered-pandemics`, `nuclear-war`, `planetary-catastrophe`). At least one of the two lists must be non-empty. A row may carry both.
4. Set `kind` to `build`, `fund`, `buy`, or `learn`.
5. Set `type` to one of: `nonprofit`, `startup`, `fund`, `grant`, `product`, `report`, `prize`, `paper`, `government`.
6. `location` is optional. Use it only when the page makes the place obvious.
7. `amount` is optional. Use it only when the page states a figure. `text` is that figure, copied. `sourceUrl` is the page that states it. No amount without `sourceUrl`.
8. Set `checkedDate` to the day you opened the URL (`YYYY-MM-DD`). `checked: false` means an automated fetch was blocked, not that the URL is dead. You can omit `checked`.
9. Keep `id` unique, kebab-case, and stable. Do not reuse an id. The same URL may appear twice when the kinds differ (a company and its product).
10. `npm test` and `npx tsc --noEmit` must pass. The data file throws on a bad slug, a non-https URL, a missing name, or an amount with no source.

There is no air-pollution slug. Rows about air pollution are tagged `copd` and `climate-change`. Do not invent a new problem in the same pull request.

## Fields

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | kebab-case, unique, never reused |
| `problemSlugs` | yes | array, `[]` only if `riskSlugs` is set |
| `riskSlugs` | no | S-tier slugs |
| `kind` | yes | `build`, `fund`, `buy`, `learn` |
| `name` | yes | the organization, product, or paper |
| `url` | yes | https |
| `type` | yes | see the list above |
| `oneLiner` | yes | one sentence, 240 characters or fewer |
| `location` | no | short place name |
| `amount` | no | `{ text, sourceUrl }`, both required when present |
| `checkedDate` | yes | `YYYY-MM-DD` |
| `checked` | no | boolean |

## Example

```ts
{
  id: 'example-fund-biosecurity',
  problemSlugs: ['biosecurity'],
  riskSlugs: ['engineered-pandemics'],
  kind: 'fund',
  name: 'Example Fund',
  url: 'https://example.org/fund',
  type: 'grant',
  oneLiner: 'Funds tools that detect a new pathogen early.',
  checkedDate: '2026-11-01',
  checked: true,
}
```

Amount, only when the page states it:

```ts
amount: {
  text: '$10 million prize',
  sourceUrl: 'https://example.org/prize',
},
```
