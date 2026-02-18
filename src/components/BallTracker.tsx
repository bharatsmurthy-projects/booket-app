import React from 'react';
import type { InningsData, MatchConfig } from '../types';
import { impactShort } from '../lib/gameEngine';

interface Props {
  innings: InningsData;
  config: MatchConfig;
}

export default function BallTracker({ innings, config }: Props) {
  const over      = innings.currentOver;
  const realBalls = over?.balls.filter(b => !b.isImpactCard) ?? [];
  const impactBall = over?.balls.find(b => b.isImpactCard) ?? null;

  const slots = Array.from({ length: 6 }, (_, i) => realBalls[i] ?? null);

  return (
    <div className="ball-tracker">
      <div className="over-label">
        Over {over?.overNumber ?? innings.overs.length + 1}
      </div>
      <div className="ball-slots">
        {slots.map((ball, i) => {
          const isImpactSlot = i === config.impactCardAfterBall - 1;
          const isLastSlot   = i === 5;
          let cls = 'ball-slot';
          let content = '';

          if (ball) {
            if (ball.isWicket)      { cls += ' bs-wicket'; content = 'W'; }
            else if (ball.runs === 6) { cls += ' bs-six';    content = '6'; }
            else if (ball.runs === 4) { cls += ' bs-four';   content = '4'; }
            else if (ball.runs === 0) { cls += ' bs-dot';    content = '•'; }
            else                      { cls += ' bs-runs';   content = String(ball.runs); }
          } else {
            cls += ' bs-empty';
            if (isImpactSlot) cls += ' bs-impact-hint';
            if (isLastSlot)   cls += ' bs-last-hint';
            content = isImpactSlot ? '⚡' : isLastSlot ? '🎭' : '';
          }

          return <div key={i} className={cls}>{content}</div>;
        })}
      </div>

      {/* Impact badge — shows the actual effect applied */}
      {impactBall && over?.impactApplied && (
        <div className="impact-applied-badge">
          ⚡ {impactBall.impactEffect
            ? impactShort(impactBall.impactEffect)
            : impactBall.displayLabel}
        </div>
      )}
    </div>
  );
}
