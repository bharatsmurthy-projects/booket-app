import type {
  MatchState, MatchConfig, InningsData, OverSummary,
  BallEvent, ImpactCardEffect, CardValue,
} from '../types';

// ─── Card Definitions ─────────────────────────────────────────────────────────

export const CARD_VALUES: CardValue[] = [0, 1, 2, 3, 4, 6, 'W'];

export const IMPACT_CARD_OPTIONS: ImpactCardEffect[] = [
  { type: 'runs_add',    value: 4 },
  { type: 'runs_add',    value: 6 },
  { type: 'runs_deduct', value: 4 },
  { type: 'runs_deduct', value: 6 },
  { type: 'over_double' },
  { type: 'wicket' },
];

export function impactLabel(effect: ImpactCardEffect): string {
  switch (effect.type) {
    case 'runs_add':    return `+${effect.value} Runs`;
    case 'runs_deduct': return `-${effect.value} Runs`;
    case 'over_double': return '×2 Over Score';
    case 'wicket':      return 'Wicket!';
  }
}

export function impactShort(effect: ImpactCardEffect): string {
  switch (effect.type) {
    case 'runs_add':    return effect.value === 0 ? '0' : `+${effect.value}`;
    case 'runs_deduct': return effect.value === 0 ? '0' : `-${effect.value}`;
    case 'over_double': return '×2';
    case 'wicket':      return 'W!';
  }
}

// ─── Match Factory ────────────────────────────────────────────────────────────

