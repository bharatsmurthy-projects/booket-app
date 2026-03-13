/**
 * Team Name Display Utilities
 * Handles consistent truncation across the app
 */

export interface TruncateOptions {
  /** Maximum characters before truncation */
  maxLength: number;
  /** Show ellipsis when truncated */
  ellipsis?: boolean;
}

/**
 * Truncate team name for display
 */
export function truncateTeamName(name: string, maxLength: number): string {
  if (!name) return '';
  const trimmed = name.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.substring(0, maxLength) + '...';
}

/**
 * Display limits for different contexts
 */
export const TEAM_NAME_LIMITS = {
  /** Maximum characters user can enter */
  INPUT_MAX: 30,
  
  /** Display in toss buttons (compact) */
  TOSS_BUTTON: 12,
  
  /** Display in match setup preview */
  SETUP_PREVIEW: 20,
  
  /** Display in scoring header (full width available) */
  SCORING_HEADER: 25,
  
  /** Display in over summary panel */
  OVER_SUMMARY: 15,
  
  /** Display in result screen innings cards */
  RESULT_INNINGS: 18,
  
  /** Display in result screen winner banner */
  RESULT_BANNER: 20,
  
  /** Display in share/copy text (full name) */
  SHARE_TEXT: 30,
} as const;

/**
 * Get appropriate truncation for context
 */
export function getDisplayName(name: string, context: keyof typeof TEAM_NAME_LIMITS): string {
  const limit = TEAM_NAME_LIMITS[context];
  return truncateTeamName(name, limit);
}
