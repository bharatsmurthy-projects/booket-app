import React from 'react';
import type { MatchState, InningsData, OverSummary } from '../types';
import { impactLabel } from '../lib/gameEngine';

interface Props {
  match: MatchState;
  onNewMatch: () => void;
  onHome: () => void;
}

export default function ResultScreen({ match, onNewMatch, onHome }: Props) {
  const result = match.innings2?.wonBy ?? 'Match Complete';
  const inn1 = match.innings1;
  const inn2 = match.innings2;

  return (
    <div className="result-screen">
      {/* Winner banner */}
      <div className="result-banner">
        <div className="result-trophy">🏆</div>
        <div className="result-text">{result}</div>
      </div>

      {/* Scorecard */}
      <div className="scorecard">
        <InningsSummary innings={inn1} label="1st Innings" />
        {inn2 && <InningsSummary innings={inn2} label="2nd Innings" />}
      </div>

      {/* Action buttons */}
      <div className="result-actions">
        <button className="btn-primary" onClick={onNewMatch}>
          🏏 New Match
        </button>
        <button className="btn-secondary" onClick={onHome}>
          🏠 Home
        </button>
      </div>
    </div>
  );
}

// ─── Innings Summary ──────────────────────────────────────────────────────────
function InningsSummary({ innings, label }: { innings: InningsData; label: string }) {
  const allOvers = [
    ...innings.overs,
    ...(innings.currentOver ? [innings.currentOver] : []),
  ];

  return (
    <div className="sc-innings">
      <div className="sc-innings-header">
        <span className="sc-innings-label">{label}</span>
        <span className="sc-team">{innings.teamName}</span>
        <span className="sc-total">{innings.totalRuns}/{innings.totalWickets}</span>
      </div>

      {allOvers.map(over => (
        <OverRow key={over.overNumber} over={over} />
      ))}

      {innings.target && (
        <div className="sc-target">Target was: {innings.target}</div>
      )}
    </div>
  );
}

function OverRow({ over }: { over: OverSummary }) {
  const realBalls = over.balls.filter(b => !b.isImpactCard);
  const impactBalls = over.balls.filter(b => b.isImpactCard);

  return (
    <div className="sc-over-row">
      <span className="sc-over-num">Ov {over.overNumber}</span>
      <div className="sc-over-balls">
        {realBalls.map((b, i) => (
          <span
            key={i}
            className={`sc-ball ${b.isWicket ? 'scb-w' : b.runs === 6 ? 'scb-six' : b.runs === 4 ? 'scb-four' : b.runs === 0 ? 'scb-dot' : 'scb-runs'}`}
          >
            {b.isWicket ? 'W' : b.runs === 0 ? '·' : b.runs}
          </span>
        ))}
        {impactBalls.map((b, i) => (
          <span key={`ic-${i}`} className="sc-ball scb-impact">
            ⚡{b.runs >= 0 ? '+' : ''}{b.runs !== 0 ? b.runs : ''}
          </span>
        ))}
      </div>
      <span className="sc-over-total">{over.overRuns}</span>
    </div>
  );
}
