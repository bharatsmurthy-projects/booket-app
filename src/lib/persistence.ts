import { getSupabase } from './supabase';
import type { MatchState } from '../types';

const STORAGE_KEY = 'booket_matches';

// ─── Local Storage Fallback ───────────────────────────────────────────────────

function localSave(match: MatchState): void {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const idx = existing.findIndex((m: MatchState) => m.id === match.id);
    if (idx >= 0) existing[idx] = match;
    else existing.unshift(match);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch (e) {
    console.warn('localStorage save failed', e);
  }
}

function localLoad(): MatchState[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function localGet(id: string): MatchState | null {
  return localLoad().find(m => m.id === id) ?? null;
}

// ─── Supabase Operations ──────────────────────────────────────────────────────

export async function saveMatch(match: MatchState): Promise<void> {
  // Always save locally first
  localSave(match);

  const supabase = await getSupabase();
  if (!supabase) return;

  const { error } = await supabase
    .from('matches')
    .upsert({
      id: match.id,
      config: match.config,
      phase: match.phase,
      innings1: match.innings1,
      innings2: match.innings2,
      current_innings: match.currentInnings,
      batting_team: match.battingTeam,
      bowling_team: match.bowlingTeam,
      created_at: match.createdAt,
      updated_at: match.updatedAt,
    });

  if (error) {
    console.warn('Supabase save failed, using local storage:', error.message);
  }
}

export async function loadMatches(): Promise<MatchState[]> {
  const supabase = await getSupabase();
  if (!supabase) return localLoad();

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) return localLoad();

  return data.map((row: any): MatchState => ({
    id: row.id,
    config: row.config,
    phase: row.phase,
    innings1: row.innings1,
    innings2: row.innings2,
    currentInnings: row.current_innings,
    battingTeam: row.batting_team,
    bowlingTeam: row.bowling_team,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function loadMatch(id: string): Promise<MatchState | null> {
  const supabase = await getSupabase();
  if (!supabase) return localGet(id);

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return localGet(id);

  return {
    id: data.id,
    config: data.config,
    phase: data.phase,
    innings1: data.innings1,
    innings2: data.innings2,
    currentInnings: data.current_innings,
    battingTeam: data.batting_team,
    bowlingTeam: data.bowling_team,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export function getCurrentMatchId(): string | null {
  return localStorage.getItem('booket_current_match');
}

export function setCurrentMatchId(id: string | null): void {
  if (id) localStorage.setItem('booket_current_match', id);
  else localStorage.removeItem('booket_current_match');
}
