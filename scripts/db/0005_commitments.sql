-- The coordination layer: one structured record per real action taken on a problem.
--
-- This is the only user-generated table on the site, and the only dataset here
-- that is genuinely live rather than curated. Everything else is a research
-- ledger with sourced numbers; this is the board. Keeping them visibly separate
-- is the point: research rows carry a confidence tag, commitment rows carry
-- "user-submitted" plus a review status, and the UI never blends the two.
--
-- Run after 0004_social_posts.sql. Idempotent and safe to re-run.

create extension if not exists "pgcrypto";

create table if not exists commitments (
  id                uuid primary key default gen_random_uuid(),

  -- What this commitment attaches to. problem_slug is the join key for the
  -- whole board; company_slug is set only for join/hire/raise intents.
  problem_slug      text not null,
  company_slug      text,

  -- Who is acting and what they are committing to do.
  actor_type        text not null
                    check (actor_type in ('talent', 'capital', 'operator')),
  intent            text not null
                    check (intent in ('start', 'join', 'contribute', 'fund', 'hire', 'raise')),

  -- Identity. email is never rendered publicly; name is only rendered when
  -- visibility = 'public'.
  name              text not null,
  email             text not null,
  url               text,

  -- The anti-spam field that carries the actual signal: what you have already
  -- done, the assumption you will test, or the correction you are proposing.
  proof             text not null,

  -- Talent-join and operator-hire only. The Join flow asks for a role type,
  -- so it gets a column rather than being smuggled into free text: the whole
  -- premise of this table is that a commitment is a structured record.
  role_type         text
                    check (role_type is null or role_type in
                      ('engineering', 'research', 'operations', 'design', 'gtm', 'policy', 'other')),

  -- Capital-only. Band rather than exact figure so an allocator can signal
  -- without disclosing a position.
  check_size_band   text
                    check (check_size_band is null or check_size_band in
                      ('<25k', '25k-100k', '100k-500k', '500k-2m', '2m-10m', '10m+')),
  stage             text
                    check (stage is null or stage in
                      ('pre-seed', 'seed', 'series-a', 'series-b+', 'grant', 'non-dilutive')),

  -- 'anon' still renders on the board, just without the name or url. An
  -- allocator can show a band and a thesis while staying unnamed.
  visibility        text not null default 'public'
                    check (visibility in ('public', 'anon')),

  -- Lifecycle. Email confirmation and human review are deliberately separate
  -- gates: confirming proves the address is real, approving proves a human
  -- read it. Both must pass before anything is public.
  --   pending   submitted, not public
  --   approved  a human approved it; renders on the public board
  --   listed    approved AND cleared for the outbound weekly digest
  --   rejected  declined; never public, never re-enters the queue
  status            text not null default 'pending'
                    check (status in ('pending', 'approved', 'listed', 'rejected')),

  confirm_token     text unique,
  confirmed_at      timestamptz,
  reviewed_at       timestamptz,
  review_note       text,

  -- Optional: submitter asked to be introduced. Intros are brokered by hand.
  wants_intro       boolean not null default false,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- The board query: approved/listed commitments for one problem, newest first.
create index if not exists idx_commitments_problem_status
  on commitments (problem_slug, status, created_at desc);

-- The company-level join count on problem pages.
create index if not exists idx_commitments_company_status
  on commitments (company_slug, status)
  where company_slug is not null;

-- The review queue and the homepage ticker.
create index if not exists idx_commitments_status_created
  on commitments (status, created_at desc);

-- Rate-limit lookups: how many times has this address submitted recently.
create index if not exists idx_commitments_email_created
  on commitments (email, created_at desc);

create or replace function commitments_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists commitments_updated_at on commitments;
create trigger commitments_updated_at
  before update on commitments
  for each row execute function commitments_set_updated_at();
