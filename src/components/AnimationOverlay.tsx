import React from 'react';
import type { AnimationType } from '../types';

interface Props {
  type: AnimationType | null;
}

const ANIM_CONFIG: Record<AnimationType, { emoji: string; text: string; className: string }> = {
  four: { emoji: '🏃', text: 'FOUR!', className: 'anim-four' },
  six: { emoji: '🚀', text: 'SIX!', className: 'anim-six' },
  wicket: { emoji: '💥', text: 'WICKET!', className: 'anim-wicket' },
  impact: { emoji: '⚡', text: 'IMPACT!', className: 'anim-impact' },
  over: { emoji: '🔔', text: 'OVER!', className: 'anim-over' },
};

export default function AnimationOverlay({ type }: Props) {
  if (!type) return null;
  const cfg = ANIM_CONFIG[type];

  return (
    <div className={`anim-overlay ${cfg.className}`}>
      <div className="anim-content">
        <div className="anim-emoji">{cfg.emoji}</div>
        <div className="anim-text">{cfg.text}</div>
      </div>
    </div>
  );
}
