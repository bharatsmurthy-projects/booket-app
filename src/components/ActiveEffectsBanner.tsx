import React from 'react';
import type { ActiveEffect } from '../types';

interface Props {
  effects: ActiveEffect[];
}

export default function ActiveEffectsBanner({ effects }: Props) {
  if (!effects || effects.length === 0) {
    return null;
  }

  // Generate dots for balls remaining (e.g., ⚪⚪ for 2 balls)
  const getBallDots = (count: number) => {
    return '⚪'.repeat(Math.min(count, 6));
  };

  return (
    <div className="active-effects-banner">
      <div className="active-effects-list">
        {effects.map((effect) => (
          <div key={effect.id} className="active-effect-item">
            <span className="effect-icon">
              {effect.type === 'double_runs' && '🔥'}
              {effect.type === 'free_hit' && '⚡'}
              {effect.type === 'boundary_bonus' && '🎯'}
              {effect.type === 'boundary_freeze' && '❄️'}
              {effect.type === 'double_wicket' && '💥'}
            </span>
            <span className="effect-text">
              {effect.description}
            </span>
            <span className="effect-dots">
              {getBallDots(effect.ballsRemaining)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
