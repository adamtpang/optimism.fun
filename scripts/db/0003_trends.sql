-- Trend engine persistence.
--
-- Everything in lib/trends runs WITHOUT this schema — the board is computed
-- live from the source APIs on each request. This adds what live computation
-- cannot give you: history. Snapshots are what turn "rising today" into
-- "rising for six weeks", which is the difference between a spike and a trend.
--
-- Idempotent. Safe to re-run.

create extension if not exists "pgcrypto";

-- ── sources ───────────────────────────────────────────────────────────────
-- One row per adapter. `quality` mirrors lib/trends/scoring.ts SOURCES so the
-- weighting is inspectable in SQL, not only in code.
create table if not exists trend_sources (
  id            text primary key,           -- 'hackernews' | 'github' | 'wikipedia'
  name          text not null,
  quality       numeric not null default 0.5,
  measures      text not null,              -- whose attention this actually counts
  url           text,
  enabled       boolean not null default true,
  last_ok_at    timestamptz,
  last_error    text,
  created_at    timestamptz not null default now()
);

-- ── raw observations ──────────────────────────────────────────────────────
-- One row per (term, source, ingest run). Kept raw so scoring can be changed
-- and replayed without re-fetching.
create table if not exists trend_observations (
  id            uuid primary key default gen_random_uuid(),
  term          text not null,
  source_id     text not null references trend_sources(id),
  current_count integer not null,
  prior_count   integer not null,
  window_days   integer not null,
  evidence      jsonb not null default '[]'::jsonb,
  source_url    text,
  observed_at   timestamptz not null default now()
);

create index if not exists idx_trend_obs_term_time
  on trend_observations (term, observed_at desc);
create index if not exists idx_trend_obs_source_time
  on trend_observations (source_id, observed_at desc);

-- ── canonical entities + aliases ──────────────────────────────────────────
-- Clustering target. A term becomes an entity; synonyms and hashtags become
-- aliases pointing at it, so "BCI" and "brain computer interface" score as one.
create table if not exists trend_entities (
  id            uuid primary key default gen_random_uuid(),
  canonical     text unique not null,
  category      text not null,
  problem_slug  text,                        -- optional link to a ranked problem
  first_seen_at timestamptz not null default now(),
  peak_at       timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists trend_aliases (
  alias      text primary key,
  entity_id  uuid not null references trend_entities(id) on delete cascade
);

create index if not exists idx_trend_aliases_entity on trend_aliases (entity_id);
create index if not exists idx_trend_entities_category on trend_entities (category);

-- ── scores over time ──────────────────────────────────────────────────────
-- The time series the dashboard charts. One row per entity per scoring run.
create table if not exists trend_snapshots (
  id               uuid primary key default gen_random_uuid(),
  entity_id        uuid not null references trend_entities(id) on delete cascade,
  trend_score      integer not null,
  momentum_score   integer not null,
  velocity_score   integer not null,
  novelty_score    integer not null,
  confidence_score integer not null,
  source_count     integer not null,
  current_total    integer not null,
  prior_total      integer not null,
  state            text not null,            -- rising | cooling | steady | quiet
  captured_at      timestamptz not null default now()
);

create index if not exists idx_trend_snapshots_entity_time
  on trend_snapshots (entity_id, captured_at desc);
create index if not exists idx_trend_snapshots_time_score
  on trend_snapshots (captured_at desc, trend_score desc);

-- ── job health ────────────────────────────────────────────────────────────
create table if not exists trend_job_runs (
  id           uuid primary key default gen_random_uuid(),
  job          text not null,                -- 'ingest' | 'score' | 'cleanup'
  status       text not null,                -- 'ok' | 'partial' | 'failed'
  attempted    integer not null default 0,
  resolved     integer not null default 0,
  duration_ms  integer,
  error        text,
  started_at   timestamptz not null default now(),
  finished_at  timestamptz
);

create index if not exists idx_trend_job_runs_job_time
  on trend_job_runs (job, started_at desc);

-- ── watchlist ─────────────────────────────────────────────────────────────
create table if not exists trend_watchlists (
  id         uuid primary key default gen_random_uuid(),
  owner      text not null,                  -- email or player id
  entity_id  uuid not null references trend_entities(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (owner, entity_id)
);

-- Seed the three adapters that need no API key.
insert into trend_sources (id, name, quality, measures, url) values
  ('hackernews', 'Hacker News', 0.80,
   'what a technical, US-skewed, early-adopter community is discussing',
   'https://news.ycombinator.com'),
  ('github', 'GitHub', 0.75,
   'what developers are actually building, not just talking about',
   'https://github.com'),
  ('wikipedia', 'Wikipedia', 0.90,
   'broad public curiosity - the least gameable of the three',
   'https://wikipedia.org')
on conflict (id) do nothing;
