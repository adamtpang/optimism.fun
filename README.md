# optimism.fun

An open tool for humanity's hardest problems. The site ranks the problems, shows the sourced numbers, and lists where to build, fund, buy, or learn. People, teams, and capital can find the same page.

The code is [MIT](LICENSE). The data compilation is [CC BY 4.0](DATA_LICENSE.md), in the spirit of Our World in Data. Cite optimism.fun and the source on the row.

## Maintained by an AI, reviewed by a human

An AI research bot updates the data by pull request. It can run every day. It opens a pull request only when it has a sourced change: a new discovery, a call to action, or a corrected figure. A human reviews the diff before it merges.

The bot does not change a rank on its own. If a source does not state a number, the number stays out. Empty days stay empty.

How to add a row: [CONTRIBUTING.md](CONTRIBUTING.md), [research/DISCOVERIES.md](research/DISCOVERIES.md), [research/CTAS.md](research/CTAS.md).

## Data you can download

Every public dataset is JSON and CSV, with the citation on the row.

| Dataset | JSON | CSV |
| --- | --- | --- |
| Problems | `/api/problems` | `/api/problems/csv` |
| One problem | `/api/problems/<slug>` | `/api/problems/<slug>/csv` |
| Time series | `/api/series` | `/api/series/csv` |
| Discoveries | `/api/discoveries` | `/api/discoveries/csv` |
| Calls to action | `/api/ctas` | `/api/ctas/csv` |
| Ranking scores | `/api/scores` | `/api/scores/csv` |
| Rendered snapshot | `/api/rendered` |  |

These files are public downloads of the current commit. They are not a supported API and they have no stability guarantee.

`/api/scores` repeats the ranking inputs, the formulas, a worked example, and model-sensitivity bounds. Those bounds are what the score does if a missing annual-severity default is set to 0 or to 1. They are not a statistical confidence interval. No validated interval is published.

`/api/rendered` returns the same snapshot the public pages render. The file is `src/data/snapshots/rendered-2026-11-06.json`. It holds the Our World in Data, WHO, and World Bank series, plus the OpenAlex, Wikipedia, SEC EDGAR, Federal Register, USAspending, NIH RePORTER, and openFDA counts on `/demand`, and the Hacker News, GitHub, and Wikipedia observations on `/trends`. A row with status `unavailable` was a failed fetch. It is not stored as zero and it is not a filled-in historical value. `/research` answers a question only after someone asks; those answers are not a standing table in the snapshot.

A stored chart uses only the series already stored for that problem. If there is no stored series, the page says so. A live chart under it is a separate retrieval, with its own year and definition.

## Stack

Next.js 16, React 19, Tailwind, TypeScript. Neon for the coordination board. Vercel for hosting.

```bash
npm install
npm run dev
npm test
npx tsc --noEmit
npm run build
```

## Analytics

PostHog runs in the browser only when `NEXT_PUBLIC_POSTHOG_KEY` is set. `NEXT_PUBLIC_POSTHOG_HOST` is optional: a site path such as `/ingest`, or an `http(s)` URL. Any other value, including empty, sends events to the same-origin `/ingest` proxy. The first load and each client-side path change record one pageview, and page leaves are recorded. Session replay stays on, and input values are masked. With no key, PostHog does not initialize. Names are listed in `.env.example`.

## What the pages are

- `/` the ranking, and a poster of it
- `/poster` the same poster, with a share image
- `/p/<slug>` the numbers, the chart, and what to do
- `/where` a private matcher. It stays in the browser
- `/data` the downloads and the license
- `/discoveries` findings, newest first
- `/s-tier` existential risks
