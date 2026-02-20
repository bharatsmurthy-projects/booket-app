import React, { useState, useEffect, useRef } from 'react';
import type { MatchState, ImpactCardEffect, AnimationType } from '../types';
import {
  getCurrentInnings, getBallNumber, isImpactBall, isLastBall,
  applyCardDraw, applyImpactCard, applyReview,
  CARD_VALUES, IMPACT_CARD_OPTIONS, impactLabel,
} from '../lib/gameEngine';
import { saveMatch } from '../lib/persistence';
import OverSummaryPanel   from '../components/OverSummaryPanel';
import ScoreHeader        from '../components/ScoreHeader';
import BallTracker        from '../components/BallTracker';
import AnimationOverlay   from '../components/AnimationOverlay';
import InningsSplash      from '../components/InningsSplash';
import MatchInfoModal     from '../components/MatchInfoModal';

interface Props {
  match: MatchState;
  onMatchUpdate: (m: MatchState) => void;
  onMatchEnd: (m: MatchState) => void;
}

type ScoringMode = 'normal' | 'impact' | 'lastball' | 'review' | 'over_summary' | 'innings_splash';

export default function ScoringScreen({ match, onMatchUpdate, onMatchEnd }: Props) {
  const [mode,           setMode]           = useState<ScoringMode>('normal');
  const [animation,      setAnimation]      = useState<AnimationType | null>(null);
  const [pendingWicket,  setPendingWicket]  = useState(false);
  const [customImpact,   setCustomImpact]   = useState('');
  const [showInfo,       setShowInfo]       = useState(false);
  const [splashShown,    setSplashShown]    = useState(false);
  const customInputRef = useRef<HTMLInputElement>(null);

  const innings       = getCurrentInnings(match);
  const config        = match.config;
  const ballNum       = getBallNumber(innings);
  const needsImpact   = isImpactBall(innings, config);
  const needsLastBall = isLastBall(innings, config);

  useEffect(() => {
    // Priority 1: Block everything if wicket under review
    if (pendingWicket) {
      if (mode !== 'review') setMode('review');
      return;
    }

    // Priority 2: Check for innings splash
    if (
      match.phase === 'innings2' &&
      match.innings2 &&
      match.innings2.totalBalls === 0 &&
      match.innings2.overs.length === 0 &&
      !splashShown
    ) {
      console.log('✅ Showing innings splash');
      setSplashShown(true);
      setMode('innings_splash');
      return;
    }

    // Priority 3: Match complete
    if (match.phase === 'result') {
      onMatchEnd(match);
      return;
    }

    // Priority 4: Impact card
    if (needsImpact) {
      if (mode !== 'impact') setMode('impact');
      return;
    }

    // Priority 5: Last ball
    if (needsLastBall) {
      if (mode !== 'lastball') setMode('lastball');
      return;
    }

    // Stay in modal modes until dismissed
    if (mode === 'review' || mode === 'over_summary' || mode === 'innings_splash') {
      return;
    }

    // Default to normal
    if (mode !== 'normal' && !needsImpact && !needsLastBall && !pendingWicket) {
      setMode('normal');
    }
  }, [match, pendingWicket, needsImpact, needsLastBall, splashShown, mode]);

  function triggerAnimation(anim: AnimationType) {
    setAnimation(anim);
    setTimeout(() => setAnimation(null), 1800);
  }

  function afterBall(newMatch: MatchState, wasWicket: boolean) {
    const newInnings = getCurrentInnings(newMatch);
    
    if (wasWicket && newInnings.reviewsLeft > 0) {
      setPendingWicket(true);
      saveMatch(newMatch);
      onMatchUpdate(newMatch);
      return;
    }
    
    setPendingWicket(false);
    checkOverOrInningsComplete(newMatch, newInnings);
    saveMatch(newMatch);
    onMatchUpdate(newMatch);
  }

  function handleCardTap(value: typeof CARD_VALUES[number], isLastBallTwist = false) {
    const newMatch = applyCardDraw(match, value, isLastBallTwist);
    if (value === 'W') triggerAnimation('wicket');
    else if (value === 6) triggerAnimation('six');
    else if (value === 4) triggerAnimation('four');
    afterBall(newMatch, value === 'W');
  }

  function handleImpactCard(effect: ImpactCardEffect) {
    const newMatch = applyImpactCard(match, effect);
    triggerAnimation('impact');
    setMode('normal');
    const newInnings = getCurrentInnings(newMatch);
    
    if (effect.type === 'wicket' && newInnings.reviewsLeft > 0) {
      setPendingWicket(true);
      saveMatch(newMatch);
      onMatchUpdate(newMatch);
      return;
    }
    
    checkOverOrInningsComplete(newMatch, newInnings);
    saveMatch(newMatch);
    onMatchUpdate(newMatch);
  }

  function handleCustomImpact() {
    const raw = customImpact.trim();
    if (!raw) return;
    const num = parseInt(raw.replace(/[^-\d]/g, ''), 10);
    if (isNaN(num)) return;
    const effect: ImpactCardEffect = num >= 0
      ? { type: 'runs_add',    value: Math.abs(num) }
      : { type: 'runs_deduct', value: Math.abs(num) };
    setCustomImpact('');
    handleImpactCard(effect);
  }

  function handleReview(result: 'out' | 'not_out') {
    const newMatch = applyReview(match, result);
    setPendingWicket(false);
    
    // applyReview already handles advancePhase if needed
    // Just save and update, then let useEffect handle mode changes
    saveMatch(newMatch);
    onMatchUpdate(newMatch);
    
    // Check for over summary (but NOT innings completion - that's in useEffect)
    const newInnings = getCurrentInnings(newMatch);
    if (!newInnings.currentOver && !newInnings.isComplete) {
      triggerAnimation('over');
      setMode('over_summary');
    } else {
      setMode('normal');
    }
  }

  function handleAcceptOut() {
    // User skipped review - wicket is final and already recorded
    // The issue: when the wicket was recorded, reviewPending=true blocked innings completion
    // AND a new over was created. We need to manually fix the match state.
    
    const currentInnings = getCurrentInnings(match);
    const config = match.config;
    
    // Check if innings SHOULD be complete with this wicket
    const outOfWickets = currentInnings.totalWickets >= config.totalWickets;
    const outOfOvers = currentInnings.overs.length >= config.totalOvers;
    const targetChased = currentInnings.target !== undefined && currentInnings.totalRuns > currentInnings.target;
    const shouldBeComplete = outOfWickets || outOfOvers || targetChased;
    
    console.log('🔴 Accept Out - checking completion:', {
      totalWickets: currentInnings.totalWickets,
      maxWickets: config.totalWickets,
      outOfWickets,
      outOfOvers,
      shouldBeComplete
    });
    
    if (shouldBeComplete && !currentInnings.isComplete) {
      // Manually mark innings as complete and trigger phase advancement
      const inningsKey = match.currentInnings === 1 ? 'innings1' : 'innings2';
      const completedInnings = {
        ...currentInnings,
        isComplete: true,
        currentOver: null, // Clear the incorrectly created new over
      };
      
      // Advance phase manually since engine didn't do it
      let updatedMatch = { ...match, [inningsKey]: completedInnings };
      
      if (match.currentInnings === 1) {
        // Create innings 2
        const target = completedInnings.totalRuns + 1;
        const battingTeam = match.bowlingTeam;
        const bowlingTeam = match.battingTeam;
        updatedMatch = {
          ...updatedMatch,
          phase: 'innings2' as const,
          innings2: {
            teamName: battingTeam,
            target,
            overs: [],
            currentOver: { overNumber: 1, balls: [], overRuns: 0, wicketsInOver: 0, impactApplied: false, lastBallTwistApplied: false },
            totalRuns: 0,
            totalWickets: 0,
            totalBalls: 0,
            reviewsLeft: config.totalReviews,
            isComplete: false,
          },
          currentInnings: 2,
          battingTeam,
          bowlingTeam,
        };
      } else {
        // Match complete
        const inn1 = updatedMatch.innings1;
        const inn2 = completedInnings;
        let winner = '';
        if (inn2.totalRuns > inn1.totalRuns) {
          const wkLeft = config.totalWickets - inn2.totalWickets;
          winner = `${inn2.teamName} won by ${wkLeft} wicket${wkLeft !== 1 ? 's' : ''}`;
        } else if (inn1.totalRuns > inn2.totalRuns) {
          const diff = inn1.totalRuns - inn2.totalRuns;
          winner = `${inn1.teamName} won by ${diff} run${diff !== 1 ? 's' : ''}`;
        } else {
          winner = 'Match Tied!';
        }
        updatedMatch = {
          ...updatedMatch,
          phase: 'result' as const,
          innings2: { ...inn2, wonBy: winner },
        };
      }
      
      saveMatch(updatedMatch);
      onMatchUpdate(updatedMatch);
    }
    
    setPendingWicket(false);
    setMode('normal');
  }

  function checkOverOrInningsComplete(m: MatchState, inn: typeof innings) {
    if (!inn.currentOver && !inn.isComplete) {
      triggerAnimation('over');
      setMode('over_summary');
    }
    // innings/match completion handled by useEffect watching match.phase
  }

  const lastOver = innings.overs.length > 0 ? innings.overs[innings.overs.length - 1] : null;
  const isChasing   = match.currentInnings === 2;
  const runsNeeded  = isChasing && innings.target ? Math.max(0, innings.target - innings.totalRuns) : 0;
  const ballsLeft   = isChasing ? config.totalOvers * 6 - innings.totalBalls : 0;
  const wicketsLeft = isChasing ? config.totalWickets - innings.totalWickets : 0;

  return (
    <div className="scoring-screen">
      <AnimationOverlay type={animation} />

      {showInfo && <MatchInfoModal match={match} onClose={() => setShowInfo(false)} />}

      {mode === 'innings_splash' && (
        <InningsSplash match={match} onDismiss={() => setMode('normal')} />
      )}

      <ScoreHeader match={match} innings={innings} onInfoClick={() => setShowInfo(true)} />

      {isChasing && (
        <div className="chase-bar">
          <div className="chase-item">
            <span className="chase-value">{runsNeeded}</span>
            <span className="chase-label">Need</span>
          </div>
          <div className="chase-divider" />
          <div className="chase-item">
            <span className="chase-value">{ballsLeft}</span>
            <span className="chase-label">Balls</span>
          </div>
          <div className="chase-divider" />
          <div className="chase-item">
            <span className="chase-value">{wicketsLeft}</span>
            <span className="chase-label">Wickets</span>
          </div>
          <div className="chase-divider" />
          <div className="chase-item">
            <span className="chase-value rrr-val">
              {ballsLeft > 0 ? (runsNeeded / (ballsLeft / 6)).toFixed(1) : '—'}
            </span>
            <span className="chase-label">RRR</span>
          </div>
        </div>
      )}

      {mode === 'over_summary' && lastOver && (
        <OverSummaryPanel over={lastOver} innings={innings} onDismiss={() => setMode('normal')} />
      )}

      <BallTracker innings={innings} config={config} />

      <div className="scoring-panel">

        {mode === 'normal' && (
          <div className="card-section">
            <div className="section-label">🃏 Ball {ballNum} — Tap the card drawn</div>
            <div className="card-grid">
              {CARD_VALUES.map(v => (
                <button
                  key={String(v)}
                  className={`card-btn ${v === 'W' ? 'card-wicket' : ''} ${v === 4 ? 'card-four' : ''} ${v === 6 ? 'card-six' : ''}`}
                  onClick={() => handleCardTap(v)}
                >
                  <span className="card-value">{v === 'W' ? '⚡' : v}</span>
                  <span className="card-sublabel">{v === 'W' ? 'Wicket' : v === 0 ? 'Dot' : `Run${v !== 1 ? 's' : ''}`}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'impact' && (
          <div className="card-section impact-section">
            <div className="section-label impact-label">⚡ IMPACT CARD! Tap the effect drawn</div>
            <div className="impact-grid">
              {IMPACT_CARD_OPTIONS.map((effect, i) => (
                <button key={i} className={`impact-btn impact-${effect.type}`} onClick={() => handleImpactCard(effect)}>
                  <span className="impact-icon">
                    {effect.type === 'runs_add' ? '➕' : effect.type === 'runs_deduct' ? '➖' : effect.type === 'over_double' ? '×2' : '⚡'}
                  </span>
                  <span className="impact-text">{impactLabel(effect)}</span>
                </button>
              ))}
              <div className="impact-custom">
                <span className="impact-custom-label">Other amount</span>
                <div className="impact-custom-row">
                  <input
                    ref={customInputRef}
                    className="impact-custom-input"
                    type="text"
                    placeholder="+10 or -5"
                    value={customImpact}
                    onChange={e => setCustomImpact(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCustomImpact()}
                    inputMode="numeric"
                  />
                  <button className="impact-custom-btn" onClick={handleCustomImpact}>✓</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'lastball' && (
          <div className="card-section lastball-section">
            <div className="section-label lastball-label">🎭 LAST BALL! Bowling team's secret card</div>
            <div className="card-grid">
              {CARD_VALUES.map(v => (
                <button
                  key={String(v)}
                  className={`card-btn lastball-card ${v === 'W' ? 'card-wicket' : ''} ${v === 4 ? 'card-four' : ''} ${v === 6 ? 'card-six' : ''}`}
                  onClick={() => handleCardTap(v, true)}
                >
                  <span className="card-value">{v === 'W' ? '⚡' : v}</span>
                  <span className="card-sublabel">{v === 'W' ? 'Wicket' : v === 0 ? 'Dot' : `Run${v !== 1 ? 's' : ''}`}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'review' && (
          <div className="card-section review-section">
            <div className="section-label review-label">🎬 WICKET! Use a Review? ({innings.reviewsLeft} left)</div>
            <div className="review-options">
              <button className="review-btn review-skip" onClick={handleAcceptOut}>
                ✋ Accept Out — No Review
              </button>
            </div>
            <div className="review-result-btns">
              <p className="review-hint">Draw a review card — what does it say?</p>
              <button className="review-result not-out" onClick={() => handleReview('not_out')}>✅ NOT OUT — Batter survives</button>
              <button className="review-result out"     onClick={() => handleReview('out')}>⚡ OUT — Wicket confirmed</button>
            </div>
          </div>
        )}

      </div>

      <div className="mini-history">
        {innings.overs.slice(-2).reverse().map(over => (
          <div key={over.overNumber} className="mini-over">
            <span className="mini-over-num">Ov {over.overNumber}</span>
            <div className="mini-balls">
              {over.balls.map((b, i) => (
                <span key={i} className={`mini-ball ${b.isWicket ? 'mb-w' : b.isImpactCard ? 'mb-ic' : b.runs === 6 ? 'mb-six' : b.runs === 4 ? 'mb-four' : ''}`}>
                  {b.isWicket ? 'W' : b.isImpactCard ? '⚡' : b.runs}
                </span>
              ))}
            </div>
            <span className="mini-over-total">{over.overRuns}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
