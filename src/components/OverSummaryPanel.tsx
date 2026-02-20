import React from 'react';
import type { OverSummary, InningsData } from '../types';
import { impactShort, impactLabel } from '../lib/gameEngine';

interface Props {
  over: OverSummary;
  innings: InningsData;
  onDismiss: () => void;
}

export default function OverSummaryPanel({ over, innings, onDismiss }: Props) {
  // Separate real balls from impact cards for display
  const allBalls   = over.balls;
  const impactBall = allBalls.find(b => b.isImpactCard);

  return (
    <div className="over-summary-overlay" onClick={onDismiss}>
      <div className="over-summary-card" onClick={e => e.stopPropagation()}>

        <div className="os-header">
          <span className="os-title">Over {over.overNumber}</span>
          <span className="os-runs">{over.overRuns}</span>
        </div>

        {/* Ball-by-ball row — real balls only */}
        <div className="os-balls">
          {allBalls.filter(b => !b.isImpactCard).map((ball, i) => {
            let cls = 'os-ball ';
            if (ball.isWicket)    cls += 'osb-w';
            else if (ball.runs === 6) cls += 'osb-six';
            else if (ball.runs === 4) cls += 'osb-four';
            else if (ball.runs === 0) cls += 'osb-dot';
            else                  cls += 'osb-runs';
            return (
              <div key={i} className={cls}>
                {ball.isWicket ? 'W' : ball.runs === 0 ? '•' : ball.runs}
              </div>
            );
          })}
        </div>

        {/* Impact card row — shown clearly */}
        {impactBall && (
          <div className="os-impact-row">
            <span className="os-impact-badge">⚡ Impact</span>
            <span className="os-impact-desc">
              {impactBall.impactEffect ? impactLabel(impactBall.impactEffect) : impactBall.displayLabel}
              {impactBall.runs !== 0 && (
                <span className={`os-impact-runs ${impactBall.runs > 0 ? 'pos' : 'neg'}`}>
                  {impactBall.runs > 0 ? `+${impactBall.runs}` : impactBall.runs} runs
                </span>
              )}
              {impactBall.isWicket && <span className="os-impact-runs neg"> −1 wicket</span>}
            </span>
          </div>
        )}

        {/* Wickets */}
        {over.wicketsInOver > 0 && (
          <div className="os-wickets">
            ⚡ {over.wicketsInOver} wicket{over.wicketsInOver > 1 ? 's' : ''} this over
          </div>
        )}

        {/* Running total */}
        <div className="os-total">
          Total: <strong>{innings.totalRuns}/{innings.totalWickets}</strong>
          <span className="os-total-overs"> after {innings.overs.length} over{innings.overs.length !== 1 ? 's' : ''}</span>
        </div>

        <button className="os-btn" onClick={onDismiss}>
          ▶ Next Over
        </button>
      </div>
    </div>
  );
}
