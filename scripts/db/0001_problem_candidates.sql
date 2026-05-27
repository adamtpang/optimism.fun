-- Run this once in Neon (or any Postgres) to create the problem_candidates
-- table. The daily problem-sourcing cron upserts into it; the /admin/candidates
-- UI lets a human promote candidates into src/data/problems.ts (still gated by
-- hand-curation — this table is the inbox, not the source of truth).
--
-- Idempotent. Safe to re-run.

create extension if not exists "pgcrypto";

create table if not exists problem_candidates (
  id                       uuid primary key default gen_random_uuid(),
  slug                     text unique not null,
  name                     text not null,
  tier                     text not null,
  tagline                  text not null,
  description              text not null,
  humans_affected          bigint,
  severity                 numeric,
  market_size              bigint,
  current_solution_quality numeric,
  welfare_bcr              numeric,
  xrisk_itn                numeric,
  utility_delta            numeric,
  transformation           jsonb,
  sources                  jsonb not null default '[]'::jsonb,
  signal_url               text,
  signal_title             text,
  signal_published_at      timestamptz,
  rationale                text,
  status                   text not null default 'draft',
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists idx_problem_candidates_status_created
  on problem_candidates (status, created_at desc);

create or replace function problem_candidates_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists problem_candidates_updated_at on problem_candidates;
create trigger problem_candidates_updated_at
  before update on problem_candidates
  for each row execute function problem_candidates_set_updated_at();
