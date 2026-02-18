export type CardValue = 0 | 1 | 2 | 3 | 4 | 6 | 'W';

export type ImpactCardEffect =
  | { type: 'runs_add'; value: number }
  | { type: 'runs_deduct'; value: number }
  | { type: 'over_double' }
  | { type: 'wicket' };

export interface BallEvent {
  ball: number; // 1-6
  runs: number; // actual runs scored (0 if wicket)
  isWicket: boolean;
  isImpactCard: boolean;
  isLastBallTwist: boolean;
  isReview: boolean;
  reviewResult?: 'out' | 'not_out';
  impactEffect?: ImpactCardEffect;
  displayLabel: string; // e.g. "4", "W", "IC+6", "LB-4"
  runningTotal: number;
}

export interface OverSummary {
  overNumber: number; // 1-indexed
  balls: BallEvent[];
  overRuns: number;
  wicketsInOver: number;
  impactApplied: boolean;
  impactEffect?: ImpactCardEffect;
  lastBallTwistApplied: boolean;
}

export interface InningsData {
  teamName: string;
  target?: number; // only for 2nd innings
  overs: OverSummary[];
  currentOver: OverSummary | null;
  totalRuns: number;
  totalWickets: number;
  totalBalls: number;
  reviewsLeft: number;
  isComplete: boolean;
  wonBy?: string;
}

export interface MatchConfig {
  team1Name: string;
  team2Name: string;
  totalOvers: number;       // default 5
  totalWickets: number;     // default 3
  totalReviews: number;     // default 3
  impactCardAfterBall: number; // default 3
  tossWinner: string;
  tossChoice: 'bat' | 'bowl';
  date: string;
}

export type MatchPhase =
  | 'setup'
  | 'toss'
  | 'innings1'
  | 'innings2'
  | 'result';

export interface MatchState {
  id: string;
  config: MatchConfig;
  phase: MatchPhase;
  innings1: InningsData;
  innings2: InningsData | null;
  currentInnings: 1 | 2;
  battingTeam: string;
  bowlingTeam: string;
  createdAt: string;
  updatedAt: string;
}

// UI State for active scoring
export interface ScoringState {
  awaitingCard: boolean;
  awaitingImpactCard: boolean;
  awaitingLastBallTwist: boolean;
  awaitingReview: boolean;
  lastEvent: BallEvent | null;
  showOverSummary: boolean;
  showAnimation: AnimationType | null;
}

export type AnimationType = 'four' | 'six' | 'wicket' | 'impact' | 'over';
