-- ═══════════════════════════════════════════════════════════
-- BOOKET — Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the DB
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── Matches table ─────────────────────────────────────────────
-- Stores the full match state as JSONB for flexibility
-- This allows the game engine to evolve without migrations

create table if not exists public.matches (
  id            uuid primary key default gen_random_uuid(),
  config        jsonb not null,         -- MatchConfig object
  phase         text not null,          -- 'setup' | 'innings1' | 'innings2' | 'result'
  innings1      jsonb not null,         -- InningsData object
  innings2      jsonb,                  -- InningsData object (null until 2nd innings)
  current_innings integer not null default 1,
  batting_team  text not null,
  bowling_team  text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index for fast recent-matches queries
create index if not exists matches_created_at_idx
  on public.matches (created_at desc);

-- Index for phase filtering (live vs completed)
create index if not exists matches_phase_idx
  on public.matches (phase);

-- Auto-update updated_at on row change
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger matches_updated_at
  before update on public.matches
  for each row execute function public.update_updated_at();

-- ── Row Level Security ─────────────────────────────────────────
-- For MVP: allow all access (no auth yet)
-- Phase 2: lock to authenticated users

alter table public.matches enable row level security;

-- Allow all for MVP (guest scoring)
create policy "Allow all for MVP"
  on public.matches
  for all
  using (true)
  with check (true);

-- ── Views ──────────────────────────────────────────────────────

-- Recent completed matches view (for result browsing)
create or replace view public.completed_matches as
select
  id,
  config->>'team1Name' as team1,
  config->>'team2Name' as team2,
  config->>'totalOvers' as overs,
  (innings1->>'totalRuns')::int as innings1_runs,
  (innings1->>'totalWickets')::int as innings1_wickets,
  (innings2->>'totalRuns')::int as innings2_runs,
  (innings2->>'totalWickets')::int as innings2_wickets,
  innings2->>'wonBy' as result,
  created_at
from public.matches
where phase = 'result'
order by created_at desc;

-- ── Sample data (optional, for testing) ───────────────────────
-- Uncomment to insert a test match:

/*
insert into public.matches (config, phase, innings1, innings2, current_innings, batting_team, bowling_team)
values (
  '{"team1Name":"Blasters","team2Name":"Strikers","totalOvers":5,"totalWickets":3,"totalReviews":3,"impactCardAfterBall":3,"tossWinner":"Blasters","tossChoice":"bat"}',
  'result',
  '{"teamName":"Blasters","totalRuns":42,"totalWickets":2,"totalBalls":30,"reviewsLeft":2,"isComplete":true,"overs":[]}',
  '{"teamName":"Strikers","totalRuns":38,"totalWickets":3,"totalBalls":28,"reviewsLeft":1,"isComplete":true,"target":43,"wonBy":"Blasters won by 4 runs","overs":[]}',
  2,
  'Strikers',
  'Blasters'
);
*/
