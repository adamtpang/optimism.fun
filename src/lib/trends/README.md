# The trend engine

The attention/velocity layer for optimism.fun. Polls public sources for signal
about a list of watched terms, scores them by momentum rather than level, and
ranks what is rising — with a specific bias toward what is rising that nobody
has priced yet.

**Runs with no database and no API keys.** Persistence and history are additive.

---

## Why it sits on the supply side

`lib/demand.ts` weights attention at **zero** on purpose: the thesis is that the
best opportunities are high demand with *low* attention. A trend board that
treated virality as importance would invert that.

So this is not a demand signal. It is the crowding axis. The view that earns its
place is **Underpriced attention** — high momentum against low absolute volume,
which is something moving before the room notices. Everything else here is a
worse Google Trends.

---

## Architecture

```
src/data/watched-terms.ts        the terms to watch (the extension point)
src/lib/trends/types.ts          shared types
src/lib/trends/scoring.ts        the scoring model + source weights
src/lib/trends/engine.ts         orchestration: fan out, score, rank
src/lib/sources/hackernews.ts    adapter — discussion velocity
src/lib/sources/github.ts        adapter — building velocity
src/lib/sources/wikipedia.ts     adapter — public curiosity (shared with demand)
src/app/api/cron/ingest-trends/  scheduled run, Bearer CRON_SECRET
src/app/trends/page.tsx          the dashboard
scripts/db/0003_trends.sql       optional persistence + history
```

Adapters are deliberately separate from scoring. An adapter's only job is to
return a `TrendObservation`: a count for the current window, a count for the
preceding window of equal length, and some evidence. It knows nothing about
weights or ranking.

---

## The scoring model

```
trendScore = 0.45·momentum + 0.20·novelty + 0.20·confidence + 0.15·velocity
             × 0.6 if only one source sees it
```

| Component | What it is | Why |
|---|---|---|
| **momentum** | growth vs the prior window, log-ratio, quality-weighted | the actual signal |
| **novelty** | share of activity that is new, squared | separates arrival from a big topic ticking up |
| **confidence** | cross-source spread + absolute volume | 3 mentions → 6 is +100% and means nothing |
| **velocity** | current volume, log-scaled | smallest weight: a level alone ranks evergreen topics |

**The corroboration gate is the load-bearing part.** A term seen by one source
is multiplied by 0.6, mirroring how `lib/demand.ts` discounts a single-class
demand signal. Cross-source confirmation is the difference between a trend and
a thread.

Growth uses a log-ratio with Laplace smoothing, so a 10× rise and a 10× fall are
symmetric and a `0 → 5` move is finite rather than infinite.

---

## Adding a source

1. Write `src/lib/sources/<name>.ts` exporting a function that returns
   `Promise<TrendObservation | null>`. Return `null` on any failure — never a
   zero, which would be a claim about the world rather than about the fetch.
2. Add the id to `TrendSourceId` in `types.ts`.
3. Add a row to `SOURCES` in `scoring.ts` with a `quality` weight and an honest
   `measures` line naming *whose* attention it counts.
4. Call it in `observeTerm()` in `engine.ts`.
5. Add a row to the seed insert in `scripts/db/0003_trends.sql`.

Follow the existing adapters' conventions: a serialised queue with a polite gap,
`AbortSignal.timeout`, and a declared User-Agent. Several public APIs reject
requests without one and report it as a bare connection failure.

### Sources evaluated and rejected

| Source | Why not |
|---|---|
| Google Trends | No free official API; values are **relative 0–100 re-normalised per request**, so two terms fetched separately are not comparable |
| X/Twitter | Paid, and expensive at any useful volume |
| TikTok | No public API for this |
| Similarweb, Sensor Tower, Crunchbase | Paid, and their licences forbid redistributing the data — fatal for a public index |

---

## Adding a term

Append to `src/data/watched-terms.ts`. That is the whole change; the next run
picks it up across every source.

Terms with a `problemSlug` connect the trend layer to the ranked index, which
lets you ask whether attention is arriving at a problem that matters. Terms
without one are the discovery path: something that keeps rising here and has no
row in the index is a candidate problem.

---

## Persistence (optional)

The board is computed live on every request, so history is the one thing live
computation cannot give you — and history is what separates a spike from a
trend.

```bash
# once DATABASE_URL is set
psql "$DATABASE_URL" -f scripts/db/0003_trends.sql
```

Tables: `trend_sources`, `trend_observations`, `trend_entities`,
`trend_aliases`, `trend_snapshots`, `trend_job_runs`, `trend_watchlists`.
Raw observations are stored unscored so the model can change and be replayed
without re-fetching.

`trend_entities` + `trend_aliases` are the clustering target: aliases point at a
canonical entity so "BCI" and "brain computer interface" score as one thing.

---

## Running it

```bash
npm run dev                      # /trends works immediately, no config
curl -H "Authorization: Bearer $CRON_SECRET" localhost:3000/api/cron/ingest-trends
```

Optional environment variables:

- `GITHUB_TOKEN` — raises GitHub search from ~10/min to 30/min
- `DATABASE_URL` — enables snapshot history
- `CRON_SECRET` — required in production for the cron route

---

## Known limits

- **No source measures "the internet."** Hacker News is a few hundred thousand
  technical people; GitHub search matches loosely across name, description and
  README and is directional at best. Each source's `measures` string states this
  in the UI rather than hiding it.
- **Niche terms return real zeros.** `gene drive` and `metascience` genuinely
  return 0 on Hacker News. That is signal, not failure.
- **English and US-skewed** across all three current sources.
- **Clustering is schema-only so far.** Entities and aliases exist in the
  database; the engine currently scores raw terms. Embedding-based merging is
  the natural next step.
