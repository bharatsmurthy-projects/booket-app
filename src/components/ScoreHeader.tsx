import React from 'react';
import type { MatchState, InningsData } from '../types';

interface Props {
  match: MatchState;
  innings: InningsData;
  onInfoClick: () => void;
}

export default function ScoreHeader({ match, innings, onInfoClick }: Props) {
  const config     = match.config;
  const isChasing  = match.currentInnings === 2;
  const oversCompleted   = innings.overs.length;
  const ballsInCurrentOver = innings.currentOver?.balls.filter(b => !b.isImpactCard).length ?? 0;

  return (
    <div className="score-header">
      <div className="innings-banner">
        <span className="innings-tag">{match.currentInnings === 1 ? '1st Innings' : '2nd Innings'}</span>
        <span className="batting-team">{innings.teamName}</span>
        {isChasing && innings.target && (
          <span className="target-tag">Target {innings.target}</span>
        )}
        {/* Info button — always visible */}
        <button className="info-btn" onClick={onInfoClick} title="Match rules & info">ℹ️</button>
      </div>

      <div className="big-score">
        <span className="score-runs">{innings.totalRuns}</span>
        <span className="score-sep">/</span>
        <span className="score-wickets">{innings.totalWickets}</span>
      </div>

      <div className="score-meta">
        <div className="meta-item">
          <span className="meta-value">{oversCompleted}.{ballsInCurrentOver}</span>
          <span className="meta-label">Overs</span>
        </div>
        <div className="meta-divider" />
        <div className="meta-item">
          <span className="meta-value">{config.totalOvers - oversCompleted}</span>
          <span className="meta-label">To Go</span>
        </div>
        <div className="meta-divider" />
        <div className="meta-item">
          <span className="meta-value">{innings.reviewsLeft}</span>
          <span className="meta-label">Reviews</span>
        </div>
        {isChasing && match.innings1 && (
          <>
            <div className="meta-divider" />
            <div className="meta-item">
              <span className="meta-value" style={{fontSize:'14px',paddingTop:'2px'}}>
                {match.innings1.totalRuns}/{match.innings1.totalWickets}
              </span>
              <span className="meta-label">{match.innings1.teamName}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