export function createMatch(config: MatchConfig): MatchState {
  const battingFirst =
    config.tossWinner === config.team1Name
      ? config.tossChoice === 'bat' ? config.team1Name : config.team2Name
      : config.tossChoice === 'bat' ? config.team2Name : config.team1Name;

  const bowlingFirst =
    battingFirst === config.team1Name ? config.team2Name : config.team1Name;

  return {
    id: crypto.randomUUID(),
    config,
    phase: 'innings1',
    innings1: createInnings(battingFirst, undefined, config),
    innings2: null,
    currentInnings: 1,
    battingTeam: battingFirst,
    bowlingTeam: bowlingFirst,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createInnings(
  teamName: string,
  target: number | undefined,
  config: MatchConfig,
): InningsData {
  return {
    teamName,
    target,
    overs: [],
    currentOver: createOver(1),
    totalRuns: 0,
    totalWickets: 0,
    totalBalls: 0,
    reviewsLeft: config.totalReviews,
    isComplete: false,
  };
}

function createOver(overNumber: number): OverSummary {
  return {
    overNumber,
    balls: [],
    overRuns: 0,
    wicketsInOver: 0,
    impactApplied: false,
    lastBallTwistApplied: false,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function getCurrentInnings(state: MatchState): InningsData {
  return state.currentInnings === 1 ? state.innings1 : state.innings2!;
}

export function getBallNumber(innings: InningsData): number {
  const realBalls = innings.currentOver?.balls.filter(b => !b.isImpactCard).length ?? 0;
  return realBalls + 1;
}

export function isImpactBall(innings: InningsData, config: MatchConfig): boolean {
  const over = innings.currentOver;
  if (!over || over.impactApplied) return false;
  const realBalls = over.balls.filter(b => !b.isImpactCard).length;
  return realBalls === config.impactCardAfterBall;
}

export function isLastBall(innings: InningsData, config: MatchConfig): boolean {
  const over = innings.currentOver;
  if (!over) return false;
  const realBalls = over.balls.filter(b => !b.isImpactCard).length;
  const impactDone = over.impactApplied || config.impactCardAfterBall >= 5;
  return realBalls === 5 && impactDone;
}

// ─── Apply Card Draw ──────────────────────────────────────────────────────────

export function applyCardDraw(
  state: MatchState,
  cardValue: CardValue,
  isLastBallTwist = false,
): MatchState {
  const innings = getCurrentInnings(state);
  const over    = innings.currentOver!;

  const isWicket = cardValue === 'W';
  const runs     = isWicket ? 0 : (cardValue as number);
  const realBalls = over.balls.filter(b => !b.isImpactCard).length;

  const ball: BallEvent = {
    ball: realBalls + 1,
    runs,
    isWicket,
    isImpactCard: false,
    isLastBallTwist,
    isReview: false,
    displayLabel: isWicket ? 'W' : String(runs),
    runningTotal: innings.totalRuns + runs,
  };

  return updateInningsWithBall(state, ball);
}

// ─── Apply Impact Card ────────────────────────────────────────────────────────

export function applyImpactCard(
  state: MatchState,
  effect: ImpactCardEffect,
): MatchState {
  const inningsKey = state.currentInnings === 1 ? 'innings1' : 'innings2';
  const innings    = getCurrentInnings(state);
  const over       = innings.currentOver!;

  let runsToAdd  = 0;
  let wicketLost = false;

  switch (effect.type) {
    case 'runs_add':
      runsToAdd = effect.value;
      break;
    case 'runs_deduct':
      runsToAdd = -Math.min(effect.value, innings.totalRuns);
      break;
    case 'over_double':
      runsToAdd = over.overRuns;
      break;
    case 'wicket':
      wicketLost = true;
      break;
  }

  const ball: BallEvent = {
    ball: over.balls.filter(b => !b.isImpactCard).length + 1,
    runs: runsToAdd,
    isWicket: wicketLost,
    isImpactCard: true,
    isLastBallTwist: false,
    isReview: false,
    impactEffect: effect,
    displayLabel: impactShort(effect),
    runningTotal: innings.totalRuns + runsToAdd,
  };

  const updatedOver: OverSummary = {
    ...over,
    balls:         [...over.balls, ball],
    overRuns:      over.overRuns + runsToAdd,
    wicketsInOver: over.wicketsInOver + (wicketLost ? 1 : 0),
    impactApplied: true,
  };

  const updatedInnings: InningsData = {
    ...innings,
    currentOver:   updatedOver,
    totalRuns:     Math.max(0, innings.totalRuns + runsToAdd),
    totalWickets:  innings.totalWickets + (wicketLost ? 1 : 0),
  };

  return {
    ...state,
    [inningsKey]: updatedInnings,
    updatedAt: new Date().toISOString(),
  };
}

// ─── Apply Review ─────────────────────────────────────────────────────────────

export function applyReview(
  state: MatchState,
  result: 'out' | 'not_out',
): MatchState {
  console.log('🔍 applyReview called with result:', result);
  
  const inningsKey = state.currentInnings === 1 ? 'innings1' : 'innings2';
  const innings    = getCurrentInnings(state);
  const config     = state.config;
  const over       = innings.currentOver;
  if (!over) return state;

  const balls       = [...over.balls];
  const lastBallIdx = balls.length - 1;

  let updatedOver: OverSummary;
  let updatedInnings: InningsData;

  if (result === 'not_out') {
    console.log('   ↳ NOT OUT - reversing wicket');
    balls[lastBallIdx] = {
      ...balls[lastBallIdx],
      isWicket:     false,
      runs:         0,
      isReview:     true,
      reviewResult: 'not_out',
      displayLabel: '0★',
    };
    updatedOver = {
      ...over,
      balls,
      wicketsInOver: Math.max(0, over.wicketsInOver - 1),
    };
    updatedInnings = {
      ...innings,
      currentOver:  updatedOver,
      totalWickets: Math.max(0, innings.totalWickets - 1),
      reviewsLeft:  innings.reviewsLeft - 1,
    };
  } else {
    console.log('   ↳ OUT - confirming wicket');
    balls[lastBallIdx] = {
      ...balls[lastBallIdx],
      isReview:     true,
      reviewResult: 'out',
      displayLabel: 'W✓',
    };
    updatedOver = { ...over, balls };
    updatedInnings = {
      ...innings,
      currentOver: updatedOver,
      reviewsLeft: innings.reviewsLeft - 1,
    };
  }

  // Check if innings is complete after review
  const realBallsInOver = updatedOver.balls.filter(b => !b.isImpactCard).length;
  const overComplete    = realBallsInOver >= 6;
  
  const outOfWickets   = updatedInnings.totalWickets >= config.totalWickets;
  const completedOvers = innings.overs.length + (overComplete ? 1 : 0);
  const outOfOvers     = completedOvers >= config.totalOvers;
  const targetChased   = innings.target !== undefined && updatedInnings.totalRuns > innings.target;
  
  // Innings complete if out of wickets, overs, or target chased
  // Review result doesn't matter - if overs are done, innings ends
  const inningsComplete = outOfWickets || outOfOvers || targetChased;

  console.log('   ↳ After review check:', {
    totalWickets: updatedInnings.totalWickets,
    outOfWickets,
    outOfOvers,
    targetChased,
    result,
    inningsComplete,
  });

  // Seal over if complete
  if (overComplete) {
    updatedInnings = {
      ...updatedInnings,
      overs: [...updatedInnings.overs, updatedOver],
      currentOver: inningsComplete ? null : createOver(updatedInnings.overs.length + 1),
    };
  }

  updatedInnings = { ...updatedInnings, isComplete: inningsComplete };

  let newState = {
    ...state,
    [inningsKey]: updatedInnings,
    updatedAt:    new Date().toISOString(),
  };

  if (inningsComplete) {
    console.log('   ↳ Innings complete after review, calling advancePhase');
    newState = advancePhase(newState, updatedInnings);
  }

  return newState;
}

// ─── Internal: update innings with a ball ─────────────────────────────────────

function updateInningsWithBall(state: MatchState, ball: BallEvent): MatchState {
  const config     = state.config;
  const inningsKey = state.currentInnings === 1 ? 'innings1' : 'innings2';
  const innings    = getCurrentInnings(state);
  const over       = innings.currentOver!;

  const updatedOver: OverSummary = {
    ...over,
    balls:         [...over.balls, ball],
    overRuns:      over.overRuns + ball.runs,
    wicketsInOver: over.wicketsInOver + (ball.isWicket ? 1 : 0),
  };

  const newTotalRuns     = Math.max(0, innings.totalRuns + ball.runs);
  const newTotalWickets  = innings.totalWickets + (ball.isWicket ? 1 : 0);
  const newTotalBalls    = innings.totalBalls + (ball.isImpactCard ? 0 : 1);

  const realBallsInOver = updatedOver.balls.filter(b => !b.isImpactCard).length;
  const overComplete    = realBallsInOver >= 6;

  const outOfWickets  = newTotalWickets >= config.totalWickets;
  const completedOvers = innings.overs.length + (overComplete ? 1 : 0);
  const outOfOvers    = completedOvers >= config.totalOvers;
  const targetChased  = innings.target !== undefined && newTotalRuns >= innings.target;
  
  // Check if review is pending
  const reviewsAvailable = innings.reviewsLeft > 0;
  const reviewPending    = ball.isWicket && reviewsAvailable;

  const wouldBeComplete = outOfWickets || outOfOvers || targetChased;
  const inningsComplete = wouldBeComplete && !reviewPending;

  console.log('🎯 updateInningsWithBall:', {
    ballIsWicket: ball.isWicket,
    newTotalWickets,
    reviewsAvailable,
    reviewPending,
    wouldBeComplete,
    inningsComplete,
    phase: state.phase,
  });

  let updatedInnings: InningsData = {
    ...innings,
    totalRuns:    newTotalRuns,
    totalWickets: newTotalWickets,
    totalBalls:   newTotalBalls,
    isComplete:   inningsComplete,
    currentOver:  overComplete ? null : updatedOver,
    overs:        overComplete ? [...innings.overs, updatedOver] : innings.overs,
  };

  if (overComplete && !inningsComplete) {
    updatedInnings = {
      ...updatedInnings,
      currentOver: createOver(updatedInnings.overs.length + 1),
    };
  }

  let newState: MatchState = {
    ...state,
    [inningsKey]: updatedInnings,
    updatedAt:    new Date().toISOString(),
  };

  if (inningsComplete) {
    console.log('   ↳ Innings complete, calling advancePhase');
    newState = advancePhase(newState, updatedInnings);
  } else if (reviewPending) {
    console.log('   ↳ Review pending, NOT advancing phase yet');
  }

  return newState;
}

// ─── Phase transitions ────────────────────────────────────────────────────────

function advancePhase(state: MatchState, completedInnings: InningsData): MatchState {
  console.log('⏭️  advancePhase called, currentInnings:', state.currentInnings);
  
  if (state.currentInnings === 1) {
    const target      = completedInnings.totalRuns + 1;
    const battingTeam = state.bowlingTeam;
    const bowlingTeam = state.battingTeam;
    console.log('   ↳ Creating innings2, target:', target);
    return {
      ...state,
      phase:          'innings2',
      innings2:        createInnings(battingTeam, target, state.config),
      currentInnings:  2,
      battingTeam,
      bowlingTeam,
    };
  } else {
    const inn1   = state.innings1;
    const inn2   = state.innings2!;
    let winner   = '';
    if (inn2.totalRuns > inn1.totalRuns) {
      const wkLeft = state.config.totalWickets - inn2.totalWickets;
      winner = `${inn2.teamName} won by ${wkLeft} wicket${wkLeft !== 1 ? 's' : ''}`;
    } else if (inn1.totalRuns > inn2.totalRuns) {
      const diff = inn1.totalRuns - inn2.totalRuns;
      winner = `${inn1.teamName} won by ${diff} run${diff !== 1 ? 's' : ''}`;
    } else {
      winner = 'Match Tied!';
    }
    console.log('   ↳ Match complete, winner:', winner);
    return {
      ...state,
      phase:   'result',
      innings2: { ...inn2, wonBy: winner },
    };
  }
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export function getRequiredRunRate(innings: InningsData, config: MatchConfig): number {
  if (!innings.target) return 0;
  const runsNeeded = innings.target - innings.totalRuns;
  const ballsLeft  = config.totalOvers * 6 - innings.totalBalls;
  if (ballsLeft <= 0) return 0;
  return runsNeeded / (ballsLeft / 6);
}

export function getRunsNeeded(innings: InningsData): number {
  if (!innings.target) return 0;
  return Math.max(0, innings.target - innings.totalRuns);
}

export function matchResultText(state: MatchState): string {
  return state.innings2?.wonBy ?? '';
}
