-- Approval-gated social publishing queue for infographic artifacts.
-- Run after 0001_problem_candidates.sql. Idempotent and safe to re-run.

create extension if not exists "pgcrypto";

create table if not exists social_posts (
  id                uuid primary key default gen_random_uuid(),
  brief_slug        text not null,
  platform          text not null check (platform in ('x', 'instagram')),
  body              text not null,
  asset_url         text,
  x_media_id        text,
  status            text not null default 'draft'
                    check (status in ('draft', 'approved', 'published', 'failed')),
  approved_at       timestamptz,
  published_at      timestamptz,
  provider_post_id  text,
  provider_response jsonb,
  last_error        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (brief_slug, platform)
);

alter table social_posts add column if not exists x_media_id text;

create index if not exists idx_social_posts_status_created
  on social_posts (status, created_at desc);

create or replace function social_posts_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists social_posts_updated_at on social_posts;
create trigger social_posts_updated_at
  before update on social_posts
  for each row execute function social_posts_set_updated_at();

