import React from 'react';
import type { MatchState } from '../types';

interface Props {
  match: MatchState;
  onDismiss: () => void;
}

export default function InningsSplash({ match, onDismiss }: Props) {
  const inn1   = match.innings1;
  const config = match.config;
  const target = inn1.totalRuns + 1;

  // Work out who bats next
  const chasingTeam = match.battingTeam; // already swapped by advancePhase

  return (
    <div className="splash-overlay" onClick={onDismiss}>
      <div className="splash-card" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="splash-header">
          <span className="splash-tag">End of 1st Innings</span>
          <span className="splash-team">{inn1.teamName}</span>
        </div>

        {/* Big score */}
        <div className="splash-score">
          <span className="splash-runs">{inn1.totalRuns}</span>
          <span className="splash-sep">/</span>
          <span className="splash-wickets">{inn1.totalWickets}</span>
        </div>
        <div className="splash-overs">
          in {inn1.overs.length} over{inn1.overs.length !== 1 ? 's' : ''}
        </div>

        {/* Divider */}
        <div className="splash-divider" />

        {/* Chase info */}
        <div className="splash-chase">
          <div className="splash-chase-team">{chasingTeam}</div>
          <div className="splash-chase-label">need</div>
          <div className="splash-target">{target}</div>
          <div className="splash-chase-label">to win</div>
        </div>

        <div className="splash-meta-row">
          <div className="splash-meta-item">
            <span className="splash-meta-val">{config.totalOvers * 6}</span>
            <span className="splash-meta-lbl">Balls</span>
          </div>
          <div className="splash-meta-item">
            <span className="splash-meta-val">{config.totalWickets}</span>
            <span className="splash-meta-lbl">Wickets</span>
          </div>
          <div className="splash-meta-item">
            <span className="splash-meta-val">
              {(target / config.totalOvers).toFixed(1)}
            </span>
            <span className="splash-meta-lbl">Req. RR</span>
          </div>
        </div>

        <button className="splash-btn" onClick={onDismiss}>
          🏏 Start 2nd Innings
        </button>
      </div>
    </div>
  );
}
