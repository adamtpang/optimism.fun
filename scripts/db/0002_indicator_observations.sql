-- 0002_indicator_observations.sql
-- Live indicator observations (World Bank WDI today; more sources later).
-- One row per (indicator, country, year). The refresh-indicators cron upserts
-- here daily; /api/indicators and server components read from here. Already
-- applied to the optimism.fun Neon project; safe to re-run (IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS indicator_observations (
  id                  BIGSERIAL PRIMARY KEY,
  source_id           TEXT NOT NULL,
  indicator           TEXT NOT NULL,
  problem_slug        TEXT NOT NULL,
  country_iso3        TEXT NOT NULL,
  year                INTEGER NOT NULL,
  value               DOUBLE PRECISION NOT NULL,
  source_last_updated DATE,
  fetched_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT indicator_observations_uniq UNIQUE (indicator, country_iso3, year)
);

CREATE INDEX IF NOT EXISTS idx_indicator_obs_problem
  ON indicator_observations (problem_slug, year DESC);
